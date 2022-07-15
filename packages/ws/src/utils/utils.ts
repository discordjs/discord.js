import type { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type { ShardRange, WebSocketManager } from '../struct/WebSocketManager';
import { WebSocketShardEvents, WebSocketShardEventsMap } from '../struct/WebSocketShard';

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

/**
 * Binds a shard's events to a WebSocketManager
 */
export function bindShardEvents(
	manager: WebSocketManager,
	emitter: AsyncEventEmitter<WebSocketShardEventsMap>,
	shardId: number,
) {
	for (const event of Object.values(WebSocketShardEvents)) {
		// @ts-expect-error
		emitter.on(event, (payload) => manager.emit(event, { ...payload, shardId }));
	}
}
