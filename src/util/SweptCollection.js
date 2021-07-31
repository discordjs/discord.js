'use strict';

const { Collection } = require('@discordjs/collection');
const { _cleanupSymbol } = require('./Constants.js');
const { TypeError } = require('../errors/DJSError.js');

/**
 * @typedef {Function} SweepFilter
 * @param {SweptCollection} collection The collection being swept
 * @returns {Function|null} Return `null` to skip sweeping, otherwise a function passed to `sweep()`,
 * See {@link [Collection#sweep](https://discord.js.org/#/docs/collection/master/class/Collection?scrollTo=sweep)}
 * for the definition of this function.
 */

/**
 * Options for defining the behavior of a Swept Collection
 * @typedef {Object} SweptCollectionOptions
 * @property {?SweepFitler} [sweepFilter=null] A function run every `sweepInterval` to determine how to sweep
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
    const { sweepFilter = null, sweepInterval = 3600 } = options;

    if (sweepFilter !== null && typeof sweepFilter !== 'function') {
      throw new TypeError('INVALID_TYPE', 'sweepFunction', 'function');
    }
    if (typeof sweepInterval !== 'number') throw new TypeError('INVALID_TYPE', 'sweepInterval', 'number');

    super(iterable);

    /**
     * A function called every sweep interval that returns a function passed to `sweep`
     * @type {?SweepFilter}
     */
    this.sweepFilter = sweepFilter;

    /**
     * The id of the interval being used to sweep.
     * @type {?Timeout}
     */
    this.interval =
      sweepInterval > 0 && sweepFilter
        ? setInterval(() => {
            const sweepFn = this.sweepFilter(this);
            if (sweepFn === null) return;
            if (typeof sweepFn !== 'function') throw new TypeError('SWEEP_FILTER_RETURN');
            this.sweep(sweepFn);
          }, sweepInterval * 1000).unref()
        : null;
  }

  /**
   * Options for generating a filter function based on lifetime
   * @typedef {Object} LifetimeFilterOptions
   * @property {number} [lifetime=14400] How long an entry should stay in the collection
   * before it is considered sweepable
   * @property {Function} [getComparisonTimestamp=`e => e.createdTimestamp`] A function that takes an entry, key,
   * and the collection and returns a timestamp to compare against in order to determine the lifetime of the entry.
   * @property {Function} [excludeFromSweep=`() => false`] A function that takes an entry, key, and the collection
   * and returns a boolean, `true` when the entry should not be checked for sweepability.
   */

  /**
   * Create a sweepFilter function that uses a lifetime to determine sweepability.
   * @param {LifetimeFilterOptions} [options={}] The options used to generate the filter function
   * @returns {SweepFilter}
   */
  static filterByLifetime({
    lifetime = 14400,
    getComparisonTimestamp = e => e?.createdTimestamp,
    excludeFromSweep = () => false,
  } = {}) {
    if (typeof lifetime !== 'number') throw new TypeError('INVALID_TYPE', 'lifetime', 'number');
    if (typeof getComparisonTimestamp !== 'function') {
      throw new TypeError('INVALID_TYPE', 'getComparisonTimestamp', 'function');
    }
    if (typeof excludeFromSweep !== 'function') {
      throw new TypeError('INVALID_TYPE', 'excludeFromSweep', 'function');
    }
    return () => {
      if (lifetime <= 0) return null;
      const lifetimeMs = lifetime * 1000;
      const now = Date.now();
      return (entry, key, coll) => {
        if (excludeFromSweep(entry, key, coll)) {
          return false;
        }
        const comparisonTimestamp = getComparisonTimestamp(entry, key, coll);
        if (!comparisonTimestamp || typeof comparisonTimestamp !== 'number') return false;
        return now - comparisonTimestamp > lifetimeMs;
      };
    };
  }

  [_cleanupSymbol]() {
    clearInterval(this.interval);
  }

  static get [Symbol.species]() {
    return Collection;
  }
}

module.exports = SweptCollection;
