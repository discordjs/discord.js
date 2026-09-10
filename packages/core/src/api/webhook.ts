/* eslint-disable jsdoc/check-param-names */

import { makeURLSearchParams, type RawFile, type REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIWebhookWithTokenMessageQuery,
	type RESTGetAPIWebhookWithTokenMessageResult,
	type RESTGetAPIWebhookResult,
	type RESTPatchAPIWebhookJSONBody,
	type RESTPatchAPIWebhookResult,
	type RESTPatchAPIWebhookWithTokenMessageJSONBody,
	type RESTPatchAPIWebhookWithTokenMessageQuery,
	type RESTPatchAPIWebhookWithTokenMessageResult,
	type RESTPostAPIWebhookWithTokenGitHubQuery,
	type RESTPostAPIWebhookWithTokenJSONBody,
	type RESTPostAPIWebhookWithTokenQuery,
	type RESTPostAPIWebhookWithTokenSlackQuery,
	type RESTPostAPIWebhookWithTokenWaitResult,
	type RESTDeleteAPIWebhookWithTokenMessageQuery,
	type Snowflake,
} from 'discord-api-types/v10';
import type { BaseRequestOptions, BaseRequestOptionsWithReason } from '../util/types.js';

export type CreateWebhookMessageOptions = RESTPostAPIWebhookWithTokenJSONBody &
	RESTPostAPIWebhookWithTokenQuery & { files?: RawFile[] };

export type EditWebhookMessageOptions = RESTPatchAPIWebhookWithTokenMessageJSONBody &
	RESTPatchAPIWebhookWithTokenMessageQuery & {
		files?: RawFile[];
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
		{ token, dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions & { token?: string | undefined } = {},
	) {
		return this.rest.get(Routes.webhook(id, token), {
			dispatcher,
			headers,
			rejectOnRateLimit,
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
		{
			token,
			dispatcher,
			headers,
			reason,
			rejectOnRateLimit,
			signal,
		}: BaseRequestOptionsWithReason & { token?: string | undefined } = {},
	) {
		return this.rest.patch(Routes.webhook(id, token), {
			reason,
			body,
			dispatcher,
			headers,
			rejectOnRateLimit,
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
		{
			token,
			dispatcher,
			headers,
			reason,
			rejectOnRateLimit,
			signal,
		}: BaseRequestOptionsWithReason & { token?: string | undefined } = {},
	) {
		await this.rest.delete(Routes.webhook(id, token), {
			reason,
			dispatcher,
			headers,
			rejectOnRateLimit,
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
		options?: BaseRequestOptions,
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
		options?: BaseRequestOptions,
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
		{ wait, thread_id, with_components, files, ...body }: CreateWebhookMessageOptions,
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		return this.rest.post(Routes.webhook(id, token), {
			query: makeURLSearchParams({ wait, thread_id, with_components }),
			files,
			body,
			auth: false,
			dispatcher,
			headers,
			rejectOnRateLimit,
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
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		await this.rest.post(Routes.webhookPlatform(id, token, 'slack'), {
			query: makeURLSearchParams(query),
			body,
			auth: false,
			dispatcher,
			headers,
			rejectOnRateLimit,
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
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		await this.rest.post(Routes.webhookPlatform(id, token, 'github'), {
			query: makeURLSearchParams(query),
			body,
			dispatcher,
			headers,
			rejectOnRateLimit,
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
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		return this.rest.get(Routes.webhookMessage(id, token, messageId), {
			query: makeURLSearchParams(query),
			auth: false,
			dispatcher,
			headers,
			rejectOnRateLimit,
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
		{ thread_id, with_components, files, ...body }: EditWebhookMessageOptions,
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		return this.rest.patch(Routes.webhookMessage(id, token, messageId), {
			query: makeURLSearchParams({ thread_id, with_components }),
			auth: false,
			body,
			dispatcher,
			headers,
			rejectOnRateLimit,
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
		query: RESTDeleteAPIWebhookWithTokenMessageQuery = {},
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		await this.rest.delete(Routes.webhookMessage(id, token, messageId), {
			query: makeURLSearchParams(query),
			auth: false,
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		});
	}
}
