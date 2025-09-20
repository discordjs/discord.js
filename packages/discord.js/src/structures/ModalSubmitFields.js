'use strict';

const { Collection } = require('@discordjs/collection');
const { ComponentType } = require('discord-api-types/v10');
const { DiscordjsTypeError, ErrorCodes } = require('../errors');

/**
 * @typedef {Object} ModalSelectedMentionables
 * @property {Collection<Snowflake, User>} users The selected users
 * @property {Collection<Snowflake, GuildMember | APIGuildMember>} members The selected members
 * @property {Collection<Snowflake, Role | APIRole>} roles The selected roles
 */

/**
 * Represents the serialized fields from a modal submit interaction
 */
class ModalSubmitFields {
  constructor(components, resolved) {
    /**
     * The components within the modal
     *
     * @type {Array<ActionRowModalData|LabelModalData|TextDisplayModalData>}
     */
    this.components = components;

    /**
     * The interaction resolved data
     *
     * @name ModalSubmitFields#resolved
     * @type {?Readonly<BaseInteractionResolvedData>}
     */
    Object.defineProperty(this, 'resolved', { value: resolved ? Object.freeze(resolved) : null });

    /**
     * The extracted fields from the modal
     * @type {Collection<string, ModalData>}
     */
    this.fields = components.reduce((accumulator, next) => {
      // For legacy support of action rows
      if ('components' in next) {
        for (const component of next.components) accumulator.set(component.customId, component);
      }

      // For label components
      if ('component' in next) {
        accumulator.set(next.component.customId, next.component);
      }

      return accumulator;
    }, new Collection());
  }

  /**
   * Gets a field given a custom id from a component
   * @param {string} customId The custom id of the component
   * @param {ComponentType} [type] The type of the component
   * @returns {ModalData}
   */
  getField(customId, type) {
    const field = this.fields.get(customId);
    if (!field) throw new DiscordjsTypeError(ErrorCodes.ModalSubmitInteractionFieldNotFound, customId);

    if (type !== undefined && type !== field.type) {
      throw new DiscordjsTypeError(ErrorCodes.ModalSubmitInteractionFieldType, customId, field.type, type);
    }

    return field;
  }

  /**
   * Gets a component by custom id and property and checks its type.
   *
   * @param {string} customId The custom id of the component.
   * @param {ComponentType[]} allowedTypes The allowed types of the component.
   * @param {string[]} properties The properties to check for for `required`.
   * @param {boolean} required Whether to throw an error if the component value(s) are not found.
   * @returns {ModalData} The option, if found.
   * @private
   */
  _getTypedComponent(customId, allowedTypes, properties, required) {
    const component = this.getField(customId);
    if (!allowedTypes.includes(component.type)) {
      throw new DiscordjsTypeError(
        ErrorCodes.ModalSubmitInteractionFieldNotFound,
        customId,
        component.type,
        allowedTypes.join(', '),
      );
    } else if (required && properties.every(prop => component[prop] === null || component[prop] === undefined)) {
      throw new DiscordjsTypeError(ErrorCodes.ModalSubmitInteractionFieldEmpty, customId, component.type);
    }

    return component;
  }

  /**
   * Gets the value of a text input component given a custom id
   * @param {string} customId The custom id of the text input component
   * @returns {string}
   */
  getTextInputValue(customId) {
    return this._getTypedComponent(customId, [ComponentType.TextInput]).value;
  }

  /**
   * Gets the values of a string select component given a custom id
   *
   * @param {string} customId The custom id of the string select component
   * @returns {string[]}
   */
  getStringSelectValues(customId) {
    return this._getTypedComponent(customId, [ComponentType.StringSelect]).values;
  }

  /**
   * Gets users component
   *
   * @param {string} customId The custom id of the component
   * @param {boolean} [required=false] Whether to throw an error if the component value is not found or empty
   * @returns {?Collection<Snowflake, User>} The selected users, or null if none were selected and not required
   */
  getSelectedUsers(customId, required = false) {
    const component = this._getTypedComponent(
      customId,
      [ComponentType.UserSelect, ComponentType.MentionableSelect],
      ['users'],
      required,
    );
    return component.users ?? null;
  }

  /**
   * Gets roles component
   *
   * @param {string} customId The custom id of the component
   * @param {boolean} [required=false] Whether to throw an error if the component value is not found or empty
   * @returns {?Collection<Snowflake, Role|APIRole>} The selected roles, or null if none were selected and not required
   */
  getSelectedRoles(customId, required = false) {
    const component = this._getTypedComponent(
      customId,
      [ComponentType.RoleSelect, ComponentType.MentionableSelect],
      ['roles'],
      required,
    );
    return component.roles ?? null;
  }

  /**
   * Gets channels component
   *
   * @param {string} customId The custom id of the component
   * @param {boolean} [required=false] Whether to throw an error if the component value is not found or empty
   * @param {ChannelType[]} [channelTypes=[]] The allowed types of channels. If empty, all channel types are allowed.
   * @returns {?Collection<Snowflake, GuildChannel|ThreadChannel|APIChannel>} The selected channels,
   * or null if none were selected and not required
   */
  getSelectedChannels(customId, required = false, channelTypes = []) {
    const component = this._getTypedComponent(customId, [ComponentType.ChannelSelect], ['channels'], required);
    const channels = component.channels;
    if (channels && channelTypes.length > 0) {
      for (const channel of channels.values()) {
        if (!channelTypes.includes(channel.type)) {
          throw new DiscordjsTypeError(
            ErrorCodes.ModalSubmitInteractionComponentInvalidChannelType,
            customId,
            channel.type,
            channelTypes.join(', '),
          );
        }
      }
    }

    return channels ?? null;
  }

  /**
   * Gets members component
   *
   * @param {string} customId The custom id of the component
   * @returns {?Collection<Snowflake, GuildMember|APIGuildMember>} The selected members,
   * or null if none were selected or the users were not present in the guild
   */
  getSelectedMembers(customId) {
    const component = this._getTypedComponent(
      customId,
      [ComponentType.UserSelect, ComponentType.MentionableSelect],
      ['members'],
      false,
    );
    return component.members ?? null;
  }

  /**
   * Gets mentionables component
   *
   * @param {string} customId The custom id of the component
   * @param {boolean} [required=false] Whether to throw an error if the component value is not found or empty
   * @returns {?ModalSelectedMentionables} The selected mentionables, or null if none were selected and not required
   */
  getSelectedMentionables(customId, required = false) {
    const component = this._getTypedComponent(
      customId,
      [ComponentType.MentionableSelect],
      ['users', 'members', 'roles'],
      required,
    );

    if (component.users || component.members || component.roles) {
      return {
        users: component.users ?? new Collection(),
        members: component.members ?? new Collection(),
        roles: component.roles ?? new Collection(),
      };
    }

    return null;
  }
}

module.exports = ModalSubmitFields;
