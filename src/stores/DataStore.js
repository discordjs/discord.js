const Collection = require('../util/Collection');

/**
 * Manages the creation, retrieval and deletion of a specific data model.
 * @extends {Collection}
 */
class DataStore extends Collection {
  constructor(client, iterable) {
    super();
    Object.defineProperty(this, 'client', { value: client });
    if (iterable) for (const item of iterable) this.create(item);
  }

  // Stubs
  create() { return undefined; }
  remove(key) { return this.delete(key); }
}

module.exports = DataStore;
