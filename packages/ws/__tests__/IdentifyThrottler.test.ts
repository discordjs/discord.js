import { setTimeout as sleep } from 'node:timers/promises';
import { expect, Mock, test, vi } from 'vitest';
import { IdentifyThrottler, WebSocketManager } from '../src';

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

test('wait for identify', async () => {
	fetchGatewayInformation.mockReturnValue({
		session_start_limit: {
			max_concurrency: 2,
		},
	});

	// First call should never wait
	await throttler.waitForIdentify();
	expect(sleep).not.toHaveBeenCalled();

	// Second call still won't wait because max_concurrency is 2
	await throttler.waitForIdentify();
	expect(sleep).not.toHaveBeenCalled();

	// Third call should wait
	await throttler.waitForIdentify();
	expect(sleep).toHaveBeenCalled();

	(sleep as Mock).mockRestore();

	// Fourth call shouldn't wait, because our max_concurrency is 2 and we waited for a reset
	await throttler.waitForIdentify();
	expect(sleep).not.toHaveBeenCalled();
});
