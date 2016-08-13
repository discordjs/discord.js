const Action = require('./Action');
const Constants = require('../../util/Constants');
const cloneObject = require('../../util/CloneObject');

class ChannelUpdateAction extends Action {

  handle(data) {
    const client = this.client;
    const channel = client.store.get('channels', data.id);

    if (channel) {
      const oldChannel = cloneObject(channel);
      channel.setup(data);
      if (!oldChannel.equals(data)) {
        client.emit(Constants.Events.CHANNEL_UPDATE, oldChannel, channel);
      }

      return {
        old: oldChannel,
        updated: channel,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

module.exports = ChannelUpdateAction;
