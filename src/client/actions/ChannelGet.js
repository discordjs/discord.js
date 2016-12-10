const Action = require('./Action');

class ChannelGetAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.dataManager.newChannel(data);
    return {
      channel,
    };
  }
}

module.exports = ChannelGetAction;
