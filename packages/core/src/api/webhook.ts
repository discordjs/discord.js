/* eslint-disable jsdoc/check-param-names */

import { makeURLSearchParams, type RequestData, type RawFile, type REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIWebhookWithTokenMessageQuery,
	type RESTGetAPIWebhookWithTokenMessageResult,
	type RESTGetAPIWebhookResult,
	type RESTPatchAPIWebhookJSONBody,
	type RESTPatchAPIWebhookResult,
	type RESTPatchAPIWebhookWithTokenMessageJSONBody,
	type RESTPatchAPIWebhookWithTokenMessageResult,
	type RESTPostAPIWebhookWithTokenGitHubQuery,
	type RESTPostAPIWebhookWithTokenJSONBody,
	type RESTPostAPIWebhookWithTokenQuery,
	type RESTPostAPIWebhookWithTokenSlackQuery,
	type RESTPostAPIWebhookWithTokenWaitResult,
	type Snowflake,
} from 'discord-api-types/v10';

export type CreateWebhookMessageOptions = RESTPostAPIWebhookWithTokenJSONBody &
	RESTPostAPIWebhookWithTokenQuery & { files?: RawFile[] };

export type EditWebhookMessageOptions = RESTPatchAPIWebhookWithTokenMessageJSONBody & {
	files?: RawFile[];
	thread_id?: string;
};

export class WebhooksAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches a webhook
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#get-webhook}
	 * @see {@link https://discord.com/developers/docs/resources/webhook#get-webhook-with-token}
	 * @param id - The id of the webhook
	 * @param options - The options for fetching the webhook
	 */
	public async get(
		id: Snowflake,
		{ token, signal }: Pick<RequestData, 'signal'> & { token?: string | undefined } = {},
	) {
		return this.rest.get(Routes.webhook(id, token), {
			signal,
			auth: !token,
		}) as Promise<RESTGetAPIWebhookResult>;
	}

	/**
	 * Edits a webhook
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#modify-webhook}
	 * @see {@link https://discord.com/developers/docs/resources/webhook#modify-webhook-with-token}
	 * @param id - The id of the webhook to edit
	 * @param body - The new webhook data
	 * @param options - The options for editing the webhook
	 */
	public async edit(
		id: Snowflake,
		body: RESTPatchAPIWebhookJSONBody,
		{ token, reason, signal }: Pick<RequestData, 'reason' | 'signal'> & { token?: string | undefined } = {},
	) {
		return this.rest.patch(Routes.webhook(id, token), {
			reason,
			body,
			signal,
			auth: !token,
		}) as Promise<RESTPatchAPIWebhookResult>;
	}

	/**
	 * Deletes a webhook
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#delete-webhook}
	 * @see {@link https://discord.com/developers/docs/resources/webhook#delete-webhook-with-token}
	 * @param id - The id of the webhook to delete
	 * @param options - The options for deleting the webhook
	 */
	public async delete(
		id: Snowflake,
		{ token, reason, signal }: Pick<RequestData, 'reason' | 'signal'> & { token?: string | undefined } = {},
	) {
		await this.rest.delete(Routes.webhook(id, token), {
			reason,
			signal,
			auth: !token,
		});
	}

	/**
	 * Executes a webhook and returns the created message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#execute-webhook}
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param body - The data for executing the webhook
	 * @param options - The options for executing the webhook
	 */
	public async execute(
		id: Snowflake,
		token: string,
		body: CreateWebhookMessageOptions & { wait: true },
		options?: Pick<RequestData, 'signal'>,
	): Promise<RESTPostAPIWebhookWithTokenWaitResult>;

	/**
	 * Executes a webhook
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#execute-webhook}
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param body - The data for executing the webhook
	 * @param options - The options for executing the webhook
	 */
	public async execute(
		id: Snowflake,
		token: string,
		body: CreateWebhookMessageOptions & { wait?: false },
		options?: Pick<RequestData, 'signal'>,
	): Promise<void>;

	/**
	 * Executes a webhook
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#execute-webhook}
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param body - The data for executing the webhook
	 * @param options - The options for executing the webhook
	 */
	public async execute(
		id: Snowflake,
		token: string,
		{ wait, thread_id, files, ...body }: CreateWebhookMessageOptions,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.post(Routes.webhook(id, token), {
			query: makeURLSearchParams({ wait, thread_id }),
			files,
			body,
			auth: false,
			signal,
		}) as Promise<RESTPostAPIWebhookWithTokenWaitResult | void>;
	}

	/**
	 * Executes a slack webhook
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#execute-slackcompatible-webhook}
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param body - The data for executing the webhook
	 * @param query - The query options for executing the webhook
	 * @param options - The options for executing the webhook
	 */
	public async executeSlack(
		id: Snowflake,
		token: string,
		body: unknown,
		query: RESTPostAPIWebhookWithTokenSlackQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		await this.rest.post(Routes.webhookPlatform(id, token, 'slack'), {
			query: makeURLSearchParams(query),
			body,
			auth: false,
			signal,
		});
	}

	/**
	 * Executes a github webhook
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#execute-githubcompatible-webhook}
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param body - The data for executing the webhook
	 * @param query - The options for executing the webhook
	 * @param options - The options for executing the webhook
	 */
	public async executeGitHub(
		id: Snowflake,
		token: string,
		body: unknown,
		query: RESTPostAPIWebhookWithTokenGitHubQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		await this.rest.post(Routes.webhookPlatform(id, token, 'github'), {
			query: makeURLSearchParams(query),
			body,
			signal,
			auth: false,
		});
	}

	/**
	 * Fetches an associated message from a webhook
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#get-webhook-message}
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param messageId - The id of the message to fetch
	 * @param query - The query options for fetching the message
	 * @param options - The options for fetching the message
	 */
	public async getMessage(
		id: Snowflake,
		token: string,
		messageId: Snowflake,
		query: RESTGetAPIWebhookWithTokenMessageQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.webhookMessage(id, token, messageId), {
			query: makeURLSearchParams(query),
			auth: false,
			signal,
		}) as Promise<RESTGetAPIWebhookWithTokenMessageResult>;
	}

	/**
	 * Edits an associated message from a webhook
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#edit-webhook-message}
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param messageId - The id of the message to edit
	 * @param body - The data for editing the message
	 * @param options - The options for editing the message
	 */
	public async editMessage(
		id: Snowflake,
		token: string,
		messageId: Snowflake,
		{ thread_id, files, ...body }: EditWebhookMessageOptions,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.patch(Routes.webhookMessage(id, token, messageId), {
			query: makeURLSearchParams({ thread_id }),
			auth: false,
			body,
			signal,
			files,
		}) as Promise<RESTPatchAPIWebhookWithTokenMessageResult>;
	}

	/**
	 * Deletes an associated message from a webhook
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#delete-webhook-message}
	 * @param id - The id of the webhook
	 * @param token - The token of the webhook
	 * @param messageId - The id of the message to delete
	 * @param query - The options for deleting the message
	 * @param options - The options for deleting the message
	 */
	public async deleteMessage(
		id: Snowflake,
		token: string,
		messageId: Snowflake,
		query: { thread_id?: Snowflake } = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		await this.rest.delete(Routes.webhookMessage(id, token, messageId), {
			query: makeURLSearchParams(query),
			auth: false,
			signal,
		});
	}
}
