import { setTimeout as sleep } from 'node:timers/promises';
import { expect, test, vi, type Mock } from 'vitest';
import { IdentifyThrottler, type WebSocketManager } from '../../src/index.js';

vi.mock('node:timers/promises', () => ({
	setTimeout: vi.fn(),
}));

const fetchGatewayInformation = vi.fn();

const manager = {
	fetchGatewayInformation,
} as unknown as WebSocketManager;

const throttler = new IdentifyThrottler(manager);

vi.useFakeTimers();

const NOW = vi.fn().mockReturnValue(Date.now());
global.Date.now = NOW;

test('basic case', async () => {
	fetchGatewayInformation.mockReturnValue({
		session_start_limit: {
			max_concurrency: 2,
			reset_after: 5_000,
		},
	});

	// Those shouldn't wait since they're in different keys

	await throttler.waitForIdentify(0);
	expect(sleep).not.toHaveBeenCalled();

	await throttler.waitForIdentify(1);
	expect(sleep).not.toHaveBeenCalled();

	// Those shouldn't wait either since they're in the same key and max_concurrency is 2

	await throttler.waitForIdentify(2);
	expect(sleep).not.toHaveBeenCalled();

	await throttler.waitForIdentify(3);
	expect(sleep).not.toHaveBeenCalled();

	// These should wait since the key is full

	await throttler.waitForIdentify(4);
	expect(sleep).toHaveBeenCalledTimes(1);

	await throttler.waitForIdentify(5);
	expect(sleep).toHaveBeenCalledTimes(2);
});
