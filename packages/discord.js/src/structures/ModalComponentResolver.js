'use strict';

const { Collection } = require('@discordjs/collection');
const { ComponentType } = require('discord-api-types/v10');
const { DiscordjsTypeError, ErrorCodes } = require('../errors/index.js');

/**
 * Returns null for an empty collection.
 *
 * @param {Collection} collection The collection to check
 * @returns {?Collection}
 * @ignore
 */
function nullIfEmpty(collection) {
  return collection.size === 0 ? null : collection;
}

/**
 * @typedef {Object} ModalSelectedMentionables
 * @property {Collection<Snowflake, User>} users The selected users
 * @property {Collection<Snowflake, GuildMember | APIGuildMember>} members The selected members
 * @property {Collection<Snowflake, Role | APIRole>} roles The selected roles
 */

/**
 * A resolver for modal submit components
 */
class ModalComponentResolver {
  constructor(client, components, resolved) {
    /**
     * The client that instantiated this.
     *
     * @name ModalComponentResolver#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The interaction resolved data
     *
     * @name ModalComponentResolver#resolved
     * @type {Readonly<BaseInteractionResolvedData>}
     */
    Object.defineProperty(this, 'resolved', { value: Object.freeze(resolved) });

    /**
     * The components within the modal
     *
     * @type {Array<ActionRowModalData|LabelModalData|TextDisplayModalData>}
     */
    this.data = components;

    /**
     * The bottom-level components of the interaction
     *
     * @type {Collection<string, ModalData>}
     */
    this.hoistedComponents = components.reduce((accumulator, next) => {
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
   * Gets a component by custom id.
   *
   * @property {string} customId The custom id of the component.
   * @returns {ModalData}
   */
  getComponent(customId) {
    const component = this.hoistedComponents.get(customId);

    if (!component) throw new DiscordjsTypeError(ErrorCodes.ModalSubmitInteractionComponentNotFound, customId);

    return component;
  }

  /**
   * Gets a component by custom id and property and checks its type.
   *
   * @param {string} customId The custom id of the component.
   * @param {ComponentType[]} allowedTypes The allowed types of the component.
   * @param {string[]} properties The properties to check for `required`.
   * @param {boolean} required Whether to throw an error if the component value(s) are not found.
   * @returns {ModalData} The option, if found.
   * @private
   */
  _getTypedComponent(customId, allowedTypes, properties, required) {
    const component = this.getComponent(customId);
    if (!allowedTypes.includes(component.type)) {
      throw new DiscordjsTypeError(
        ErrorCodes.ModalSubmitInteractionComponentType,
        customId,
        component.type,
        allowedTypes.join(', '),
      );
    } else if (required && properties.every(prop => component[prop] === null || component[prop] === undefined)) {
      throw new DiscordjsTypeError(ErrorCodes.ModalSubmitInteractionComponentEmpty, customId, component.type);
    }

    return component;
  }

  /**
   * Gets the ids picked in a component, after checking its type.
   *
   * @param {string} customId The custom id of the component.
   * @param {ComponentType[]} allowedTypes The allowed types of the component.
   * @param {boolean} [required=false] Whether to throw an error if nothing was picked.
   * @returns {Snowflake[]}
   * @private
   */
  _getPickedIds(customId, allowedTypes, required = false) {
    const { values, type } = this._getTypedComponent(customId, allowedTypes);
    if (required && values.length === 0) {
      throw new DiscordjsTypeError(ErrorCodes.ModalSubmitInteractionComponentEmpty, customId, type);
    }

    return values;
  }

  /**
   * Gets the resolved entries for the given ids.
   *
   * @param {string} key The key of the resolved data to read.
   * @param {Snowflake[]} ids The ids to keep.
   * @returns {Collection<Snowflake, *>}
   * @private
   */
  _pickResolved(key, ids) {
    // discord leaves a key out of resolved when nothing of that kind was picked anywhere in the modal
    const all = this.resolved[key] ?? new Collection();
    return all.filter((_, id) => ids.includes(id));
  }

  /**
   * Gets the value of a text input component
   *
   * @param {string} customId The custom id of the text input component
   * @returns {string}
   */
  getTextInputValue(customId) {
    return this._getTypedComponent(customId, [ComponentType.TextInput]).value;
  }

  /**
   * Gets the values of a string select component
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
    const ids = this._getPickedIds(customId, [ComponentType.UserSelect, ComponentType.MentionableSelect], required);
    return nullIfEmpty(this._pickResolved('users', ids));
  }

  /**
   * Gets roles component
   *
   * @param {string} customId The custom id of the component
   * @param {boolean} [required=false] Whether to throw an error if the component value is not found or empty
   * @returns {?Collection<Snowflake, Role|APIRole>} The selected roles, or null if none were selected and not required
   */
  getSelectedRoles(customId, required = false) {
    const ids = this._getPickedIds(customId, [ComponentType.RoleSelect, ComponentType.MentionableSelect], required);
    return nullIfEmpty(this._pickResolved('roles', ids));
  }

  /**
   * Gets channels component
   *
   * @param {string} customId The custom id of the component
   * @param {boolean} [required=false] Whether to throw an error if the component value is not found or empty
   * @param {ChannelType[]} [channelTypes=[]] The allowed types of channels. If empty, all channel types are allowed.
   * @returns {?Collection<Snowflake, GuildChannel|ThreadChannel|APIChannel>} The selected channels, or null if none were selected and not required
   */
  getSelectedChannels(customId, required = false, channelTypes = []) {
    const ids = this._getPickedIds(customId, [ComponentType.ChannelSelect], required);
    const channels = this._pickResolved('channels', ids);
    if (channelTypes.length > 0) {
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

    return nullIfEmpty(channels);
  }

  /**
   * Gets members component
   *
   * @param {string} customId The custom id of the component
   * @returns {?Collection<Snowflake, GuildMember|APIGuildMember>} The selected members, or null if none were selected or the users were not present in the guild
   */
  getSelectedMembers(customId) {
    const ids = this._getPickedIds(customId, [ComponentType.UserSelect, ComponentType.MentionableSelect]);
    return nullIfEmpty(this._pickResolved('members', ids));
  }

  /**
   * Gets mentionables component
   *
   * @param {string} customId The custom id of the component
   * @param {boolean} [required=false] Whether to throw an error if the component value is not found or empty
   * @returns {?ModalSelectedMentionables} The selected mentionables, or null if none were selected and not required
   */
  getSelectedMentionables(customId, required = false) {
    const ids = this._getPickedIds(customId, [ComponentType.MentionableSelect], required);
    const users = this._pickResolved('users', ids);
    const members = this._pickResolved('members', ids);
    const roles = this._pickResolved('roles', ids);

    if (users.size === 0 && members.size === 0 && roles.size === 0) return null;

    return { users, members, roles };
  }

  /**
   * Gets file upload component
   *
   * @param {string} customId The custom id of the component
   * @param {boolean} [required=false] Whether to throw an error if the component value is not found or empty
   * @returns {?Collection<Snowflake, Attachment>} The uploaded files, or null if none were uploaded and not required
   */
  getUploadedFiles(customId, required = false) {
    const ids = this._getPickedIds(customId, [ComponentType.FileUpload], required);
    return nullIfEmpty(this._pickResolved('attachments', ids));
  }

  /**
   * Get radio group component
   *
   * @param {string} customId The custom id of the component
   * @param {boolean} [required=false] Whether to throw an error if the component value is not found or empty
   * @returns {?string} The selected radio group option value, or null if none were selected and not required
   */
  getRadioGroup(customId, required = false) {
    return this._getTypedComponent(customId, [ComponentType.RadioGroup], ['value'], required).value;
  }

  /**
   * Get checkbox group component
   *
   * @param {string} customId The custom id of the component
   * @returns {string[]} The selected checkbox group option values
   */
  getCheckboxGroup(customId) {
    return this._getTypedComponent(customId, [ComponentType.CheckboxGroup]).values;
  }

  /**
   * Get checkbox component
   *
   * @param {string} customId The custom id of the component
   * @returns {boolean} Whether this checkbox was selected
   */
  getCheckbox(customId) {
    return this._getTypedComponent(customId, [ComponentType.Checkbox]).value;
  }
}

exports.ModalComponentResolver = ModalComponentResolver;
