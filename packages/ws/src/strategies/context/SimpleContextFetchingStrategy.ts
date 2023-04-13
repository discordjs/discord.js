import { IdentifyThrottler } from '../../utils/IdentifyThrottler.js';
import type { SessionInfo, WebSocketManager } from '../../ws/WebSocketManager.js';
import type { FetchingStrategyOptions, IContextFetchingStrategy } from './IContextFetchingStrategy.js';

export class SimpleContextFetchingStrategy implements IContextFetchingStrategy {
	// This strategy assumes every shard is running under the same process - therefore we need a single
	// IdentifyThrottler per manager.
	private static throttlerCache = new WeakMap<WebSocketManager, IdentifyThrottler>();

	private static ensureThrottler(manager: WebSocketManager): IdentifyThrottler {
		const existing = SimpleContextFetchingStrategy.throttlerCache.get(manager);
		if (existing) {
			return existing;
		}

		const throttler = new IdentifyThrottler(manager);
		SimpleContextFetchingStrategy.throttlerCache.set(manager, throttler);
		return throttler;
	}

	private readonly throttler: IdentifyThrottler;

	public constructor(private readonly manager: WebSocketManager, public readonly options: FetchingStrategyOptions) {
		this.throttler = SimpleContextFetchingStrategy.ensureThrottler(manager);
	}

	public async retrieveSessionInfo(shardId: number): Promise<SessionInfo | null> {
		return this.manager.options.retrieveSessionInfo(shardId);
	}

	public updateSessionInfo(shardId: number, sessionInfo: SessionInfo | null) {
		return this.manager.options.updateSessionInfo(shardId, sessionInfo);
	}

	public async waitForIdentify(shardId: number): Promise<void> {
		await this.throttler.waitForIdentify(shardId);
	}
}
