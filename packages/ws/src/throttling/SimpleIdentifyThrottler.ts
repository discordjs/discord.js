import { setTimeout as sleep } from 'node:timers/promises';
import { Collection } from '@discordjs/collection';
import { AsyncQueue } from '@sapphire/async-queue';
import type { IIdentifyThrottler } from './IIdentifyThrottler';

/**
 * The state of a rate limit key's identify queue.
 */
export interface IdentifyState {
	queue: AsyncQueue;
	resetsAt: number;
}

/**
 * Local, in-memory identify throttler.
 */
export class SimpleIdentifyThrottler implements IIdentifyThrottler {
	private readonly states = new Collection<number, IdentifyState>();

	public constructor(private readonly maxConcurrency: number) {}

	/**
	 * {@inheritDoc IIdentifyThrottler.waitForIdentify}
	 */
	public async waitForIdentify(shardId: number): Promise<void> {
		const key = shardId % this.maxConcurrency;

		const state = this.states.ensure(key, () => {
			return {
				queue: new AsyncQueue(),
				resetsAt: Number.POSITIVE_INFINITY,
			};
		});

		await state.queue.wait();

		try {
			const diff = state.resetsAt - Date.now();
			if (diff <= 5_000) {
				// To account for the latency the IDENTIFY payload goes through, we add a bit more wait time
				const time = diff + Math.random() * 1_500;
				console.log(`[IDENTIFY] Shard ${shardId} is waiting ${time}ms for the rate limit to expire.`);
				await sleep(time);
			}

			state.resetsAt = Date.now() + 5_000;
		} finally {
			state.queue.shift();
		}
	}
}
