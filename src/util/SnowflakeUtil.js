'use strict';

const Util = require('./Util');

// Discord epoch (2015-01-01T00:00:00.000Z)
const EPOCH = 1_420_070_400_000;
let INCREMENT = 0;

/**
 * A container for useful snowflake-related methods.
 */
class SnowflakeUtil extends null {
  /**
   * A {@link https://developer.twitter.com/en/docs/twitter-ids Twitter snowflake},
   * except the epoch is 2015-01-01T00:00:00.000Z.
   *
   * If we have a snowflake '266241948824764416' we can represent it as binary:
   * ```
   * 64                                          22     17     12          0
   *  000000111011000111100001101001000101000000  00001  00000  000000000000
   *       number of ms since Discord epoch       worker  pid    increment
   * ```
   * @typedef {string} Snowflake
   */

  /**
   * Generates a Discord snowflake.
   * <info>This hardcodes the worker's id as 1 and the process's id as 0.</info>
   * @param {number|Date} [timestamp=Date.now()] Timestamp or date of the snowflake to generate
   * @returns {Snowflake} The generated snowflake
   */
  static generate(timestamp = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
      throw new TypeError(
        `"timestamp" argument must be a number (received ${isNaN(timestamp) ? 'NaN' : typeof timestamp})`,
      );
    }
    if (INCREMENT >= 4095) INCREMENT = 0;
    const BINARY = `${(timestamp - EPOCH).toString(2).padStart(42, '0')}0000100000${(INCREMENT++)
      .toString(2)
      .padStart(12, '0')}`;
    return Util.binaryToId(BINARY);
  }

  /**
   * A deconstructed snowflake.
   * @typedef {Object} DeconstructedSnowflake
   * @property {number} timestamp Timestamp the snowflake was created
   * @property {Date} date Date the snowflake was created
   * @property {number} workerId The worker's id in the snowflake
   * @property {number} processId The process's id in the snowflake
   * @property {number} increment Increment in the snowflake
   * @property {string} binary Binary representation of the snowflake
   */

  /**
   * Deconstructs a Discord snowflake.
   * @param {Snowflake} snowflake Snowflake to deconstruct
   * @returns {DeconstructedSnowflake}
   */
  static deconstruct(snowflake) {
    const BINARY = Util.idToBinary(snowflake).toString(2).padStart(64, '0');
    return {
      timestamp: parseInt(BINARY.substring(0, 42), 2) + EPOCH,
      get date() {
        return new Date(this.timestamp);
      },
      workerId: parseInt(BINARY.substring(42, 47), 2),
      processId: parseInt(BINARY.substring(47, 52), 2),
      increment: parseInt(BINARY.substring(52, 64), 2),
      binary: BINARY,
    };
  }

  /**
   * Discord's epoch value (2015-01-01T00:00:00.000Z).
   * @type {number}
   * @readonly
   */
  static get EPOCH() {
    return EPOCH;
  }
}

module.exports = SnowflakeUtil;
