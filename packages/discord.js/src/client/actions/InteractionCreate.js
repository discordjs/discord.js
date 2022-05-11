'use strict';

const { InteractionType, ComponentType, ApplicationCommandType } = require('discord-api-types/v10');
const Action = require('./Action');
const Events = require('../../util/Events');
const Structures = require('../../util/Structures');
const AutocompleteInteraction = Structures.get('AutocompleteInteraction');
const ButtonInteraction = Structures.get('ButtonInteraction');
const ChatInputCommandInteraction = Structures.get('ChatInputCommandInteraction');
const MessageContextMenuCommandInteraction = Structures.get('MessageContextMenuCommandInteraction');
const ModalSubmitInteraction = Structures.get('ModalSubmitInteraction');
const SelectMenuInteraction = Structures.get('SelectMenuInteraction');
const UserContextMenuCommandInteraction = Structures.get('UserContextMenuCommandInteraction');

class InteractionCreateAction extends Action {
  handle(data) {
    const client = this.client;

    // Resolve and cache partial channels for Interaction#channel getter
    const channel = this.getChannel(data);

    // Do not emit this for interactions that cache messages that are non-text-based.
    let InteractionClass;

    switch (data.type) {
      case InteractionType.ApplicationCommand:
        switch (data.data.type) {
          case ApplicationCommandType.ChatInput:
            InteractionClass = ChatInputCommandInteraction;
            break;
          case ApplicationCommandType.User:
            InteractionClass = UserContextMenuCommandInteraction;
            break;
          case ApplicationCommandType.Message:
            if (channel && !channel.isTextBased()) return;
            InteractionClass = MessageContextMenuCommandInteraction;
            break;
          default:
            client.emit(
              Events.Debug,
              `[INTERACTION] Received application command interaction with unknown type: ${data.data.type}`,
            );
            return;
        }
        break;
      case InteractionType.MessageComponent:
        if (channel && !channel.isTextBased()) return;

        switch (data.data.component_type) {
          case ComponentType.Button:
            InteractionClass = ButtonInteraction;
            break;
          case ComponentType.SelectMenu:
            InteractionClass = SelectMenuInteraction;
            break;
          default:
            client.emit(
              Events.Debug,
              `[INTERACTION] Received component interaction with unknown type: ${data.data.component_type}`,
            );
            return;
        }
        break;
      case InteractionType.ApplicationCommandAutocomplete:
        InteractionClass = AutocompleteInteraction;
        break;
      case InteractionType.ModalSubmit:
        InteractionClass = ModalSubmitInteraction;
        break;
      default:
        client.emit(Events.Debug, `[INTERACTION] Received interaction with unknown type: ${data.type}`);
        return;
    }

    const interaction = new InteractionClass(client, data);

    /**
     * Emitted when an interaction is created.
     * @event Client#interactionCreate
     * @param {Interaction} interaction The interaction which was created
     */
    client.emit(Events.InteractionCreate, interaction);
  }
}

module.exports = InteractionCreateAction;
