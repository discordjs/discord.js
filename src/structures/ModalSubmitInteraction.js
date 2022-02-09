'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const Interaction = require('./Interaction');
const InteractionResponses = require('./interfaces/InteractionResponses');

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
