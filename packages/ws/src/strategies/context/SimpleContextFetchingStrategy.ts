import { IdentifyThrottler } from '../../utils/IdentifyThrottler.js';
import type { SessionInfo, WebSocketManager } from '../../ws/WebSocketManager.js';
import type { FetchingStrategyOptions, IContextFetchingStrategy } from './IContextFetchingStrategy.js';

// This strategy assumes every shard is running under the same process - therefore a global identify throttler is used
// If this is not the case, a custom strategy should be written to implement `waitForIdentify`

let globalIdentifyThrottler: IdentifyThrottler;

export class SimpleContextFetchingStrategy implements IContextFetchingStrategy {
	public constructor(private readonly manager: WebSocketManager, public readonly options: FetchingStrategyOptions) {}

	public async retrieveSessionInfo(shardId: number): Promise<SessionInfo | null> {
		return this.manager.options.retrieveSessionInfo(shardId);
	}

	public updateSessionInfo(shardId: number, sessionInfo: SessionInfo | null) {
		return this.manager.options.updateSessionInfo(shardId, sessionInfo);
	}

	public async waitForIdentify(): Promise<void> {
		globalIdentifyThrottler ??= new IdentifyThrottler(this.manager);
		await globalIdentifyThrottler.waitForIdentify();
	}
}
