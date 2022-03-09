'use strict';

const { InteractionType } = require('discord-api-types/v9');

class PartialInteractionMessage {
  constructor(client, interactionId, channelId) {
    /**
     * The interaction id of the response
     */
    this.interactionId = interactionId;
    /**
     * The channel the response was sent in.
     */
    this.channelId = channelId;
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
      messageInteractionId: this.interactionId,
      channelId: this.channelId,
      interactionType: InteractionType.MessageComponent,
    });
  }
}

const InteractionCollector = require('./InteractionCollector');

module.exports = PartialInteractionMessage;
