'use strict';

const Interaction = require('./Interaction');
const InteractionWebhook = require('./InteractionWebhook');
const ModalSubmitFieldsResolver = require('./ModalSubmitFieldsResolver');
const InteractionResponses = require('./interfaces/InteractionResponses');
const { MessageComponentTypes } = require('../util/Constants');

/**
 * Represents a modal submit interaction.
 * @extends {Interaction}
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
     * The message associated with this interaction
     * @type {Message|APIMessage|null}
     */
    this.message = data.message ? this.channel?.messages._add(data.message) ?? data.message : null;

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
     * Whether the reply to this interaction is ephemeral
     * @type {?boolean}
     */
    this.ephemeral = null;

    /**
     * Whether this interaction has already been replied to
     * @type {boolean}
     */
    this.replied = false;

    /**
     * An associated interaction webhook, can be used to further interact with this interaction
     * @type {InteractionWebhook}
     */
    this.webhook = new InteractionWebhook(this.client, this.applicationId, this.token);
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
  update() {}
  deferUpdate() {}
}

InteractionResponses.applyToClass(ModalSubmitInteraction, ['showModal', 'awaitModalSubmit']);

module.exports = ModalSubmitInteraction;
