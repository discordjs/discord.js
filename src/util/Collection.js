const Util = require('./Util');

/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 * @extends {Map}
 */
class Collection extends Map {
  constructor(iterable) {
    super(iterable);

    /**
     * Cached array for the `array()` method - will be reset to `null` whenever `set()` or `delete()` are called
     * @name Collection#_array
     * @type {?Array}
     * @private
     */
    Object.defineProperty(this, '_array', { value: null, writable: true, configurable: true });

    /**
     * Cached array for the `keyArray()` method - will be reset to `null` whenever `set()` or `delete()` are called
     * @name Collection#_keyArray
     * @type {?Array}
     * @private
     */
    Object.defineProperty(this, '_keyArray', { value: null, writable: true, configurable: true });
  }

  set(key, val) {
    this._array = null;
    this._keyArray = null;
    return super.set(key, val);
  }

  delete(key) {
    this._array = null;
    this._keyArray = null;
    return super.delete(key);
  }

  /**
   * Creates an ordered array of the values of this collection, and caches it internally. The array will only be
   * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
   * itself. If you don't want this caching behaviour, use `[...collection.values()]` or
   * `Array.from(collection.values())` instead.
   * @returns {Array}
   */
  array() {
    if (!this._array || this._array.length !== this.size) this._array = [...this.values()];
    return this._array;
  }

  /**
   * Creates an ordered array of the keys of this collection, and caches it internally. The array will only be
   * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
   * itself. If you don't want this caching behaviour, use `[...collection.keys()]` or
   * `Array.from(collection.keys())` instead.
   * @returns {Array}
   */
  keyArray() {
    if (!this._keyArray || this._keyArray.length !== this.size) this._keyArray = [...this.keys()];
    return this._keyArray;
  }

  /**
   * Obtains the first value(s) in this collection.
   * @param {number} [amount] Amount of values to obtain from the beginning
   * @returns {*|Array<*>} A single value if no amount is provided or an array of values, starting from the end if
   * amount is negative
   */
  first(amount) {
    if (typeof amount === 'undefined') return this.values().next().value;
    if (amount < 0) return this.last(amount * -1);
    amount = Math.min(this.size, amount);
    const arr = new Array(amount);
    const iter = this.values();
    for (let i = 0; i < amount; i++) arr[i] = iter.next().value;
    return arr;
  }

  /**
   * Obtains the first key(s) in this collection.
   * @param {number} [amount] Amount of keys to obtain from the beginning
   * @returns {*|Array<*>} A single key if no amount is provided or an array of keys, starting from the end if
   * amount is negative
   */
  firstKey(amount) {
    if (typeof amount === 'undefined') return this.keys().next().value;
    if (amount < 0) return this.lastKey(amount * -1);
    amount = Math.min(this.size, amount);
    const arr = new Array(amount);
    const iter = this.keys();
    for (let i = 0; i < amount; i++) arr[i] = iter.next().value;
    return arr;
  }

  /**
   * Obtains the last value(s) in this collection. This relies on {@link Collection#array}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [amount] Amount of values to obtain from the end
   * @returns {*|Array<*>} A single value if no amount is provided or an array of values, starting from the start if
   * amount is negative
   */
  last(amount) {
    const arr = this.array();
    if (typeof amount === 'undefined') return arr[arr.length - 1];
    if (amount < 0) return this.first(amount * -1);
    if (!amount) return [];
    return arr.slice(-amount);
  }

  /**
   * Obtains the last key(s) in this collection. This relies on {@link Collection#keyArray}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [amount] Amount of keys to obtain from the end
   * @returns {*|Array<*>} A single key if no amount is provided or an array of keys, starting from the start if
   * amount is negative
   */
  lastKey(amount) {
    const arr = this.keyArray();
    if (typeof amount === 'undefined') return arr[arr.length - 1];
    if (amount < 0) return this.firstKey(amount * -1);
    if (!amount) return [];
    return arr.slice(-amount);
  }

  /**
   * Obtains unique random value(s) from this collection. This relies on {@link Collection#array}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [amount] Amount of values to obtain randomly
   * @returns {*|Array<*>} A single value if no amount is provided or an array of values
   */
  random(amount) {
    let arr = this.array();
    if (typeof amount === 'undefined') return arr[Math.floor(Math.random() * arr.length)];
    if (arr.length === 0 || !amount) return [];
    const rand = new Array(amount);
    arr = arr.slice();
    for (let i = 0; i < amount; i++) rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
    return rand;
  }

  /**
   * Obtains unique random key(s) from this collection. This relies on {@link Collection#keyArray}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [amount] Amount of keys to obtain randomly
   * @returns {*|Array<*>} A single key if no amount is provided or an array
   */
  randomKey(amount) {
    let arr = this.keyArray();
    if (typeof amount === 'undefined') return arr[Math.floor(Math.random() * arr.length)];
    if (arr.length === 0 || !amount) return [];
    const rand = new Array(amount);
    arr = arr.slice();
    for (let i = 0; i < amount; i++) rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
    return rand;
  }

  /**
   * Searches for a single item where the given function returns a truthy value. This behaves like
   * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
   * <warn>All collections used in Discord.js are mapped using their `id` property, and if you want to find by id you
   * should use the `get` method. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get) for details.</warn>
   * @param {Function} fn The function to test with (should return boolean)
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {*}
   * @example users.find(user => user.username === 'Bob');
   */
  find(fn, thisArg) {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return val;
    }
    return undefined;
  }

  /* eslint-disable max-len */
  /**
   * Searches for the key of a single item where the given function returns a truthy value. This behaves like
   * [Array.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex),
   * but returns the key rather than the positional index.
   * @param {Function} fn The function to test with (should return boolean)
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {*}
   * @example
   * users.findKey(user => user.username === 'Bob');
   */
  /* eslint-enable max-len */
  findKey(fn, thisArg) {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return key;
    }
    return undefined;
  }

  /**
   * Filters the collection for items where the given function returns a truthy value. This behaves like
   * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
   * but returns a Collection instead of an Array.
   * @param {Function} fn The function to test with (should return boolean)
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {Collection}
   * @example
   * users.filter(user => user.username === 'Bob');
   */
  filter(fn, thisArg) {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    const results = new Collection();
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val);
    }
    return results;
  }

  /**
   * Partitions the collection into two collections where the first collection
   * contains the items that passed and the second contains the items that failed.
   * @param {Function} fn Function used to test (should return a boolean)
   * @returns {Collection[]}
   * @example const [small, big] = guilds.partition(guild => guild.memberCount > 250);
   */
  partition(fn) {
    const results = [new Collection(), new Collection()];
    for (const [key, val] of this) {
      if (fn(val, key, this)) {
        results[0].set(key, val);
      } else {
        results[1].set(key, val);
      }
    }
    return results;
  }

  /**
   * Maps each item to another value. Identical in behavior to
   * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
   * but returns a Collection instead of an Array.
   * @param {Function} fn Function that produces an element of the new collection, taking three arguments
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {Collection}
   * @example users.map(user => user.tag);
   */
  map(fn, thisArg) {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    const results = new Collection();
    for (const [key, val] of this) results.set(key, fn(val, key, this));
    return results;
  }

  /**
   * Checks if there exists an item that passes a test. Identical in behavior to
   * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {boolean}
   * @example users.some(user => user.discriminator === '0000');
   */
  some(fn, thisArg) {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return true;
    }
    return false;
  }

  /**
   * Checks if all items passes a test. Identical in behavior to
   * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {boolean}
   * @example users.every(user => !user.bot);
   */
  every(fn, thisArg) {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false;
    }
    return true;
  }

  /**
   * Applies a function to produce a single value. Identical in behavior to
   * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
   * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
   * and `collection`
   * @param {*} [initialValue] Starting value for the accumulator
   * @returns {*}
   * @example guilds.reduce((acc, guild) => acc + guild.memberCount);
   */
  reduce(fn, initialValue) {
    let accumulator;
    if (typeof initialValue !== 'undefined') {
      accumulator = initialValue;
      for (const [key, val] of this) accumulator = fn(accumulator, val, key, this);
    } else {
      let first = true;
      for (const [key, val] of this) {
        if (first) {
          accumulator = val;
          first = false;
          continue;
        }
        accumulator = fn(accumulator, val, key, this);
      }
    }
    return accumulator;
  }

  /**
   * Creates an identical shallow copy of this collection.
   * @returns {Collection}
   * @example const newColl = someColl.clone();
   */
  clone() {
    return new this.constructor(this);
  }

  /**
   * Combines this collection with others into a new collection. None of the source collections are modified.
   * @param {...Collection} collections Collections to merge
   * @returns {Collection}
   * @example const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
   */
  concat(...collections) {
    const newColl = this.clone();
    for (const coll of collections) {
      for (const [key, val] of coll) newColl.set(key, val);
    }
    return newColl;
  }

  /**
   * Calls the `delete()` method on all items that have it.
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
   * Checks if this collection shares identical key-value pairings with another.
   * This is different to checking for equality using equal-signs, because
   * the collections may be different objects, but contain the same data.
   * @param {Collection} collection Collection to compare with
   * @returns {boolean} Whether the collections have identical contents
   */
  equals(collection) {
    if (!collection) return false;
    if (this === collection) return true;
    if (this.size !== collection.size) return false;
    return !this.find((value, key) => {
      const testVal = collection.get(key);
      return testVal !== value || (testVal === undefined && !collection.has(key));
    });
  }

  /**
   * The sort() method sorts the elements of a collection and returns it.
   * The sort is not necessarily stable. The default sort order is according to string Unicode code points.
   * @param {Function} [compareFunction] Specifies a function that defines the sort order.
   * If omitted, the collection is sorted according to each character's Unicode code point value,
   * according to the string conversion of each element.
   * @returns {Collection}
   * @example users.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
   */
  sort(compareFunction = (x, y) => +(x > y) || +(x === y) - 1) {
    return new Collection([...this.entries()].sort((a, b) => compareFunction(a[1], b[1], a[0], b[0])));
  }

  toJSON() {
    return this.map(e => typeof e.toJSON === 'function' ? e.toJSON() : Util.flatten(e));
  }
}

module.exports = Collection;
