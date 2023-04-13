import { setTimeout as sleep } from 'node:timers/promises';
import { Collection } from '@discordjs/collection';
import { AsyncQueue } from '@sapphire/async-queue';

export interface SessionState {
	queue: AsyncQueue;
	resetsAt: number;
}

export class IdentifyThrottler {
	private readonly states = new Collection<number, SessionState>();

	public constructor(private readonly maxConcurrency: number) {}

	public async waitForIdentify(shardId: number): Promise<void> {
		const key = shardId % this.maxConcurrency;

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
				await sleep(time);
			}

			state.resetsAt = Date.now() + 5_000;
		} finally {
			state.queue.shift();
		}
	}
}
