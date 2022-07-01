'use strict';

const BaseInteraction = require('./BaseInteraction');
const InteractionWebhook = require('./InteractionWebhook');
const ModalSubmitFields = require('./ModalSubmitFields');
const InteractionResponses = require('./interfaces/InteractionResponses');
const { lazy } = require('../util/Util');

const getMessage = lazy(() => require('./Message').Message);

/**
 * @typedef {Object} ModalData
 * @property {string} value The value of the field
 * @property {ComponentType} type The component type of the field
 * @property {string} customId The custom id of the field
 */

/**
 * @typedef {Object} ActionRowModalData
 * @property {ModalData[]} components The components of this action row
 * @property {ComponentType} type The component type of the action row
 */

/**
 * Represents a modal interaction
 * @extends {BaseInteraction}
 * @implements {InteractionResponses}
 */
class ModalSubmitInteraction extends BaseInteraction {
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
       * @type {?Message}
       */
      this.message = this.channel?.messages._add(data.message) ?? new (getMessage())(this.client, data.message);
    } else {
      this.message = null;
    }

    /**
     * The components within the modal
     * @type {ActionRowModalData[]}
     */
    this.components = data.data.components?.map(c => ModalSubmitInteraction.transformComponent(c));

    /**
     * The fields within the modal
     * @type {ModalSubmitFields}
     */
    this.fields = new ModalSubmitFields(this.components);

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
   * @returns {ModalData[]}
   */
  static transformComponent(rawComponent) {
    return {
      value: rawComponent.value,
      type: rawComponent.type,
      customId: rawComponent.custom_id,
      components: rawComponent.components?.map(c => this.transformComponent(c)),
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
