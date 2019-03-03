'use strict';

const { RangeError } = require('../errors');

/**
 * Data structure that makes it easy to interact with a bitfield.
 */
class BitField {
  /**
   * @param {BitFieldResolvable} [bits=0] Bits(s) to read from
   */
  constructor(bits) {
    /**
     * Bitfield of the packed bits
     * @type {number}
     */
    this.bitfield = this.constructor.resolve(bits);
  }

  /**
   * Checks if this bitfield equals another
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
  equals(bit) {
    return this.bitfield === this.constructor.resolve(bit);
  }

  /**
   * Checks whether the bitfield has a bit, or multiple bits.
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
  has(bit) {
    if (bit instanceof Array) return bit.every(p => this.has(p));
    bit = this.constructor.resolve(bit);
    return (this.bitfield & bit) === bit;
  }

  /**
   * Gets all given bits that are missing from the bitfield.
   * @param {BitFieldResolvable} bits Bits(s) to check for
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {string[]}
   */
  missing(bits, ...hasParams) {
    if (!(bits instanceof Array)) bits = new this.constructor(bits).toArray(false);
    return bits.filter(p => !this.has(p, ...hasParams));
  }

  /**
   * Freezes these bits, making them immutable.
   * @returns {Readonly<BitField>} These bits
   */
  freeze() {
    return Object.freeze(this);
  }

  /**
   * Adds bits to these ones.
   * @param {...BitFieldResolvable} [bits] Bits to add
   * @returns {BitField} These bits or new BitField if the instance is frozen.
   */
  add(...bits) {
    let total = 0;
    for (const bit of bits) {
      total |= this.constructor.resolve(bit);
    }
    if (Object.isFrozen(this)) return new this.constructor(this.bitfield | total);
    this.bitfield |= total;
    return this;
  }

  /**
   * Removes bits from these.
   * @param {...BitFieldResolvable} [bits] Bits to remove
   * @returns {BitField} These bits or new BitField if the instance is frozen.
   */
  remove(...bits) {
    let total = 0;
    for (const bit of bits) {
      total |= this.constructor.resolve(bit);
    }
    if (Object.isFrozen(this)) return new this.constructor(this.bitfield & ~total);
    this.bitfield &= ~total;
    return this;
  }

  /**
   * Gets an object mapping field names to a {@link boolean} indicating whether the
   * bit is available.
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {Object}
   */
  serialize(...hasParams) {
    const serialized = {};
    for (const perm in this.constructor.FLAGS) serialized[perm] = this.has(perm, ...hasParams);
    return serialized;
  }

  /**
   * Gets an {@link Array} of bitfield names based on the bits available.
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {string[]}
   */
  toArray(...hasParams) {
    return Object.keys(this.constructor.FLAGS).filter(bit => this.has(bit, ...hasParams));
  }

  toJSON() {
    return this.bitfield;
  }

  valueOf() {
    return this.bitfield;
  }

  *[Symbol.iterator]() {
    yield* this.toArray();
  }

  /**
   * Data that can be resolved to give a bitfield. This can be:
   * * A string (see {@link BitField.FLAGS})
   * * A bit number
   * * An instance of BitField
   * * An Array of BitFieldResolvable
   * @typedef {string|number|BitField|BitFieldResolvable[]} BitFieldResolvable
   */

  /**
   * Resolves bitfields to their numeric form.
   * @param {BitFieldResolvable} [bit=0] - bit(s) to resolve
   * @returns {number}
   */
  static resolve(bit = 0) {
    if (typeof bit === 'number' && bit >= 0) return bit;
    if (bit instanceof BitField) return bit.bitfield;
    if (bit instanceof Array) return bit.map(p => this.resolve(p)).reduce((prev, p) => prev | p, 0);
    if (typeof bit === 'string') return this.FLAGS[bit];
    throw new RangeError('BITFIELD_INVALID');
  }
}

/**
 * Numeric bitfield flags.
 * <info>Defined in extension classes</info>
 * @type {Object}
 * @abstract
 */
BitField.FLAGS = {};

module.exports = BitField;
