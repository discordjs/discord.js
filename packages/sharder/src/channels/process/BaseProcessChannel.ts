import type { ChildProcess } from 'node:child_process';
import type { Worker as ClusterWorker } from 'node:cluster';
import process from 'node:process';
import type { Awaitable } from '@discordjs/util';
import type { ShardManager } from '../../ShardManager.js';
import { MessageOp } from '../../messages/base/IMessageHandler.js';
import type { SerializedInput } from '../../messages/base/IMessageHandler.js';
import { createDeferredPromise } from '../../utils/DeferredPromise.js';
import { BaseChannel } from '../base/BaseChannel.js';

export abstract class BaseProcessChannel<
	Process extends ChildProcess | ClusterWorker,
	Options extends BaseProcessChannelOptions = BaseProcessChannelOptions,
> extends BaseChannel<Options> {
	public readonly env: Record<string, string>;

	public process: Process | null = null;

	private handleDisconnect: (() => void) | null = null;

	public constructor(manager: ShardManager<Options>, shards: readonly number[]) {
		super(manager, shards);

		this.env = {
			...process.env,
			SHARDING_MANAGER: 'true',
			SHARDS: JSON.stringify(this.shards),
			SHARD_COUNT: this.manager.totalShards.toString(),
		};
	}

	public init(): Awaitable<void> {
		if (this.process !== null) throw new Error('Cannot re-initialize the process');

		this.handleDisconnect = this.handleStop.bind(this);
		this.process = this.createProcess();
		this.process.on('message', this.handleMessage.bind(this));
		this.process.on('disconnect', this.handleDisconnect);
	}

	public async start(id: number, timeout?: number): Promise<void> {
		if (this.process === null) throw new Error('The process has not been initialized.');

		await this.send(timeout ?? null, { id, opcode: MessageOp.Start });
	}

	public async destroy(): Promise<void> {
		if (this.process === null) throw new Error('The process was already closed.');

		this.process.off('disconnect', this.handleDisconnect!);
		this.process.kill();

		await this.handleStop(false);
	}

	public async close(id: number): Promise<void> {
		if (this.process === null) return;

		await this.send(null, { id, opcode: MessageOp.Close });
	}

	public async closeAll(): Promise<void> {
		if (this.process === null) return;

		await this.send(null, { opcode: MessageOp.CloseAll });
	}

	public async restart(id: number, timeout?: number): Promise<void> {
		if (this.process === null) throw new Error('The process has not been initialized.');

		await this.send(timeout ?? null, { id, opcode: MessageOp.Restart });
	}

	public async restartAll(): Promise<void> {
		if (this.process === null) throw new Error('The process has not been initialized.');

		await this.send(null, { opcode: MessageOp.RestartAll });
	}

	public sendMessage(body: SerializedInput): Awaitable<void> {
		if (this.process === null) return Promise.reject(new Error('The process was not initialized.'));

		// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
		const deferred = createDeferredPromise<void>();
		// eslint-disable-next-line promise/prefer-await-to-callbacks
		this.process.send(body, (error) => {
			if (error) deferred.reject(error);
			else deferred.resolve();
		});

		return deferred.promise;
	}

	protected abstract createProcess(): Process;

	protected handleStart() {
		this.ping.start();
	}

	protected async handleStop(respawn?: boolean) {
		this.ping.stop();
		this.ready = false;
		this.process = null;

		if (respawn ?? this.consumeRespawn()) await this.init();
	}
}

export interface BaseProcessChannelOptions {
	/**
	 * Arguments to pass to the shard script executable when spawning.
	 */
	execArgv?: string[];

	/**
	 * Arguments to pass to the shard script when spawning.
	 */
	shardArgs?: string[];
}
