'use strict';

const Interaction = require('./Interaction');
const InteractionWebhook = require('./InteractionWebhook');
const ModalSubmitFieldsResolver = require('./ModalSubmitFieldsResolver');
const InteractionResponses = require('./interfaces/InteractionResponses');
const Components = require('../util/Components');

/**
 * @typedef {Object} ModalFieldData
 * @property {string} value The value of the field
 * @property {ComponentType} type The component type of the field
 * @property {string} customId The custom id of the field
 */

/**
 * Represents a modal interaction
 * @implements {InteractionResponses}
 */
class ModalSubmitInteraction extends Interaction {
  constructor(client, data) {
    super(client, data);
    /**
     * The custom id of the modal.
     * @type {string}
     */
    this.customId = data.data.custom_id;

    if ('message' in data) {
      /**
       * The message associated with this interaction
       * @type {?(Message|APIMessage)}
       */
      this.message = this.channel?.messages._add(data.message) ?? data.message;
    } else {
      this.message = null;
    }

    /**
     * The components within the modal
     * @type {ActionRow[]}
     */
    this.components = data.data.components?.map(c => Components.createComponent(c)) ?? [];

    /**
     * The fields within the modal
     * @type {ModalSubmitFieldsResolver}
     */
    this.fields = new ModalSubmitFieldsResolver(this.components);

    /**
     * Whether the reply to this interaction has been deferred
     * @type {boolean}
     */
    this.deferred = false;

    /**
     * Whether this interaction has already been replied to
     * @type {boolean}
     */
    this.replied = false;

    /**
     * Whether the reply to this interaction is ephemeral
     * @type {?boolean}
     */
    this.ephemeral = null;

    /**
     * An associated interaction webhook, can be used to further interact with this interaction
     * @type {InteractionWebhook}
     */
    this.webhook = new InteractionWebhook(this.client, this.applicationId, this.token);
  }

  /**
   * Transforms component data to discord.js-compatible data
   * @param {*} rawComponent The data to transform
   * @returns {ModalFieldData[]}
   */
  static transformComponent(rawComponent) {
    return {
      value: rawComponent.value,
      type: rawComponent.type,
      customId: rawComponent.custom_id,
    };
  }

  /**
   * Whether this is from a {@link MessageComponentInteraction}.
   * @returns {boolean}
   */
  isFromMessage() {
    return Boolean(this.message);
  }

  // These are here only for documentation purposes - they are implemented by InteractionResponses
  /* eslint-disable no-empty-function */
  deferReply() {}
  reply() {}
  fetchReply() {}
  editReply() {}
  deleteReply() {}
  followUp() {}
  deferUpdate() {}
  update() {}
}

InteractionResponses.applyToClass(ModalSubmitInteraction, 'showModal');

module.exports = ModalSubmitInteraction;
