import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type Redis from 'ioredis';
import { BaseBrokerOptions, DefaultBrokerOptions, IPubSubBroker, ToEventMap } from '../Broker.interface';

// For some reason ioredis doesn't have this typed, but it exists
declare module 'ioredis' {
	interface Redis {
		xreadgroupBuffer: (...args: Array<string | Buffer>) => Promise<[Buffer, [Buffer, Buffer[]][]][]>;
	}
}

export interface RedisBrokerOptions extends BaseBrokerOptions {
	redisClient: Redis;
}

export class PubSubRedisBroker<TEvents extends Record<string, any>>
	extends AsyncEventEmitter<ToEventMap<TEvents>>
	implements IPubSubBroker<TEvents>
{
	private readonly options: Required<RedisBrokerOptions>;
	private readonly subscribedEvents = new Set<string>();

	private listening = false;
	private streamReadClient?: Redis;

	public constructor(options: RedisBrokerOptions) {
		super();
		this.options = { ...DefaultBrokerOptions, ...options };
		options.redisClient.defineCommand('xcleangroup', {
			numberOfKeys: 1,
			lua: readFileSync(resolve(__dirname, '..', '..', '..', 'scripts', 'xcleangroup.lua'), 'utf8'),
		});
	}

	public async publish<T extends keyof TEvents>(event: T, data: TEvents[T]): Promise<void> {
		await this.options.redisClient.xadd(event as string, '*', 'data', this.options.encode(data));
	}

	public async subscribe(group: string, events: (keyof TEvents)[]): Promise<void> {
		await Promise.all(
			events.map((event) => {
				this.subscribedEvents.add(event as string);
				return this.options.redisClient.xgroup('CREATE', event as string, group, 0, 'MKSTREAM');
			}),
		);
		void this.listen(group);
	}

	public async unsubscribe(group: string, events: (keyof TEvents)[]): Promise<void> {
		const commands = Array<string[]>(events.length * 2);
		for (let i = 0; i < commands.length; i += 2) {
			const event = events[i / 2];
			commands[i] = ['xgroup', 'delconsumer', event as string, group, this.options.name];
			commands[i + 1] = ['xcleangroup', event as string, group];
		}

		await this.options.redisClient.pipeline(commands).exec();

		for (const event of events) {
			this.subscribedEvents.delete(event as string);
		}
	}

	private async listen(group: string): Promise<void> {
		if (this.listening) {
			return;
		}

		this.listening = true;
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while (true) {
			try {
				const data = await (this.streamReadClient ??= this.options.redisClient.duplicate()).xreadgroupBuffer(
					'GROUP',
					group,
					this.options.name,
					'COUNT',
					String(this.options.maxChunk),
					'BLOCK',
					String(this.options.blockInterval),
					'STREAMS',
					...this.subscribedEvents,
					...Array<string>(this.subscribedEvents.size).fill('>'),
				);

				for (const [event, info] of data) {
					for (const [id, packet] of info) {
						const i = packet.findIndex((v, i) => v.toString('utf8') === 'data' && i % 2 === 0);
						if (i < 0) {
							continue;
						}

						const data = packet[i + 1];
						if (!data) {
							continue;
						}

						const payload: { data: unknown; ack: () => Promise<void> } = {
							data: this.options.decode(data),
							ack: async () => {
								await this.options.redisClient.xack(event, group, id);
							},
						};

						this.emit(event.toString('utf8'), payload);
					}
				}
			} catch (error) {
				this.emit('error', error);
				break;
			}
		}

		this.listening = false;
	}
}
