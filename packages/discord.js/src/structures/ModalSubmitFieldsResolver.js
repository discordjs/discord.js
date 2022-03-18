'use strict';

const { Collection } = require('@discordjs/collection');
const { ComponentType } = require('discord-api-types/v10');
const { TypeError } = require('../errors');

/**
 * Represents the serialized fields from a modal submit interaction
 */
class ModalSubmitFieldsResolver {
  constructor(components) {
    /**
     * The components within the modal
     * @type {Array<ActionRow<ModalFieldData>>} The components in the modal
     */
    this.components = components;

    /**
     * The extracted fields from the modal
     * @type {Collection<string, ModalFieldData>} The fields in the modal
     */
    this.fields = components.reduce((accumulator, next) => {
      next.components.forEach(c => accumulator.set(c.customId, c));
      return accumulator;
    }, new Collection());
  }

  /**
   * Gets a field given a custom id from a component
   * @param {string} customId The custom id of the component
   * @returns {ModalFieldData}
   */
  getField(customId) {
    const field = this.fields.get(customId);
    if (!field) throw new TypeError('MODAL_SUBMIT_INTERACTION_FIELD_NOT_FOUND', customId);
    return field;
  }

  /**
   * Gets the value of a text input component given a custom id
   * @param {string} customId The custom id of the text input component
   * @returns {string}
   */
  getTextInputValue(customId) {
    const field = this.getField(customId);
    const expectedType = ComponentType.TextInput;
    if (field.type !== expectedType) {
      throw new TypeError('MODAL_SUBMIT_INTERACTION_FIELD_TYPE', customId, field.type, expectedType);
    }
    return field.value;
  }
}

module.exports = ModalSubmitFieldsResolver;
