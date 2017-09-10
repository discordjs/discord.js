const Collection = require('../util/Collection');

/**
 * Manages the creation, retrieval and deletion of a specific data model.
 * @extends {Collection}
 */
class DataStore extends Collection {
  constructor(client, iterable, holds) {
    super();
    Object.defineProperty(this, 'client', { value: client });
    Object.defineProperty(this, 'holds', { value: holds });
    if (iterable) for (const item of iterable) this.create(item);
  }

  create(data, cache = true, { id, extras = [] } = {}) {
    const existing = this.get(id || data.id);
    if (existing) return existing;

    const entry = this.holds ? new this.holds(this.client, data, ...extras) : data;
    if (cache) this.set(id || entry.id, entry);
    return entry;
  }

  remove(key) { return this.delete(key); }

  /**
   * Resolves a data entry to a data Object.
   * @param {string|Object} idOrInstance The id or instance of something in this datastore
   * @returns {?Object} An instance from this datastore
   */
  resolve(idOrInstance) {
    if (idOrInstance instanceof this.holds) return idOrInstance;
    if (typeof idOrInstance === 'string') return this.get(idOrInstance) || null;
    return null;
  }

  /**
   * Resolves a data entry to a instance ID.
   * @param {string|Instance} idOrInstance The id or instance of something in this datastore
   * @returns {?string}
   */
  resolveID(idOrInstance) {
    if (idOrInstance instanceof this.holds) return idOrInstance.id;
    if (typeof idOrInstance === 'string') return idOrInstance;
    return null;
  }
}

module.exports = DataStore;
