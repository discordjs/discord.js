'use strict';

const Collection = require('./Collection');

/**
 * Keeps track of all the lifetimes of all the entries present in the collection.
 * When polled, the entries who have outlived their lifetime will be removed from the collection.
 * When the cache has reached its max capacity new entries will not be added to the collection.
 * @extends {Collection}
 * @param {number} [maxSize] The maximum size of the Collection
 * @private
 */
class Cache extends Collection {
  constructor(maxSize) {
    super();
    /**
     * The max size of the Collection.
     * @type {number | undefined}
     */
    this.maxSize = maxSize;
    /**
     * Contains the date of the last hit of all the entries.
     * @type {Collection}
     */
    this.lastHit = new Collection();
  }

  get(key) {
    const data = super.get(key);
    if (data === undefined) return undefined;
    this.lastHit.set(key, Date.now());
    return data;
  }

  set(key, value) {
    if (this.maxSize !== undefined && super.size() >= this.maxSize) {
      return this;
    }
    this.lastHit.set(key, Date.now());
    return super.set(key, value);
  }

  delete(key) {
    this.lastHit.delete(key);
    return super.delete(key);
  }

  clear() {
    this.lastHit.clear();
    return super.clear();
  }

  first(amount) {
    if (amount === undefined) {
      const data = super.first();
      if (data === undefined) return undefined;
      this.lastHit.set(super.firstKey(), Date.now());
      return data;
    }
    const data = super.first(amount);
    if (data.length === 0) return [];
    const keys = super.firstKey(amount);
    const now = Date.now();
    keys.forEach(key => this.lastHit.set(key, now));
    return data;
  }

  last(amount) {
    if (amount === undefined) {
      const data = super.last();
      if (data === undefined) return undefined;
      this.lastHit.set(super.lastKey(), Date.now());
      return data;
    }
    const data = super.last(amount);
    if (data.length === 0) return [];
    const keys = super.lastKey(amount);
    const now = Date.now();
    keys.forEach(key => this.lastHit.set(key, now));
    return data;
  }

  random(amount) {
    if (amount === undefined) {
      const key = super.randomKey();
      if (key === undefined) return undefined;
      this.lastHit.set(key, Date.now());
      return super.get(key);
    }
    const keys = super.randomKey(amount);
    if (keys.length === 0) return [];
    const now = Date.now();
    keys.forEach(key => this.lastHit.set(key, now));
    return keys.map(key => super.get(key));
  }

  find(fn) {
    const key = super.findKey(fn);
    if (key === undefined) return undefined;
    this.lastHit.set(key, Date.now());
    return super.get(key);
  }

  sweep(fn) {
    return super.sweep((value, key, collection) => {
      const val = fn(value, key, collection);
      if (val === true) this.lastHit.delete(key);
      return val;
    });
  }

  filter(fn) {
    const now = Date.now();
    return super.filter((value, key, collection) => {
      const val = fn(value, key, collection);
      if (val === true) this.lastHit.set(key, now);
      return val;
    });
  }

  partition(fn) {
    const now = Date.now();
    return super.partition((value, key, collection) => {
      const val = fn(value, key, collection);
      if (val === true) this.lastHit.set(key, now);
      return val;
    });
  }

  /**
   * Removes all entries which have outlived their lifetimes.
   * @param {number} lifetime The maximum duration (in milliseconds) stale entries should live.
   */
  poll(lifetime) {
    const now = Date.now();
    const keysToRemove = this.lastHit.filter(hit => now - hit >= lifetime);
    keysToRemove.each((_val, key) => this.delete(key));
  }
}

module.exports = Cache;
