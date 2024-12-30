// @ts-nocheck
import { setTimeout as sleep } from 'node:timers/promises';
import { expect, test, vi } from 'vitest';
import { SimpleIdentifyThrottler } from '../../src/index.js';

vi.mock('node:timers/promises', () => ({
	setTimeout: vi.fn(),
}));

const throttler = new SimpleIdentifyThrottler(2);

vi.useFakeTimers();

const TIME = Date.now();
const NOW = vi.fn().mockReturnValue(TIME);
global.Date.now = NOW;

test('basic case', async () => {
	// Those shouldn't wait since they're in different keys

	await throttler.waitForIdentify(0);
	expect(sleep).not.toHaveBeenCalled();

	await throttler.waitForIdentify(1);
	expect(sleep).not.toHaveBeenCalled();

	// Those should wait

	await throttler.waitForIdentify(2);
	expect(sleep).toHaveBeenCalledTimes(1);

	await throttler.waitForIdentify(3);
	expect(sleep).toHaveBeenCalledTimes(2);
});

test('does not call sleep with a negative time', async () => {
	await throttler.waitForIdentify(0);
	expect(sleep).not.toHaveBeenCalled();

	// By overshooting, we're simulating a bug that existed prior to this test, where-in by enough time
	// passing before the shard tried to identify for a subseuent time, the passed value would end up being negative
	// (and this was unchecked). Node simply treats that as 1ms, so it wasn't particularly harmful, but they
	// recently introduced a warning for it, so we want to avoid that.
	NOW.mockReturnValueOnce(TIME + 10_000);
	await throttler.waitForIdentify(0);
	expect(sleep).not.toHaveBeenCalled(1);
});
