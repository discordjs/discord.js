const kCode = Symbol('code');
const sCode = Symbol('stack');

/**
 * Represents an error from Discord's HTTP Gateway
 */
class DiscordHTTPError extends Error {
  constructor(error) {
    super(error.message);
    this[kCode] = error.code;
    this[sCode] = error.errors;
  }

  /**
   * The name of this error
   * @type {string}
   */
  get name() {
    return `DiscordHTTPError ${this[kCode]}`;
  }

  /**
   * The error code from Discord
   * @type {number}
   */
  get code() {
    return this[kCode];
  }

  /**
   * A trace
   * @type {?Object}
   */
  get trace() {
    return this[sCode];
  }
}

module.exports = DiscordHTTPError;
