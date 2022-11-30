import { fork, type ChildProcess } from 'node:child_process';
import { BaseProcessChannel, type BaseProcessChannelOptions } from './BaseProcessChannel.js';

export class ForkChannel extends BaseProcessChannel<ChildProcess, ForkChannelOptions> {
	protected createProcess(): ChildProcess {
		return fork(this.manager.channelOptions.path, this.manager.channelOptions.shardArgs, {
			env: this.env,
			execArgv: this.manager.channelOptions.execArgv,
		});
	}
}

export interface ForkChannelOptions extends BaseProcessChannelOptions {
	/**
	 * The path of the file to fork.
	 */
	path: string;
}
