import type { IClusterHandlerConstructor } from './base/IClusterHandler';
import { ClusterProcessClusterHandler } from './process/ClusterProcessClusterHandler';
import { ForkProcessClusterHandler } from './process/ForkProcessClusterHandler';

export * from './base/BaseClusterHandler';
export * from './base/IClusterHandler';
export * from './process/BaseProcessClusterHandler';
export * from './process/ClusterProcessClusterHandler';
export * from './process/ForkProcessClusterHandler';

export const shardHandlers = new Map<keyof ShardHandlers, IClusterHandlerConstructor<any>>([
	['cluster', ClusterProcessClusterHandler],
	['fork', ForkProcessClusterHandler],
]);

export interface ShardHandlers {
	cluster: ClusterProcessClusterHandler['manager']['options'];
	fork: ForkProcessClusterHandler['manager']['options'];
}
