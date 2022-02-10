import { Collection } from '@discordjs/collection';
import type { LimitedCollectionOptions } from '../../typings/index.js';
import { TypeError } from '../errors/DJSError.js';

/**
 * Options for defining the behavior of a LimitedCollection
 * @typedef {Object} LimitedCollectionOptions
 * @property {?number} [maxSize=Infinity] The maximum size of the Collection
 * @property {?Function} [keepOverLimit=null] A function, which is passed the value and key of an entry, ran to decide
 * to keep an entry past the maximum size
 */

/**
 * A Collection which holds a max amount of entries.
 * @extends {Collection}
 * @param {LimitedCollectionOptions} [options={}] Options for constructing the Collection.
 * @param {Iterable} [iterable=null] Optional entries passed to the Map constructor.
 */
export class LimitedCollection<K, V> extends Collection<K, V> {
  /**
   * The max size of the Collection.
   * @type {number}
   */
  public readonly maxSize: number;

  /**
   * A function called to check if an entry should be kept when the Collection is at max size.
   * @type {?Function}
   */
  public readonly keepOverLimit: ((value: V, key: K, collection: this) => boolean) | null;

  public constructor(options: LimitedCollectionOptions<K, V> = {}, iterable?: Iterable<readonly [K, V]>) {
    if (typeof options !== 'object' || options === null) {
      throw new TypeError('INVALID_TYPE', 'options', 'object', true);
    }
    const { maxSize = Infinity, keepOverLimit = null } = options;

    if (typeof maxSize !== 'number') {
      throw new TypeError('INVALID_TYPE', 'maxSize', 'number');
    }
    if (keepOverLimit !== null && typeof keepOverLimit !== 'function') {
      throw new TypeError('INVALID_TYPE', 'keepOverLimit', 'function');
    }

    super(iterable ?? []);

    this.maxSize = maxSize;
    this.keepOverLimit = keepOverLimit;
  }

  public override set(key: K, value: V) {
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

  public static get [Symbol.species]() {
    return Collection;
  }
}
