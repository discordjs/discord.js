const Action = require('./Action');
const Constants = require('../../util/Constants');

class ChannelDeleteAction extends Action {
  constructor(client) {
    super(client);
    this.deleted = new Map();
  }

  handle(data) {
    const client = this.client;
    let channel = client.channels.get(data.id);

    if (channel) {
      client.channels.remove(channel.id);
      client.emit(Constants.Events.CHANNEL_DELETE, channel);
    }

    return { channel };
  }
}

/**
 * Emitted whenever a channel is deleted.
 * @event Client#channelDelete
 * @param {Channel} channel The channel that was deleted
 */

module.exports = ChannelDeleteAction;
