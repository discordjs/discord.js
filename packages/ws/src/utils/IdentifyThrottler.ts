import { setTimeout as sleep } from 'node:timers/promises';
import { AsyncQueue } from '@sapphire/async-queue';
import type { WebSocketManager } from '../ws/WebSocketManager.js';

export class IdentifyThrottler {
	private readonly queue = new AsyncQueue();

	private identifyState = {
		remaining: 0,
		resetsAt: Number.POSITIVE_INFINITY,
	};

	public constructor(private readonly manager: WebSocketManager) {}

	public async waitForIdentify(): Promise<void> {
		await this.queue.wait();

		try {
			if (this.identifyState.remaining <= 0) {
				const diff = this.identifyState.resetsAt - Date.now();
				if (diff <= 5_000) {
					const time = diff + Math.random() * 1_500;
					await sleep(time);
				}

				const info = await this.manager.fetchGatewayInformation();
				this.identifyState = {
					remaining: info.session_start_limit.max_concurrency,
					resetsAt: Date.now() + 5_000,
				};
			}

			this.identifyState.remaining--;
		} finally {
			this.queue.shift();
		}
	}
}
