/* eslint-disable jsdoc/check-param-names */
import { makeURLSearchParams, type RawFile, type REST } from '@discordjs/rest';
import {
	Routes,
	type APIMessage,
	type APIUser,
	type RESTGetAPIChannelMessageReactionUsersQuery,
	type RESTPostAPIChannelMessageJSONBody,
} from 'discord-api-types/v10';

export class MessagesAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Edits a message
	 *
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to edit
	 * @param options - The options to use when editing the message
	 */
	public async edit(
		channelId: string,
		messageId: string,
		{ files, ...body }: RESTPostAPIChannelMessageJSONBody & { files?: RawFile[] },
	) {
		return this.rest.patch(Routes.channelMessage(channelId, messageId), { files, body }) as Promise<APIMessage>;
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
		return this.rest.get(Routes.channelMessageReaction(channelId, messageId, emoji), {
			query: makeURLSearchParams(options as Record<string, unknown>),
		}) as Promise<APIUser[]>;
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
