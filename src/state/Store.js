const Collection = require('../util/Collection');

/**
 * A store of data which interacts with client state
 * @class DataStore
 * @extends {Collection}
 */
class DataStore extends Collection {
  constructor(client, iterable) {
    super(iterable);

    Object.defineProperty(this, 'client', {
      value: client,
      enumerable: false,
      writable: false,
    });
  }

  /**
   * Merge another Store with this Store
   * @param {DataStore} data A store to merge with this one
   * @returns {DataStore}
   */
  merge(data) {
    let newData = null;
    for (const key in data) {
      if (!data.hasOwnProperty(key)) continue;
      if (!this.hasOwnProperty(key)) continue;
      const value = data[key];
      if (this[key] !== value) {
        if (newData === null) newData = Object.assign({}, this);
        newData[key] = data[key];
      }
    }
    return newData !== null ? new this.constructor(newData) : this;
  }

  // Stubs
  create() { return undefined; }
  remove() { return undefined; }
}

module.exports = DataStore;
