'use strict';

const { createComponent } = require('@discordjs/builders');
const Interaction = require('./Interaction');
const InteractionWebhook = require('./InteractionWebhook');
const ModalSubmitFieldsResolver = require('./ModalSubmitFieldsResolver');
const InteractionResponses = require('./interfaces/InteractionResponses');

/**
 * @typedef {Object} ModalFieldData
 * @property {string} value The value of the field
 * @property {ComponentType} type The component type of the field
 * @property {string} customId The custom id of the field
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

    console.log(data);

    /**
     * The message associated with this interaction
     * @type {Message|APIMessage|null}
     */
    this.message = this.channel?.messages._add(data.message) ?? data.message ?? null;

    /**
     * The components within the modal
     * @type {ActionRow[]}
     */
    this.components = data.data.components?.map(c => createComponent(c)) ?? [];

    /**
     * The fields within the modal
     * @type {ModalSubmitFieldsResolver}
     */
    this.fields = new ModalSubmitFieldsResolver(this.components);

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
   * Whether or not this is from a message component interaction.
   * @returns {boolean}
   */
  isFromMessage() {
    return Boolean(this.message);
  }
}

InteractionResponses.applyToClass(ModalSubmitInteraction, 'showModal');

module.exports = ModalSubmitInteraction;
