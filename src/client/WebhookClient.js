const Webhook = require('../structures/Webhook');
const RESTManager = require('./rest/RESTManager');

class WebhookClient {
  constructor(id, token) {
    this.id = id;

    this.token = token;

    /**
     * The REST manager of the client
     * @type {RESTManager}
     * @private
     */
    this.rest = new RESTManager(this);
  }
}

module.exports = WebhookClient;
