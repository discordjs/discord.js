import type { Buffer } from 'node:buffer';
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type { Redis } from 'ioredis';
import { ReplyError } from 'ioredis';
import type { BaseBrokerOptions, IBaseBroker, ToEventMap } from '../Broker.js';
import { DefaultBrokerOptions } from '../Broker.js';

// For some reason ioredis doesn't have this typed, but it exists
declare module 'ioredis' {
	interface Redis {
		xreadgroupBuffer(...args: (Buffer | string)[]): Promise<[Buffer, [Buffer, Buffer[]][]][] | null>;
	}
}

/**
 * Options specific for a Redis broker
 */
export interface RedisBrokerOptions extends BaseBrokerOptions {
	/**
	 * How long to block for messages when polling
	 */
	blockTimeout?: number;

	/**
	 * Consumer group name to use for this broker
	 *
	 * @see {@link https://redis.io/commands/xreadgroup/}
	 */
	group: string;

	/**
	 * Max number of messages to poll at once
	 */
	maxChunk?: number;

	/**
	 * Unique consumer name.
	 *
	 * @see {@link https://redis.io/commands/xreadgroup/}
	 */
	name?: string;
}

/**
 * Default broker options for redis
 */
export const DefaultRedisBrokerOptions = {
	...DefaultBrokerOptions,
	name: randomBytes(20).toString('hex'),
	maxChunk: 10,
	blockTimeout: 5_000,
} as const satisfies Required<Omit<RedisBrokerOptions, 'group'>>;

/**
 * Helper class with shared Redis logic
 */
export abstract class BaseRedisBroker<
		TEvents extends Record<string, any[]>,
		TResponses extends Record<keyof TEvents, any> | undefined = undefined,
	>
	extends AsyncEventEmitter<ToEventMap<TEvents, TResponses>>
	implements IBaseBroker<TEvents>
{
	/**
	 * Used for Redis queues, see the 3rd argument taken by {@link https://redis.io/commands/xadd | xadd}
	 */
	public static readonly STREAM_DATA_KEY = 'data' as const;

	/**
	 * Options this broker is using
	 */
	protected readonly options: Required<RedisBrokerOptions>;

	/**
	 * Events this broker has subscribed to
	 */
	protected readonly subscribedEvents = new Set<string>();

	/**
	 * Internal copy of the Redis client being used to read incoming payloads
	 */
	protected readonly streamReadClient: Redis;

	/**
	 * Whether this broker is currently polling events
	 */
	protected listening = false;

	public constructor(
		protected readonly redisClient: Redis,
		options: RedisBrokerOptions,
	) {
		super();
		this.options = { ...DefaultRedisBrokerOptions, ...options };
		redisClient.defineCommand('xcleangroup', {
			numberOfKeys: 1,
			lua: readFileSync(resolve(__dirname, '..', 'scripts', 'xcleangroup.lua'), 'utf8'),
		});
		this.streamReadClient = redisClient.duplicate();
	}

	/**
	 * {@inheritDoc IBaseBroker.subscribe}
	 */
	public async subscribe(events: (keyof TEvents)[]): Promise<void> {
		await Promise.all(
			// @ts-expect-error: Intended
			events.map(async (event) => {
				this.subscribedEvents.add(event as string);
				try {
					return await this.redisClient.xgroup('CREATE', event as string, this.options.group, 0, 'MKSTREAM');
				} catch (error) {
					if (!(error instanceof ReplyError)) {
						throw error;
					}
				}
			}),
		);
		void this.listen();
	}

	/**
	 * {@inheritDoc IBaseBroker.unsubscribe}
	 */
	public async unsubscribe(events: (keyof TEvents)[]): Promise<void> {
		const commands: unknown[][] = Array.from({ length: events.length * 2 });
		for (let idx = 0; idx < commands.length; idx += 2) {
			const event = events[idx / 2];
			commands[idx] = ['xgroup', 'delconsumer', event as string, this.options.group, this.options.name];
			commands[idx + 1] = ['xcleangroup', event as string, this.options.group];
		}

		await this.redisClient.pipeline(commands).exec();

		for (const event of events) {
			this.subscribedEvents.delete(event as string);
		}
	}

	/**
	 * Begins polling for events, firing them to {@link BaseRedisBroker.listen}
	 */
	protected async listen(): Promise<void> {
		if (this.listening) {
			return;
		}

		this.listening = true;

		while (this.subscribedEvents.size > 0) {
			try {
				const data = await this.streamReadClient.xreadgroupBuffer(
					'GROUP',
					this.options.group,
					this.options.name,
					'COUNT',
					String(this.options.maxChunk),
					'BLOCK',
					String(this.options.blockTimeout),
					'STREAMS',
					...this.subscribedEvents,
					...Array.from({ length: this.subscribedEvents.size }, () => '>'),
				);

				if (!data) {
					continue;
				}

				for (const [event, info] of data) {
					for (const [id, packet] of info) {
						const idx = packet.findIndex((value, idx) => value.toString('utf8') === 'data' && idx % 2 === 0);
						if (idx < 0) {
							continue;
						}

						const data = packet[idx + 1];
						if (!data) {
							continue;
						}

						this.emitEvent(id, this.options.group, event.toString('utf8'), this.options.decode(data));
					}
				}
			} catch (error) {
				// @ts-expect-error: Intended
				this.emit('error', error);
				break;
			}
		}

		this.listening = false;
	}

	/**
	 * Destroys the broker, closing all connections
	 */
	public async destroy() {
		await this.unsubscribe([...this.subscribedEvents]);
		this.streamReadClient.disconnect();
		this.redisClient.disconnect();
	}

	/**
	 * Handles an incoming Redis event
	 */
	protected abstract emitEvent(id: Buffer, group: string, event: string, data: unknown): unknown;
}
