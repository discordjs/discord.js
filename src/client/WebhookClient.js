const Webhook = require('../structures/Webhook');

class WebhookClient extends Webhook {
  constructor(id, token) {
    super(null, id, token);
    this.options = {
      apiRequestMethod: 'sequential',
    };
  }
}

module.exports = WebhookClient;
