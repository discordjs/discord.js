const Webhook = require('../structures/Webhook');
const RESTManager = require('./rest/RESTManager');
const ClientDataResolver = require('./ClientDataResolver');
const mergeDefault = require('../util/MergeDefault');
const Constants = require('../util/Constants');

/**
 * The Webhook Client.
 * @extends {Webhook}
 */
class WebhookClient extends Webhook {
  constructor(id, token, options) {
    super(null, id, token);

    /**
     * @param {ClientOptions} [options] Options for the client
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
