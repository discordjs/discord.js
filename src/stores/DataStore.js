const Collection = require('../util/Collection');
let Structures;

/**
 * Manages the creation, retrieval and deletion of a specific data model.
 * @extends {Collection}
 */
class DataStore extends Collection {
  /**
   * Disable caching data in all new stores of this type.
   * @static
   * @returns {true}
   */
  static disable() {
    this.disabled = true;
    return this.disabled;
  }

  /**
   * Enable caching data in all new stores of this type.
   * @static
   * @returns {false}
   */
  static enable() {
    this.disabled = false;
    return this.disabled;
  }

  constructor(client, iterable, holds) {
    super();
    /**
     * Whether this store is disabled. If true, data will still be set but its value will be null.
     * @type {boolean}
     */
    this.disabled = this.constructor.disabled;

    if (!Structures) Structures = require('../util/Structures');
    Object.defineProperty(this, 'client', { value: client });
    Object.defineProperty(this, 'holds', { value: Structures.get(holds.name) || holds });
    if (iterable) for (const item of iterable) this.add(item);
  }

  /**
   * Disable caching data in this store.
   * @returns {true}
   */
  disable() {
    this.disabled = true;
    return this.disabled;
  }

  /**
   * Enable caching data in this store.
   * @returns {false}
   */
  enable() {
    this.disabled = false;
    return this.disabled;
  }

  add(data, cache = true, { id, extras = [] } = {}) {
    const existing = this.get(id || data.id);
    if (existing) return existing;

    const entry = this.holds ? new this.holds(this.client, data, ...extras) : data;
    if (cache) this.set(id || entry.id, entry);
    return entry;
  }

  remove(key) { return this.delete(key); }

  set(key, value) {
    return super.set(key, this.disabled ? null : value);
  }

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

DataStore.disabled = false;

module.exports = DataStore;
