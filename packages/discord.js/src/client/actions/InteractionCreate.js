'use strict';

const { InteractionType, ComponentType, ApplicationCommandType } = require('discord-api-types/v10');
const Action = require('./Action');
const AutocompleteInteraction = require('../../structures/AutocompleteInteraction');
const ButtonInteraction = require('../../structures/ButtonInteraction');
const ChannelSelectMenuInteraction = require('../../structures/ChannelSelectMenuInteraction');
const ChatInputCommandInteraction = require('../../structures/ChatInputCommandInteraction');
const MentionableSelectMenuInteraction = require('../../structures/MentionableSelectMenuInteraction');
const MessageContextMenuCommandInteraction = require('../../structures/MessageContextMenuCommandInteraction');
const ModalSubmitInteraction = require('../../structures/ModalSubmitInteraction');
const RoleSelectMenuInteraction = require('../../structures/RoleSelectMenuInteraction');
const StringSelectMenuInteraction = require('../../structures/StringSelectMenuInteraction');
const UserContextMenuCommandInteraction = require('../../structures/UserContextMenuCommandInteraction');
const UserSelectMenuInteraction = require('../../structures/UserSelectMenuInteraction')
const Events = require('../../util/Events');

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
          case ComponentType.ChannelSelect:
            InteractionClass = ChannelSelectMenuInteraction;
            break;
          case ComponentType.MentionableSelect:
            InteractionClass = MentionableSelectMenuInteraction;
            break;
          case ComponentType.RoleSelect:
            InteractionClass = RoleSelectMenuInteraction;
            break;
          case ComponentType.StringSelect:
            InteractionClass = StringSelectMenuInteraction;
            break;
          case ComponentType.UserSelect:
            InteractionClass = UserSelectMenuInteraction;
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
     * @param {BaseInteraction} interaction The interaction which was created
     */
    client.emit(Events.InteractionCreate, interaction);
  }
}

module.exports = InteractionCreateAction;
