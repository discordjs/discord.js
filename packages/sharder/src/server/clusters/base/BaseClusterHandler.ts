import { EventEmitter } from 'node:events';
import { setTimeout as sleep } from 'node:timers/promises';
import type {
	IClusterHandler,
	ClusterHandlerRestartOptions,
	ClusterHandlerSendOptions,
	ClusterHandlerStartOptions,
} from './IClusterHandler';
import type { ShardingManager, ShardingManagerRespawnAllOptions } from '../../../ShardingManager';
import { IMessageHandler, IMessageHandlerConstructor, MessageOp } from '../../../messages/base/IMessageHandler';
import type { NonNullObject } from '../../../utils/types';
import { ShardPing } from '../../ShardPing';

export abstract class BaseClusterHandler<ClusterOptions = NonNullObject>
	extends EventEmitter
	implements IClusterHandler<ClusterOptions>
{
	public readonly ids: readonly number[];

	public readonly manager: ShardingManager<ClusterOptions>;

	public readonly ping: ShardPing<ClusterOptions>;

	/**
	 * Whether or not the shard's client is ready.
	 */
	public ready = false;

	protected respawnsLeft: number;

	protected readonly messages: IMessageHandler;

	public constructor(
		ids: readonly number[],
		manager: ShardingManager<ClusterOptions>,
		MessageHandler: IMessageHandlerConstructor,
	) {
		super();
		this.ids = ids;
		this.manager = manager;
		this.respawnsLeft = this.manager.respawns;
		this.ping = new ShardPing(this);
		this.messages = new MessageHandler();
	}

	public async send(data: unknown, options: ClusterHandlerSendOptions = {}): Promise<unknown> {
		const serialized = this.messages.serialize(data, options.opcode ?? MessageOp.Message);
		const reply = options.reply ?? true;

		if (reply) this.messages.track(serialized.id);

		try {
			await this.sendMessage(serialized.body);
		} catch (error) {
			this.messages.untrack(serialized.id);
			throw error;
		}

		return reply ? this.messages.waitForId(serialized.id) : null;
	}

	/**
	 * Closes and restarts the shard.
	 * @param options The options for respawning the shard.
	 */
	public async restart(options: ClusterHandlerRestartOptions): Promise<void> {
		await this.close();
		if (options.delay > 0) await sleep(options.delay);
		await this.start(options);
	}

	public abstract start(options: ClusterHandlerStartOptions): Promise<void> | void;

	/**
	 * Closes the shard and does not restart it.
	 */
	public abstract close(): Promise<void> | void;

	protected abstract sendMessage(data: unknown): Promise<void>;

	protected _consumeRespawn() {
		if (this.respawnsLeft === 0) return false;

		if (this.respawnsLeft !== -1 && this.respawnsLeft !== Infinity) --this.respawnsLeft;
		return true;
	}

	protected _handleMessage(message: string) {
		const deserialized = this.messages.deserialize(message);
		this.messages.handle(deserialized.id, deserialized.data);

		switch (deserialized.op) {
			case MessageOp.Ping: {
				this.ping.receive(deserialized.data as number);
				break;
			}
			case MessageOp.Ready: {
				this.ready = true;
				this.respawnsLeft = this.manager.respawns;
				this.manager.emit('shardReady', this);
				this.emit('ready');
				break;
			}
			case MessageOp.Disconnected: {
				this.ready = false;
				this.manager.emit('shardDisconnected', this);
				this.emit('disconnected');
				break;
			}
			case MessageOp.Reconnecting: {
				this.ready = false;
				this.manager.emit('shardReconnecting', this);
				this.emit('reconnecting');
				break;
			}
			case MessageOp.RespawnAll: {
				this.manager
					.respawnAll(deserialized.data as ShardingManagerRespawnAllOptions)
					.catch((error) => this.send({ success: false, error }, { id: deserialized.id, reply: false }))
					.catch(() => void 0);
				break;
			}
			case MessageOp.Message: {
				this.manager.emit('shardMessage', this);
				this.emit('message');
				break;
			}
		}
	}

	protected _handleStart() {
		this.ping.start();
	}

	protected _handleStop() {
		this.ping.stop();
	}

	public static setup(options: NonNullObject): void;
	public static setup() {
		// NOP
	}

	public static validate(value: unknown): NonNullObject {
		return value as NonNullObject;
	}

	public static get isPrimary() {
		return false;
	}
}
