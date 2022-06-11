'use strict';

const { InteractionType } = require('discord-api-types/v10');
const { ErrorCodes } = require('../errors');

/**
 * Represents an interaction's response
 */
class InteractionResponse {
  /**
   * @param {Interaction} interaction The interaction associated with this response
   * @param {Snowflake?} id The interaction id associated with the original response
   * @private
   */
  constructor(interaction, id) {
    /**
     * The interaction associated with the interaction response
     * @type {Interaction}
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
        else reject(new Error(ErrorCodes.INTERACTION_COLLECTOR_ERROR, reason));
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
}

// eslint-disable-next-line import/order
const InteractionCollector = require('./InteractionCollector');
module.exports = InteractionResponse;
