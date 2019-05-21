'use strict';

const Collection = require('../util/Collection');
let Structures;

/**
 * Manages the creation, retrieval and deletion of a specific data model.
 * @extends {Collection}
 */
class DataStore extends Collection {
  constructor(client, iterable, holds) {
    super();
    if (!Structures) Structures = require('../util/Structures');
    Object.defineProperty(this, 'client', { value: client });
    Object.defineProperty(this, 'holds', { value: Structures.get(holds.name) || holds });
    if (iterable) for (const item of iterable) this.add(item);
  }

  add(data, cache = true, { id, extras = [] } = {}) {
    const existing = this.get(id || data.id);
    if (existing && existing._patch && cache) existing._patch(data);
    if (existing) return existing;

    const entry = this.holds ? new this.holds(this.client, data, ...extras) : data;
    if (cache) this.set(id || entry.id, entry);
    return entry;
  }

  remove(key) { return this.delete(key); }

  /**
   * Resolves a data entry to a data Object.
   * @param {string|Object} idOrInstance The id or instance of something in this DataStore
   * @returns {?Object} An instance from this DataStore
   */
  resolve(idOrInstance) {
    if (idOrInstance instanceof this.holds) return idOrInstance;
    if (typeof idOrInstance === 'string') return this.get(idOrInstance) || null;
    return null;
  }

  /**
   * Resolves a data entry to a instance ID.
   * @param {string|Instance} idOrInstance The id or instance of something in this DataStore
   * @returns {?Snowflake}
   */
  resolveID(idOrInstance) {
    if (idOrInstance instanceof this.holds) return idOrInstance.id;
    if (typeof idOrInstance === 'string') return idOrInstance;
    return null;
  }

  static get [Symbol.species]() {
    return Collection;
  }
}

module.exports = DataStore;
