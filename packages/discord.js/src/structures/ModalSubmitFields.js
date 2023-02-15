'use strict';

const { Collection } = require('@discordjs/collection');
const { ComponentType } = require('discord-api-types/v10');
const { DiscordjsTypeError, ErrorCodes } = require('../errors');

/**
 * Represents the serialized fields from a modal submit interaction
 */
class ModalSubmitFields {
  constructor(components) {
    /**
     * The components within the modal
     * @type {ActionRowModalData[]}
     */
    this.components = components;

    /**
     * The extracted fields from the modal
     * @type {Collection<string, ModalData>}
     */
    this.fields = components.reduce((accumulator, next) => {
      next.components.forEach(c => accumulator.set(c.customId, c));
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
   * Gets the value of a text input component given a custom id
   * @param {string} customId The custom id of the text input component
   * @returns {string}
   */
  getTextInputValue(customId) {
    return this.getField(customId, ComponentType.TextInput).value;
  }
}

module.exports = ModalSubmitFields;
