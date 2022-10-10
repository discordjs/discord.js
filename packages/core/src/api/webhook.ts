import type { REST } from '@discordjs/rest';
import { makeURLSearchParams } from '@discordjs/rest';
import type {
	APIMessage,
	APIWebhook,
	RESTPatchAPIWebhookJSONBody,
	RESTPatchAPIWebhookWithTokenMessageJSONBody,
	RESTPostAPIChannelWebhookJSONBody,
	RESTPostAPIWebhookWithTokenGitHubQuery,
	RESTPostAPIWebhookWithTokenJSONBody,
	RESTPostAPIWebhookWithTokenQuery,
	RESTPostAPIWebhookWithTokenSlackQuery,
} from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v10';

export const webhooks = (api: REST) => ({
	async fetch(id: string, token?: string) {
		return api.get(Routes.webhook(id, token));
	},

	async create(channelId: string, options: RESTPostAPIChannelWebhookJSONBody, reason?: string) {
		return (await api.post(Routes.channelWebhooks(channelId), {
			reason,
			body: options,
		})) as APIWebhook;
	},

	async edit(id: string, options: RESTPatchAPIWebhookJSONBody, token?: string, reason?: string) {
		return (await api.patch(Routes.webhook(id, token), {
			reason,
			body: options,
		})) as APIWebhook;
	},

	async delete(id: string, token?: string, reason?: string) {
		return api.delete(Routes.webhook(id, token), { reason });
	},

	async execute(
		id: string,
		token: string,
		options: RESTPostAPIWebhookWithTokenJSONBody & RESTPostAPIWebhookWithTokenQuery = {},
	) {
		const { wait, thread_id, ...body } = options;
		return api.post(Routes.webhook(id, token), {
			query: makeURLSearchParams({ wait, thread_id }),
			body,
		});
	},

	async executeSlack(id: string, token: string, options: RESTPostAPIWebhookWithTokenSlackQuery = {}) {
		return api.post(Routes.webhookPlatform(id, token, 'slack'), {
			query: makeURLSearchParams({ wait: options.wait, thread_id: options.thread_id }),
			body: options,
		});
	},

	async executeGitHub(id: string, token: string, options: RESTPostAPIWebhookWithTokenGitHubQuery = {}) {
		return api.post(Routes.webhookPlatform(id, token, 'github'), {
			query: makeURLSearchParams({ wait: options.wait, thread_id: options.thread_id }),
			body: options,
		});
	},

	async getMessage(id: string, token: string, messageId: string, options: { thread_id?: string } = {}) {
		return (await api.get(Routes.webhookMessage(id, token, messageId), {
			query: makeURLSearchParams({ ...options }),
		})) as APIMessage;
	},

	async editMessage(
		id: string,
		token: string,
		messageId: string,
		options: RESTPatchAPIWebhookWithTokenMessageJSONBody & { thread_id?: string } = {},
	) {
		const { thread_id, ...body } = options;
		return (await api.patch(Routes.webhookMessage(id, token, messageId), {
			query: makeURLSearchParams({ thread_id }),
			body,
		})) as APIMessage;
	},

	async deleteMessage(id: string, token: string, messageId: string, options: { thread_id?: string } = {}) {
		return api.delete(Routes.webhookMessage(id, token, messageId), {
			query: makeURLSearchParams({ ...options }),
		});
	},
});
