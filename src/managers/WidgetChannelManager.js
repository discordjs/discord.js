'use strict';

const BaseManager = require('./BaseManager');
const WidgetChannel = require('../structures/WidgetChannel');

/**
 * Manages API methods for users and stores their cache.
 * @extends {BaseManager}
 */
class WidgetChannelManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, WidgetChannel);
  }

  add(data, cache = true) {
    const existing = this.cache.get(data.id);
    if (existing) {
      if (existing._patch && cache) existing._patch(data);
      return existing;
    }
    const channel = new WidgetChannel(this.client, data);
    if (cache) this.cache.set(channel.id, channel);

    return channel;
  }
  /**
   * Obtains a channel from Discord, or the channel cache if it's already available.
   * @param {Snowflake} id ID of the channel
   * @param {boolean} [cache=true] Whether to cache the new channel object if it isn't already
   * @param {boolean} [force=false] Whether to skip the cache check and request the API
   * @returns {Promise<Channel>}
   * @example
   * // Fetch a channel by its id
   * client.channels.fetch('222109930545610754')
   *   .then(channel => console.log(channel.name))
   *   .catch(console.error);
   */
  async fetch(id, cache = true, force = false) {
    if (!force) {
      const existing = this.cache.get(id);
      if (existing) return existing;
    }

    const data = await this.client.api.channels(id).get();
    return this.add(data, cache);
  }
}

module.exports = WidgetChannelManager;
