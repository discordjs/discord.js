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
   * @typedef {string|number} FlagResolvable
   */

  /**
   * Checks whether the bitfield has a bit, or multiple bits.
   * @param {FlagResolvable|FlagResolvable[]} flag Flag(s) to check for
   * @returns {boolean}
   */
  has(flag) {
    if (flag instanceof Array) return flag.every(f => this.has(f));
    flag = this.resolve(flag);
    return (this.bitfield & flag) === flag;
  }

  /**
   * Gets all given bits that are missing from the bitfield.
   * @param {FlagResolvable[]} flags Flag to check for
   * @returns {FlagResolvable[]}
   */
  missing(flags) {
    return flags.filter(f => !this.has(f));
  }

  /**
   * Adds flags to this one, creating a new instance to represent the new bitfield.
   * @param {...FlagResolvable} flags Flags to add
   * @returns {bits}
   */
  add(...flags) {
    let total = 0;
    for (let p = 0; p < flags.length; p++) {
      const flag = this.resolve(flags[p]);
      if ((this.bitfield & flag) !== flag) total |= flag;
    }
    return new this.constructor(this.bitfield | total, this.map);
  }

  /**
   * Removes flags to this one, creating a new instance to represent the new bitfield.
   * @param {...FlagResolvable} flags Flags to remove
   * @returns {bits}
   */
  remove(...flags) {
    let total = 0;
    for (let p = 0; p < flags.length; p++) {
      const flag = this.resolve(flag[p]);
      if ((this.bitfield & flag) === flag) total |= flag;
    }
    return new this.constructor(this.member, this.bitfield & ~total);
  }

  /**
   * Gets an object mapping the bitfield to its map keys (like `READ_MESSAGES`) as a {@link boolean}
   * @returns {Object}
   */
  serialize() {
    const serialized = {};
    for (const flag in this.map) serialized[flag] = this.has(flag);
    return serialized;
  }

  /**
   * Resolves bits to their numeric form.
   * @param {FlagResolvable|FlagResolvable[]} flag - bit(s) to resolve
   * @returns {number|number[]}
   */
  resolve(flag) {
    if (flag instanceof Array) return flag.map(p => this.resolve(p));
    if (typeof flag === 'string') flag = this.map[flag];
    if (typeof flag !== 'number' || flag < 1) throw new RangeError(Constants.Errors.NOT_A_BITFIELD_FLAG);
    return flag;
  }
}

module.exports = Bitfield;
