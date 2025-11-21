import type { RESTGetAPIGatewayBotResult } from 'discord-api-types/v10';

export const mockGatewayInformation: RESTGetAPIGatewayBotResult = {
	shards: 1,
	session_start_limit: {
		max_concurrency: 3,
		reset_after: 60,
		remaining: 3,
		total: 3,
	},
	url: 'wss://gateway.discord.gg',
};
