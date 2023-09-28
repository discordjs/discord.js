'use strict';

const { DiscordjsRangeError, ErrorCodes } = require('../errors');

/**
 * Data structure that makes it easy to interact with a bitfield.
 */
class BitField {
  /**
   * Numeric bitfield flags.
   * <info>Defined in extension classes</info>
   * @type {Object}
   * @memberof BitField
   * @abstract
   */
  static Flags = {};

  /**
   * @type {number|bigint}
   * @memberof BitField
   * @private
   */
  static DefaultBit = 0;

  /**
   * @param {BitFieldResolvable} [bits=this.constructor.DefaultBit] Bit(s) to read from
   */
  constructor(bits = this.constructor.DefaultBit) {
    /**
     * Bitfield of the packed bits
     * @type {number|bigint}
     */
    this.bitfield = this.constructor.resolve(bits);
  }

  /**
   * Checks whether the bitfield has a bit, or any of multiple bits.
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
  any(bit) {
    return (this.bitfield & this.constructor.resolve(bit)) !== this.constructor.DefaultBit;
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
    bit = this.constructor.resolve(bit);
    return (this.bitfield & bit) === bit;
  }

  /**
   * Gets all given bits that are missing from the bitfield.
   * @param {BitFieldResolvable} bits Bit(s) to check for
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {string[]}
   */
  missing(bits, ...hasParams) {
    return new this.constructor(bits).remove(this).toArray(...hasParams);
  }

  /**
   * Freezes these bits, making them immutable.
   * @returns {Readonly<BitField>}
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
    let total = this.constructor.DefaultBit;
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
    let total = this.constructor.DefaultBit;
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
    for (const [flag, bit] of Object.entries(this.constructor.Flags)) {
      if (isNaN(flag)) serialized[flag] = this.has(bit, ...hasParams);
    }
    return serialized;
  }

  /**
   * Gets an {@link Array} of bitfield names based on the bits available.
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {string[]}
   */
  toArray(...hasParams) {
    return [...this[Symbol.iterator](...hasParams)];
  }

  toJSON() {
    return typeof this.bitfield === 'number' ? this.bitfield : this.bitfield.toString();
  }

  valueOf() {
    return this.bitfield;
  }

  *[Symbol.iterator](...hasParams) {
    for (const bitName of Object.keys(this.constructor.Flags)) {
      if (isNaN(bitName) && this.has(bitName, ...hasParams)) yield bitName;
    }
  }

  /**
   * Data that can be resolved to give a bitfield. This can be:
   * * A bit number (this can be a number literal or a value taken from {@link BitField.Flags})
   * * A string bit number
   * * An instance of BitField
   * * An Array of BitFieldResolvable
   * @typedef {number|string|bigint|BitField|BitFieldResolvable[]} BitFieldResolvable
   */

  /**
   * Resolves bitfields to their numeric form.
   * @param {BitFieldResolvable} [bit] bit(s) to resolve
   * @returns {number|bigint}
   */
  static resolve(bit) {
    const { DefaultBit } = this;
    if (typeof DefaultBit === typeof bit && bit >= DefaultBit) return bit;
    if (bit instanceof BitField) return bit.bitfield;
    if (Array.isArray(bit)) return bit.map(p => this.resolve(p)).reduce((prev, p) => prev | p, DefaultBit);
    if (typeof bit === 'string') {
      if (!isNaN(bit)) return typeof DefaultBit === 'bigint' ? BigInt(bit) : Number(bit);
      if (this.Flags[bit] !== undefined) return this.Flags[bit];
    }
    throw new DiscordjsRangeError(ErrorCodes.BitFieldInvalid, bit);
  }
}

module.exports = BitField;
