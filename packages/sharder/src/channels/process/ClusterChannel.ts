import cluster, { type Worker as ClusterWorker } from 'node:cluster';
import { BaseProcessChannel } from './BaseProcessChannel.js';

export class ClusterChannel extends BaseProcessChannel<ClusterWorker> {
	protected createProcess(): ClusterWorker {
		cluster.setupPrimary({
			execArgv: this.manager.channelOptions.execArgv,
			args: this.manager.channelOptions.shardArgs,
		});
		return cluster.fork(this.env);
	}
}
