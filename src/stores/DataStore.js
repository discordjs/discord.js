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

  // Stubs
  create(data, cache = true, ...extras) {
    const existing = this.get(data.id);
    if (existing) return existing;

    const entry = this.holds ? new this.holds(this.client, data, ...extras) : data;
    if (cache) this.set(entry.id, entry);
    return entry;
  }
  remove(key) { return this.delete(key); }
}

module.exports = DataStore;
