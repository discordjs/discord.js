'use strict';

const Collection = require('./Collection.js');
const { TypeError } = require('../errors/DJSError.js');

/**
 * Options for defining the behavior of a Swept Collection
 * @typedef {Object} SweptCollectionOptions
 * @property {number} [maxSize=-1] The maximum size of the Collection
 * @property {Function|null} [keepAtMaxSize=null] A function used to exclude some entries from being removed
 * when reaching the specified max size.
 * The function takes an entry as a paremeter and returns a boolean, `true` to keep.
 * <warn>When the function returns `true` for every entry,
 * the first entry will be removed to maintain size</warn>
 * @property {Function|null} [sweepFilter=null] A custom function taking no parameters, run every every `sweepInterval`.
 * The return value of this function is a function passed to `sweep()`,
 * See {@link [Collection#sweep](https://discord.js.org/#/docs/collection/master/class/Collection?scrollTo=sweep)}
 * for the definition of this function.
 * @property {number} [sweepInterval=3600] How frequently, in seconds, to sweep the collection.
 */

/**
 * A Collection which holds a max amount of entries and sweeps periodically.
 * @extends {Collection}
 * @param {SweptCollectionOptions} [options={}] Options for constructing the swept collection.
 * @param {Iterable} [iterable=null] Optional entries passed to the Map constructor.
 */
class SweptCollection extends Collection {
  constructor(options = {}, iterable) {
    if (typeof options !== 'object' || options === null) {
      throw new TypeError('INVALID_TYPE', 'options', 'object or iterable', true);
    }
    const { maxSize = -1, keepAtMaxSize = null, sweepFilter = null, sweepInterval = 3600 } = options;

    if (typeof maxSize !== 'number') throw new TypeError('INVALID_TYPE', 'maxSize', 'number');
    if (keepAtMaxSize !== null && typeof keepAtMaxSize !== 'function') {
      throw new TypeError('INVALID_TYPE', 'maxSizePreidcate', 'function');
    }
    if (sweepFilter !== null && typeof sweepFilter !== 'function') {
      throw new TypeError('INVALID_TYPE', 'sweepFunction', 'function');
    }
    if (typeof sweepInterval !== 'number') throw new TypeError('INVALID_TYPE', 'sweepInterval', 'number');

    super(iterable);

    /**
     * The max size of the Collection.
     * @type {number}
     */
    this.maxSize = maxSize;

    /**
     * A function called to exclude items from being removed when the Collection reaches max size.
     * <warn>When the function returns `true` for every entry, the first entry is removed to maintain size</warn>
     * @type {?Function}
     */
    this.keepAtMaxSize = keepAtMaxSize;

    /**
     * A function called every sweep interval that returns a function passed to `sweep`
     * @type {?Function}
     */
    this.sweepFilter = sweepFilter;

    /**
     * The id of the interval being used to sweep.
     * @type {?Number}
     */
    this.interval =
      sweepInterval > 0 && sweepFilter ? setInterval(() => this.sweep(this.sweepFilter()), sweepInterval * 1000) : null;
  }

  set(key, value) {
    if (this.maxSize === 0) return this;
    if (this.maxSize === -1 || this.maxSize === Infinity) super.set(key, value);
    if (this.size >= this.maxSize && !this.has(key)) {
      let deleted = false;
      if (this.keepAtMaxSize) {
        for (const [k, v] of this) {
          if (!this.keepAtMaxSize(v)) {
            this.delete(k);
            deleted = true;
            break;
          }
        }
      }
      if (!deleted) {
        this.delete(this.firstKey());
      }
    }
    return super.set(key, value);
  }

  /**
   * Options for generating a filter function based on lifetime
   * @typedef {Object} LifetimeFilterOptions
   * @property {number} [lifetime=14400] How long an entry should stay in the collection
   * before it is considered sweepable
   * @property {Function} [getComparisonTimestamp=`e => e.createdTimestamp`] A function that takes an entry
   * and returns a timestamp to compare against in order to determine the lifetime of the entry.
   * @property {Function} [excludeFromSweep=null] A function that takes an entry and returns a boolean,
   * `true` when the entry should not be checked for sweepability.
   */

  /**
   * Create a sweepFilter function that uses a lifetime to determine sweepability.
   * @param {LifetimeFilterOptions} [options={}] The options used to generate the filter function
   * @returns {Function}
   */
  static filterByLiftetme({
    lifetime = 14400,
    getComparisonTimestamp = e => e?.createdTimestamp,
    excludeFromSweep = null,
  } = {}) {
    if (typeof lifetime !== 'number') throw new TypeError('INVALID_TYPE', 'lifetime', 'number');
    if (typeof getComparisonTimestamp !== 'function') {
      throw new TypeError('INVALID_TYPE', 'getComparisonTimestamp', 'function');
    }
    if (excludeFromSweep !== null && typeof excludeFromSweep !== 'function') {
      throw new TypeError('INVALID_TYPE', 'excludeFromSweep', 'function');
    }
    return () => {
      if (lifetime <= 0) return () => false;
      const lifetimeMs = lifetime * 1000;
      const now = Date.now();
      return entry => {
        if (excludeFromSweep?.(entry)) {
          return false;
        }
        const comparisonTimestamp = getComparisonTimestamp(entry);
        if (!comparisonTimestamp || typeof comparisonTimestamp !== 'number') return false;
        return now - comparisonTimestamp > lifetimeMs;
      };
    };
  }
}

module.exports = SweptCollection;
