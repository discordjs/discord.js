import type { Awaitable } from '@discordjs/util';
import type { ManagerShardEventsMap, WebSocketShardEvents } from '@discordjs/ws';
import type { GatewaySendPayload } from 'discord-api-types/v10';

/**
 * Gateway-like structure that can be used to interact with an actual WebSocket connection.
 * You can provide a custom implementation, useful for running a message broker between your app and your gateway,
 * or you can simply use the {@link @discordjs/ws#(WebSocketManager:class)}.
 */
export interface Gateway {
	getShardCount(): Awaitable<number>;
	on(
		event: WebSocketShardEvents.Dispatch,
		listener: (...params: ManagerShardEventsMap[WebSocketShardEvents.Dispatch]) => Awaitable<void>,
	): this;
	send(shardId: number, payload: GatewaySendPayload): Awaitable<void>;
}
