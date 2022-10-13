import type { REST } from '@discordjs/rest';
import type {
	APIInteraction,
	APIInteractionResponseCallbackData,
	APIMessage,
	APIModalInteractionResponseCallbackData,
} from 'discord-api-types/v10';
import { Routes, InteractionResponseType } from 'discord-api-types/v10';

export class InteractionsAPI {
	private readonly rest: REST;

	public constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Replies to an interaction
	 *
	 * @param interaction - The interaction to reply to
	 * @param options - The options to use when replying
	 */
	public async reply(interaction: APIInteraction, options: APIInteractionResponseCallbackData | string) {
		const interactionResponse = typeof options === 'string' ? { content: options } : options;

		await this.rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
			body: {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: interactionResponse,
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
	public async followUp(interaction: APIInteraction, options: APIInteractionResponseCallbackData | string) {
		const interactionResponse = typeof options === 'string' ? { content: options } : options;
		await this.rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
			body: interactionResponse,
		});
	}

	/**
	 * Edits the initial reply to an interaction
	 *
	 * @param interaction - The interaction to edit the reply to
	 * @param options - The options to use when editing the reply
	 */
	public async edit(interaction: APIInteraction, options: APIInteractionResponseCallbackData | string) {
		const interactionResponse = typeof options === 'string' ? { content: options } : options;
		await this.rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token, '@original'), {
			body: interactionResponse,
		});
	}

	/**
	 * Fetches the initial reply to an interaction
	 *
	 * @param interaction - The interaction to fetch the reply from
	 */
	public async getOriginalMessage(interaction: APIInteraction) {
		return (await this.rest.get(
			Routes.webhookMessage(interaction.application_id, interaction.token, '@original'),
		)) as APIMessage;
	}

	/**
	 * Deletes the initial reply to an interaction
	 *
	 * @param interaction - The interaction to delete the reply from
	 */
	public async deleteMessage(interaction: APIInteraction) {
		await this.rest.delete(Routes.webhookMessage(interaction.application_id, interaction.token, '@original'));
	}

	/**
	 * Updates the initial reply to an interaction
	 *
	 * @param interaction - The interaction to update
	 * @param options - The options to use when updating the interaction
	 */
	public async update(interaction: APIInteraction, options: APIInteractionResponseCallbackData | string) {
		const interactionResponse = typeof options === 'string' ? { content: options } : options;
		await this.rest.patch(Routes.interactionCallback(interaction.id, interaction.token), {
			body: {
				type: InteractionResponseType.UpdateMessage,
				data: interactionResponse,
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
