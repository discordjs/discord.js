import type { PubSubRedisBroker } from '@discordjs/brokers';
import type { ManagerShardEventsMap, WebSocketShardEvents } from '@discordjs/ws';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type { GatewaySendPayload, GatewayDispatchEvents } from 'discord-api-types/v10';
import type { DiscordEvents } from '../client.js';
import type { Gateway } from './Gateway.js';

interface BrokerIntrinsicProps {
	shardId: number;
}

interface Events extends DiscordEvents {
	gateway_send: GatewaySendPayload;
}

export type RedisBrokerDiscordEvents = {
	[K in keyof Events]: BrokerIntrinsicProps & { payload: Events[K] };
};

export class RedisGateway
	extends AsyncEventEmitter<{ dispatch: ManagerShardEventsMap[WebSocketShardEvents.Dispatch] }>
	implements Gateway
{
	public constructor(
		private readonly broker: PubSubRedisBroker<RedisBrokerDiscordEvents>,
		private readonly shardCount: number,
	) {
		super();
	}

	public getShardCount(): number {
		return this.shardCount;
	}

	public async send(shardId: number, payload: GatewaySendPayload): Promise<void> {
		await this.broker.publish('gateway_send', { payload, shardId });
	}

	public async init(group: string, events: GatewayDispatchEvents[]) {
		for (const event of events) {
			this.broker.on(event, ({ data: { payload, shardId }, ack }) => {
				// @ts-expect-error - Union shenanigans
				this.emit('dispatch', { shardId, data: payload });
				void ack();
			});
		}

		await this.broker.subscribe(group, events);
	}
}
