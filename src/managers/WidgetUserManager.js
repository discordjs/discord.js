'use strict';

const BaseManager = require('./BaseManager');
const WidgetUser = require('../structures/WidgetUser');

/**
 * Manages API methods for users and stores their cache.
 * @extends {BaseManager}
 */
class WidgetChannelManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, WidgetUser);
  }

  add(data, cache = true) {
    const existing = this.cache.get(data.id);
    if (existing) {
      if (existing._patch && cache) existing._patch(data);
      return existing;
    }
    const user = new WidgetUser(this.client, data);
    if (cache) this.cache.set(user.id, user);

    return user;
  }
}

module.exports = WidgetChannelManager;
