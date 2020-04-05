'use strict';

const Webhook = require('../structures/Webhook');
const BaseClient = require('./BaseClient');
const DataResolver = require('../util/DataResolver');

/**
 * The webhook client.
 * @implements {Webhook}
 * @extends {BaseClient}
 */
class WebhookClient extends BaseClient {
  /**
   * @param {WebhookClientOptions} options Options for the client
   * @example
   * // Create a new webhook from ID and token and send a message
   * const hook = new Discord.WebhookClient({ id: '1234', token: 'abcdef' });
   * hook.send('This will send a message').catch(console.error);
   * @example
   * // Create a new webhook from URL and send a message
   * const hook = new Discord.WebhookClient({ url: 'https://discordapp.com/api/webhooks/1234/abcdef' });
   * hook.send('This will send a message').catch(console.error);
   */
  constructor(options) {
    super(options);

    const buildFromURL = options.url ? DataResolver.resolveWebhookURL(options.url) : false;
    if (buildFromURL) {
      Object.defineProperty(this, 'client', { value: this });
      this.id = buildFromURL[0];
      Object.defineProperty(this, 'token', { value: buildFromURL[1], writable: true, configurable: true });
    } else {
      Object.defineProperty(this, 'client', { value: this });
      this.id = options.id;
      Object.defineProperty(this, 'token', { value: options.token, writable: true, configurable: true });
    }
  }
}

Webhook.applyToClass(WebhookClient);

module.exports = WebhookClient;
