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

		if (!this.streamReadClient) {
			this.streamReadClient = this.options.redisClient.duplicate();
			this.streamReadClient.on('messageBuffer', (channel: Buffer, message: Buffer) => {
				const [, id] = channel.toString().split(':');
				if (id && this.promises.has(id)) {
					const { resolve, timeout } = this.promises.get(id)!;
					resolve(this.options.decode(message));
					clearTimeout(timeout);
				}
			});
		}

		await this.streamReadClient.subscribe(rpcChannel);
		return new Promise<TResponses[T]>((resolve, reject) => {
			const timeout = setTimeout(
				() => reject(new Error(`timed out after ${timeoutDuration}`)),
				timeoutDuration,
			).unref();

			this.promises.set(id!, { resolve, reject, timeout });
		}).finally(() => void this.streamReadClient!.unsubscribe(rpcChannel));
	}
}
