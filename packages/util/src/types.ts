/**
 * Represents a type that may or may not be a promise
 */
export type Awaitable<Result> = PromiseLike<Result> | Result;
