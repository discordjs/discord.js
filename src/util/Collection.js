/**
 * A utility class to help make it easier to access the data stores
 * @extends {Map}
 */
class Collection extends Map {
  /**
   * Returns an ordered array of the values of this collection.
   * @returns {array}
   * @example
   * // identical to:
   * Array.from(collection.values());
   */
  array() {
    return Array.from(this.values());
  }

  /**
   * Returns the first item in this collection.
   * @returns {*}
   */
  first() {
    return this.values().next().value;
  }

  /**
   * Returns the last item in this collection. This is a relatively slow operation,
   * since an array copy of the values must be made to find the last element.
   * @returns {*}
   */
  last() {
    const arr = this.array();
    return arr[arr.length - 1];
  }

  /**
   * Returns a random item from this collection. This is a relatively slow operation,
   * since an array copy of the values must be made to find a random element.
   * @returns {*}
   */
  random() {
    const arr = this.array();
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * If the items in this collection have a delete method (e.g. messages), invoke
   * the delete method. Returns an array of promises
   * @returns {Promise[]}
   */
  deleteAll() {
    const returns = [];
    for (const item of this.values()) {
      if (item.delete) returns.push(item.delete());
    }
    return returns;
  }

  /**
   * Returns an array of items where `item[prop] === value` of the collection
   * @param {string} prop The property to test against
   * @param {*} value The expected value
   * @returns {array}
   * @example
   * collection.findAll('username', 'Bob');
   */
  findAll(prop, value) {
    if (typeof prop !== 'string') throw new TypeError('Key must be a string.');
    if (typeof value === 'undefined') throw new Error('Value must be specified.');
    const results = [];
    for (const item of this.values()) {
      if (item[prop] === value) results.push(item);
    }
    return results;
  }

  /**
   * Returns a single item where `item[prop] === value`, or the given function returns `true`.
   * In the latter case, this is identical to
   * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
   * @param {string|function} propOrFn The property to test against, or the function to test with
   * @param {*} [value] The expected value - only applicable and required if using a property for the first argument
   * @returns {*}
   * @example
   * collection.find('id', '123123...');
   * @example
   * collection.find(val => val.id === '123123...');
   */
  find(propOrFn, value) {
    if (typeof propOrFn === 'string') {
      if (typeof value === 'undefined') throw new Error('Value must be specified.');
      for (const item of this.values()) {
        if (item[propOrFn] === value) return item;
      }
      return null;
    } else if (typeof propOrFn === 'function') {
      for (const [key, val] of this) {
        if (propOrFn(val, key, this)) return val;
      }
      return null;
    } else {
      throw new Error('First argument must be a property string or a function.');
    }
  }

  /* eslint-disable max-len */
  /**
   * Returns the key of the item where `item[prop] === value`, or the given function returns `true`.
   * In the latter case, this is identical to
   * [Array.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex).
   * @param {string|function} propOrFn The property to test against, or the function to test with
   * @param {*} [value] The expected value - only applicable and required if using a property for the first argument
   * @returns {*}
   * @example
   * collection.find('id', '123123...');
   * @example
   * collection.find(val => val.id === '123123...');
   */
  /* eslint-enable max-len */
  findKey(propOrFn, value) {
    if (typeof propOrFn === 'string') {
      if (typeof value === 'undefined') throw new Error('Value must be specified.');
      for (const [key, val] of this) {
        if (val[propOrFn] === value) return key;
      }
      return null;
    } else if (typeof propOrFn === 'function') {
      for (const [key, val] of this) {
        if (propOrFn(val, key, this)) return key;
      }
      return null;
    } else {
      throw new Error('First argument must be a property string or a function.');
    }
  }

  /**
   * Returns true if the collection has an item where `item[prop] === value`
   * @param {string} prop The property to test against
   * @param {*} value The expected value
   * @returns {boolean}
   * @example
   * if (collection.exists('id', '123123...')) {
   *  console.log('user here!');
   * }
   */
  exists(prop, value) {
    return Boolean(this.find(prop, value));
  }

  /**
   * Identical to
   * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
   * but returns a Collection instead of an Array.
   * @param {function} fn Function used to test (should return a boolean)
   * @param {Object} [thisArg] Value to use as `this` when executing function
   * @returns {Collection}
   */
  filter(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const collection = new Collection();
    for (const [key, val] of this) {
      if (fn(val, key, this)) collection.set(key, val);
    }
    return collection;
  }

  /**
   * Identical to
   * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
   * @param {function} fn Function that produces an element of the new array, taking three arguments
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {array}
   */
  map(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const arr = new Array(this.size);
    let i = 0;
    for (const [key, val] of this) {
      arr[i++] = fn(val, key, this);
    }
    return arr;
  }

  /**
   * Identical to
   * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
   * @param {function} fn Function used to test (should return a boolean)
   * @param {Object} [thisArg] Value to use as `this` when executing function
   * @returns {Collection}
   */
  some(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return true;
    }
    return false;
  }

  /**
   * Identical to
   * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
   * @param {function} fn Function used to test (should return a boolean)
   * @param {Object} [thisArg] Value to use as `this` when executing function
   * @returns {Collection}
   */
  every(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false;
    }
    return true;
  }
}

module.exports = Collection;
