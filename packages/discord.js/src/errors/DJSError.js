'use strict';

// Heavily inspired by node's `internal/errors` module
const { ErrorCodes } = require('./ErrorCodes.js');
const { Messages } = require('./Messages.js');

/**
 * Extend an error of some sort into a DiscordjsError.
 *
 * @param {Error} Base Base error to extend
 * @returns {DiscordjsError}
 * @ignore
 */
function makeDiscordjsError(Base) {
  return class DiscordjsError extends Base {
    constructor(code, ...args) {
      super(message(code, args));
      this.code = code;

      // Consistent stack trace capture across environments
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error(this.message).stack;
      }
    }

    get name() {
      return `${super.name} [${this.code}]`;
    }
  };
}

/**
 * Format the message for an error.
 *
 * @param {string} code The error code
 * @param {Array<*>} args Arguments to pass for util format or as function args
 * @returns {string} Formatted string
 * @ignore
 */
function message(code, args) {
  if (typeof code !== 'string' || !(code in ErrorCodes)) {
    throw new Error('Error code must be a valid DiscordjsErrorCodes');
  }

  const msg = Messages[code];
  if (!msg) {
    throw new Error(`No message associated with error code: ${code}.`);
  }

  if (typeof msg === 'function') {
    return msg(...args);
  }

  if (!args?.length) {
    return msg;
  }

  args.unshift(msg);
  return String(...args);
}

exports.DiscordjsError = makeDiscordjsError(Error);
exports.DiscordjsTypeError = makeDiscordjsError(TypeError);
exports.DiscordjsRangeError = makeDiscordjsError(RangeError);
