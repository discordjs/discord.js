'use strict';

const Interaction = require('./Interaction');
const ModalSubmitFieldsResolver = require('./ModalSubmitFieldsResolver');
const InteractionResponses = require('./interfaces/InteractionResponses');

/**
 * @typedef {Object} PartialInputTextData
 * @property {string} value
 * @property {ComponentType} type
 * @property {string} customId
 */

/**
 * Represents a modal interaction
 */
class ModalSubmitInteraction extends Interaction {
  constructor(client, data) {
    super(client, data);
    /**
     * The custom id of the modal.
     * @type {string}
     */
    this.customId = data.data.custom_id;

    /**
     * The components within the modal
     * @type {Array<ActionRow<PartialInputTextData>>}
     */
    this.components = data.data.components?.map(c => ModalSubmitInteraction.transformComponent(c)) ?? [];

    /**
     * The fields within the modal
     * @type {ModalSubmitFieldsResolver}
     */
    this.fields = new ModalSubmitFieldsResolver(this.components);
  }

  /**
   * Transforms component data to discord.js-compatible data
   * @param {*} rawComponent The data to transform
   * @returns {ActionRow[]}
   */
  static transformComponent(rawComponent) {
    return rawComponent.components.map(c => ({
      value: c.value,
      type: c.type,
      customId: c.custom_id,
    }));
  }
}

InteractionResponses.applyToClass(ModalSubmitInteraction);

module.exports = ModalSubmitInteraction;
