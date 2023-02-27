'use strict';

const { InteractionType } = require('discord-api-types/v10');
const { Error } = require('../errors');
const SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * Represents an interaction's response
 */
class InteractionResponse {
  constructor(interaction, id) {
    /**
     * The interaction associated with the interaction response
     * @type {BaseInteraction}
     */
    this.interaction = interaction;
    /**
     * The id of the original interaction response
     * @type {Snowflake}
     */
    this.id = id ?? interaction.id;
    this.client = interaction.client;
  }

  /**
   * The timestamp the interaction response was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.timestampFrom(this.id);
  }

  /**
   * The time the interaction response was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * Collects a single component interaction that passes the filter.
   * The Promise will reject if the time expires.
   * @param {AwaitMessageComponentOptions} [options={}] Options to pass to the internal collector
   * @returns {Promise<MessageComponentInteraction>}
   */
  awaitMessageComponent(options = {}) {
    const _options = { ...options, max: 1 };
    return new Promise((resolve, reject) => {
      const collector = this.createMessageComponentCollector(_options);
      collector.once('end', (interactions, reason) => {
        const interaction = interactions.first();
        if (interaction) resolve(interaction);
        else reject(new Error('INTERACTION_COLLECTOR_ERROR', reason));
      });
    });
  }

  /**
   * Creates a message component interaction collector
   * @param {MessageComponentCollectorOptions} [options={}] Options to send to the collector
   * @returns {InteractionCollector}
   */
  createMessageComponentCollector(options = {}) {
    return new InteractionCollector(this.client, {
      ...options,
      interactionResponse: this,
      interactionType: InteractionType.MessageComponent,
    });
  }

  /**
   * Fetches the response as a {@link Message} object.
   * @returns {Promise<Message>}
   */
  fetch() {
    return this.interaction.fetchReply();
  }

  /**
   * Deletes the response.
   * @returns {Promise<void>}
   */
  delete() {
    return this.interaction.deleteReply();
  }

  /**
   * Edits the response.
   * @param {string|MessagePayload|WebhookEditMessageOptions} options The new options for the response.
   * @returns {Promise<Message>}
   */
  edit(options) {
    return this.interaction.editReply(options);
  }
}

// eslint-disable-next-line import/order
const InteractionCollector = require('./InteractionCollector');

module.exports = InteractionResponse;
