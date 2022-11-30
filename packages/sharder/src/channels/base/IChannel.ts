import type { Awaitable } from '@discordjs/util';
import type { ShardManager } from '../../ShardManager.js';
import type { MessageOp } from '../../messages/base/IMessageHandler.js';

export interface IChannel<Options extends {} = {}> {
	/**
	 * Closes one of the channel's shards. Throws if the id is not contained in {@link IChannel#shards}.
	 *
	 * @param id - The id of the shard to close.
	 */
	close(id: number): Awaitable<void>;

	/**
	 * Closes all of the channel's shards.
	 */
	closeAll(): Awaitable<void>;

	/**
	 * Destroys the channel. Requires {@link IChannel#init} to be called before it can be re-used.
	 */
	destroy(): Awaitable<void>;

	/**
	 * Initializes the channel.
	 */
	init(): Awaitable<void>;

	/**
	 * The manager that instantiated this channel.
	 */
	readonly manager: ShardManager<Options>;

	/**
	 * Restarts one of the channel's shards. Throws if the id is not contained in {@link IChannel#shards}.
	 *
	 * @param id - The id of the shard to restart.
	 * @param timeout - The maximum amount of time in milliseconds to wait between the shard initialization and ready.
	 */
	restart(id: number, timeout?: number): Awaitable<void>;

	/**
	 * Restarts all of a channel's shards.
	 */
	restartAll(): Awaitable<void>;

	/**
	 * Sends a message to one or all shards.
	 *
	 * @param data - The data to be sent.
	 * @param options - The options for the message delivery.
	 */
	send<Reply extends boolean = false>(
		data: unknown,
		options?: ChannelSendOptions<Reply>,
	): Promise<Reply extends true ? unknown : undefined>;

	/**
	 * The ids of the shards this channel manages.
	 */
	readonly shards: readonly number[];

	/**
	 * Starts one of the channel's shards. Throws if the id is not contained in {@link IChannel#shards}.
	 *
	 * @param id - The id of the shard to create.
	 * @param timeout - The maximum amount of time in milliseconds to wait between the shard initialization and ready.
	 */
	start(id: number, timeout?: number): Awaitable<void>;
}

export interface ChannelSendOptions<Reply extends boolean = boolean> {
	/**
	 * The id of the shard to send the message to. If not defined, it will broadcast to all the shards.
	 */
	id?: number;

	/**
	 * The message's opcode to send.
	 */
	opcode?: MessageOp;

	/**
	 * Whether or not to await a reply response.
	 */
	reply?: Reply;
}

export type ChannelConstructor = new (manager: ShardManager, shards: readonly number[]) => IChannel;
