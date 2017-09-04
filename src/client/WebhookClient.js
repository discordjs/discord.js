const Webhook = require('../structures/Webhook');
const BaseClient = require('./BaseClient');

/**
 * The webhook client.
 * @extends {Webhook}
 * @extends {BaseClient}
 */
class WebhookClient extends BaseClient {
  /**
   * @param {Snowflake} id ID of the webhook
   * @param {string} token Token of the webhook
   * @param {ClientOptions} [options] Options for the client
   * @example
   * // Create a new webhook and send a message
   * const hook = new Discord.WebhookClient('1234', 'abcdef');
   * hook.sendMessage('This will send a message').catch(console.error);
   */
  constructor(id, token, options) {
    super(options);
    Webhook.call(this, null, id, token);
  }
}

Object.assign(WebhookClient.prototype, Object.create(Webhook.prototype));

module.exports = WebhookClient;
