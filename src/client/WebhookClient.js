const Webhook = require('../structures/Webhook');
const RESTManager = require('./rest/RESTManager');
const ClientDataResolver = require('./ClientDataResolver');
const mergeDefault = require('../util/MergeDefault');
const Constants = require('../util/Constants');

/**
 * The Webhook Client
 * @extends {Webhook}
 */
class WebhookClient extends Webhook {
  /**
   * @param {string} id The id of the webhook.
   * @param {string} token the token of the webhook.
   * @param {ClientOptions} [options] Options for the client
   * @example
   * // create a new webhook and send a message
   * let hook = new Discord.WebhookClient('1234', 'abcdef')
   * hook.sendMessage('This will send a message').catch(console.error)
   */
  constructor(id, token, options) {
    super(null, id, token);

    /**
     * The options the client was instantiated with
     * @type {ClientOptions}
     */
    this.options = mergeDefault(Constants.DefaultOptions, options);

    /**
     * The REST manager of the client
     * @type {RESTManager}
     * @private
     */
    this.rest = new RESTManager(this);

    /**
     * The Data Resolver of the Client
     * @type {ClientDataResolver}
     * @private
     */
    this.resolver = new ClientDataResolver(this);
  }
}

module.exports = WebhookClient;
