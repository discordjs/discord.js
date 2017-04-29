const Action = require('./Action');

class ChannelCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.dataManager.newChannel(data);
    return { channel };
  }
}

module.exports = ChannelCreateAction;
