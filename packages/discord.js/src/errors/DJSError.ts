// Heavily inspired by node's `internal/errors` module

import type { Messages } from './Messages';

const kCode = Symbol('code');
const messages = new Map<string, string | ((...args: unknown[]) => string)>();

/**
 * Format the message for an error.
 * @param {string} key Error key
 * @param {Array<*>} args Arguments to pass for util format or as function args
 * @returns {string} Formatted string
 */
function message(key: keyof typeof Messages, ...args: unknown[]): string {
  if (typeof key !== 'string') throw new global.Error('Error message key must be a string');
  const msg = messages.get(key);
  if (!msg) throw new global.Error(`An invalid error message key was used: ${key}.`);
  if (typeof msg === 'function') return msg(...args);
  if (!args.length) return msg;
  args.unshift(msg);
  return String(...args);
}

export interface DiscordjsError extends Error {
  [kCode]: string;
  readonly name: string;
  readonly code: string;
}
export type DiscordjsErrorConstructor = new <T extends keyof typeof Messages>(
  key: T,
  ...args: typeof Messages[T] extends (...args: any[]) => string ? Parameters<typeof Messages[T]> : never
) => DiscordjsError;

/**
 * Extend an error of some sort into a DiscordjsError.
 * @param {Error} Base Base error to extend
 * @returns {DiscordjsError}
 */
function makeDiscordjsError<T extends ErrorConstructor>(Base: T): DiscordjsErrorConstructor {
  // @ts-expect-error Mixin any args
  return class DiscordjsError extends Base {
    public [kCode]: string;
    public constructor(key: keyof typeof Messages, ...args: any[]) {
      super(message(key, args));
      this[kCode] = key;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (global.Error.captureStackTrace) global.Error.captureStackTrace(this, DiscordjsError);
    }

    public override get name() {
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
export function register(sym: string, val: string | ((...args: any[]) => string)) {
  messages.set(sym, typeof val === 'function' ? val : String(val));
}

export const Error = makeDiscordjsError(global.Error);
export const TypeError = makeDiscordjsError(global.TypeError);
export const RangeError = makeDiscordjsError(global.RangeError);
