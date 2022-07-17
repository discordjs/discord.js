'use strict';

const BaseClient = require('./BaseClient');
const { Error, ErrorCodes } = require('../errors');
const Webhook = require('../structures/Webhook');
const { parseWebhookURL } = require('../util/Util');

/**
 * The webhook client.
 * @implements {Webhook}
 * @extends {BaseClient}
 */
class WebhookClient extends BaseClient {
  /**
   * The data for the webhook client containing either an id and token or just a URL
   * @typedef {Object} WebhookClientData
   * @property {Snowflake} [id] The id of the webhook
   * @property {string} [token] The token of the webhook
   * @property {string} [url] The full URL for the webhook client
   */

  /**
   * @param {WebhookClientData} data The data of the webhook
   * @param {ClientOptions} [options] Options for the client
   */
  constructor(data, options) {
    super(options);
    Object.defineProperty(this, 'client', { value: this });
    let { id, token } = data;

    if ('url' in data) {
      const parsed = parseWebhookURL(data.url);
      if (!parsed) {
        throw new Error(ErrorCodes.WebhookURLInvalid);
      }

      ({ id, token } = parsed);
    }

    this.id = id;
    Object.defineProperty(this, 'token', { value: token, writable: true, configurable: true });
  }

  // These are here only for documentation purposes - they are implemented by Webhook
  /* eslint-disable no-empty-function, valid-jsdoc */
  /**
   * Sends a message with this webhook.
   * @param {string|MessagePayload|WebhookMessageOptions} options The content for the reply
   * @returns {Promise<APIMessage>}
   */
  send() {}

  /**
   * Gets a message that was sent by this webhook.
   * @param {Snowflake} message The id of the message to fetch
   * @param {WebhookFetchMessageOptions} [options={}] The options to provide to fetch the message.
   * @returns {Promise<APIMessage>} Returns the message sent by this webhook
   */
  fetchMessage() {}

  /**
   * Edits a message that was sent by this webhook.
   * @param {MessageResolvable} message The message to edit
   * @param {string|MessagePayload|WebhookEditMessageOptions} options The options to provide
   * @returns {Promise<APIMessage>} Returns the message edited by this webhook
   */
  editMessage() {}

  sendSlackMessage() {}
  edit() {}
  delete() {}
  deleteMessage() {}
  get createdTimestamp() {}
  get createdAt() {}
  get url() {}
}

Webhook.applyToClass(WebhookClient);

module.exports = WebhookClient;
