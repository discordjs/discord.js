const Collection = require('../util/Collection');

class DataStore extends Collection {
  constructor(client, iterable) {
    super(iterable);

    Object.defineProperty(this, 'client', {
      value: client,
      enumerable: false,
      writable: false,
    });
  }

  // Stubs
  create() { return undefined; }
  remove() { return undefined; }
}

module.exports = DataStore;
