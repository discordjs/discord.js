import type { ShardingManager } from '../../../ShardingManager';
import type { IMessageHandlerConstructor, MessageOp } from '../../../messages/base/IMessageHandler';
import type { NonNullObject } from '../../../utils/types';

/**
 * The shard handler is a strategy system that manages the lifetime and a channel to the client shard, this class is
 * used exclusively in the primary process alongside {@link ShardingManager}, and can be passed in
 * {@link ShardingManagerOptions.ClusterHandler}.
 *
 * To create your own strategy, the easiest way is to create a class extending any of the following bases:
 *
 * - {@link BaseClusterHandler}: defines the bare-basic implementation.
 * - {@link BaseProcessClusterHandler}: defines an almost-full implementation, works with {@link ChildProcess} and
 * {@link Worker}.
 *
 * Furthermore, the library ships the following built-in handlers:
 *
 * - {@link ForkProcessClusterHandler}: defines a process-based sharding using `child_process.fork`.
 * - {@link ClusterProcessClusterHandler}: defines a process-based sharding using `cluster.fork`.
 */
export interface IClusterHandler<ClusterOptions = NonNullObject> {
	/**
	 * The shard IDs.
	 */
	readonly ids: readonly number[];

	/**
	 * The manager that instantiated the shard handler.
	 */
	readonly manager: ShardingManager<ClusterOptions>;

	/**
	 * Sends data to the shard.
	 * @param data The data to be sent.
	 * @param options The options for the message delivery.
	 */
	send: (data: unknown, options?: ClusterHandlerSendOptions) => Promise<unknown>;

	/**
	 * Starts the shard.
	 * @param options The options defining the start-up behavior.
	 */
	start: (options: ClusterHandlerStartOptions) => Promise<void> | void;

	/**
	 * Closes the shard and terminates the communication with the client.
	 */
	close: () => Promise<void> | void;

	/**
	 * Restarts the shard handler, may call {@link start} and then {@link close}.
	 * @param options The options defining the respawn behavior.
	 */
	restart: (options: ClusterHandlerRestartOptions) => Promise<void>;
}

export interface ClusterHandlerSendOptions {
	id?: number;
	reply?: boolean;
	opcode?: MessageOp;
}

export interface ClusterHandlerStartOptions {
	timeout?: number | undefined;
}

export interface ClusterHandlerRestartOptions {
	delay: number;
	timeout: number;
}

export interface IClusterHandlerConstructor<ResolvedOptions extends NonNullObject = NonNullObject> {
	new (
		ids: readonly number[],
		manager: ShardingManager<ResolvedOptions>,
		messageBuilder: IMessageHandlerConstructor,
	): IClusterHandler<ResolvedOptions>;

	/**
	 * Sets up the shard handler for subsequent runs.
	 * @param options The options passed in {@link ShardingManagerOptions.shardOptions}.
	 */
	setup: (options: ResolvedOptions) => void;

	/**
	 * Validates the shard options.
	 * @param value The options passed in {@link ShardingManagerOptions.shardOptions}.
	 * @returns The validated values with the defined values.
	 */
	validate: (value: unknown) => ResolvedOptions;

	/**
	 * Whether or not the process is a primary one.
	 */
	readonly isPrimary: boolean;
}
