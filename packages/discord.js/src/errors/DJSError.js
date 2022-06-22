'use strict';

// Heavily inspired by node's `internal/errors` module
const ErrorCodes = require('./ErrorCodes');
const Messages = require('./Messages');
const kCode = Symbol('code');

/**
 * Extend an error of some sort into a DiscordjsError.
 * @param {Error} Base Base error to extend
 * @returns {DiscordjsError}
 * @ignore
 */
function makeDiscordjsError(Base) {
  return class DiscordjsError extends Base {
    constructor(code, ...args) {
      super(message(code, args));
      this[kCode] = code;
      Error.captureStackTrace?.(this, DiscordjsError);
    }

    get name() {
      return `${super.name} [${this.code}]`;
    }

    get code() {
      return ErrorCodes[this[kCode]];
    }
  };
}

/**
 * Format the message for an error.
 * @param {string} code The error code
 * @param {Array<*>} args Arguments to pass for util format or as function args
 * @returns {string} Formatted string
 * @ignore
 */
function message(code, args) {
  if (typeof code !== 'number') throw new Error('Error code must be a valid DiscordjsErrorCodes');
  const msg = Messages[code];
  if (!msg) throw new Error(`An invalid error code was used: ${code}.`);
  if (typeof msg === 'function') return msg(...args);
  if (!args?.length) return msg;
  args.unshift(msg);
  return String(...args);
}

module.exports = {
  Error: makeDiscordjsError(Error),
  TypeError: makeDiscordjsError(TypeError),
  RangeError: makeDiscordjsError(RangeError),
};
