const Collection = require('../util/Collection');

/**
 * A data store
 * @class DataStore
 * @extends {Collection}
 */
class DataStore extends Collection {
  constructor(client, iterable) {
    super();
    for (const item of iterable) this.create(item);
    Object.defineProperty(this, 'client', { value: client });
  }

  // Stubs
  create() { return undefined; }
  remove() { return undefined; }
}

module.exports = DataStore;
