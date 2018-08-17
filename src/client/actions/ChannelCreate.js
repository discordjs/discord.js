const Action = require('./Action');
const { Events } = require('../../util/Constants');

class ChannelCreateAction extends Action {
  handle(data) {
    const client = this.client;
    this._patch(data);
    const existing = client.channels.has(data.id);
    const channel = client.channels.add(data);
    if (!existing && channel) {
      client.emit(Events.CHANNEL_CREATE, channel);
    }
    return { channel };
  }
}

module.exports = ChannelCreateAction;
