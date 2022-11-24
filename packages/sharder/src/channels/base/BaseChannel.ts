import type { Awaitable } from '@discordjs/util';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type { ShardManager } from '../../ShardManager.js';
import type { SerializedInput } from '../../messages/base/IMessageHandler.js';
import { type IMessageHandler, MessageOp } from '../../messages/base/IMessageHandler.js';
import { ShardPing } from '../../utils/ShardPing.js';
import type { ChannelSendOptions, IChannel } from './IChannel.js';

export abstract class BaseChannel<Options extends {} = {}>
	extends AsyncEventEmitter<MappedChannelEvents>
	implements IChannel<Options>
{
	public readonly manager: ShardManager<Options>;

	public readonly shards: readonly number[];

	public readonly ping: ShardPing;

	public ready = false;

	protected remainingRespawns: number;

	protected readonly messages: IMessageHandler;

	public constructor(manager: ShardManager<Options>, shards: readonly number[]) {
		super();
		this.manager = manager;
		this.shards = shards;
		this.remainingRespawns = manager.respawns;
		this.messages = new manager.MessageHandlerConstructor();
		this.ping = new ShardPing(this);
	}

	public abstract init(): Awaitable<void>;

	public abstract destroy(): Awaitable<void>;

	public abstract sendMessage(body: SerializedInput): Awaitable<void>;

	public async send<Reply extends boolean = false>(
		data: unknown,
		options: ChannelSendOptions<Reply> = {},
	): Promise<Reply extends true ? unknown : undefined> {
		const serialized = this.messages.serialize(data, options.opcode ?? MessageOp.Message);
		const reply = options.reply ?? false;

		if (reply) this.messages.track(serialized.id);

		try {
			await this.sendMessage(serialized.body);
		} catch (error) {
			if (reply) this.messages.untrack(serialized.id);
			throw error;
		}

		// @ts-expect-error: Complex type return.
		return reply ? this.messages.waitForId(serialized.id) : undefined;
	}

	public abstract start(id: number, timeout?: number): Awaitable<void>;

	public abstract close(id: number): Awaitable<void>;

	public abstract closeAll(): Awaitable<void>;

	public abstract restart(id: number, timeout?: number): Awaitable<void>;

	public abstract restartAll(): Awaitable<void>;

	protected consumeRespawn() {
		if (this.remainingRespawns === 0) return false;
		if (this.remainingRespawns !== -1) --this.remainingRespawns;
		return true;
	}

	protected async handleMessage(data: SerializedInput) {
		const deserialized = this.messages.deserialize(data);
		this.messages.handle(deserialized.id, deserialized.body);

		switch (deserialized.op) {
			case MessageOp.Ping: {
				this.ping.receive(deserialized.body as number);
				this.emit('ping');
				break;
			}

			case MessageOp.Ready: {
				this.ready = true;
				this.emit('ready');
				break;
			}

			case MessageOp.Start: {
				await this.manager.start(deserialized.body as number);
				break;
			}

			case MessageOp.Close: {
				await this.manager.close(deserialized.body as number);
				break;
			}

			case MessageOp.CloseAll: {
				await (deserialized.body ? this.manager.closeAll() : this.closeAll());
				break;
			}

			case MessageOp.Restart: {
				await this.manager.restart(deserialized.body as number);
				break;
			}

			case MessageOp.RestartAll: {
				await (deserialized.body ? this.manager.restartAll() : this.restartAll());
				break;
			}

			case MessageOp.Abort: {
				this.messages.untrack(deserialized.body as number);
				break;
			}

			case MessageOp.Message: {
				this.emit('message', deserialized.body);
				break;
			}
		}
	}
}

export interface ChannelEvents {
	disconnected: [];
	message: [body: unknown];
	ping: [];
	ready: [];
	reconnecting: [];
}

type MappedChannelEvents = { [K in keyof ChannelEvents]: ChannelEvents[K] };
