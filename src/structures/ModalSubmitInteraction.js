'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const Interaction = require('./Interaction');
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
     * The inputs within the modal
     * @type {Array<MessageActionRow<MessageActionRowComponent>>}
     */
    this.components = data.data.components?.map(c => BaseMessageComponent.create(c, this.client)) ?? [];
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
