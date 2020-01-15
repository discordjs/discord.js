'use strict';

const Channel = require('../structures/Channel');
const BaseManager = require('./BaseManager');
const { Events } = require('../util/Constants');

class ChannelManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, Channel);
  }

  /**
  * The cache of Channels.
  * @property {Collection<Snowflake, Channel>} cache
  * @memberof ChannelManager
  * @instance
  */

  add(data, guild, cache = true) {
    const existing = this.cache.get(data.id);
    if (existing) {
      if (existing._patch && cache) existing._patch(data);
      if (guild) guild.channels.add(existing);
      return existing;
    }

    const channel = Channel.create(this.client, data, guild);

    if (!channel) {
      this.client.emit(Events.DEBUG, `Failed to find guild, or unknown type for channel ${data.id} ${data.type}`);
      return null;
    }

    if (cache) this.cache.set(channel.id, channel);

    return channel;
  }
}

module.exports = ChannelManager;
