import { BaseRedisBroker, RedisBrokerOptions, STREAM_DATA_KEY } from './BaseRedis';
import { DefaultBrokerOptions, IRPCBroker } from '../Broker.interface';

interface InternalPromise {
	resolve: (data: any) => void;
	reject: (error: any) => void;
	timeout: NodeJS.Timeout;
}

export interface RPCRedisBrokerOptions extends RedisBrokerOptions {
	timeout?: number;
}

export const DefaultRPCRedisBrokerOptions: Required<Omit<RPCRedisBrokerOptions, 'redisClient'>> = {
	...DefaultBrokerOptions,
	timeout: 5_000,
};

export class RPCRedisBroker<TEvents extends Record<string, any>, TResponses extends Record<keyof TEvents, any>>
	extends BaseRedisBroker<TEvents>
	implements IRPCBroker<TEvents, TResponses>
{
	protected override readonly options: Required<RPCRedisBrokerOptions>;
	protected readonly promises = new Map<string, InternalPromise>();

	public constructor(options: RPCRedisBrokerOptions) {
		super(options);
		this.options = { ...DefaultRPCRedisBrokerOptions, ...options };

		this.streamReadClient.on('messageBuffer', (channel: Buffer, message: Buffer) => {
			const [, id] = channel.toString().split(':');
			if (id && this.promises.has(id)) {
				const { resolve, timeout } = this.promises.get(id)!;
				resolve(this.options.decode(message));
				clearTimeout(timeout);
			}
		});
	}

	public async call<T extends keyof TEvents>(
		event: T,
		data: TEvents[T],
		timeoutDuration: number = this.options.timeout,
	): Promise<TResponses[T]> {
		const id = await this.options.redisClient.xadd(event as string, '*', STREAM_DATA_KEY, this.options.encode(data));
		// This id! assertion is valid. From redis docs:
		// "The command returns a Null reply when used with the NOMKSTREAM option and the key doesn't exist."
		// See: https://redis.io/commands/xadd/
		const rpcChannel = `${event as string}:${id!}`;

		// Construct the error here for better stack traces
		const timedOut = new Error(`timed out after ${timeoutDuration}ms`);

		await this.streamReadClient.subscribe(rpcChannel);
		return new Promise<TResponses[T]>((resolve, reject) => {
			const timeout = setTimeout(() => reject(timedOut), timeoutDuration).unref();

			this.promises.set(id!, { resolve, reject, timeout });
		}).finally(() => void this.streamReadClient.unsubscribe(rpcChannel));
	}

	protected emitEvent(id: Buffer, group: string, event: string, data: unknown) {
		const payload: { data: unknown; ack: () => Promise<void>; reply: (data: unknown) => Promise<void> } = {
			data,
			ack: async () => {
				await this.options.redisClient.xack(event, group, id);
			},
			reply: async (data) => {
				await this.options.redisClient.publish(`${event}:${id.toString()}`, this.options.encode(data));
			},
		};

		this.emit(event, payload);
	}
}
