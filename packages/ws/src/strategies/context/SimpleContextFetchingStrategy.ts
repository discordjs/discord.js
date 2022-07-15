import type { FetchingStrategyOptions, IContextFetchingStrategy } from './IContextFetchingStrategy';
import type { SessionInfo, WebSocketManager } from '../../struct/WebSocketManager';

export class SimpleContextFetchingStrategy implements IContextFetchingStrategy {
	public constructor(private readonly manager: WebSocketManager, public readonly options: FetchingStrategyOptions) {}

	public async retrieveSessionInfo(shardId: number): Promise<SessionInfo | null> {
		return this.manager.options.retrieveSessionInfo(shardId);
	}

	public updateSessionInfo(shardId: number, sessionInfo: SessionInfo | null) {
		return this.manager.options.updateSessionInfo(shardId, sessionInfo);
	}
}
