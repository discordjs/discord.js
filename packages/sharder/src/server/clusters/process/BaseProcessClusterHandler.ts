import type { ChildProcess } from 'node:child_process';
import type { Worker } from 'node:cluster';
import { once } from 'node:events';
import { z } from 'zod';
import type { ShardingManager } from '../../../ShardingManager';
import type { IMessageHandlerConstructor } from '../../../messages/base/IMessageHandler';
import { createDeferredPromise } from '../../utils/utils';
import { BaseClusterHandler } from '../base/BaseClusterHandler';
import type { ClusterHandlerStartOptions } from '../base/IClusterHandler';

const baseProcessClusterHandlerOptionsPredicate = z.strictObject({
	shardArgs: z.string().array().default([]),
	execArgv: z.string().array().default([]),
});

export abstract class BaseProcessClusterHandler<
	Process extends ChildProcess | Worker,
	ClusterOptions = BaseProcessClusterHandlerOptions,
> extends BaseClusterHandler<ClusterOptions> {
	/**
	 * Environment variables for the shard's process.
	 */
	public readonly env: Record<string, string>;

	public process: Process | null = null;

	private _exitListener: ((options: HandleExitOptions) => void) | null = null;

	public constructor(
		ids: readonly number[],
		manager: ShardingManager<ClusterOptions>,
		messageBuilder: IMessageHandlerConstructor,
	) {
		super(ids, manager, messageBuilder);

		this.env = {
			...process.env,
			SHARDING_MANAGER: 'true',
			SHARDING_MANAGER_CLUSTER_STRATEGY: Reflect.get(this, 'name') as string,
			SHARDING_MANAGER_MESSAGE_STRATEGY: this.messages.name,
			SHARDS: JSON.stringify(this.ids),
			SHARD_COUNT: this.manager.totalShards.toString(),
		};
		if (this.manager.token) this.env.DISCORD_TOKEN = this.manager.token;
	}

	public abstract get name(): string;

	public async start({ timeout = 30_000 }: ClusterHandlerStartOptions = {}): Promise<void> {
		if (this.process !== null) throw new Error('The process was already started.');

		this._exitListener = this._handleStop.bind(this);

		this.process = this.createProcess();

		this.process.on('message', this._handleMessage.bind(this));
		this.process.on('exit', this._exitListener);

		if (timeout === -1 || timeout === Infinity) {
			this._handleStart();
			return;
		}

		const abortController = new AbortController();
		const timer = setTimeout(() => abortController.abort(), timeout).unref();

		try {
			await once(this.process, 'spawn', { signal: abortController.signal });
			await once(this, 'ready', { signal: abortController.signal });
		} finally {
			clearTimeout(timer);
		}

		this._handleStart();
	}

	public async close(): Promise<void> {
		if (this.process === null) throw new Error('The process was already closed.');

		this.process.off('exit', this._exitListener!);
		this.process.kill();

		await this._handleStop({ respawn: false });
	}

	protected sendMessage(data: string | Buffer): Promise<void> {
		if (this.process === null) return Promise.reject(new Error('The process was not initialized.'));

		const deferred = createDeferredPromise<void>();
		this.process.send(data, (error) => {
			if (error) deferred.reject(error);
			else deferred.resolve();
		});

		return deferred.promise;
	}

	protected abstract createProcess(): Process;

	protected override _handleStart() {
		super._handleStart();

		this.manager.emit('shardSpawn', this);
		this.emit('spawn');
	}

	protected override async _handleStop(options: HandleExitOptions = {}) {
		super._handleStop();
		this.manager.emit('shardDeath', this);
		this.emit('death');

		this.ready = false;
		this.process = null;

		if (options.respawn ?? this._consumeRespawn()) await this.start({ timeout: options.timeout });
	}

	public static override validate(value: unknown): Required<BaseProcessClusterHandlerOptions> {
		return baseProcessClusterHandlerOptionsPredicate.parse(value);
	}
}

export interface BaseProcessClusterHandlerOptions {
	/**
	 * Arguments to pass to the shard script when spawning.
	 */
	shardArgs?: string[];

	/**
	 * Arguments to pass to the shard script executable when spawning.
	 */
	execArgv?: string[];
}

interface HandleExitOptions {
	/**
	 * Whether or not to spawn the shard again.
	 */
	respawn?: boolean;

	/**
	 * The amount in milliseconds to wait until the client has become ready (`-1` or `Infinity` for no wait).
	 */
	timeout?: number;
}
