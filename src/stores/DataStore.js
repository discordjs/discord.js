const Collection = require('../util/Collection');

/**
 * Manages the creation, retrieval and deletion of a specific data model.
 * @extends {Collection}
 */
class DataStore extends Collection {
  constructor(client, iterable) {
    super();
    if (iterable) for (const item of iterable) this.create(item);
    Object.defineProperty(this, 'client', { value: client });
  }

  // Stubs
  create() { return undefined; }
  remove(key) { return this.delete(key); }
}

module.exports = DataStore;
