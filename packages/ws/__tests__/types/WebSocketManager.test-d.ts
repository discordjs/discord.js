import type { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import { expectType, expectAssignable } from 'tsd';
import type { ManagerShardEventsMap, WebSocketShardEventsMap, WebSocketManager } from '../../src/index.js';

declare const manager: WebSocketManager;
declare const eventMap: ManagerShardEventsMap;

type AugmentedShardEventsMap = {
	[K in keyof WebSocketShardEventsMap]: [
		WebSocketShardEventsMap[K] extends [] ? { shardId: number } : WebSocketShardEventsMap[K][0] & { shardId: number },
	];
};

expectType<AugmentedShardEventsMap>(eventMap);
expectAssignable<AsyncEventEmitter<AugmentedShardEventsMap>>(manager);
