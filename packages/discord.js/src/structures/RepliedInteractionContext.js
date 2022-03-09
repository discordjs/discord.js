'use strict';

const { InteractionType } = require('discord-api-types/v9');

/**
 * Represents the context of an interaction that's a been replied to
 */
class RepliedInteractionContext {
  /**
   * @param {Client} client The client
   * @param {Interaction} interaction The interaction associated with the response
   * @private
   */
  constructor(client, interaction) {
    /**
     * The interaction of the response
     * @type {Interaction}
     */
    this.interaction = interaction;
    this.client = client;
  }

  /**
   * Creates a message component interaction collector
   * @param {MessageComponentCollectorOptions} [options={}] Options to send to the collector
   * @returns {InteractionCollector}
   */
  createMessageComponentCollector(options = {}) {
    return new InteractionCollector(this.client, {
      ...options,
      messageInteractionId: this.interaction.interactionId,
      channelId: this.interaction.channelId,
      interactionType: InteractionType.MessageComponent,
    });
  }
}

const InteractionCollector = require('./InteractionCollector');
module.exports = RepliedInteractionContext;
