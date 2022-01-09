'use strict';

const { InteractionType, ComponentType, ApplicationCommandType } = require('discord-api-types/v9');
const Action = require('./Action');
const AutocompleteInteraction = require('../../structures/AutocompleteInteraction');
const ButtonInteraction = require('../../structures/ButtonInteraction');
const ChatInputCommandInteraction = require('../../structures/ChatInputCommandInteraction');
const MessageContextMenuCommandInteraction = require('../../structures/MessageContextMenuCommandInteraction');
const SelectMenuInteraction = require('../../structures/SelectMenuInteraction');
const UserContextMenuCommandInteraction = require('../../structures/UserContextMenuCommandInteraction');
const { Events } = require('../../util/Constants');

class InteractionCreateAction extends Action {
  handle(data) {
    const client = this.client;

    // Resolve and cache partial channels for Interaction#channel getter
    this.getChannel(data);

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
            InteractionClass = MessageContextMenuCommandInteraction;
            break;
          default:
            client.emit(
              Events.DEBUG,
              `[INTERACTION] Received application command interaction with unknown type: ${data.data.type}`,
            );
            return;
        }
        break;
      case InteractionType.MessageComponent:
        switch (data.data.component_type) {
          case ComponentType.Button:
            InteractionClass = ButtonInteraction;
            break;
          case ComponentType.SelectMenu:
            InteractionClass = SelectMenuInteraction;
            break;
          default:
            client.emit(
              Events.DEBUG,
              `[INTERACTION] Received component interaction with unknown type: ${data.data.component_type}`,
            );
            return;
        }
        break;
      case InteractionType.ApplicationCommandAutocomplete:
        InteractionClass = AutocompleteInteraction;
        break;
      default:
        client.emit(Events.DEBUG, `[INTERACTION] Received interaction with unknown type: ${data.type}`);
        return;
    }

    const interaction = new InteractionClass(client, data);

    /**
     * Emitted when an interaction is created.
     * @event Client#interactionCreate
     * @param {Interaction} interaction The interaction which was created
     */
    client.emit(Events.INTERACTION_CREATE, interaction);
  }
}

module.exports = InteractionCreateAction;
