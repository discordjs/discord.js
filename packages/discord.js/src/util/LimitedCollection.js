'use strict';

const { Collection } = require('@discordjs/collection');
const { DiscordjsTypeError, ErrorCodes } = require('../errors/index.js');

/**
 * Options for defining the behavior of a LimitedCollection
 *
 * @typedef {Object} LimitedCollectionOptions
 * @property {?number} [maxSize=Infinity] The maximum size of the Collection
 * @property {?Function} [keepOverLimit=null] A function, which is passed the value and key of an entry, ran to decide
 * to keep an entry past the maximum size
 */

/**
 * A Collection which holds a max amount of entries.
 *
 * @extends {Collection}
 * @param {LimitedCollectionOptions} [options={}] Options for constructing the Collection.
 * @param {Iterable} [iterable=null] Optional entries passed to the Map constructor.
 */
class LimitedCollection extends Collection {
  constructor(options = {}, iterable = undefined) {
    if (typeof options !== 'object' || options === null) {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'options', 'object', true);
    }

    const { maxSize = Infinity, keepOverLimit = null } = options;

    if (typeof maxSize !== 'number') {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'maxSize', 'number');
    }

    if (keepOverLimit !== null && typeof keepOverLimit !== 'function') {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'keepOverLimit', 'function');
    }

    super(iterable);

    /**
     * The max size of the Collection.
     *
     * @type {number}
     */
    this.maxSize = maxSize;

    /**
     * A function called to check if an entry should be kept when the Collection is at max size.
     *
     * @type {?Function}
     */
    this.keepOverLimit = keepOverLimit;
  }

  set(key, value) {
    if (this.maxSize === 0 && !this.keepOverLimit?.(value, key, this)) return this;
    if (this.size >= this.maxSize && !this.has(key)) {
      for (const [iteratedKey, iteratedValue] of this.entries()) {
        const keep = this.keepOverLimit?.(iteratedValue, iteratedKey, this) ?? false;
        if (!keep) {
          this.delete(iteratedKey);
          break;
        }
      }
    }

    return super.set(key, value);
  }

  static get [Symbol.species]() {
    return Collection;
  }
}

exports.LimitedCollection = LimitedCollection;
