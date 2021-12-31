'use strict';

// Discord epoch (2015-01-01T00:00:00.000Z)
const EPOCH = 1_420_070_400_000;
let INCREMENT = BigInt(0);

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
    if (INCREMENT >= 4095n) INCREMENT = BigInt(0);

    // Assign WorkerId as 1 and ProcessId as 0:
    return ((BigInt(timestamp - EPOCH) << 22n) | (1n << 17n) | INCREMENT++).toString();
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
    const bigIntSnowflake = BigInt(snowflake);
    return {
      timestamp: Number(bigIntSnowflake >> 22n) + EPOCH,
      get date() {
        return new Date(this.timestamp);
      },
      workerId: Number((bigIntSnowflake >> 17n) & 0b11111n),
      processId: Number((bigIntSnowflake >> 12n) & 0b11111n),
      increment: Number(bigIntSnowflake & 0b111111111111n),
      binary: bigIntSnowflake.toString(2).padStart(64, '0'),
    };
  }

  /**
   * Retrieves the timestamp field's value from a Discord snowflake.
   * @param {Snowflake} snowflake Snowflake to get the timestamp value from
   * @returns {number}
   */
  static timestampFrom(snowflake) {
    return Number(BigInt(snowflake) >> 22n) + EPOCH;
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
