const Action = require('./Action');

class ChannelGetAction extends Action {
  handle(data, cache) {
    const client = this.client;
    const channel = client.dataManager.newChannel(data, cache);
    return {
      channel,
    };
  }
}

module.exports = ChannelGetAction;
