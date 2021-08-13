'use strict';

const { ApplicationCommandTypes, ApplicationCommandOptionTypes, MessageButtonStyles } = require('./Constants');

/**
 * Helpers for checking different variants of common types.
 */
class TypeGuards extends null {
  /**
   * Resolves a given type to an enum equivalent value, and
   * checks if it's part of the given enum type.
   * @private
   * @param {string|number} type The type to resolve
   * @param {any} object The enum to resolve to
   * @param {any[]} fields The enum fields to check
   * @returns {boolean} Whether the type is part of the enum
   */
  static isPartofEnum(type, object, fields) {
    const resolvedType = typeof type === 'number' ? type : object[type];
    fields = fields.map(field => object[field]);
    return fields.includes(resolvedType);
  }

  /**
   * Verifies if the given command data is chat input command or not.
   * @param {ApplicationCommandData} commandData The command data to check
   * @returns {boolean} True if it conforms to chat input command data, false otherwise
   */
  static isChatInputCommandData(commandData) {
    return TypeGuards.isPartofEnum(commandData.type, ApplicationCommandTypes, ['CHAT_INPUT']);
  }

  /**
   * Verifies if the given command data is a context menu command or not.
   * @param {ApplicationCommandData} commandData The command data to check
   * @returns {boolean} True if it conforms to chat input command data, false otherwise
   */
  static isContextMenuCommandData(commandData) {
    return TypeGuards.isPartofEnum(commandData.type, ApplicationCommandTypes, ['MESSAGE', 'USER']);
  }

  /**
   * Verifies if the given command option data supports choices or not.
   * @param {ApplicationCommandOptionData} commandOptionData The command option data to check
   * @returns {boolean} True if the option supports choices, false otherwise
   */
  static optionDataSupportsChoices(commandOptionData) {
    return TypeGuards.isPartofEnum(commandOptionData.type, ApplicationCommandOptionTypes, [
      'BOOLEAN',
      'INTEGER',
      'STRING',
      'NUMBER',
    ]);
  }

  /**
   * Verifies if the given command option data supports options or not.
   * @param {ApplicationCommandOptionData} commandOptionData The command option data to check
   * @returns {boolean} True if the option supports options, false otherwise
   */
  static optionDataSupportsSubOptions(commandOptionData) {
    return TypeGuards.isPartofEnum(commandOptionData.type, ApplicationCommandOptionTypes, [
      'SUB_COMMAND',
      'SUB_COMMAND_GROUP',
    ]);
  }

  /**
   * Verifies if the given message button options support URL's or not.
   * @param {MessageButtonOptions} messageButtonOptions The message button options to check.
   * @returns {boolean} True if the option supports URL's, false otherwise.
   */
  static isLinkButtonOptions(messageButtonOptions) {
    return TypeGuards.isPartofEnum(messageButtonOptions.type, MessageButtonStyles, ['LINK']);
  }

  /**
   * Verifies if the given message button options support doesn't support URL's or not.
   * @param {MessageButtonOptions} messageButtonOptions The message button options to check.
   * @returns {boolean} True if the option doesn't support URL's, false otherwise.
   */
  static isInteractionButtonOptions(messageButtonOptions) {
    return !TypeGuards.isLinkButtonOptions(messageButtonOptions);
  }
}

module.exports = TypeGuards;
