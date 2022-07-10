import { REST } from '@discordjs/rest';
import type { APIGatewayBotInfo } from 'discord-api-types/v10';
import { MockAgent } from 'undici';
import { describe, expect, test } from 'vitest';
import { WebSocketManager } from '../src';

test('fetch gateway information', async () => {
	const mockAgent = new MockAgent();
	const mockPool = mockAgent.get('https://discord.com');
	mockAgent.disableNetConnect();

	const rest = new REST().setAgent(mockAgent);
	const manager = new WebSocketManager({ rest }).setToken('A-Very-Fake-Token');

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

	mockPool
		.intercept({
			path: '/api/v10/gateway/bot',
			method: 'GET',
		})
		.reply(() => ({
			data,
			statusCode: 200,
			responseOptions: {
				headers: {
					'content-type': 'application/json',
				},
			},
		}));

	const initialData = await manager.fetchGatewayInformation();
	expect(initialData).toEqual(data);
});
