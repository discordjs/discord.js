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
    // Init this.maxSize to make sure it is never undefined.
    this.maxSize = Infinity;
  }


  set(key, value) {
    if (this.maxSize === 0) return;
    if (this.size >= this.maxSize && this.maxSize > 0) this.delete(this.firstKey());
    super.set(key, value);
  }

  // Stubs
  create() { return undefined; }
  remove(key) { return this.delete(key); }
}

module.exports = DataStore;
