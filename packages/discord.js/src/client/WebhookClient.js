'use strict';

const BaseClient = require('./BaseClient');
const { Error, ErrorCodes } = require('../errors');
const Webhook = require('../structures/Webhook');

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
      const url = data.url.match(
        // eslint-disable-next-line no-useless-escape
        /https?:\/\/(?:ptb\.|canary\.)?discord\.com\/api(?:\/v\d{1,2})?\/webhooks\/(\d{17,19})\/([\w-]{68})/i,
      );

      if (!url || url.length <= 1) throw new Error(ErrorCodes.WebhookUrlInvalid);

      [, id, token] = url;
    }

    this.id = id;
    Object.defineProperty(this, 'token', { value: token, writable: true, configurable: true });
  }

  // These are here only for documentation purposes - they are implemented by Webhook
  /* eslint-disable no-empty-function */
  send() {}
  sendSlackMessage() {}
  fetchMessage() {}
  edit() {}
  editMessage() {}
  delete() {}
  deleteMessage() {}
  get createdTimestamp() {}
  get createdAt() {}
  get url() {}
}

Webhook.applyToClass(WebhookClient);

module.exports = WebhookClient;
