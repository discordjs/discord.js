import { setTimeout as sleep } from 'node:timers/promises';
import { expect, test, vi } from 'vitest';
import { SimpleIdentifyThrottler } from '../../src/index.js';

vi.mock('node:timers/promises', () => ({
	setTimeout: vi.fn(),
}));

const throttler = new SimpleIdentifyThrottler(2);

vi.useFakeTimers();

const NOW = vi.fn().mockReturnValue(Date.now());
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
