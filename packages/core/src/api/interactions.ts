/* eslint-disable jsdoc/check-param-names */
import type { RawFile, REST } from '@discordjs/rest';
import {
	InteractionResponseType,
	Routes,
	type APICommandAutocompleteInteractionResponseCallbackData,
	type APIInteraction,
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
	 * @param interaction - The interaction to reply to
	 * @param options - The options to use when replying
	 */
	public async reply(interaction: APIInteraction, options: APIInteractionResponseCallbackData & { files: RawFile[] }) {
		await this.rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
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
	 * @param interaction - The interaction to defer the reply to
	 */
	public async defer(interaction: APIInteraction) {
		await this.rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
			body: {
				type: InteractionResponseType.DeferredChannelMessageWithSource,
			},
		});
	}

	/**
	 * Defers an update from a message component interaction
	 *
	 * @param interaction - The component interaction to defer the update for
	 */
	public async deferMessageUpdate(interaction: APIInteraction) {
		await this.rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
			body: {
				type: InteractionResponseType.DeferredMessageUpdate,
			},
		});
	}

	/**
	 * Reply to a deferred interaction
	 *
	 * @param interaction - The interaction to reply to
	 * @param options - The options to use when replying
	 */
	public async followUp(
		interaction: APIInteraction,
		options: APIInteractionResponseCallbackData & { files?: RawFile[] },
	) {
		await this.webhooks.execute(interaction.application_id, interaction.token, options);
	}

	/**
	 * Edits the initial reply to an interaction
	 *
	 * @param interaction - The interaction to edit the reply to
	 * @param options - The options to use when editing the reply
	 */
	public async editReply(
		interaction: APIInteraction,
		options: APIInteractionResponseCallbackData & { files?: RawFile[] },
	) {
		return this.webhooks.editMessage(interaction.application_id, interaction.token, '@original', options);
	}

	/**
	 * Fetches the initial reply to an interaction
	 *
	 * @param interaction - The interaction to fetch the reply from
	 */
	public async getOriginalReply(interaction: APIInteraction) {
		return this.webhooks.getMessage(
			interaction.application_id,
			interaction.token,
			'@original',
		) as Promise<RESTGetAPIWebhookWithTokenMessageResult>;
	}

	/**
	 * Deletes the initial reply to an interaction
	 *
	 * @param interaction - The interaction to delete the reply from
	 */
	public async deleteReply(interaction: APIInteraction) {
		await this.webhooks.deleteMessage(interaction.application_id, interaction.token, '@original');
	}

	/**
	 * Updates the the message the component interaction was triggered on
	 *
	 * @param interaction - The interaction to update
	 * @param options - The options to use when updating the interaction
	 */
	public async updateMessage(
		interaction: APIInteraction,
		{ files, ...data }: APIInteractionResponseCallbackData & { files?: RawFile[] },
	) {
		await this.rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
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
	 * @param interaction - The autocomplete interaction to respond to
	 * @param options - Options for the autocomplete response
	 */
	public async sendAutocomplete(
		interaction: APIInteraction,
		options: APICommandAutocompleteInteractionResponseCallbackData,
	) {
		return this.rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
			body: {
				type: InteractionResponseType.ApplicationCommandAutocompleteResult,
				data: options,
			},
		});
	}

	/**
	 * Sends a modal response to an interaction
	 *
	 * @param interaction - The interaction to respond to
	 * @param modal - The modal to send
	 */
	public async sendModal(interaction: APIInteraction, modal: APIModalInteractionResponseCallbackData) {
		await this.rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
			body: {
				type: InteractionResponseType.Modal,
				data: modal,
			},
		});
	}
}
