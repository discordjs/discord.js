import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import { Redis, ReplyError } from 'ioredis';
import { BaseBrokerOptions, DefaultBrokerOptions, IBaseBroker, ToEventMap } from '../Broker.interface';

// For some reason ioredis doesn't have this typed, but it exists
declare module 'ioredis' {
	interface Redis {
		xreadgroupBuffer: (...args: Array<string | Buffer>) => Promise<[Buffer, [Buffer, Buffer[]][]][] | null>;
	}
}

export interface RedisBrokerOptions extends BaseBrokerOptions {
	redisClient: Redis;
}

export abstract class BaseRedisBroker<TEvents extends Record<string, any>>
	extends AsyncEventEmitter<ToEventMap<TEvents>>
	implements IBaseBroker<TEvents>
{
	public static readonly STREAM_DATA_KEY = 'data';

	protected readonly options: Required<RedisBrokerOptions>;
	protected readonly subscribedEvents = new Set<string>();
	protected readonly streamReadClient: Redis;

	protected listening = false;

	public constructor(options: RedisBrokerOptions) {
		super();
		this.options = { ...DefaultBrokerOptions, ...options };
		options.redisClient.defineCommand('xcleangroup', {
			numberOfKeys: 1,
			lua: readFileSync(resolve(__dirname, '..', '..', '..', 'scripts', 'xcleangroup.lua'), 'utf8'),
		});
		this.streamReadClient = options.redisClient.duplicate();
	}

	public async subscribe(group: string, events: (keyof TEvents)[]): Promise<void> {
		await Promise.all(
			events.map(async (event) => {
				this.subscribedEvents.add(event as string);
				try {
					return await this.options.redisClient.xgroup('CREATE', event as string, group, 0, 'MKSTREAM');
				} catch (error) {
					if (!(error instanceof ReplyError)) {
						throw error;
					}
				}
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

	protected async listen(group: string): Promise<void> {
		if (this.listening) {
			return;
		}

		this.listening = true;
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while (true) {
			try {
				const data = await this.streamReadClient.xreadgroupBuffer(
					'GROUP',
					group,
					this.options.name,
					'COUNT',
					String(this.options.maxChunk),
					'BLOCK',
					String(this.options.blockTimeout),
					'STREAMS',
					...this.subscribedEvents,
					...Array<string>(this.subscribedEvents.size).fill('>'),
				);

				if (!data) {
					continue;
				}

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

						this.emitEvent(id, group, event.toString('utf8'), this.options.decode(data));
					}
				}
			} catch (error) {
				this.emit('error', error);
				break;
			}
		}

		this.listening = false;
	}

	protected abstract emitEvent(id: Buffer, group: string, event: string, data: unknown): unknown;
}
