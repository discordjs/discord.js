'use strict';

const DataManager = require('./DataManager');
const { _cleanupSymbol } = require('../util/Constants');

/**
 * Manages the API methods of a data model with a mutable cache of instances.
 * @extends {DataManager}
 * @abstract
 */
class CachedManager extends DataManager {
  constructor(client, holds, iterable) {
    super(client, holds);

    Object.defineProperty(this, '_cache', { value: this.client.options.makeCache(this.constructor, this.holds) });

    let cleanup = this._cache[_cleanupSymbol]?.();
    if (cleanup) {
      cleanup = cleanup.bind(this._cache);
      client._cleanups.add(cleanup);
      client._finalizers.register(this, {
        cleanup,
        message:
          `Garbage collection completed on ${this.constructor.name}, ` +
          `which had a ${this._cache.constructor.name} of ${this.holds.name}.`,
        name: this.constructor.name,
      });
    }

    if (iterable) {
      for (const item of iterable) {
        this._add(item);
      }
    }
  }

  /**
   * The cache of items for this manager.
   * @type {Collection}
   * @abstract
   */
  get cache() {
    return this._cache;
  }

  _add(data, cache = true, { id, extras = [] } = {}) {
    const existing = this.cache.get(id ?? data.id);
    if (existing) {
      if (cache) {
        existing._patch(data);
        return existing;
      }
      const clone = existing._clone();
      clone._patch(data);
      return clone;
    }

    const entry = this.holds ? new this.holds(this.client, data, ...extras) : data;
    if (cache) this.cache.set(id ?? entry.id, entry);
    return entry;
  }
}

module.exports = CachedManager;
