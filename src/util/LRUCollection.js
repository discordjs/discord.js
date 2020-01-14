'use strict';

const Collection = require('./Collection');

/**
 * A LRU (Least Recently Used) Collection used for housing channels and sweeping dm channels.
 * @extends {Collection}
*/
class LRUCollection extends Collection {
  constructor(lruable = ['dm'], size = 20) {
    super();
    /**
     * The max LRU size of this collection
     * @type {number}
     */
    this.size = size;
    /**
     * The type of channels to add to LRU.
     * @type {Array<string>}
     */
    this.lruable = lruable;
    this.klru = Symbol('LRU');
    this.lru = this[this.klru] = [];

    this.lru.add = item => {
      this.lru.remove(item);
      this.lru.unshift(item);
      while (this.lru.length > this.max) this.remove(this.lru[this.lru.length - 1]);
    };

    this.lru.remove = item => {
      const index = this.lru.indexOf(item);
      if (index > -1) this.lru.splice(index, 1);
    };
  }

  get(key, peek = false) {
    const item = super.get(key);
    if (!item || !this.lruable.includes(item.type)) return item;
    if (!peek) this[this.kLru].add(key);
    return item;
  }

  set(key, val) {
    if (this.lruable.includes(val.type)) this[this.kLru].add(key);
    return super.set(key, val);
  }

  delete(key) {
    const item = this.get(key, true);
    if (!item) return false;
    if (this.lruable.includes(item.type)) this[this.kLru].remove(key);
    return super.delete(key);
  }

  remove(id) {
    const channel = this.get(id);
    if (channel.guild) channel.guild.channels.remove(id);
    this.delete(id);
  }
}

module.exports = LRUCollection;
