'use strict';

const { setInterval } = require('node:timers');
const { Collection } = require('@discordjs/collection');
const { _cleanupSymbol } = require('./Constants.js');
const Sweepers = require('./Sweepers.js');
const { TypeError } = require('../errors/DJSError.js');

/**
 * @typedef {Function} SweepFilter
 * @param {LimitedCollection} collection The collection being swept
 * @returns {Function|null} Return `null` to skip sweeping, otherwise a function passed to `sweep()`,
 * See {@link [Collection#sweep](https://discord.js.org/#/docs/collection/main/class/Collection?scrollTo=sweep)}
 * for the definition of this function.
 */

/**
 * Options for defining the behavior of a LimitedCollection
 * @typedef {Object} LimitedCollectionOptions
 * @property {?number} [maxSize=Infinity] The maximum size of the Collection
 * @property {?Function} [keepOverLimit=null] A function, which is passed the value and key of an entry, ran to decide
 * to keep an entry past the maximum size
 * @property {?SweepFilter} [sweepFilter=null] DEPRECATED: There is no direct alternative to this,
 * however most of its purpose is fulfilled by {@link Client#sweepers}
 * A function ran every `sweepInterval` to determine how to sweep
 * @property {?number} [sweepInterval=0] DEPRECATED: There is no direct alternative to this,
 * however most of its purpose is fulfilled by {@link Client#sweepers}
 * How frequently, in seconds, to sweep the collection.
 */

/**
 * A Collection which holds a max amount of entries and sweeps periodically.
 * @extends {Collection}
 * @param {LimitedCollectionOptions} [options={}] Options for constructing the Collection.
 * @param {Iterable} [iterable=null] Optional entries passed to the Map constructor.
 */
class LimitedCollection extends Collection {
  constructor(options = {}, iterable) {
    if (typeof options !== 'object' || options === null) {
      throw new TypeError('INVALID_TYPE', 'options', 'object', true);
    }
    const { maxSize = Infinity, keepOverLimit = null, sweepInterval = 0, sweepFilter = null } = options;

    if (typeof maxSize !== 'number') {
      throw new TypeError('INVALID_TYPE', 'maxSize', 'number');
    }
    if (keepOverLimit !== null && typeof keepOverLimit !== 'function') {
      throw new TypeError('INVALID_TYPE', 'keepOverLimit', 'function');
    }
    if (typeof sweepInterval !== 'number') {
      throw new TypeError('INVALID_TYPE', 'sweepInterval', 'number');
    }
    if (sweepFilter !== null && typeof sweepFilter !== 'function') {
      throw new TypeError('INVALID_TYPE', 'sweepFilter', 'function');
    }

    super(iterable);

    /**
     * The max size of the Collection.
     * @type {number}
     */
    this.maxSize = maxSize;

    /**
     * A function called to check if an entry should be kept when the Collection is at max size.
     * @type {?Function}
     */
    this.keepOverLimit = keepOverLimit;

    /**
     * A function called every sweep interval that returns a function passed to `sweep`.
     * @deprecated in favor of {@link Client#sweepers}
     * @type {?SweepFilter}
     */
    this.sweepFilter = sweepFilter;

    /**
     * The id of the interval being used to sweep.
     * @deprecated in favor of {@link Client#sweepers}
     * @type {?Timeout}
     */
    this.interval =
      sweepInterval > 0 && sweepInterval !== Infinity && sweepFilter
        ? setInterval(() => {
            const sweepFn = this.sweepFilter(this);
            if (sweepFn === null) return;
            if (typeof sweepFn !== 'function') throw new TypeError('SWEEP_FILTER_RETURN');
            this.sweep(sweepFn);
          }, sweepInterval * 1_000).unref()
        : null;
  }

  set(key, value) {
    if (this.maxSize === 0) return this;
    if (this.size >= this.maxSize && !this.has(key)) {
      for (const [k, v] of this.entries()) {
        const keep = this.keepOverLimit?.(v, k, this) ?? false;
        if (!keep) {
          this.delete(k);
          break;
        }
      }
    }
    return super.set(key, value);
  }

  /**
   * Create a sweepFilter function that uses a lifetime to determine sweepability.
   * @param {LifetimeFilterOptions} [options={}] The options used to generate the filter function
   * @deprecated Use {@link Sweepers.filterByLifetime} instead
   * @returns {SweepFilter}
   */
  static filterByLifetime({
    lifetime = 14400,
    getComparisonTimestamp = e => e?.createdTimestamp,
    excludeFromSweep = () => false,
  } = {}) {
    return Sweepers.filterByLifetime({ lifetime, getComparisonTimestamp, excludeFromSweep });
  }

  [_cleanupSymbol]() {
    return this.interval ? () => clearInterval(this.interval) : null;
  }

  static get [Symbol.species]() {
    return Collection;
  }
}

module.exports = LimitedCollection;
