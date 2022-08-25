import { BaseRedisBroker } from './BaseRedis';
import type { IPubSubBroker } from '../Broker.interface';

export class PubSubRedisBroker<TEvents extends Record<string, any>>
	extends BaseRedisBroker<TEvents>
	implements IPubSubBroker<TEvents>
{
	public async publish<T extends keyof TEvents>(event: T, data: TEvents[T]): Promise<void> {
		await this.options.redisClient.xadd(event as string, '*', 'data', this.options.encode(data));
	}
}
