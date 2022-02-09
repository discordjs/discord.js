'use strict';

const Interaction = require('./Interaction');
const ModalSubmitFieldsResolver = require('./ModalSubmitFieldsResolver');
const InteractionResponses = require('./interfaces/InteractionResponses');
const { MessageComponentTypes } = require('../util/Constants');

class ModalSubmitInteraction extends Interaction {
  constructor(client, data) {
    super(client, data);

    /**
     * The custom id of the modal.
     * @type {string}
     */
    this.customId = data.data.custom_id;

    /**
     * @typedef {Object} PartialTextInputData
     * @property {string} [customId] A unique string to be sent in the interaction when submitted
     * @property {MessageComponentType} [type] The type of this component
     * @property {string} [value] Value of this text input component
     */

    /**
     * @typedef {Object} PartialModalActionRow
     * @property {MessageComponentType} [type] The type of this component
     * @property {PartialTextInputData[]} [components] Partial text input components
     */

    /**
     * The inputs within the modal
     * @type {PartialModalActionRow[]}
     */
    this.components =
      data.data.components?.map(c => ({
        type: MessageComponentTypes[c.type],
        components: ModalSubmitInteraction.transformComponent(c),
      })) ?? [];

    /**
     * The fields within the modal
     * @type {ModalSubmitFieldsResolver}
     */
    this.fields = new ModalSubmitFieldsResolver(this.components);
  }

  /**
   * Get the value submitted in a text input component
   * @param {string} customId Custom id of the text input component
   * @returns {string}
   */
  getTextInputValue(customId) {
    for (const row of this.components) {
      const field = row.components.find(
        c => c.customId === customId && c.type === MessageComponentTypes[MessageComponentTypes.TEXT_INPUT],
      );

      if (field) {
        return field.value;
      }
    }
    return null;
  }

  /**
   * Transforms component data to discord.js-compatible data
   * @param {*} rawComponent The data to transform
   * @returns {PartialTextInputData[]}
   */
  static transformComponent(rawComponent) {
    return rawComponent.components.map(c => ({
      value: c.value,
      type: MessageComponentTypes[c.type],
      customId: c.custom_id,
    }));
  }

  // These are here only for documentation purposes - they are implemented by InteractionResponses
  /* eslint-disable no-empty-function */
  deferReply() {}
  reply() {}
  fetchReply() {}
  editReply() {}
  deleteReply() {}
  followUp() {}
}

InteractionResponses.applyToClass(ModalSubmitInteraction, ['deferUpdate', 'update', 'presentModal']);

module.exports = ModalSubmitInteraction;
