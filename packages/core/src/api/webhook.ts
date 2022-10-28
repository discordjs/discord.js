import { makeURLSearchParams, type RawFile, type REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIChannelMessageResult,
	type RESTGetAPIWebhookResult,
	type RESTPatchAPIWebhookJSONBody,
	type RESTPatchAPIWebhookResult,
	type RESTPatchAPIWebhookWithTokenMessageJSONBody,
	type RESTPatchAPIWebhookWithTokenMessageResult,
	type RESTPostAPIChannelWebhookJSONBody,
	type RESTPostAPIWebhookWithTokenGitHubQuery,
	type RESTPostAPIWebhookWithTokenJSONBody,
	type RESTPostAPIWebhookWithTokenQuery,
	type RESTPostAPIWebhookWithTokenResult,
	type RESTPostAPIWebhookWithTokenSlackQuery,
	type RESTPostAPIWebhookWithTokenWaitResult,
	type Snowflake,
} from 'discord-api-types/v10';

export class WebhooksAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches a webhook
	 *
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 */
	public async get(id: Snowflake, token?: string) {
		return this.rest.get(Routes.webhook(id, token)) as Promise<RESTGetAPIWebhookResult>;
	}

	/**
	 * Creates a new webhook
	 *
	 * @param channelId - The id of the channel to create the webhook in
	 * @param data - The data to use when creating the webhook
	 * @param reason - The reason for creating the webhook
	 */
	public async create(channelId: Snowflake, data: RESTPostAPIChannelWebhookJSONBody, reason?: string) {
		return this.rest.post(Routes.channelWebhooks(channelId), {
			reason,
			body: data,
		}) as Promise<RESTPostAPIWebhookWithTokenResult>;
	}

	/**
	 * Edits a webhook
	 *
	 * @param id - The id of the webhook to edit
	 * @param webhook - The new webhook data
	 * @param options - The options to use when editing the webhook
	 */
	public async edit(
		id: Snowflake,
		webhook: RESTPatchAPIWebhookJSONBody,
		{ token, reason }: { reason?: string; token?: string } = {},
	) {
		return this.rest.patch(Routes.webhook(id, token), { reason, body: webhook }) as Promise<RESTPatchAPIWebhookResult>;
	}

	/**
	 * Deletes a webhook
	 *
	 * @param id - The id of the webhook to delete
	 * @param options - The options to use when deleting the webhook
	 */
	public async delete(id: Snowflake, { token, reason }: { reason?: string; token?: string } = {}) {
		await this.rest.delete(Routes.webhook(id, token), { reason });
	}

	/**
	 * Executes a webhook and returns the created message
	 *
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param data - The data to use when executing the webhook
	 */
	public async execute(
		id: Snowflake,
		token: string,
		data: RESTPostAPIWebhookWithTokenJSONBody & RESTPostAPIWebhookWithTokenQuery & { files?: RawFile[]; wait: true },
	): Promise<RESTPostAPIWebhookWithTokenWaitResult>;

	/**
	 * Executes a webhook
	 *
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param data - The data to use when executing the webhook
	 */
	public async execute(
		id: Snowflake,
		token: string,
		data: RESTPostAPIWebhookWithTokenJSONBody & RESTPostAPIWebhookWithTokenQuery & { files?: RawFile[]; wait?: false },
	): Promise<void>;

	/**
	 * Executes a webhook
	 *
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param data - The data to use when executing the webhook
	 */
	public async execute(
		id: Snowflake,
		token: string,
		{
			wait,
			thread_id,
			files,
			...body
		}: RESTPostAPIWebhookWithTokenJSONBody & RESTPostAPIWebhookWithTokenQuery & { files?: RawFile[] },
	) {
		return this.rest.post(Routes.webhook(id, token), {
			query: makeURLSearchParams({ wait, thread_id }),
			files,
			body,
			// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
		}) as Promise<RESTPostAPIWebhookWithTokenWaitResult | void>;
	}

	/**
	 * Executes a slack webhook
	 *
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param options - The options to use when executing the webhook
	 */
	public async executeSlack(id: Snowflake, token: string, options: RESTPostAPIWebhookWithTokenSlackQuery = {}) {
		await this.rest.post(Routes.webhookPlatform(id, token, 'slack'), {
			query: makeURLSearchParams(options as Record<string, unknown>),
			body: options,
		});
	}

	/**
	 * Executes a github webhook
	 *
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param options - The options to use when executing the webhook
	 */
	public async executeGitHub(id: Snowflake, token: string, options: RESTPostAPIWebhookWithTokenGitHubQuery = {}) {
		await this.rest.post(Routes.webhookPlatform(id, token, 'github'), {
			query: makeURLSearchParams(options as Record<string, unknown>),
			body: options,
		});
	}

	/**
	 * Fetches an associated message from a webhook
	 *
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param messageId - The id of the message to fetch
	 * @param options - The options to use when fetching the message
	 */
	public async getMessage(id: Snowflake, token: string, messageId: Snowflake, options: { thread_id?: string } = {}) {
		return this.rest.get(Routes.webhookMessage(id, token, messageId), {
			query: makeURLSearchParams(options as Record<string, unknown>),
		}) as Promise<RESTGetAPIChannelMessageResult>;
	}

	/**
	 * Edits an associated message from a webhook
	 *
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param messageId - The id of the message to edit
	 * @param data - The data to use when editing the message
	 */
	public async editMessage(
		id: Snowflake,
		token: string,
		messageId: Snowflake,
		{ thread_id, ...body }: RESTPatchAPIWebhookWithTokenMessageJSONBody & { thread_id?: string },
	) {
		return this.rest.patch(Routes.webhookMessage(id, token, messageId), {
			query: makeURLSearchParams({ thread_id }),
			body,
		}) as Promise<RESTPatchAPIWebhookWithTokenMessageResult>;
	}

	/**
	 * Deletes an associated message from a webhook
	 *
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param messageId - The id of the message to delete
	 * @param options - The options to use when deleting the message
	 */
	public async deleteMessage(id: Snowflake, token: string, messageId: Snowflake, options: { thread_id?: string } = {}) {
		await this.rest.delete(Routes.webhookMessage(id, token, messageId), {
			query: makeURLSearchParams(options as Record<string, unknown>),
		});
	}
}
