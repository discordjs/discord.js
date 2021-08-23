'use strict';

const { ApplicationCommandOptionTypes } = require('./Constants');
const { TypeError } = require('../errors/DJSError');

/**
 * Helpers for checking different variants of common types.
 */
class TypeGuards extends null {
  /**
   * Verifies if the given command option data supports choices or not.
   * @param {ApplicationCommandOptionData} commandOptionData The command option data to check
   * @returns {boolean} True if the option supports choices, false otherwise
   */
  static optionDataSupportsChoices(commandOptionData) {
    TypeGuards.validateType(commandOptionData);
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
    TypeGuards.validateType(commandOptionData);
    return TypeGuards.isPartOfEnum(commandOptionData.type, ApplicationCommandOptionTypes, [
      'SUB_COMMAND',
      'SUB_COMMAND_GROUP',
    ]);
  }

  /**
   * Resolves a given type to an enum equivalent value, and
   * checks if it's part of the given enum type.
   * @param {string|number} type The type to resolve
   * @param {Object} object The enum to resolve to
   * @param {string[]} fields The enum fields to check
   * @returns {boolean} Whether the type is part of the enum
   * @private
   */
  static isPartOfEnum(type, object, fields) {
    const resolvedType = typeof type === 'number' ? type : object[type];
    return fields.some(field => object[field] === resolvedType);
  }

  /**
   * Throws a type error if the object has no `type field`.
   * @param {Object} object The object to type check.
   * @private
   */
  static validateType(object) {
    if (!('type' in object)) {
      throw new TypeError('INVALID_TYPE', 'options', 'object', true);
    }
  }
}

module.exports = TypeGuards;
