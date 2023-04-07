'use strict';

// This file contains the typedefs for camel-cased JSON data
const { ComponentBuilder } = require('@discordjs/builders');
const { ComponentType } = require('discord-api-types/v10');
/**
 * @typedef {Object} BaseComponentData
 * @property {ComponentType} type The type of component
 */

/**
 * @typedef {BaseComponentData} ActionRowData
 * @property {ComponentData[]} components The components in this action row
 */

/**
 * @typedef {BaseComponentData} ButtonComponentData
 * @property {ButtonStyle} style The style of the button
 * @property {?boolean} disabled Whether this button is disabled
 * @property {string} label The label of this button
 * @property {?APIMessageComponentEmoji} emoji The emoji on this button
 * @property {?string} customId The custom id of the button
 * @property {?string} url The URL of the button
 */

/**
 * @typedef {object} SelectMenuComponentOptionData
 * @property {string} label The label of the option
 * @property {string} value The value of the option
 * @property {?string} description The description of the option
 * @property {?APIMessageComponentEmoji} emoji The emoji on the option
 * @property {?boolean} default Whether this option is selected by default
 */

/**
 * @typedef {BaseComponentData} SelectMenuComponentData
 * @property {string} customId The custom id of the select menu
 * @property {?boolean} disabled Whether the select menu is disabled or not
 * @property {?number} maxValues The maximum amount of options that can be selected
 * @property {?number} minValues The minimum amount of options that can be selected
 * @property {?SelectMenuComponentOptionData[]} options The options in this select menu
 * @property {?string} placeholder The placeholder of the select menu
 */

/**
 * @typedef {ActionRowData|ButtonComponentData|SelectMenuComponentData} MessageComponentData
 */

/**
 * @typedef {BaseComponentData} TextInputComponentData
 * @property {string} customId The custom id of the text input
 * @property {TextInputStyle} style The style of the text input
 * @property {string} label The text that appears on top of the text input field
 * @property {?number} minLength The minimum number of characters that can be entered in the text input
 * @property {?number} maxLength The maximum number of characters that can be entered in the text input
 * @property {?boolean} required Whether or not the text input is required or not
 * @property {?string} value The pre-filled text in the text input
 * @property {?string} placeholder Placeholder for the text input
 */

/**
 * @typedef {ActionRowData|ButtonComponentData|SelectMenuComponentData|TextInputComponentData} ComponentData
 */

/**
 * Any emoji data that can be used within a button
 * @typedef {APIMessageComponentEmoji|string} ComponentEmojiResolvable
 */

/**
 * Transforms API data into a component
 * @param {APIMessageComponent|Component} data The data to create the component from
 * @returns {Component}
 */
function createComponent(data) {
  if (data instanceof Component) {
    return data;
  }

  switch (data.type) {
    case ComponentType.ActionRow:
      return new ActionRow(data);
    case ComponentType.Button:
      return new ButtonComponent(data);
    case ComponentType.StringSelect:
      return new StringSelectMenuComponent(data);
    case ComponentType.TextInput:
      return new TextInputComponent(data);
    case ComponentType.UserSelect:
      return new UserSelectMenuComponent(data);
    case ComponentType.RoleSelect:
      return new RoleSelectMenuComponent(data);
    case ComponentType.MentionableSelect:
      return new MentionableSelectMenuComponent(data);
    case ComponentType.ChannelSelect:
      return new ChannelSelectMenuComponent(data);
    default:
      return new Component(data);
  }
}

/**
 * Transforms API data into a component builder
 * @param {APIMessageComponent|ComponentBuilder} data The data to create the component from
 * @returns {ComponentBuilder}
 */
function createComponentBuilder(data) {
  if (data instanceof ComponentBuilder) {
    return data;
  }

  switch (data.type) {
    case ComponentType.ActionRow:
      return new ActionRowBuilder(data);
    case ComponentType.Button:
      return new ButtonBuilder(data);
    case ComponentType.StringSelect:
      return new StringSelectMenuBuilder(data);
    case ComponentType.TextInput:
      return new TextInputBuilder(data);
    case ComponentType.UserSelect:
      return new UserSelectMenuBuilder(data);
    case ComponentType.RoleSelect:
      return new RoleSelectMenuBuilder(data);
    case ComponentType.MentionableSelect:
      return new MentionableSelectMenuBuilder(data);
    case ComponentType.ChannelSelect:
      return new ChannelSelectMenuBuilder(data);
    default:
      return new ComponentBuilder(data);
  }
}

module.exports = { createComponent, createComponentBuilder };

const ActionRow = require('../structures/ActionRow');
const ActionRowBuilder = require('../structures/ActionRowBuilder');
const ButtonBuilder = require('../structures/ButtonBuilder');
const ButtonComponent = require('../structures/ButtonComponent');
const ChannelSelectMenuBuilder = require('../structures/ChannelSelectMenuBuilder');
const ChannelSelectMenuComponent = require('../structures/ChannelSelectMenuComponent');
const Component = require('../structures/Component');
const MentionableSelectMenuBuilder = require('../structures/MentionableSelectMenuBuilder');
const MentionableSelectMenuComponent = require('../structures/MentionableSelectMenuComponent');
const RoleSelectMenuBuilder = require('../structures/RoleSelectMenuBuilder');
const RoleSelectMenuComponent = require('../structures/RoleSelectMenuComponent');
const StringSelectMenuBuilder = require('../structures/StringSelectMenuBuilder');
const StringSelectMenuComponent = require('../structures/StringSelectMenuComponent');
const TextInputBuilder = require('../structures/TextInputBuilder');
const TextInputComponent = require('../structures/TextInputComponent');
const UserSelectMenuBuilder = require('../structures/UserSelectMenuBuilder');
const UserSelectMenuComponent = require('../structures/UserSelectMenuComponent');

/**
 * @external JSONEncodable
 * @see {@link https://discord.js.org/docs/packages/util/stable/JSONEncodable:Interface}
 */
