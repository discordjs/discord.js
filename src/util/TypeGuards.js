'use strict';

const { ApplicationCommandOptionTypes } = require('./Constants');

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
   * @param {string[]} fields The enum fields to check
   * @returns {boolean} Whether the type is part of the enum
   */
  static isPartOfEnum(type, object, fields) {
    const resolvedType = typeof type === 'number' ? type : object[type];
    return fields.some(field => object[field] === resolvedType);
  }

  /**
   * Verifies if the given command option data supports choices or not.
   * @param {ApplicationCommandOptionData} commandOptionData The command option data to check
   * @returns {boolean} True if the option supports choices, false otherwise
   */
  static optionDataSupportsChoices(commandOptionData) {
    return TypeGuards.isPartOfEnum(commandOptionData.type, ApplicationCommandOptionTypes, [
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
    return TypeGuards.isPartOfEnum(commandOptionData.type, ApplicationCommandOptionTypes, [
      'SUB_COMMAND',
      'SUB_COMMAND_GROUP',
    ]);
  }
}

module.exports = TypeGuards;
