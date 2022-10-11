import type { REST } from '@discordjs/rest';
import type {
	APIInteraction,
	APIInteractionResponseCallbackData,
	APIMessage,
	APIModalInteractionResponseCallbackData,
} from 'discord-api-types/v10';
import { Routes, InteractionResponseType } from 'discord-api-types/v10';

export const interactions = (api: REST) => ({
	async reply(interaction: APIInteraction, content: APIInteractionResponseCallbackData | string) {
		const interactionResponse = typeof content === 'string' ? { content } : content;

		await api.post(Routes.interactionCallback(interaction.id, interaction.token), {
			body: {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: interactionResponse,
			},
		});
	},

	async defer(interaction: APIInteraction) {
		await api.post(Routes.interactionCallback(interaction.id, interaction.token), {
			body: {
				type: InteractionResponseType.DeferredChannelMessageWithSource,
			},
		});
	},

	async followUp(interaction: APIInteraction, options: APIInteractionResponseCallbackData | string) {
		const interactionResponse = typeof options === 'string' ? { content: options } : options;
		await api.post(Routes.interactionCallback(interaction.id, interaction.token), {
			body: interactionResponse,
		});
	},

	async edit(interaction: APIInteraction, content: APIInteractionResponseCallbackData | string) {
		const interactionResponse = typeof content === 'string' ? { content } : content;
		await api.patch(Routes.webhookMessage(interaction.application_id, interaction.token, '@original'), {
			body: interactionResponse,
		});
	},

	async fetchOriginalMessage(interaction: APIInteraction) {
		return (await api.get(
			Routes.webhookMessage(interaction.application_id, interaction.token, '@original'),
		)) as APIMessage;
	},

	async deleteMessage(interaction: APIInteraction) {
		await api.delete(Routes.webhookMessage(interaction.application_id, interaction.token, '@original'));
	},

	async update(interaction: APIInteraction, content: APIInteractionResponseCallbackData | string) {
		const interactionResponse = typeof content === 'string' ? { content } : content;
		await api.patch(Routes.interactionCallback(interaction.id, interaction.token), {
			body: {
				type: InteractionResponseType.UpdateMessage,
				data: interactionResponse,
			},
		});
	},

	async sendModal(interaction: APIInteraction, modal: APIModalInteractionResponseCallbackData) {
		await api.post(Routes.interactionCallback(interaction.id, interaction.token), {
			body: {
				type: InteractionResponseType.Modal,
				data: modal,
			},
		});
	},
});
