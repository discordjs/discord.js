/* eslint-disable jsdoc/check-param-names */

import { makeURLSearchParams, type RawFile, type REST } from '@discordjs/rest';
import {
	InteractionResponseType,
	Routes,
	type APICommandAutocompleteInteractionResponseCallbackData,
	type APIInteractionResponseCallbackData,
	type APIInteractionResponseDeferredChannelMessageWithSource,
	type APIModalInteractionResponseCallbackData,
	type RESTGetAPIWebhookWithTokenMessageResult,
	type RESTPostAPIInteractionCallbackQuery,
	type RESTPostAPIInteractionCallbackWithResponseResult,
	type Snowflake,
} from 'discord-api-types/v10';
import type { BaseRequestOptions } from '../util/types.js';
import type { WebhooksAPI } from './webhook.js';

export interface CreateInteractionResponseOptions
	extends APIInteractionResponseCallbackData, RESTPostAPIInteractionCallbackQuery {
	files?: RawFile[];
}

export type CreateInteractionDeferResponseOptions = APIInteractionResponseDeferredChannelMessageWithSource['data'] &
	RESTPostAPIInteractionCallbackQuery;

export type CreateInteractionFollowUpResponseOptions = APIInteractionResponseCallbackData & { files?: RawFile[] };
export type EditInteractionResponseOptions = APIInteractionResponseCallbackData & { files?: RawFile[] };

export type CreateInteractionUpdateMessageResponseOptions = APIInteractionResponseCallbackData &
	RESTPostAPIInteractionCallbackQuery & { files?: RawFile[] };

export type CreateAutocompleteResponseOptions = APICommandAutocompleteInteractionResponseCallbackData &
	RESTPostAPIInteractionCallbackQuery;

export type CreateModalResponseOptions = APIModalInteractionResponseCallbackData & RESTPostAPIInteractionCallbackQuery;

export class InteractionsAPI {
	public constructor(
		private readonly rest: REST,
		private readonly webhooks: WebhooksAPI,
	) {}

	/**
	 * Replies to an interaction and returns an interaction callback object
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param body - The callback data for replying
	 * @param options - The options for replying
	 */
	public async reply(
		interactionId: Snowflake,
		interactionToken: string,
		body: CreateInteractionResponseOptions & { with_response: true },
		options?: BaseRequestOptions,
	): Promise<RESTPostAPIInteractionCallbackWithResponseResult>;

	/**
	 * Replies to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param body - The callback data for replying
	 * @param options - The options for replying
	 */
	public async reply(
		interactionId: Snowflake,
		interactionToken: string,
		body: CreateInteractionResponseOptions & { with_response?: false },
		options?: BaseRequestOptions,
	): Promise<undefined>;

	/**
	 * Replies to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param body - The callback data for replying
	 * @param options - The options for replying
	 */
	public async reply(
		interactionId: Snowflake,
		interactionToken: string,
		body: CreateInteractionResponseOptions,
		options?: BaseRequestOptions,
	): Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>;

	public async reply(
		interactionId: Snowflake,
		interactionToken: string,
		{ files, with_response, ...data }: CreateInteractionResponseOptions,
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		const response = await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			query: makeURLSearchParams({ with_response }),
			files,
			auth: false,
			body: {
				type: InteractionResponseType.ChannelMessageWithSource,
				data,
			},
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		});

		return with_response ? response : undefined;
	}

	/**
	 * Defers the reply to an interaction and returns an interaction callback object
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param body - The callback data for deferring the reply
	 * @param options - The options for deferring
	 */
	public async defer(
		interactionId: Snowflake,
		interactionToken: string,
		body: CreateInteractionDeferResponseOptions & { with_response: true },
		options?: BaseRequestOptions,
	): Promise<RESTPostAPIInteractionCallbackWithResponseResult>;

	/**
	 * Defers the reply to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param body - The callback data for deferring the reply
	 * @param options - The options for deferring
	 */
	public async defer(
		interactionId: Snowflake,
		interactionToken: string,
		body?: CreateInteractionDeferResponseOptions & { with_response?: false },
		options?: BaseRequestOptions,
	): Promise<undefined>;

	/**
	 * Defers the reply to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param body - The callback data for deferring the reply
	 * @param options - The options for deferring
	 */
	public async defer(
		interactionId: Snowflake,
		interactionToken: string,
		body?: CreateInteractionDeferResponseOptions,
		options?: BaseRequestOptions,
	): Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>;

	public async defer(
		interactionId: Snowflake,
		interactionToken: string,
		{ with_response, ...data }: CreateInteractionDeferResponseOptions = {},
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		const response = await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			query: makeURLSearchParams({ with_response }),
			auth: false,
			body: {
				type: InteractionResponseType.DeferredChannelMessageWithSource,
				data,
			},
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		});

		return with_response ? response : undefined;
	}

	/**
	 * Defers an update from a message component interaction and returns an interaction callback object
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param body - The callback data for deferring the update
	 * @param options - The options for deferring
	 */
	public async deferMessageUpdate(
		interactionId: Snowflake,
		interactionToken: string,
		body: RESTPostAPIInteractionCallbackQuery & { with_response: true },
		options?: BaseRequestOptions,
	): Promise<RESTPostAPIInteractionCallbackWithResponseResult>;

	/**
	 * Defers an update from a message component interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param body - The callback data for deferring the update
	 * @param options - The options for deferring
	 */
	public async deferMessageUpdate(
		interactionId: Snowflake,
		interactionToken: string,
		body?: RESTPostAPIInteractionCallbackQuery & { with_response?: false },
		options?: BaseRequestOptions,
	): Promise<undefined>;

	/**
	 * Defers an update from a message component interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param body - The callback data for deferring the update
	 * @param options - The options for deferring
	 */
	public async deferMessageUpdate(
		interactionId: Snowflake,
		interactionToken: string,
		body?: RESTPostAPIInteractionCallbackQuery,
		options?: BaseRequestOptions,
	): Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>;

	public async deferMessageUpdate(
		interactionId: Snowflake,
		interactionToken: string,
		{ with_response }: RESTPostAPIInteractionCallbackQuery = {},
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		const response = await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			query: makeURLSearchParams({ with_response }),
			auth: false,
			body: {
				type: InteractionResponseType.DeferredMessageUpdate,
			},
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		});

		return with_response ? response : undefined;
	}

	/**
	 * Reply to a deferred interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message}
	 * @param applicationId - The application id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param body - The callback data for replying
	 * @param options - The options for replying
	 */
	public async followUp(
		applicationId: Snowflake,
		interactionToken: string,
		body: CreateInteractionFollowUpResponseOptions,
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		return this.webhooks.execute(
			applicationId,
			interactionToken,
			{ ...body, wait: true },
			{ dispatcher, headers, rejectOnRateLimit, signal },
		);
	}

	/**
	 * Edits the initial reply to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response}
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#edit-followup-message}
	 * @param applicationId - The application id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param callbackData - The callback data for editing the reply
	 * @param messageId - The id of the message to edit. If omitted, the original reply will be edited
	 * @param options - The options for editing the reply
	 */
	public async editReply(
		applicationId: Snowflake,
		interactionToken: string,
		callbackData: EditInteractionResponseOptions,
		messageId?: Snowflake | '@original',
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		return this.webhooks.editMessage(applicationId, interactionToken, messageId ?? '@original', callbackData, {
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		});
	}

	/**
	 * Fetches the initial reply to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response}
	 * @param applicationId - The application id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param options - The options for fetching the reply
	 */
	public async getOriginalReply(
		applicationId: Snowflake,
		interactionToken: string,
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		return this.webhooks.getMessage(
			applicationId,
			interactionToken,
			'@original',
			{},
			{ dispatcher, headers, rejectOnRateLimit, signal },
		) as Promise<RESTGetAPIWebhookWithTokenMessageResult>;
	}

	/**
	 * Deletes the initial reply to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#delete-original-interaction-response}
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#delete-followup-message}
	 * @param applicationId - The application id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param messageId - The id of the message to delete. If omitted, the original reply will be deleted
	 * @param options - The options for deleting the reply
	 */
	public async deleteReply(
		applicationId: Snowflake,
		interactionToken: string,
		messageId?: Snowflake | '@original',
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		await this.webhooks.deleteMessage(
			applicationId,
			interactionToken,
			messageId ?? '@original',
			{},
			{ dispatcher, headers, rejectOnRateLimit, signal },
		);
	}

	/**
	 * Updates the message the component interaction was triggered on and returns an interaction callback object
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param callbackData - The callback data for updating the interaction
	 * @param options - The options for updating the interaction
	 */
	public async updateMessage(
		interactionId: Snowflake,
		interactionToken: string,
		callbackData: CreateInteractionUpdateMessageResponseOptions & { with_response: true },
		options?: BaseRequestOptions,
	): Promise<RESTPostAPIInteractionCallbackWithResponseResult>;

	/**
	 * Updates the message the component interaction was triggered on
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param callbackData - The callback data for updating the interaction
	 * @param options - The options for updating the interaction
	 */
	public async updateMessage(
		interactionId: Snowflake,
		interactionToken: string,
		callbackData: CreateInteractionUpdateMessageResponseOptions & { with_response?: false },
		options?: BaseRequestOptions,
	): Promise<undefined>;

	/**
	 * Updates the message the component interaction was triggered on
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param callbackData - The callback data for updating the interaction
	 * @param options - The options for updating the interaction
	 */
	public async updateMessage(
		interactionId: Snowflake,
		interactionToken: string,
		callbackData: CreateInteractionUpdateMessageResponseOptions,
		options?: BaseRequestOptions,
	): Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>;

	public async updateMessage(
		interactionId: Snowflake,
		interactionToken: string,
		{ files, with_response, ...data }: CreateInteractionUpdateMessageResponseOptions,
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		const response = await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			query: makeURLSearchParams({ with_response }),
			files,
			auth: false,
			body: {
				type: InteractionResponseType.UpdateMessage,
				data,
			},
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		});

		return with_response ? response : undefined;
	}

	/**
	 * Sends an autocomplete response to an interaction and returns an interaction callback object
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param callbackData - The callback data for the autocomplete response
	 * @param options - The options for sending the autocomplete response
	 */
	public async createAutocompleteResponse(
		interactionId: Snowflake,
		interactionToken: string,
		callbackData: CreateAutocompleteResponseOptions & { with_response: true },
		options?: BaseRequestOptions,
	): Promise<RESTPostAPIInteractionCallbackWithResponseResult>;

	/**
	 * Sends an autocomplete response to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param callbackData - The callback data for the autocomplete response
	 * @param options - The options for sending the autocomplete response
	 */
	public async createAutocompleteResponse(
		interactionId: Snowflake,
		interactionToken: string,
		callbackData: CreateAutocompleteResponseOptions & { with_response?: false },
		options?: BaseRequestOptions,
	): Promise<undefined>;

	/**
	 * Sends an autocomplete response to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param callbackData - The callback data for the autocomplete response
	 * @param options - The options for sending the autocomplete response
	 */
	public async createAutocompleteResponse(
		interactionId: Snowflake,
		interactionToken: string,
		callbackData: CreateAutocompleteResponseOptions,
		options?: BaseRequestOptions,
	): Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>;

	public async createAutocompleteResponse(
		interactionId: Snowflake,
		interactionToken: string,
		{ with_response, ...data }: CreateAutocompleteResponseOptions,
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		const response = await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			query: makeURLSearchParams({ with_response }),
			auth: false,
			body: {
				type: InteractionResponseType.ApplicationCommandAutocompleteResult,
				data,
			},
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		});

		return with_response ? response : undefined;
	}

	/**
	 * Sends a modal response to an interaction and returns an interaction callback object
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param callbackData - The modal callback data to send
	 * @param options - The options for sending the modal
	 */
	public async createModal(
		interactionId: Snowflake,
		interactionToken: string,
		callbackData: CreateModalResponseOptions & { with_response: true },
		options?: BaseRequestOptions,
	): Promise<RESTPostAPIInteractionCallbackWithResponseResult>;

	/**
	 * Sends a modal response to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param callbackData - The modal callback data to send
	 * @param options - The options for sending the modal
	 */
	public async createModal(
		interactionId: Snowflake,
		interactionToken: string,
		callbackData: CreateModalResponseOptions & { with_response?: false },
		options?: BaseRequestOptions,
	): Promise<undefined>;

	/**
	 * Sends a modal response to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param callbackData - The modal callback data to send
	 * @param options - The options for sending the modal
	 */
	public async createModal(
		interactionId: Snowflake,
		interactionToken: string,
		callbackData: CreateModalResponseOptions,
		options?: BaseRequestOptions,
	): Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>;

	public async createModal(
		interactionId: Snowflake,
		interactionToken: string,
		{ with_response, ...data }: CreateModalResponseOptions,
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		const response = await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			query: makeURLSearchParams({ with_response }),
			auth: false,
			body: {
				type: InteractionResponseType.Modal,
				data,
			},
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		});

		return with_response ? response : undefined;
	}

	/**
	 * Launches an activity and returns an interaction callback object
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param body - The callback data for launching the activity
	 * @param options - The options for launching the activity
	 */
	public async launchActivity(
		interactionId: Snowflake,
		interactionToken: string,
		body: RESTPostAPIInteractionCallbackQuery & { with_response: true },
		options?: BaseRequestOptions,
	): Promise<RESTPostAPIInteractionCallbackWithResponseResult>;

	/**
	 * Launches an activity
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param body - The callback data for launching the activity
	 * @param options - The options for launching the activity
	 */
	public async launchActivity(
		interactionId: Snowflake,
		interactionToken: string,
		body?: RESTPostAPIInteractionCallbackQuery & { with_response?: false },
		options?: BaseRequestOptions,
	): Promise<undefined>;

	/**
	 * Launches an activity
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param body - The callback data for launching the activity
	 * @param options - The options for launching the activity
	 */
	public async launchActivity(
		interactionId: Snowflake,
		interactionToken: string,
		body?: RESTPostAPIInteractionCallbackQuery,
		options?: BaseRequestOptions,
	): Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>;

	public async launchActivity(
		interactionId: Snowflake,
		interactionToken: string,
		{ with_response }: RESTPostAPIInteractionCallbackQuery = {},
		{ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {},
	) {
		const response = await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			query: makeURLSearchParams({ with_response }),
			auth: false,
			body: {
				type: InteractionResponseType.LaunchActivity,
			},
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		});

		return with_response ? response : undefined;
	}
}
