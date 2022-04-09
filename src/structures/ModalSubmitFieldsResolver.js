'use strict';

const { TypeError } = require('../errors');
const { MessageComponentTypes } = require('../util/Constants');

/**
 * A resolver for modal submit interaction text inputs.
 */
class ModalSubmitFieldsResolver {
  constructor(components) {
    /**
     * The components within the modal
     * @type {PartialModalActionRow[]} The components in the modal
     */
    this.components = components;
  }

  /**
   * The extracted fields from the modal
   * @type {PartialInputTextData[]} The fields in the modal
   * @private
   */
  get _fields() {
    return this.components.reduce((previous, next) => previous.concat(next.components), []);
  }

  /**
   * Gets a field given a custom id from a component
   * @param {string} customId The custom id of the component
   * @returns {?PartialInputTextData}
   */
  getField(customId) {
    const field = this._fields.find(f => f.customId === customId);
    if (!field) throw new TypeError('MODAL_SUBMIT_INTERACTION_FIELD_NOT_FOUND', customId);
    return field;
  }

  /**
   * Gets the value of a text input component given a custom id
   * @param {string} customId The custom id of the text input component
   * @returns {?string}
   */
  getTextInputValue(customId) {
    const field = this.getField(customId);
    const expectedType = MessageComponentTypes[MessageComponentTypes.TEXT_INPUT];
    if (field.type !== expectedType) {
      throw new TypeError('MODAL_SUBMIT_INTERACTION_FIELD_TYPE', customId, field.type, expectedType);
    }
    return field.value;
  }
}

module.exports = ModalSubmitFieldsResolver;
