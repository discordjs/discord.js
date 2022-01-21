'use strict';

const { RangeError } = require('../errors');

/**
 * Data structure that makes it easy to interact with a bitfield.
 */
class BitField {
  /**
   * @param {BitFieldResolvable} [bits=this.constructor.defaultBit] Bit(s) to read from
   */
  constructor(bits = this.constructor.defaultBit) {
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
    return (this.bitfield & this.constructor.resolve(bit)) !== this.constructor.defaultBit;
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
   * @returns {string[]}
   */
  missing(bits) {
    return new this.constructor(bits).remove(this);
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
    let total = this.constructor.defaultBit;
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
    let total = this.constructor.defaultBit;
    for (const bit of bits) {
      total |= this.constructor.resolve(bit);
    }
    if (Object.isFrozen(this)) return new this.constructor(this.bitfield & ~total);
    this.bitfield &= ~total;
    return this;
  }

  toJSON() {
    return typeof this.bitfield === 'number' ? this.bitfield : this.bitfield.toString();
  }

  valueOf() {
    return this.bitfield;
  }

  /**
   * Data that can be resolved to give a bitfield. This can be:
   * * A bit number (this can be a number literal or a value taken from an enum value)
   * * An instance of BitField
   * * An Array of BitFieldResolvable
   * @typedef {number|bigint|BitField|BitFieldResolvable[]} BitFieldResolvable
   */

  /**
   * Resolves bitfields to their numeric form.
   * @param {BitFieldResolvable} [bit] bit(s) to resolve
   * @returns {number|bigint}
   */
  static resolve(bit) {
    console.log(bit);
    const { defaultBit } = this;
    if (typeof defaultBit === typeof bit && bit >= defaultBit) return bit;
    if (bit instanceof BitField) return bit.bitfield;
    if (Array.isArray(bit)) return bit.map(p => this.resolve(p)).reduce((prev, p) => prev | p, defaultBit);
    if (typeof bit === 'string') {
      // If (typeof this.FLAGS[bit] !== 'undefined') return this.FLAGS[bit];
      if (!isNaN(bit)) return typeof defaultBit === 'bigint' ? BigInt(bit) : Number(bit);
    }
    throw new RangeError('BITFIELD_INVALID', bit);
  }
}

/**
 * @type {number|bigint}
 * @private
 */
BitField.defaultBit = 0;

module.exports = BitField;
