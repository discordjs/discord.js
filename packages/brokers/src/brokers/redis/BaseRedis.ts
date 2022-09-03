import type { Buffer } from 'node:buffer';
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
			// eslint-disable-next-line consistent-return
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
		const commands: unknown[][] = Array.from({ length: events.length * 2 });
		for (let idx = 0; idx < commands.length; idx += 2) {
			const event = events[idx / 2];
			commands[idx] = ['xgroup', 'delconsumer', event as string, group, this.options.name];
			commands[idx + 1] = ['xcleangroup', event as string, group];
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
