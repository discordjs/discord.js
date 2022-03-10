'use strict';

const { InteractionType } = require('discord-api-types/v9');

/**
 * Represents an interaction's response
 */
class InteractionReply {
  /**
   * @param {Interaction} interaction The interaction associated with this response
   * @private
   */
  constructor(interaction) {
    if (!interaction.replied) {
      throw new Error('InteractionReply objects can only be instantiated with replied interactions.');
    }
    /**
     * The interaction associated with this reply
     * @type {Interaction}
     */
    this.interaction = interaction;
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
      interactionReply: this,
      interactionType: InteractionType.MessageComponent,
    });
  }
}

const InteractionCollector = require('./InteractionCollector');
module.exports = InteractionReply;
