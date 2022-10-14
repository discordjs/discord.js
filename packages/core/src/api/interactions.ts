import type { RawFile, REST } from '@discordjs/rest';
import type {
	APIInteraction,
	APIInteractionResponseCallbackData,
	APIMessage,
	APIModalInteractionResponseCallbackData,
} from 'discord-api-types/v10';
import { Routes, InteractionResponseType } from 'discord-api-types/v10';
import type { WebhooksAPI } from './webhook.js';

export class InteractionsAPI {
	private readonly rest: REST;

	private readonly webhooks: WebhooksAPI;

	public constructor(rest: REST, webhooks: WebhooksAPI) {
		this.rest = rest;
		this.webhooks = webhooks;
	}

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
		return (await this.webhooks.editMessage(
			interaction.application_id,
			interaction.token,
			'@original',
			options,
		)) as APIMessage;
	}

	/**
	 * Fetches the initial reply to an interaction
	 *
	 * @param interaction - The interaction to fetch the reply from
	 */
	public async getOriginalMessage(interaction: APIInteraction) {
		return (await this.webhooks.getMessage(interaction.application_id, interaction.token, '@original')) as APIMessage;
	}

	/**
	 * Deletes the initial reply to an interaction
	 *
	 * @param interaction - The interaction to delete the reply from
	 */
	public async deleteMessage(interaction: APIInteraction) {
		await this.webhooks.deleteMessage(interaction.application_id, interaction.token, '@original');
	}

	/**
	 * Updates the initial reply to an interaction
	 *
	 * @param interaction - The interaction to update
	 * @param options - The options to use when updating the interaction
	 */
	public async update(
		interaction: APIInteraction,
		options: APIInteractionResponseCallbackData & { files?: RawFile[] },
	) {
		await this.webhooks.editMessage(interaction.application_id, interaction.token, '@original', options);
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
