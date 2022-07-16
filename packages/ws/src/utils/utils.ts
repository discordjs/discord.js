import type { ShardRange } from '../ws/WebSocketManager';

export type Awaitable<T> = T | Promise<T>;

/**
 * Yields the numbers in the given range as an array
 * @example
 * range({ start: 3, end: 5 }); // [3, 4, 5]
 */
export function range({ start, end }: ShardRange): number[] {
	return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}

/**
 * Lazily evaluate a callback, storing its result
 */
export function lazy<T>(cb: () => T): () => T {
	let defaultValue: T;
	return () => (defaultValue ??= cb());
}
