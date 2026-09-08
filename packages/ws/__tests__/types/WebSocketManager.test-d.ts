import type { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import { expectTypeOf } from 'vitest';
import type { ManagerShardEventsMap, WebSocketShardEventsMap, WebSocketManager } from '../../src/index.js';

declare const manager: WebSocketManager;
declare const eventMap: ManagerShardEventsMap;

type AugmentedShardEventsMap = {
	[K in keyof WebSocketShardEventsMap]: [...WebSocketShardEventsMap[K], shardId: number];
};

expectTypeOf(eventMap).toEqualTypeOf<AugmentedShardEventsMap>();
expectTypeOf(manager).toMatchTypeOf<AsyncEventEmitter<AugmentedShardEventsMap>>();
