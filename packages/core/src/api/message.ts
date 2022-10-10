import type { REST } from '@discordjs/rest';
import { makeURLSearchParams } from '@discordjs/rest';
import type {
	APIMessage,
	APIUser,
	RESTGetAPIChannelMessageReactionUsersQuery,
	RESTPostAPIChannelMessageJSONBody,
} from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v10';

export const messages = (rest: REST) => ({
	async send(channelId: string, options: RESTPostAPIChannelMessageJSONBody | string) {
		const messageOptions = typeof options === 'string' ? { content: options } : options;

		return (await rest.post(Routes.channelMessages(channelId), {
			body: {
				...messageOptions,
			},
		})) as APIMessage;
	},

	async edit(channelId: string, messageId: string, options: RESTPostAPIChannelMessageJSONBody | string) {
		const messageOptions = typeof options === 'string' ? { content: options } : options;

		return (await rest.patch(Routes.channelMessage(channelId, messageId), {
			body: {
				...messageOptions,
			},
		})) as APIMessage;
	},

	async delete(channelId: string, messageId: string) {
		return (await rest.delete(Routes.channelMessage(channelId, messageId))) as APIMessage;
	},

	async bulkDelete(channelId: string, messageIds: string[]): Promise<void> {
		await rest.post(Routes.channelBulkDelete(channelId), {
			body: {
				messages: messageIds,
			},
		});
	},

	async reply(channelId: string, messageRef: APIMessage, options: RESTPostAPIChannelMessageJSONBody | string) {
		const messageOptions = typeof options === 'string' ? { content: options } : options;

		return (await rest.post(Routes.channelMessages(channelId), {
			body: {
				message_reference: {
					message_id: messageRef.id,
					channel_id: messageRef.channel_id,
				},
				...messageOptions,
			},
		})) as APIMessage;
	},

	async fetch(channelId: string, messageId: string) {
		return (await rest.get(Routes.channelMessage(channelId, messageId))) as APIMessage;
	},

	async crosspost(channelId: string, messageId: string) {
		return (await rest.post(Routes.channelMessageCrosspost(channelId, messageId))) as APIMessage;
	},

	async getReactions(
		channelId: string,
		messageId: string,
		emoji: string,
		options: RESTGetAPIChannelMessageReactionUsersQuery = {},
	) {
		return (await rest.get(Routes.channelMessageReaction(channelId, messageId, emoji), {
			query: makeURLSearchParams({ ...options }),
		})) as APIUser[];
	},

	async deleteOwnReaction(channelId: string, messageId: string, emoji: string) {
		await rest.delete(Routes.channelMessageOwnReaction(channelId, messageId, emoji));
	},

	async deleteUserReaction(channelId: string, messageId: string, emoji: string, userID: string) {
		await rest.delete(Routes.channelMessageUserReaction(channelId, messageId, emoji, userID));
	},

	async deleteAllReactions(channelId: string, messageId: string) {
		await rest.delete(Routes.channelMessageAllReactions(channelId, messageId));
	},

	async deleteAllReactionsForEmoji(channelId: string, messageId: string, emoji: string) {
		await rest.delete(Routes.channelMessageReaction(channelId, messageId, emoji));
	},

	async addReaction(channelId: string, messageId: string, emoji: string) {
		await rest.put(Routes.channelMessageOwnReaction(channelId, messageId, emoji));
	},
});
