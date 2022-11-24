import { setTimeout as sleep } from 'node:timers/promises';
import { range } from '@discordjs/util';
import { AsyncQueue } from '@sapphire/async-queue';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type { ChannelConstructor, IChannel } from './channels/base/IChannel.js';
import { ClusterChannel } from './channels/process/ClusterChannel.js';
import { JsonMessageHandler } from './messages/JsonMessageHandler.js';
import type { MessageHandlerConstructor } from './messages/base/IMessageHandler.js';
import type { ShardPingOptions } from './utils/ShardPing.js';

export class ShardManager<ChannelOptions extends {} = {}> extends AsyncEventEmitter {
	public readonly respawns: number;

	public readonly channelOptions: ChannelOptions;

	public readonly pingOptions: ShardPingOptions;

	public readonly spawnOptions: Required<ShardSpawnOptions>;

	public readonly channels: IChannel[] = [];

	public readonly totalShards: number;

	public readonly ChannelConstructor: ChannelConstructor;

	public readonly MessageHandlerConstructor: MessageHandlerConstructor;

	private readonly queue = new AsyncQueue();

	public constructor(options: ShardManagerOptions<ChannelOptions>) {
		super();

		if ('respawns' in options) {
			if (options.respawns === Number.POSITIVE_INFINITY || options.respawns === -1) this.respawns = -1;
			else if (!Number.isSafeInteger(options.respawns)) throw new RangeError('respawns must be a safe integer');
			else if (options.respawns < 0) throw new RangeError('respawns must be a positive number');
			else this.respawns = options.respawns;
		} else {
			this.respawns = -1;
		}

		this.channelOptions = options.channel ?? ({} as ChannelOptions);
		this.pingOptions = options.ping ?? {};
		this.spawnOptions = {
			delay: options.spawn?.delay ?? 5_000,
			timeout: options.spawn?.timeout ?? 30_000,
		};
		this.ChannelConstructor = options.ChannelConstructor ?? ClusterChannel;
		this.MessageHandlerConstructor = options.MessageHandlerConstructor ?? JsonMessageHandler;

		if (typeof options.shards === 'number') {
			this.totalShards = options.shards;
			for (let shard = 0; shard < this.totalShards; ++shard) {
				this.channels.push(new this.ChannelConstructor(this, [shard]));
			}
		} else {
			let totalShards = 0;
			for (const number of options.shards) {
				this.channels.push(new this.ChannelConstructor(this, range(totalShards, totalShards + number)));
				totalShards += number;
			}

			this.totalShards = totalShards;
		}
	}

	public findChannelForShard(id: number) {
		for (const channel of this.channels) {
			if (channel.shards.includes(id)) return channel;
		}

		return null;
	}

	public async init() {
		await Promise.all(this.channels.map((channel) => channel.init()));
	}

	public async startAll() {
		for (const channel of this.channels) {
			for (const shard of channel.shards) {
				await this.forceStart(channel, shard);
			}
		}
	}

	public async start(id: number) {
		const channel = this.findChannelForShard(id);
		if (channel) {
			await this.forceStart(channel, id);
			return true;
		}

		return false;
	}

	public async closeAll() {
		for (const channel of this.channels) {
			await channel.closeAll();
		}
	}

	public async close(id: number) {
		const channel = this.findChannelForShard(id);
		if (channel) {
			await channel.close(id);
			return true;
		}

		return false;
	}

	public async restartAll() {
		for (const channel of this.channels) {
			for (const shard of channel.shards) {
				await this.forceRestart(channel, shard);
			}
		}
	}

	public async restart(shard: number) {
		const channel = this.findChannelForShard(shard);
		if (channel) {
			await this.forceRestart(channel, shard);
			return true;
		}

		return false;
	}

	private async forceStart(channel: IChannel, shard: number) {
		await this.queue.wait();

		try {
			await channel.start(shard, this.spawnOptions.timeout);
		} catch (error) {
			await this.forceStart(channel, shard);
			this.emit('error', error);
		} finally {
			await sleep(this.spawnOptions.delay);
			this.queue.shift();
		}
	}

	private async forceRestart(channel: IChannel, shard: number) {
		await this.queue.wait();

		try {
			await channel.restart(shard, this.spawnOptions.timeout);
		} catch (error) {
			await this.forceRestart(channel, shard);
			this.emit('error', error);
		} finally {
			await sleep(this.spawnOptions.delay);
			this.queue.shift();
		}
	}
}

export interface ShardManagerOptions<ChannelOptions extends {} = {}> {
	ChannelConstructor?: ChannelConstructor;

	/**
	 * The {@link IMessageHandler} constructor.
	 *
	 * Defaults to {@link JsonMessageHandler}.
	 */
	MessageHandlerConstructor?: MessageHandlerConstructor;

	/**
	 * The channel options, if any.
	 */
	channel: {} extends ChannelOptions ? ChannelOptions | undefined : ChannelOptions;

	/**
	 * The options for the ping system.
	 */
	ping?: ShardPingOptions;

	/**
	 * The amount of times to respawn shards (`-1` or `Infinity` for no limitless).
	 *
	 * Defaults to `-1`.
	 */
	respawns?: number;

	/**
	 * The amount of shards to create, or an array of clusters.
	 *
	 * @example
	 * ```typescript
	 * // Will create 9 shards.
	 * const manager = new ShardManager({
	 * 	shards: 9
	 * });
	 * ```
	 * @example
	 * ```typescript
	 * // Will create 3 clusters of 3 shards each.
	 * const manager = new ShardManager({
	 * 	shards: [3, 3, 3]
	 * });
	 * ```
	 */
	shards: number | readonly number[];

	/**
	 * The options for the spawn system.
	 */
	spawn?: ShardSpawnOptions;
}

export interface ShardSpawnOptions {
	/**
	 * The delay in milliseconds between each shard spawn. Starts upon READY signal from the last spawned shard.
	 *
	 * Defaults to `5_000`.
	 */
	delay?: number;

	/**
	 * The maximum amount of time in milliseconds between the shard spawn and the READY signal. Upon reaching, the shard
	 * will be killed and queued for spawning at the end of the queue.
	 *
	 * Defaults to `30_000`.
	 */
	timeout?: number;
}
