const DataStore = require('./DataStore');
const Channel = require('../structures/Channel');
const { Events } = require('../util/Constants');

const kLru = Symbol('LRU');
const lruable = ['group', 'dm'];

/**
 * Stores channels.
 * @private
 * @extends {DataStore}
 */
class ChannelStore extends DataStore {
  constructor(client, iterableOrOptions = {}, options) {
    if (!options && typeof iterableOrOptions[Symbol.iterator] !== 'function') {
      options = iterableOrOptions;
      iterableOrOptions = undefined;
    }
    super(client, iterableOrOptions, Channel);

    if (options.lru) {
      const lru = this[kLru] = [];
      lru.add = item => {
        lru.remove(item);
        lru.unshift(item);
        while (lru.length > options.lru) this.remove(lru[lru.length - 1]);
      };
      lru.remove = item => {
        const index = lru.indexOf(item);
        if (index > -1) lru.splice(index, 1);
      };
    }
  }

  get(key, peek = false) {
    const item = super.get(key);
    if (!item || !lruable.includes(item.type)) return item;
    if (!peek && this[kLru]) this[kLru].add(key);
    return item;
  }

  set(key, val) {
    if (this[kLru] && lruable.includes(val.type)) this[kLru].add(key);
    return super.set(key, val);
  }

  delete(key) {
    const item = this.get(key, true);
    if (!item) return false;
    if (this[kLru] && lruable.includes(item.type)) this[kLru].remove(key);
    return super.delete(key);
  }

  create(data, guild, cache = true) {
    const existing = this.get(data.id);
    if (existing) return existing;

    const channel = Channel.create(this.client, data, guild);

    if (!channel) {
      this.client.emit(Events.DEBUG, `Failed to find guild for channel ${data.id} ${data.type}`);
      return null;
    }

    if (cache) this.set(channel.id, channel);

    return channel;
  }

  remove(id) {
    const channel = this.get(id);
    if (channel.guild) channel.guild.channels.remove(id);
    super.remove(id);
  }

  /**
   * Data that can be resolved to give a Channel object. This can be:
   * * A Channel object
   * * A Snowflake
   * @typedef {Channel|Snowflake} ChannelResolvable
   */

  /**
   * Resolves a ChannelResolvable to a Channel object.
   * @method resolve
   * @memberof ChannelStore
   * @instance
   * @param {ChannelResolvable} channel The channel resolvable to resolve
   * @returns {?Channel}
   */

  /**
   * Resolves a ChannelResolvable to a channel ID string.
   * @method resolveID
   * @memberof ChannelStore
   * @instance
   * @param {ChannelResolvable} channel The channel resolvable to resolve
   * @returns {?Snowflake}
   */
}

module.exports = ChannelStore;
