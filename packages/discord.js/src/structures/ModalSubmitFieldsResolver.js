'use strict';

const { ComponentType } = require('discord-api-types/v9');
const { TypeError } = require('../errors');

class ModalSubmitFieldsResolver {
  constructor(components) {
    /**
     * The components within the modal
     * @type {Array<ActionRow<ModalFieldData>>} The components in the modal
     */
    this.components = components;
  }

  /**
   * The extracted fields from the modal
   * @type {ModalFieldData[]} The fields in the modal
   */
  get fields() {
    return this.components.reduce((previous, next) => previous.concat(next.components), []);
  }

  /**
   * Gets a field given a custom id from a component
   * @param {string} customId The custom id of the component
   * @returns {ModalFieldData}
   */
  getField(customId) {
    const field = this.fields.find(f => f.customId === customId);
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
