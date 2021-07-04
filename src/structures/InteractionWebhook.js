'use strict';

const Webhook = require('./Webhook');

/**
 * Represents a webhook for an Interaction
 * @implements {Webhook}
 */
class InteractionWebhook {
  /**
   * @param {Client} client The instantiating client
   * @param {Snowflake} id The application's id
   * @param {string} token The interaction's token
   */
  constructor(client, id, token) {
    /**
     * The client that instantiated the interaction webhook
     * @name InteractionWebhook#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });
    this.id = id;
    Object.defineProperty(this, 'token', { value: token, writable: true, configurable: true });
  }

  // These are here only for documentation purposes - they are implemented by Webhook
  /* eslint-disable no-empty-function, valid-jsdoc */
  /**
   * Sends a message with this webhook.
   * @param {string|MessagePayload|InteractionReplyOptions} options The content for the reply
   * @returns {Promise<Message|APIMessage>}
   */
  send() {}
  fetchMessage() {}
  editMessage() {}
  deleteMessage() {}
  get url() {}
}

Webhook.applyToClass(InteractionWebhook, ['sendSlackMessage', 'edit', 'delete', 'createdTimestamp', 'createdAt']);

module.exports = InteractionWebhook;
