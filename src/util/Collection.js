/**
 * A utility class to help make it easier to access the data stores
 * @extends {Map}
 */
class Collection extends Map {

  /**
   * Returns an ordered array of the values of this collection.
   * @returns {Array}
   * @example
   * // identical to:
   * Array.from(collection.values());
   */
  array() {
    return Array.from(this.values());
  }

  /**
   * Returns the first item in this collection.
   * @returns {Object}
   * @example
   * // identical to:
   * Array.from(collection.values())[0];
   */
  first() {
    return this.array()[0];
  }

  /**
   * Returns the last item in this collection.
   * @returns {Object}
   */
  last() {
    const arr = this.array();
    return arr[arr.length - 1];
  }

  /**
   * Returns a random item from this collection.
   * @returns {Object}
   */
  random() {
    const arr = this.array();
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * If the items in this collection have a delete method (e.g. messages), invoke
   * the delete method. Returns an array of promises
   * @return {Array<Promise>}
   */
  deleteAll() {
    const returns = [];
    for (const item of this.values()) {
      if (item.delete) {
        returns.push(item.delete());
      }
    }
    return returns;
  }

  /**
   * The length (size) of this collection.
   * @readonly
   * @type {Number}
   */
  get length() {
    return this.size;
  }

  /**
   * Returns an array of items where `item[key] === value` of the collection
   * @param {String} key the key to filter by
   * @param {any} value the expected value
   * @returns {Array<Object>}
   * @example
   * collection.getAll('username', 'Bob');
   */
  findAll(key, value) {
    const results = [];
    for (const item of this.values()) {
      if (item[key] === value) {
        results.push(item);
      }
    }
    return results;
  }

  /**
   * Returns a single item where `item[key] === value`
   * @param {String} key the key to filter by
   * @param {any} value the expected value
   * @returns {Object}
   * @example
   * collection.get('id', '123123...');
   */
  find(key, value) {
    for (const item of this.values()) {
      if (item[key] === value) {
        return item;
      }
    }
    return null;
  }

  /**
   * Returns true if the collection has an item where `item[key] === value`
   * @param {String} key the key to filter by
   * @param {any} value the expected value
   * @returns {Object}
   * @example
   * if (collection.exists('id', '123123...')) {
   *  console.log('user here!');
   * }
   */
  exists(key, value) {
    return Boolean(this.find(key, value));
  }

  _arrayMethod(method, args) {
    return Array.prototype[method].apply(this.array(), args);
  }

  /**
   * Identical to
   * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
   * but returns a Collection instead of an Array.
   * @param {Function} callback the callback used to filter
   * @param {Object} [thisArg] value to set as this when filtering
   * @returns {Collection}
   */
  filter(...args) {
    const newArray = this.array().filter(...args);
    const collection = new Collection();
    for (const item of newArray) {
      collection.set(item.id, item);
    }
    return collection;
  }
}

module.exports = Collection;
