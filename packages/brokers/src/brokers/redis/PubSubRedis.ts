import type { Buffer } from 'node:buffer';
import type { IPubSubBroker } from '../Broker.js';
import { BaseRedisBroker } from './BaseRedis.js';

/**
 * PubSub broker powered by Redis
 *
 * @example
 * ```ts
 * // publisher.js
 * import { PubSubRedisBroker } from '@discordjs/brokers';
 * import Redis from 'ioredis';
 *
 * const broker = new PubSubRedisBroker({ redisClient: new Redis() });
 *
 * await broker.publish('test', 'Hello World!');
 * await broker.destroy();
 *
 * // subscriber.js
 * import { PubSubRedisBroker } from '@discordjs/brokers';
 * import Redis from 'ioredis';
 *
 * const broker = new PubSubRedisBroker({ redisClient: new Redis() });
 * 	broker.on('test', ({ data, ack }) => {
 * 	console.log(data);
 * 	void ack();
 * });
 *
 * await broker.subscribe('subscribers', ['test']);
 * ```
 */
export class PubSubRedisBroker<TEvents extends Record<string, any>>
	extends BaseRedisBroker<TEvents>
	implements IPubSubBroker<TEvents>
{
	/**
	 * {@inheritDoc IPubSubBroker.publish}
	 */
	public async publish<T extends keyof TEvents>(event: T, data: TEvents[T]): Promise<void> {
		await this.options.redisClient.xadd(
			event as string,
			'*',
			BaseRedisBroker.STREAM_DATA_KEY,
			this.options.encode(data),
		);
	}

	protected emitEvent(id: Buffer, group: string, event: string, data: unknown) {
		const payload: { ack(): Promise<void>; data: unknown } = {
			data,
			ack: async () => {
				await this.options.redisClient.xack(event, group, id);
			},
		};

		this.emit(event, payload);
	}
}
