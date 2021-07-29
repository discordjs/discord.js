'use strict';

const DataManager = require('./DataManager');
const { _cacheCleanupSymbol } = require('../util/Constants');

/**
 * Manages the API methods of a data model with a mutable cache of instances.
 * @extends {DataManager}
 * @abstract
 */
class CachedManager extends DataManager {
  constructor(client, holds, iterable) {
    super(client, holds);

    Object.defineProperty(this, '_cache', { value: this.client.options.makeCache(this.constructor, this.holds) });

    let cleanup = this._cache[_cacheCleanupSymbol];
    const cacheType = this._cache.constructor.name;
    if (cleanup) {
      cleanup = cleanup.bind(this._cache);
      client._cacheCleanups.add(cleanup);
      client._managerFinalizers.register(this, {
        cleanup,
        message: `Garbage Collection completed on ${this.constructor.name}, which held a ${cacheType}.`,
        managerName: this.constructor.name,
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
    if (cache) existing?._patch(data);
    if (existing) return existing;

    const entry = this.holds ? new this.holds(this.client, data, ...extras) : data;
    if (cache) this.cache.set(id ?? entry.id, entry);
    return entry;
  }
}

module.exports = CachedManager;
