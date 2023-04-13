import type { IIdentifyThrottler } from '../../throttling/IIdentifyThrottler.js';
import type { SessionInfo, WebSocketManager } from '../../ws/WebSocketManager.js';
import type { FetchingStrategyOptions, IContextFetchingStrategy } from './IContextFetchingStrategy.js';

export class SimpleContextFetchingStrategy implements IContextFetchingStrategy {
	// This strategy assumes every shard is running under the same process - therefore we need a single
	// IdentifyThrottler per manager.
	private static throttlerCache = new WeakMap<WebSocketManager, IIdentifyThrottler>();

	public constructor(private readonly manager: WebSocketManager, public readonly options: FetchingStrategyOptions) {}

	private static async ensureThrottler(manager: WebSocketManager): Promise<IIdentifyThrottler> {
		const throttler = SimpleContextFetchingStrategy.throttlerCache.get(manager);
		if (throttler) {
			return throttler;
		}

		const newThrottler = await manager.options.buildIdentifyThrottler(manager);
		SimpleContextFetchingStrategy.throttlerCache.set(manager, newThrottler);

		return newThrottler;
	}

	public async retrieveSessionInfo(shardId: number): Promise<SessionInfo | null> {
		return this.manager.options.retrieveSessionInfo(shardId);
	}

	public updateSessionInfo(shardId: number, sessionInfo: SessionInfo | null) {
		return this.manager.options.updateSessionInfo(shardId, sessionInfo);
	}

	public async waitForIdentify(shardId: number): Promise<void> {
		const throttler = await SimpleContextFetchingStrategy.ensureThrottler(this.manager);
		await throttler.waitForIdentify(shardId);
	}
}
