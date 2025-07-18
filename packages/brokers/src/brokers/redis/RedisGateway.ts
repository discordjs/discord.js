import type { Gateway, GatewayDispatchPayload, GatewayDispatchEvents, GatewaySendPayload } from '@discordjs/core';
import type { ManagerShardEventsMap, WebSocketShardEvents } from '@discordjs/ws';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type { PubSubRedisBroker } from '@discordjs/brokers';

// need this to be its own type for some reason, the compiler doesn't behave the same way if we in-line it
type _DiscordEvents = {
	[K in GatewayDispatchEvents]: GatewayDispatchPayload & {
		t: K;
	};
};

export type DiscordEvents = {
	[K in keyof _DiscordEvents]: _DiscordEvents[K]['d'];
};

interface BrokerIntrinsicProps {
	shardId: number;
}

interface Events extends DiscordEvents {
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	[RedisGateway.GatewaySendEvent]: GatewaySendPayload;
}

export type RedisBrokerDiscordEvents = {
	[K in keyof Events]: BrokerIntrinsicProps & { payload: Events[K] };
};

/**
 * RedisGateway is an implementation for core's Gateway interface built on top of our Redis brokers.
 *
 * Some important notes:
 * - Instances for this class are for your consumers/services that need the gateway. naturally, the events passed into
 * `init` are the only ones the core client will be able to emit
 * - You can also opt to use the class as-is without `@discordjs/core`, if you so desire. Events are properly typed
 * - You need to implement your own gateway service. Refer to the example below for how that would look like. This class
 * offers some static methods and properties that help in this errand. It is extremely important that you `publish`
 * events as the receiving service expects, and also that you handle GatewaySend events.
 *
 * @example
 * ```ts
 * // gateway-service/index.ts
 * import { RedisGateway, PubSubRedisBroker, kUseRandomGroupName } from '@discordjs/brokers';
 * import Redis from 'ioredis';
 *
 * // the `name` here probably should be env-determined if you need to scale this. see the main README for more information.
 * // also, we use a random group because we do NOT want work-balancing on gateway_send events.
 * const broker = new PubSubRedisBroker(new Redis(), { group: kUseRandomGroupName, name: 'send-consumer-1' });
 * const gateway = new WebSocketManager(gatewayOptionsHere); // see @discordjs/ws for examples.
 *
 * // emit events over the broker
 * gateway.on(WebSocketShardEvents.Dispatch, (...data) => void broker.publish(RedisGateway.toPublishArgs(data));
 *
 * // listen to payloads we should send to Discord
 * broker.on(RedisGateway.GatewaySendEvent, async ({ data: { payload, shardId }, ack }) => {
 * 	await gateway.send(shardId, payload);
 * 	await ack();
 * });
 * await broker.subscribe([RedisGateway.GatewaySendEvent]);
 * await gateway.connect();
 * ```
 *
 * ```ts
 * // other-service/index.ts
 * import { RedisGateway, PubSubRedisBroker, kUseRandomGroupName } from '@discordjs/brokers';
 * import Redis from 'ioredis';
 *
 * // the name here should absolutely be env-determined, see the main README for more information.
 * const broker = new PubSubRedisBroker(new Redis(), { group: 'my-service-name', name: 'service-name-instance-1' });
 * // unfortunately, we have to know the shard count. ideally this should be an env var
 * const gateway = new RedisGateway(broker, Number.parseInt(process.env.SHARD_COUNT, 10));
 *
 * const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
 * const client = new Client({ rest, gateway });
 *
 * // set up your client as you normally would with core
 *
 * // subscribe to the events that you want
 * await gateway.init([GatewayDispatchEvents.GuildCreate, GatewayDispatchEvents.MessageCreate]);
 * ```
 */
export class RedisGateway
	extends AsyncEventEmitter<{ dispatch: ManagerShardEventsMap[WebSocketShardEvents.Dispatch] }>
	implements Gateway
{
	/**
	 * Event used over the broker used to tell shards to send a payload to Discord.
	 */
	public static readonly GatewaySendEvent = 'gateway_send' as const;

	/**
	 * Converts a dispatch event from `@discordjs/ws` to arguments for a `broker.publish` call.
	 */
	public static toPublishArgs(
		data: [payload: GatewayDispatchPayload, shardId: number],
	): [GatewayDispatchEvents, BrokerIntrinsicProps & { payload: GatewayDispatchPayload['d'] }] {
		const [payload, shardId] = data;
		return [payload.t, { shardId, payload: payload.d }];
	}

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

	public async init(events: GatewayDispatchEvents[]) {
		for (const event of events) {
			// async_event_emitter nukes our types on this one.
			this.broker.on(
				event,
				({
					ack,
					data: { payload, shardId },
				}: {
					// eslint-disable-next-line @typescript-eslint/method-signature-style
					ack: () => Promise<void>;
					data: BrokerIntrinsicProps & { payload: any };
				}) => {
					// @ts-expect-error - Union shenanigans
					this.emit('dispatch', { shardId, data: payload });
					void ack();
				},
			);
		}

		await this.broker.subscribe(events);
	}
}
