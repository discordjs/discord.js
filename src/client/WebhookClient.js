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

    if (this.id && this.token) this.setup();
  }

  setup() {
    this.rest.methods.fetchWebhook(this.id, this.token).then(hook => {
      Object.apply(this, hook);
    });
  }
}

module.exports = WebhookClient;
