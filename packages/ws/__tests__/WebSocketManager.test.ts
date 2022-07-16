import { REST } from '@discordjs/rest';
import type { APIGatewayBotInfo } from 'discord-api-types/v10';
import { MockAgent } from 'undici';
import { expect, test, vi } from 'vitest';
import { WebSocketManager } from '../src';

vi.useFakeTimers();

const NOW = vi.fn().mockReturnValue(Date.now());
global.Date.now = NOW;

test('fetch gateway information', async () => {
	const mockAgent = new MockAgent();
	const mockPool = mockAgent.get('https://discord.com');
	mockAgent.disableNetConnect();

	const rest = new REST().setAgent(mockAgent).setToken('A-Very-Fake-Token');
	const manager = new WebSocketManager({ token: 'A-Very-Fake-Token', intents: 0, rest });

	const data: APIGatewayBotInfo = {
		shards: 1,
		session_start_limit: {
			max_concurrency: 3,
			reset_after: 60,
			remaining: 3,
			total: 3,
		},
		url: 'wss://gateway.discord.gg',
	};

	const fetch = vi.fn(() => ({
		data,
		statusCode: 200,
		responseOptions: {
			headers: {
				'content-type': 'application/json',
			},
		},
	}));

	mockPool
		.intercept({
			path: '/api/v10/gateway/bot',
			method: 'GET',
		})
		.reply(fetch);

	const initial = await manager.fetchGatewayInformation();
	expect(initial).toEqual(data);
	expect(fetch).toHaveBeenCalledOnce();

	fetch.mockRestore();

	const cached = await manager.fetchGatewayInformation();
	expect(cached).toEqual(data);
	expect(fetch).not.toHaveBeenCalled();

	fetch.mockRestore();

	mockPool
		.intercept({
			path: '/api/v10/gateway/bot',
			method: 'GET',
		})
		.reply(fetch);

	const forced = await manager.fetchGatewayInformation(true);
	expect(forced).toEqual(data);
	expect(fetch).toHaveBeenCalledOnce();

	fetch.mockRestore();

	mockPool
		.intercept({
			path: '/api/v10/gateway/bot',
			method: 'GET',
		})
		.reply(fetch);

	NOW.mockReturnValue(Infinity);
	const cacheExpired = await manager.fetchGatewayInformation();
	expect(cacheExpired).toEqual(data);
	expect(fetch).toHaveBeenCalledOnce();
});
