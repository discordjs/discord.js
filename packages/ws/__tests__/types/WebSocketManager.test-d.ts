import type { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type { GatewayCapabilityBits } from 'discord-api-types/v10';
import { expectTypeOf, test } from 'vitest';
import type { ManagerShardEventsMap, WebSocketShardEventsMap, WebSocketManager } from '../../src/index.js';

declare const manager: WebSocketManager;
declare const eventMap: ManagerShardEventsMap;

test('WebSocketManager capabilities option type', () => {
	expectTypeOf(manager.options.capabilities).toEqualTypeOf<GatewayCapabilityBits | 0>();
});

type AugmentedShardEventsMap = {
	[K in keyof WebSocketShardEventsMap]: [...WebSocketShardEventsMap[K], shardId: number];
};

test('WebSocketManager events are augmented with the shard id', () => {
	expectTypeOf(eventMap).toEqualTypeOf<AugmentedShardEventsMap>();
	expectTypeOf(manager).toExtend<AsyncEventEmitter<AugmentedShardEventsMap>>();
});
