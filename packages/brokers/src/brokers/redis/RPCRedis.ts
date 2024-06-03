import type { Buffer } from 'node:buffer';
import { clearTimeout, setTimeout } from 'node:timers';
import type Redis from 'ioredis/built/Redis.js';
import type { IRPCBroker } from '../Broker.js';
import type { RedisBrokerOptions } from './BaseRedis.js';
import { BaseRedisBroker, DefaultRedisBrokerOptions } from './BaseRedis.js';

interface InternalPromise {
	reject(error: any): void;
	resolve(data: any): void;
	timeout: NodeJS.Timeout;
}

/**
 * Options specific for an RPC Redis broker
 */
export interface RPCRedisBrokerOptions extends RedisBrokerOptions {
	timeout?: number;
}

/**
 * Default values used for the {@link RPCRedisBrokerOptions}
 */
export const DefaultRPCRedisBrokerOptions = {
	...DefaultRedisBrokerOptions,
	timeout: 5_000,
} as const satisfies Required<Omit<RPCRedisBrokerOptions, 'group'>>;

/**
 * RPC broker powered by Redis
 *
 * @example
 * ```ts
 * // caller.js
 * import { RPCRedisBroker } from '@discordjs/brokers';
 * import Redis from 'ioredis';
 *
 * const broker = new RPCRedisBroker(new Redis());
 *
 * console.log(await broker.call('testcall', 'Hello World!'));
 * await broker.destroy();
 *
 * // responder.js
 * import { RPCRedisBroker } from '@discordjs/brokers';
 * import Redis from 'ioredis';
 *
 * const broker = new RPCRedisBroker(new Redis());
 * broker.on('testcall', ({ data, ack, reply }) => {
 * 	console.log('responder', data);
 * 	void ack();
 * 	void reply(`Echo: ${data}`);
 * });
 *
 * await broker.subscribe('responders', ['testcall']);
 * ```
 */
export class RPCRedisBroker<TEvents extends Record<string, any>, TResponses extends Record<keyof TEvents, any>>
	extends BaseRedisBroker<TEvents>
	implements IRPCBroker<TEvents, TResponses>
{
	/**
	 * Options this broker is using
	 */
	protected override readonly options: Required<RPCRedisBrokerOptions>;

	protected readonly promises = new Map<string, InternalPromise>();

	public constructor(redisClient: Redis, options: RPCRedisBrokerOptions) {
		super(redisClient, options);
		this.options = { ...DefaultRPCRedisBrokerOptions, ...options };

		this.streamReadClient.on('messageBuffer', (channel: Buffer, message: Buffer) => {
			const [, id] = channel.toString().split(':');
			if (id && this.promises.has(id)) {
				// eslint-disable-next-line @typescript-eslint/unbound-method
				const { resolve, timeout } = this.promises.get(id)!;
				resolve(this.options.decode(message));
				clearTimeout(timeout);
			}
		});
	}

	/**
	 * {@inheritDoc IRPCBroker.call}
	 */
	public async call<Event extends keyof TEvents>(
		event: Event,
		data: TEvents[Event],
		timeoutDuration: number = this.options.timeout,
	): Promise<TResponses[Event]> {
		const id = await this.redisClient.xadd(
			event as string,
			'*',
			BaseRedisBroker.STREAM_DATA_KEY,
			this.options.encode(data),
		);
		// This id! assertion is valid. From redis docs:
		// "The command returns a Null reply when used with the NOMKSTREAM option and the key doesn't exist."
		// See: https://redis.io/commands/xadd/
		const rpcChannel = `${event as string}:${id!}`;

		// Construct the error here for better stack traces
		const timedOut = new Error(`timed out after ${timeoutDuration}ms`);

		await this.streamReadClient.subscribe(rpcChannel);
		return new Promise<TResponses[Event]>((resolve, reject) => {
			const timeout = setTimeout(() => reject(timedOut), timeoutDuration).unref();

			this.promises.set(id!, { resolve, reject, timeout });
			// eslint-disable-next-line promise/prefer-await-to-then
		}).finally(() => {
			void this.streamReadClient.unsubscribe(rpcChannel);
			this.promises.delete(id!);
		});
	}

	protected emitEvent(id: Buffer, event: string, data: unknown) {
		const payload: { ack(): Promise<void>; data: unknown; reply(data: unknown): Promise<void> } = {
			data,
			ack: async () => {
				await this.redisClient.xack(event, this.options.group, id);
			},
			reply: async (data) => {
				await this.redisClient.publish(`${event}:${id.toString()}`, this.options.encode(data));
			},
		};

		this.emit(event, payload);
	}
}
