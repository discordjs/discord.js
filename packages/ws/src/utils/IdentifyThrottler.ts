import { setTimeout as sleep } from 'node:timers/promises';
import type { WebSocketManager } from '../ws/WebSocketManager';

export class IdentifyThrottler {
	private identifyState = {
		remaining: 0,
		resetsAt: Infinity,
	};

	public constructor(private readonly manager: WebSocketManager) {}

	public async waitForIdentify(): Promise<void> {
		if (this.identifyState.remaining <= 0) {
			const diff = this.identifyState.resetsAt - Date.now();
			if (diff <= 5_000) {
				// I managed to get it to identify too fast by only multiplying even with 1_200... somehow
				const time = diff + Math.random() * 1_300;
				await sleep(time);
			}

			const info = await this.manager.fetchGatewayInformation();
			this.identifyState = {
				remaining: info.session_start_limit.max_concurrency,
				resetsAt: Date.now() + 5_000,
			};
		}

		this.identifyState.remaining--;
	}
}
