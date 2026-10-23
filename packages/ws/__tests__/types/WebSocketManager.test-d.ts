import type { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type { GatewayCapabilityBits } from 'discord-api-types/v10';
import { expectTypeOf } from 'vitest';
import type { ManagerShardEventsMap, WebSocketShardEventsMap, WebSocketManager } from '../../src/index.js';

declare const manager: WebSocketManager;
declare const eventMap: ManagerShardEventsMap;

expectTypeOf(manager.options.capabilities).toEqualTypeOf<GatewayCapabilityBits | 0>();

type AugmentedShardEventsMap = {
	[K in keyof WebSocketShardEventsMap]: [...WebSocketShardEventsMap[K], shardId: number];
};

expectTypeOf(eventMap).toEqualTypeOf<AugmentedShardEventsMap>();
expectTypeOf(manager).toMatchTypeOf<AsyncEventEmitter<AugmentedShardEventsMap>>();
