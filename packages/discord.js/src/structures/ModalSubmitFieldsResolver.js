'use strict';

const { ComponentType } = require('discord-api-types/v9');
const { TypeError } = require('../errors');

class ModalSubmitFieldsResolver {
  constructor(components) {
    /**
     * The components within the modal
     * @type {Array<ActionRow<PartialInputTextData>>} The components in the modal
     */
    this.components = components;
  }

  /**
   * The extracted fields from the modal
   * @type {Array<PartialInputTextData>}The fields in the modal
   * @private
   */
  get _fields() {
    return this.components.reduce((previous, next) => previous.concat(next), []);
  }

  /**
   * Gets a field given a custom id from a component
   * @param {string} customId The custom id of the component
   * @param {?boolean} required Whether the component is required or not
   * @returns {?PartialInputTextData}
   */
  getField(customId, required) {
    const field = this._fields.find(f => f.customId === customId);
    if (required && !field) throw new TypeError('MODAL_SUBMIT_INTERACTION_FIELD_NOT_FOUND', customId);
    return field;
  }

  getTextInputValue(customId, required) {
    const field = this.getField(customId, required);
    const expectedType = ComponentType.TextInput;
    if (field.type !== expectedType) {
      throw new TypeError('MODAL_SUBMIT_INTERACTION_FIELD_TYPE', customId, field.type, expectedType);
    }
    return field.value;
  }
}

module.exports = ModalSubmitFieldsResolver;
