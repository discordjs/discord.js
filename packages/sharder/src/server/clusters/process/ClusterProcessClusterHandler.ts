import cluster, { Worker } from 'node:cluster';
import { BaseProcessClusterHandler, BaseProcessClusterHandlerOptions } from './BaseProcessClusterHandler';

export class ClusterProcessClusterHandler extends BaseProcessClusterHandler<Worker> {
	public get name(): string {
		return 'cluster';
	}

	protected override createProcess(): Worker {
		return cluster.fork(this.env);
	}

	public static override setup(options: BaseProcessClusterHandlerOptions) {
		cluster.setupPrimary({ execArgv: options.execArgv, args: options.shardArgs });
	}

	public static override get isPrimary() {
		return cluster.isPrimary;
	}
}
