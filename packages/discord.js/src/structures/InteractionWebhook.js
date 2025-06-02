'use strict';

const { Webhook } = require('./Webhook.js');

/**
 * Represents a webhook for an Interaction
 *
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
     *
     * @name InteractionWebhook#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });
    this.id = id;
    Object.defineProperty(this, 'token', { value: token, writable: true, configurable: true });
  }

  // These are here only for documentation purposes - they are implemented by Webhook

  /**
   * Sends a message with this webhook.
   *
   * @param {string|MessagePayload|InteractionReplyOptions} options The content for the reply
   * @returns {Promise<Message>}
   */

  async send() {}

  /**
   * Gets a message that was sent by this webhook.
   *
   * @param {Snowflake|'@original'} message The id of the message to fetch
   * @returns {Promise<Message>} Returns the message sent by this webhook
   */

  async fetchMessage() {}

  /**
   * Edits a message that was sent by this webhook.
   *
   * @param {MessageResolvable|'@original'} message The message to edit
   * @param {string|MessagePayload|WebhookMessageEditOptions} options The options to provide
   * @returns {Promise<Message>} Returns the message edited by this webhook
   */

  async editMessage() {}

  deleteMessage() {}

  // eslint-disable-next-line getter-return
  get url() {}
}

Webhook.applyToClass(InteractionWebhook, ['sendSlackMessage', 'edit', 'delete', 'createdTimestamp', 'createdAt']);

exports.InteractionWebhook = InteractionWebhook;
