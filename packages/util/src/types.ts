/**
 * Represents a type that may or may not be a promise
 */
export type Awaitable<Value> = PromiseLike<Value> | Value;
