import type { ShardRange } from '../ws/WebSocketManager';

export type Awaitable<T> = Promise<T> | T;

/**
 * Yields the numbers in the given range as an array
 *
 * @example
 * ```ts
 * range({ start: 3, end: 5 }); // [3, 4, 5]
 * ```
 */
export function range({ start, end }: ShardRange): number[] {
	return Array.from({ length: end - start + 1 }, (_, index) => index + start);
}

/**
 * Lazily evaluate a callback, storing its result
 */
export function lazy<T>(cb: () => T): () => T {
	let defaultValue: T;
	return () => (defaultValue ??= cb());
}
