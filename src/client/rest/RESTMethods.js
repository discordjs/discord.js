const Constants = require('../../util/Constants');
const Endpoints = Constants.Endpoints;

class RESTMethods {
  constructor(restManager) {
    this.rest = restManager;
    this.client = restManager.client;
  }

  sendWebhookMessage(webhook, content, { avatarURL, tts, disableEveryone, embeds, username } = {}, file = null) {
    username = username || webhook.name;
    if (typeof content !== 'undefined') content = this.client.resolver.resolveString(content);
    if (content) {
      if (disableEveryone || (typeof disableEveryone === 'undefined' && this.client.options.disableEveryone)) {
        content = content.replace(/@(everyone|here)/g, '@\u200b$1');
      }
    }
    return this.rest.request('post', `${Endpoints.Webhook(webhook.id, webhook.token)}?wait=true`, false, {
      username,
      avatar_url: avatarURL,
      content,
      tts,
      embeds,
    }, file);
  }

  sendSlackWebhookMessage(webhook, body) {
    return this.rest.request(
      'post', `${Endpoints.Webhook(webhook.id, webhook.token)}/slack?wait=true`, false, body
    );
  }
}

module.exports = RESTMethods;
