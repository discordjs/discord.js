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
   * The length (size) of this collection.
   * @readonly
   */
  get length() {
    return this.size;
  }

  /**
   * Returns an array of items where `item[key] === value` of the collection
   * @param {String} key the key to filter bby
   * @param {any} value the expected value
   * @returns {Array<Object>}
   * @example
   * collection.getAll('username', 'Bob');
   */
  findAll(key, value) {
    const results = [];
    for (const item of this.array()) {
      if (item[key] === value) {
        results.push(item);
      }
    }
    return results;
  }

  /**
   * Returns a single item where `item[key] === value`
   * @param {String} key the key to filter bby
   * @param {any} value the expected value
   * @returns {Object}
   * @example
   * collection.get('id', '123123...');
   */
  find(key, value) {
    for (const item of this.array()) {
      if (item[key] === value) {
        return item;
      }
    }
    return null;
  }

  /**
   * Returns true if the collection has an item where `item[key] === value`
   * @param {String} key the key to filter bby
   * @param {any} value the expected value
   * @returns {Object}
   * @example
   * if (collection.exists('id', '123123...')) {
   *  console.log('user here!');
   * }
   */
  exists(key, value) {
    return Boolean(this.get(key, value));
  }

  _arrayMethod(method, args) {
    return Array.prototype[method].apply(this.array(), args);
  }
}

module.exports = Collection;
