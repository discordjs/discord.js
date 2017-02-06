const Action = require('./Action');

class ChannelCreateAction extends Action {
  handle(data, guild, force) {
    const client = this.client;
    const channel = client.dataManager.newChannel(data, guild, force);
    return {
      channel,
    };
  }
}

module.exports = ChannelCreateAction;
