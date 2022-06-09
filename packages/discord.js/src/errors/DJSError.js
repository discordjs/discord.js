'use strict';

// Heavily inspired by node's `internal/errors` module

const kCode = Symbol('code');
const messages = new Map();

/**
 * Extend an error of some sort into a DiscordjsError.
 * @param {Error} Base Base error to extend
 * @returns {DiscordjsError}
 * @ignore
 */
function makeDiscordjsError(Base) {
  return class DiscordjsError extends Base {
    constructor(key, ...args) {
      super(message(key, args));
      this[kCode] = key;
      if (Error.captureStackTrace) Error.captureStackTrace(this, DiscordjsError);
    }

    get name() {
      return `${super.name} [${this[kCode]}]`;
    }

    get code() {
      return this[kCode];
    }
  };
}

/**
 * Format the message for an error.
 * @param {string} key Error key
 * @param {Array<*>} args Arguments to pass for util format or as function args
 * @returns {string} Formatted string
 * @ignore
 */
function message(key, args) {
  if (typeof key !== 'string') throw new Error('Error message key must be a string');
  const msg = messages.get(key);
  if (!msg) throw new Error(`An invalid error message key was used: ${key}.`);
  if (typeof msg === 'function') return msg(...args);
  if (!args?.length) return msg;
  args.unshift(msg);
  return String(...args);
}

/**
 * Register an error code and message.
 * @param {string} sym Unique name for the error
 * @param {*} val Value of the error
 * @ignore
 */
function register(sym, val) {
  messages.set(sym, typeof val === 'function' ? val : String(val));
}

module.exports = {
  register,
  Error: makeDiscordjsError(Error),
  TypeError: makeDiscordjsError(TypeError),
  RangeError: makeDiscordjsError(RangeError),
};
