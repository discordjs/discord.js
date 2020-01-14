'use strict';

const Collection = require('./Collection.js');

/**
 * A Collection which holds a max amount of entries. The first key is deleted if the Collection has
 * reached max size.
 * @extends {Collection}
 * @param {number} [maxSize=0] The maximum size of the Collection
 * @param {Iterable} [iterable=null] Optional entries passed to the Map constructor.
 */

class LimitedCollection extends Collection {
  constructor(maxSize = 0, iterable = null) {
    super(iterable);
    /**
     * The max size of the Collection.
     * @type {number}
     */
    this.maxSize = maxSize;
  }

  set(key, value) {
    if (this.maxSize === 0) return;
    if (this.size >= this.maxSize) this.delete(this.firstKey());
    super.set(key, value);
  }
}

module.exports = LimitedCollection;
