import { setTimeout as sleep } from 'node:timers/promises';
import { Collection } from '@discordjs/collection';
import { AsyncQueue } from '@sapphire/async-queue';
import type { WebSocketManager } from '../ws/WebSocketManager.js';
import { WebSocketShardEvents } from '../ws/WebSocketShard.js';

interface SessionState {
	queue: AsyncQueue;
	resetsAt: number;
}

export class IdentifyThrottler {
	private readonly states = new Collection<number, SessionState>();

	public constructor(private readonly manager: WebSocketManager) {}

	public async waitForIdentify(shardId: number): Promise<void> {
		const info = await this.manager.fetchGatewayInformation();
		const key = shardId % info.session_start_limit.max_concurrency;

		const state = this.states.ensure(key, () => ({
			queue: new AsyncQueue(),
			resetsAt: Number.POSITIVE_INFINITY,
		}));

		await state.queue.wait();

		try {
			const diff = state.resetsAt - Date.now();
			if (diff <= 5_000) {
				// To account for the latency the IDENTIFY payload goes through, we add a bit more wait time
				const time = diff + Math.random() * 1_500;
				this.manager.emit(WebSocketShardEvents.Debug, {
					shardId,
					message: `Waiting ${time}ms before IDENTIFYing`,
				});
				await sleep(time);
			}

			state.resetsAt = Date.now() + 5_000;
		} finally {
			state.queue.shift();
		}
	}
}
