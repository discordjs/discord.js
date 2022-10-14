import type { RawFile, REST } from '@discordjs/rest';
import { makeURLSearchParams } from '@discordjs/rest';
import type {
	APIMessage,
	APIUser,
	RESTGetAPIChannelMessageReactionUsersQuery,
	RESTPostAPIChannelMessageJSONBody,
} from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v10';

export class MessagesAPI {
	private readonly rest: REST;

	public constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Sends a message in a channel
	 *
	 * @param channelId - The id of the channel to send the message in
	 * @param message - The options to use when sending the message
	 */
	public async send(channelId: string, message: RESTPostAPIChannelMessageJSONBody & { files?: RawFile[] }) {
		const messageOptions = typeof message === 'string' ? { content: message } : message;

		return (await this.rest.post(Routes.channelMessages(channelId), {
			files: messageOptions.files,
			body: messageOptions,
		})) as APIMessage;
	}

	/**
	 * Edits a message
	 *
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to edit
	 * @param options - The options to use when editing the message
	 * @returns
	 */
	public async edit(channelId: string, messageId: string, options: RESTPostAPIChannelMessageJSONBody | string) {
		const messageOptions = typeof options === 'string' ? { content: options } : options;

		return (await this.rest.patch(Routes.channelMessage(channelId, messageId), {
			body: messageOptions,
		})) as APIMessage;
	}

	/**
	 * Deletes a message
	 *
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete
	 */
	public async delete(channelId: string, messageId: string) {
		return (await this.rest.delete(Routes.channelMessage(channelId, messageId))) as APIMessage;
	}

	/**
	 * Bulk deletes messages
	 *
	 * @param channelId - The id of the channel the messages are in
	 * @param messageIds - The ids of the messages to delete
	 */
	public async bulkDelete(channelId: string, messageIds: string[]): Promise<void> {
		await this.rest.post(Routes.channelBulkDelete(channelId), {
			body: {
				messages: messageIds,
			},
		});
	}

	/**
	 * Replies to a message
	 *
	 * @param channelId - The id of the channel the message is in
	 * @param messageRef - The message to reply to
	 * @param options - The options to use when replying to the message
	 */
	public async reply(channelId: string, messageRef: APIMessage, options: RESTPostAPIChannelMessageJSONBody | string) {
		const messageOptions = typeof options === 'string' ? { content: options } : options;

		return (await this.rest.post(Routes.channelMessages(channelId), {
			body: {
				message_reference: {
					message_id: messageRef.id,
					channel_id: messageRef.channel_id,
				},
				...messageOptions,
			},
		})) as APIMessage;
	}

	/**
	 * Fetches a message
	 *
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to fetch
	 */
	public async get(channelId: string, messageId: string) {
		return (await this.rest.get(Routes.channelMessage(channelId, messageId))) as APIMessage;
	}

	/**
	 * Crossposts a message
	 *
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to crosspost
	 */
	public async crosspost(channelId: string, messageId: string) {
		return (await this.rest.post(Routes.channelMessageCrosspost(channelId, messageId))) as APIMessage;
	}

	/**
	 * Fetches the reactions for a message
	 *
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to get the reactions for
	 * @param emoji - The emoji to get the reactions for
	 * @param options - The options to use when fetching the reactions
	 */
	public async getReactions(
		channelId: string,
		messageId: string,
		emoji: string,
		options: RESTGetAPIChannelMessageReactionUsersQuery = {},
	) {
		return (await this.rest.get(Routes.channelMessageReaction(channelId, messageId, emoji), {
			query: makeURLSearchParams(options as Record<string, unknown>),
		})) as APIUser[];
	}

	/**
	 * Deletes a reaction for the current user
	 *
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete the reaction for
	 * @param emoji - The emoji to delete the reaction for
	 */
	public async deleteOwnReaction(channelId: string, messageId: string, emoji: string) {
		await this.rest.delete(Routes.channelMessageOwnReaction(channelId, messageId, emoji));
	}

	/**
	 * Deletes a reaction for a user
	 *
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete the reaction for
	 * @param emoji - The emoji to delete the reaction for
	 * @param userID - The id of the user to delete the reaction for
	 */
	public async deleteUserReaction(channelId: string, messageId: string, emoji: string, userID: string) {
		await this.rest.delete(Routes.channelMessageUserReaction(channelId, messageId, emoji, userID));
	}

	/**
	 * Deletes all reactions for a message
	 *
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete the reactions for
	 */
	public async deleteAllReactions(channelId: string, messageId: string) {
		await this.rest.delete(Routes.channelMessageAllReactions(channelId, messageId));
	}

	/**
	 * Deletes all reactions of an emoji for a message
	 *
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete the reactions for
	 * @param emoji - The emoji to delete the reactions for
	 */
	public async deleteAllReactionsForEmoji(channelId: string, messageId: string, emoji: string) {
		await this.rest.delete(Routes.channelMessageReaction(channelId, messageId, emoji));
	}

	/**
	 * Adds a reaction to a message
	 *
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to add the reaction to
	 * @param emoji - The emoji to add the reaction with
	 */
	public async addReaction(channelId: string, messageId: string, emoji: string) {
		await this.rest.put(Routes.channelMessageOwnReaction(channelId, messageId, emoji));
	}
}
