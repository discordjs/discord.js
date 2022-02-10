// Heavily inspired by node's `internal/errors` module

import type { Constructable } from '../../typings';

const kCode = Symbol('code');
const messages = new Map<string>();

/**
 * Format the message for an error.
 * @param {string} key Error key
 * @param {Array<*>} args Arguments to pass for util format or as function args
 * @returns {string} Formatted string
 */
function message(key: string, args: any[]) {
  if (typeof key !== 'string') throw new Error('Error message key must be a string');
  const msg = messages.get(key);
  if (!msg) throw new Error(`An invalid error message key was used: ${key}.`);
  if (typeof msg === 'function') return msg(...args);
  if (!args.length) return msg;
  args.unshift(msg);
  return String(...args);
}

/**
 * Extend an error of some sort into a DiscordjsError.
 * @param {Error} Base Base error to extend
 * @returns {DiscordjsError}
 */
function makeDiscordjsError(Base: Constructable<any>) {
  return class DiscordjsError extends Base {
    public declare [kCode]: string;
    public constructor(key: string, ...args: any[]) {
      super(message(key, args));
      this[kCode] = key;
      if (Error.captureStackTrace) Error.captureStackTrace(this, DiscordjsError);
    }

    public get name() {
      return `${super.name} [${this[kCode]}]`;
    }

    public get code() {
      return this[kCode];
    }
  };
}

/**
 * Register an error code and message.
 * @param {string} sym Unique name for the error
 * @param {*} val Value of the error
 */
function register(sym: string, val) {
  messages.set(sym, typeof val === 'function' ? val : String(val));
}

module.exports = {
  register,
  Error: makeDiscordjsError(Error),
  TypeError: makeDiscordjsError(TypeError),
  RangeError: makeDiscordjsError(RangeError),
};
