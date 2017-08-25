const DataStore = require('./DataStore');
const DMChannel = require('../structures/DMChannel');
const GroupDMChannel = require('../structures/GroupDMChannel');
const Constants = require('../util/Constants');

const kLru = Symbol('LRU');
const lruable = ['group', 'dm'];

/**
 * Stores channels.
 * @private
 * @extends {DataStore}
 */
class ChannelStore extends DataStore {
  constructor(iterable, options = {}) {
    super(iterable);

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

    let channel;
    switch (data.type) {
      case Constants.ChannelTypes.DM:
        channel = new DMChannel(this.client, data);
        break;
      case Constants.ChannelTypes.GROUP:
        channel = new GroupDMChannel(this.client, data);
        break;
      default: // eslint-disable-line no-case-declarations
        guild = guild || this.client.guilds.get(data.guild_id);
        if (!guild) {
          this.client.emit(Constants.Events.DEBUG, `Failed to find guild for channel ${data.id} ${data.type}`);
          return null;
        }
        channel = guild.channels.create(data, cache);
        break;
    }

    if (cache) this.set(channel.id, channel);

    return channel;
  }

  remove(id) {
    const channel = this.get(id);
    if (channel.guild) channel.guild.channels.remove(id);
    super.remove(id);
  }
}

module.exports = ChannelStore;
