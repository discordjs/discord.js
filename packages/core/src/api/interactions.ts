import type { RawFile, REST } from '@discordjs/rest';
import type { Snowflake } from 'discord-api-types/v10';
import {
	InteractionResponseType,
	Routes,
	type APICommandAutocompleteInteractionResponseCallbackData,
	type APIInteractionResponseCallbackData,
	type APIModalInteractionResponseCallbackData,
	type RESTGetAPIWebhookWithTokenMessageResult,
} from 'discord-api-types/v10';
import type { WebhooksAPI } from './webhook.js';

export class InteractionsAPI {
	public constructor(private readonly rest: REST, private readonly webhooks: WebhooksAPI) {}

	/**
	 * Replies to an interaction
	 *
	 * @param interactionId - The ID of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param options - The options to use when replying
	 */
	public async reply(
		interactionId: Snowflake,
		interactionToken: string,
		options: APIInteractionResponseCallbackData & { files?: RawFile[] },
	) {
		await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			files: options.files,
			body: {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: options,
			},
		});
	}

	/**
	 * Defers the reply to an interaction
	 *
	 * @param interactionId - The ID of the interaction
	 * @param interactionToken - The token of the interaction
	 */
	public async defer(interactionId: Snowflake, interactionToken: string) {
		await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			body: {
				type: InteractionResponseType.DeferredChannelMessageWithSource,
			},
		});
	}

	/**
	 * Defers an update from a message component interaction
	 *
	 * @param interactionId - The ID of the interaction
	 * @param interactionToken - The token of the interaction
	 */
	public async deferMessageUpdate(interactionId: Snowflake, interactionToken: string) {
		await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			body: {
				type: InteractionResponseType.DeferredMessageUpdate,
			},
		});
	}

	/**
	 * Reply to a deferred interaction
	 *
	 * @param applicationId - The application ID of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param options - The options to use when replying
	 */
	public async followUp(
		applicationId: Snowflake,
		interactionToken: string,
		options: APIInteractionResponseCallbackData & { files?: RawFile[] },
	) {
		await this.webhooks.execute(applicationId, interactionToken, options);
	}

	/**
	 * Edits the initial reply to an interaction
	 *
	 * @param applicationId - The application ID of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param options - The options to use when editing the reply
	 */
	public async editReply(
		applicationId: Snowflake,
		interactionToken: string,
		options: APIInteractionResponseCallbackData & { files?: RawFile[] },
	) {
		return this.webhooks.editMessage(applicationId, interactionToken, '@original', options);
	}

	/**
	 * Fetches the initial reply to an interaction
	 *
	 * @param applicationId - The application ID of the interaction
	 * @param interactionToken - The token of the interaction
	 */
	public async getOriginalReply(applicationId: Snowflake, interactionToken: string) {
		return this.webhooks.getMessage(
			applicationId,
			interactionToken,
			'@original',
		) as Promise<RESTGetAPIWebhookWithTokenMessageResult>;
	}

	/**
	 * Deletes the initial reply to an interaction
	 *
	 * @param applicationId - The application ID of the interaction
	 * @param interactionToken - The token of the interaction
	 */
	public async deleteReply(applicationId: Snowflake, interactionToken: string) {
		await this.webhooks.deleteMessage(applicationId, interactionToken, '@original');
	}

	/**
	 * Updates the the message the component interaction was triggered on
	 *
	 * @param interactionId - The ID of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param options - The options to use when updating the interaction
	 */
	public async updateMessage(
		interactionId: Snowflake,
		interactionToken: string,
		{ files, ...data }: APIInteractionResponseCallbackData & { files?: RawFile[] },
	) {
		await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			files,
			body: {
				type: InteractionResponseType.UpdateMessage,
				data,
			},
		});
	}

	/**
	 * Sends an autocomplete response to an interaction
	 *
	 * @param interactionId - The ID of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param options - Options for the autocomplete response
	 */
	public async createAutocompleteResponse(
		interactionId: Snowflake,
		interactionToken: string,
		options: APICommandAutocompleteInteractionResponseCallbackData,
	) {
		await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			body: {
				type: InteractionResponseType.ApplicationCommandAutocompleteResult,
				data: options,
			},
		});
	}

	/**
	 * Sends a modal response to an interaction
	 *
	 * @param interactionId - The ID of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param modal - The modal to send
	 */
	public async createModal(
		interactionId: Snowflake,
		interactionToken: string,
		modal: APIModalInteractionResponseCallbackData,
	) {
		await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			body: {
				type: InteractionResponseType.Modal,
				data: modal,
			},
		});
	}
}
