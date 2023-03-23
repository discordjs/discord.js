import type { RawFile, REST } from '@discordjs/rest';
import { InteractionResponseType, Routes } from 'discord-api-types/v10';
import type {
	Snowflake,
	APICommandAutocompleteInteractionResponseCallbackData,
	APIInteractionResponseCallbackData,
	APIModalInteractionResponseCallbackData,
	RESTGetAPIWebhookWithTokenMessageResult,
} from 'discord-api-types/v10';
import type { WebhooksAPI } from './webhook.js';

export class InteractionsAPI {
	public constructor(private readonly rest: REST, private readonly webhooks: WebhooksAPI) {}

	/**
	 * Replies to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param data - The data to use when replying
	 */
	public async reply(
		interactionId: Snowflake,
		interactionToken: string,
		{ files, ...data }: APIInteractionResponseCallbackData & { files?: RawFile[] },
	) {
		await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			files,
			auth: false,
			body: {
				type: InteractionResponseType.ChannelMessageWithSource,
				data,
			},
		});
	}

	/**
	 * Defers the reply to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 */
	public async defer(interactionId: Snowflake, interactionToken: string) {
		await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			auth: false,
			body: {
				type: InteractionResponseType.DeferredChannelMessageWithSource,
			},
		});
	}

	/**
	 * Defers an update from a message component interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 */
	public async deferMessageUpdate(interactionId: Snowflake, interactionToken: string) {
		await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			auth: false,
			body: {
				type: InteractionResponseType.DeferredMessageUpdate,
			},
		});
	}

	/**
	 * Reply to a deferred interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message}
	 * @param applicationId - The application id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param data - The data to use when replying
	 */
	public async followUp(
		applicationId: Snowflake,
		interactionToken: string,
		data: APIInteractionResponseCallbackData & { files?: RawFile[] },
	) {
		await this.webhooks.execute(applicationId, interactionToken, data);
	}

	/**
	 * Edits the initial reply to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response}
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#edit-followup-message}
	 * @param applicationId - The application id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param data - The data to use when editing the reply
	 * @param messageId - The id of the message to edit. If omitted, the original reply will be edited
	 */
	public async editReply(
		applicationId: Snowflake,
		interactionToken: string,
		data: APIInteractionResponseCallbackData & { files?: RawFile[] },
		messageId?: Snowflake | '@original',
	) {
		return this.webhooks.editMessage(applicationId, interactionToken, messageId ?? '@original', data);
	}

	/**
	 * Fetches the initial reply to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response}
	 * @param applicationId - The application id of the interaction
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
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#delete-original-interaction-response}
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#delete-followup-message}
	 * @param applicationId - The application id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param messageId - The id of the message to delete. If omitted, the original reply will be deleted
	 */
	public async deleteReply(applicationId: Snowflake, interactionToken: string, messageId?: Snowflake | '@original') {
		await this.webhooks.deleteMessage(applicationId, interactionToken, messageId ?? '@original');
	}

	/**
	 * Updates the the message the component interaction was triggered on
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param data - The data to use when updating the interaction
	 */
	public async updateMessage(
		interactionId: Snowflake,
		interactionToken: string,
		{ files, ...data }: APIInteractionResponseCallbackData & { files?: RawFile[] },
	) {
		await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			files,
			auth: false,
			body: {
				type: InteractionResponseType.UpdateMessage,
				data,
			},
		});
	}

	/**
	 * Sends an autocomplete response to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param data - Data for the autocomplete response
	 */
	public async createAutocompleteResponse(
		interactionId: Snowflake,
		interactionToken: string,
		data: APICommandAutocompleteInteractionResponseCallbackData,
	) {
		await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			auth: false,
			body: {
				type: InteractionResponseType.ApplicationCommandAutocompleteResult,
				data,
			},
		});
	}

	/**
	 * Sends a modal response to an interaction
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response}
	 * @param interactionId - The id of the interaction
	 * @param interactionToken - The token of the interaction
	 * @param data - The modal to send
	 */
	public async createModal(
		interactionId: Snowflake,
		interactionToken: string,
		data: APIModalInteractionResponseCallbackData,
	) {
		await this.rest.post(Routes.interactionCallback(interactionId, interactionToken), {
			auth: false,
			body: {
				type: InteractionResponseType.Modal,
				data,
			},
		});
	}
}
