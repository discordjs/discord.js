const Action = require('./Action');

class ChannelCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.create(data);
    return { channel };
  }
}

module.exports = ChannelCreateAction;
