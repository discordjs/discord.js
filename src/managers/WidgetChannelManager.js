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
}

module.exports = WidgetChannelManager;
