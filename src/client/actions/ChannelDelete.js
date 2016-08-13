const Action = require('./Action');

class ChannelDeleteAction extends Action {

  constructor(client) {
    super(client);
    this.timeouts = [];
    this.deleted = {};
  }

  handle(data) {
    const client = this.client;
    let channel = client.store.get('channels', data.id);

    if (channel) {
      client.store.killChannel(channel);
      this.deleted[channel.id] = channel;
      this.scheduleForDeletion(channel.id);
    } else if (this.deleted[data.id]) {
      channel = this.deleted[data.id];
    }

    return {
      channel,
    };
  }

  scheduleForDeletion(id) {
    this.timeouts.push(
      setTimeout(() => delete this.deleted[id],
        this.client.options.rest_ws_bridge_timeout)
    );
  }
}

module.exports = ChannelDeleteAction;
