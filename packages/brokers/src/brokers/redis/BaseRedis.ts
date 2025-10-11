import type { Buffer } from 'node:buffer';
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type { Redis } from 'ioredis';
import { ReplyError } from 'ioredis';
import type { BaseBrokerOptions, IBaseBroker, ToEventMap } from '../Broker.js';
import { DefaultBrokerOptions } from '../Broker.js';

type RedisReadGroupData = [Buffer, [Buffer, Buffer[]][]][];

// For some reason ioredis doesn't have those typed, but they exist
declare module 'ioredis' {
	interface Redis {
		xclaimBuffer(
			key: Buffer | string,
			group: Buffer | string,
			consumer: Buffer | string,
			minIdleTime: number,
			id: Buffer | string,
			...args: (Buffer | string)[]
		): Promise<string[]>;
		xreadgroupBuffer(...args: (Buffer | string)[]): Promise<RedisReadGroupData | null>;
	}
}

export const kUseRandomGroupName = Symbol.for('djs.brokers.useRandomGroupName');

/**
 * Options specific for a Redis broker
 */
export interface RedisBrokerOptions extends BaseBrokerOptions {
	/**
	 * How long to block for messages when polling
	 */
	blockTimeout?: number;
	/**
	 * Consumer group name to use for this broker. For fanning out events, use {@link kUseRandomGroupName}
	 *
	 * @see {@link https://redis.io/commands/xreadgroup/}
	 */
	group: string | typeof kUseRandomGroupName;
	/**
	 * Max number of messages to poll at once
	 */
	maxChunk?: number;
	/**
	 * How many times a message can be delivered to a consumer before it is considered dead.
	 * This is used to prevent messages from being stuck in the queue forever if a consumer is
	 * unable to process them.
	 */
	maxDeliveredTimes?: number;
	/**
	 * How long a message should be idle for before allowing it to be claimed by another consumer.
	 * Note that too high of a value can lead to a high delay in processing messages during a service downscale,
	 * while too low of a value can lead to messages being too eagerly claimed by other consumers during an instance
	 * restart (which is most likely not actually that problematic)
	 */
	messageIdleTime?: number;
	/**
	 * Unique consumer name.
	 *
	 * @see {@link https://redis.io/commands/xreadgroup/}
	 */
	name: string;
}

/**
 * Default broker options for redis
 */
export const DefaultRedisBrokerOptions = {
	...DefaultBrokerOptions,
	maxChunk: 10,
	maxDeliveredTimes: 3,
	messageIdleTime: 3_000,
	blockTimeout: 5_000,
} as const satisfies Required<Omit<RedisBrokerOptions, 'group' | 'name'>>;

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
	 * The group being used by this broker.
	 *
	 * @privateRemarks
	 * Stored as its own field to do the "use random group" resolution in the constructor.
	 */
	protected readonly group: string;

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
		this.group = this.options.group === kUseRandomGroupName ? randomBytes(16).toString('hex') : this.options.group;
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
					return await this.redisClient.xgroup('CREATE', event as string, this.group, 0, 'MKSTREAM');
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
	 * Begins polling for events, firing them to {@link BaseRedisBroker.emitEvent}
	 */
	protected async listen(): Promise<void> {
		if (this.listening) {
			return;
		}

		this.listening = true;

		// Enter regular polling
		while (this.subscribedEvents.size > 0) {
			try {
				await this.claimAndEmitDeadEvents();
			} catch (error) {
				// @ts-expect-error: Intended
				this.emit('error', error);
				// We don't break here to keep the loop running even if dead event processing fails
			}

			try {
				// As per docs, '>' means "give me a new message"
				const data = await this.readGroup('>', this.options.blockTimeout);
				if (!data) {
					continue;
				}

				await this.processMessages(data);
			} catch (error) {
				// @ts-expect-error: Intended
				this.emit('error', error);
				break;
			}
		}

		this.listening = false;
	}

	private async readGroup(fromId: string, block: number): Promise<RedisReadGroupData> {
		const data = await this.streamReadClient.xreadgroupBuffer(
			'GROUP',
			this.group,
			this.options.name,
			'COUNT',
			String(this.options.maxChunk),
			'BLOCK',
			String(block),
			'STREAMS',
			...this.subscribedEvents,
			...Array.from({ length: this.subscribedEvents.size }, () => fromId),
		);

		return data ?? [];
	}

	private async processMessages(data: RedisReadGroupData): Promise<void> {
		for (const [event, messages] of data) {
			const eventName = event.toString('utf8');

			for (const [id, packet] of messages) {
				const idx = packet.findIndex((value, idx) => value.toString('utf8') === 'data' && idx % 2 === 0);
				if (idx < 0) continue;

				const payload = packet[idx + 1];
				if (!payload) continue;

				this.emitEvent(id, this.group, eventName, this.options.decode(payload));
			}
		}
	}

	private async claimAndEmitDeadEvents(): Promise<void> {
		for (const stream of this.subscribedEvents) {
			// Get up to N oldest pending messages (note: a pending message is a message that has been read, but never ACKed)
			const pending = (await this.streamReadClient.xpending(
				stream,
				this.group,
				'-',
				'+',
				this.options.maxChunk,
				// See: https://redis.io/docs/latest/commands/xpending/#extended-form-of-xpending
			)) as [id: string, consumer: string, idleMs: number, deliveredTimes: number][];

			for (const [id, consumer, idleMs, deliveredTimes] of pending) {
				// Technically xclaim checks for us anyway, but why not avoid an extra call?
				if (idleMs < this.options.messageIdleTime) {
					continue;
				}

				if (deliveredTimes > this.options.maxDeliveredTimes) {
					// This message is dead. It has repeatedly failed being processed by a consumer.
					await this.streamReadClient.xdel(stream, this.group, id);
					continue;
				}

				// Try to claim the message if we don't already own it (this may fail if another consumer has already claimed it)
				if (consumer !== this.options.name) {
					const claimed = await this.streamReadClient.xclaimBuffer(
						stream,
						this.group,
						this.options.name,
						Math.max(this.options.messageIdleTime, 1),
						id,
						'JUSTID',
					);

					// Another consumer got the message before us
					if (!claimed?.length) {
						continue;
					}
				}

				// Fetch message body
				const entries = await this.streamReadClient.xrangeBuffer(stream, id, id);
				// No idea how this could happen, frankly!
				if (!entries?.length) {
					continue;
				}

				const [msgId, fields] = entries[0]!;
				const idx = fields.findIndex((value, idx) => value.toString('utf8') === 'data' && idx % 2 === 0);
				if (idx < 0) {
					continue;
				}

				const payload = fields[idx + 1];
				if (!payload) {
					continue;
				}

				this.emitEvent(msgId, this.group, stream, this.options.decode(payload));
			}
		}
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
