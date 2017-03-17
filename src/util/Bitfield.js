const Constants = require('../util/Constants');

/**
 * Data structure that makes it easy to interact with a pbitfield.
 */
class Bitfield {
  /**
   * @param {number} bitfield Permissions bitfield to read from
   * @param {Object} map The flag map for the permissions
   */
  constructor(bitfield, map) {
    this.bitfield = bitfield;
    this.map = map;
  }

  /**
   * Packed bitfield
   * @type {number}
   */
  get raw() {
    return this.bitfield;
  }

  set raw(raw) {
    this.bitfield = raw;
  }

  /**
   * Data that can be used to resolve from a bitfield. This can be:
   * - A string
   * - A number
   * @typedef {string|number} BitfieldResolvable
   */

  /**
   * Checks whether the bitfield has a bit, or multiple bits.
   * @param {BitResolvable|BitResolvable[]} bit bit(s) to check for
   * @returns {boolean}
   */
  has(bit) {
    if (bit instanceof Array) return bit.every(p => this.has(p));
    bit = this.resolve(bit);
    return (this.bitfield & bit) === bit;
  }

  /**
   * Gets all given bits that are missing from the bitfield.
   * @param {BitResolvable[]} bits Bits to check for
   * @returns {BitResolvable[]}
   */
  missing(bits) {
    return bits.filter(p => !this.has(p));
  }

  /**
   * Adds bits to this one, creating a new instance to represent the new bitfield.
   * @param {...bitResolvable} bits bits to add
   * @returns {bits}
   */
  add(...bits) {
    let total = 0;
    for (let p = 0; p < bits.length; p++) {
      const perm = this.resolve(bits[p]);
      if ((this.bitfield & perm) !== perm) total |= perm;
    }
    return new this.constructor(this.bitfield | total, this.map);
  }

  /**
   * Removes bits to this one, creating a new instance to represent the new bitfield.
   * @param {...bitResolvable} keys bits to remove
   * @returns {bits}
   */
  remove(...bits) {
    let total = 0;
    for (let p = 0; p < bits.length; p++) {
      const perm = this.resolve(bits[p]);
      if ((this.bitfield & perm) === perm) total |= perm;
    }
    return new this.constructor(this.member, this.bitfield & ~total);
  }

  /**
   * Gets an object mapping the bitfield to its map keys (like `READ_MESSAGES`) as a {@link boolean}
   * @returns {Object}
   */
  serialize() {
    const serialized = {};
    for (const key in this.map) serialized[key] = this.has(key);
    return serialized;
  }

  /**
   * Resolves bits to their numeric form.
   * @param {bitResolvable|bits[]} bit - bit(s) to resolve
   * @returns {number|number[]}
   */
  resolve(bit) {
    if (bit instanceof Array) return bit.map(p => this.resolve(p));
    if (typeof bit === 'string') bit = this.map[bit];
    if (typeof bit !== 'number' || bit < 1) throw new RangeError(Constants.Errors.NOT_A_BIT);
    return bit;
  }
}

module.exports = Bitfield;
