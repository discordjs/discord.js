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
   * Represents the credentials used for a webhook in the form of its id and token.
   * @typedef {Object} WebhookClientDataIdWithToken
   * @property {Snowflake} id The webhook's id
   * @property {string} token The webhook's token
   */

  /**
   * Represents the credentials used for a webhook in the form of a URL.
   * @typedef {Object} WebhookClientDataURL
   * @property {string} url The full URL for the webhook
   */

  /**
   * Represents the credentials used for a webhook.
   * @typedef {WebhookClientDataIdWithToken|WebhookClientDataURL} WebhookClientData
   */

  /**
   * Options for a webhook client.
   * @typedef {Object} WebhookClientOptions
   * @property {MessageMentionOptions} [allowedMentions] Default value for {@link BaseMessageOptions#allowedMentions}
   * @property {RESTOptions} [rest] Options for the REST manager
   */

  /**
   * @param {WebhookClientData} data The data of the webhook
   * @param {WebhookClientOptions} [options] Options for the webhook client
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

  /**
   * The options the webhook client was instantiated with.
   * @type {WebhookClientOptions}
   * @name WebhookClient#options
   */

  // These are here only for documentation purposes - they are implemented by Webhook
  /* eslint-disable no-empty-function, valid-jsdoc */
  /**
   * Sends a message with this webhook.
   * @param {string|MessagePayload|WebhookCreateMessageOptions} options The content for the reply
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
