import { makeURLSearchParams, type RawFile, type REST, type RequestData } from '@discordjs/rest';
import {
	Routes,
	type RESTDeleteAPIChannelResult,
	type RESTGetAPIChannelInvitesResult,
	type RESTGetAPIChannelMessageReactionUsersQuery,
	type RESTGetAPIChannelMessageReactionUsersResult,
	type RESTGetAPIChannelMessageResult,
	type RESTGetAPIChannelMessagesQuery,
	type RESTGetAPIChannelMessagesResult,
	type RESTGetAPIChannelPinsResult,
	type RESTGetAPIChannelResult,
	type RESTGetAPIChannelThreadsArchivedQuery,
	type RESTGetAPIChannelUsersThreadsArchivedResult,
	type RESTGetAPIChannelWebhooksResult,
	type RESTPatchAPIChannelJSONBody,
	type RESTPatchAPIChannelMessageResult,
	type RESTPatchAPIChannelResult,
	type RESTPostAPIChannelFollowersResult,
	type RESTPostAPIChannelInviteJSONBody,
	type RESTPostAPIChannelInviteResult,
	type RESTPostAPIChannelMessageCrosspostResult,
	type RESTPostAPIChannelMessageJSONBody,
	type RESTPostAPIChannelMessageResult,
	type Snowflake,
} from 'discord-api-types/v10';

export class ChannelsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Sends a message in a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#create-message}
	 * @param channelId - The id of the channel to send the message in
	 * @param body - The data to use when sending the message
	 * @param options - The options to use when sending the message
	 */
	public async createMessage(
		channelId: Snowflake,
		{ files, ...body }: RESTPostAPIChannelMessageJSONBody & { files?: RawFile[] },
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.post(Routes.channelMessages(channelId), {
			files,
			body,
			signal,
		}) as Promise<RESTPostAPIChannelMessageResult>;
	}

	/**
	 * Edits a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#edit-message}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to edit
	 * @param body - The data to use when editing the message
	 * @param options - The options to use when editing the message
	 */
	public async editMessage(
		channelId: Snowflake,
		messageId: Snowflake,
		{ files, ...body }: RESTPostAPIChannelMessageJSONBody & { files?: RawFile[] },
		{ signal }: Pick<RequestData, 'signal'>,
	) {
		return this.rest.patch(Routes.channelMessage(channelId, messageId), {
			files,
			body,
			signal,
		}) as Promise<RESTPatchAPIChannelMessageResult>;
	}

	/**
	 * Fetches the reactions for a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#get-reactions}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to get the reactions for
	 * @param emoji - The emoji to get the reactions for
	 * @param query - The query options to use when fetching the reactions
	 * @param options - The options for fetching the message reactions
	 */
	public async getMessageReactions(
		channelId: Snowflake,
		messageId: Snowflake,
		emoji: string,
		query: RESTGetAPIChannelMessageReactionUsersQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.channelMessageReaction(channelId, messageId, encodeURIComponent(emoji)), {
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIChannelMessageReactionUsersResult>;
	}

	/**
	 * Deletes a reaction for the current user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#delete-own-reaction}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete the reaction for
	 * @param emoji - The emoji to delete the reaction for
	 * @param options - The options for deleting the reaction
	 */
	public async deleteOwnMessageReaction(
		channelId: Snowflake,
		messageId: Snowflake,
		emoji: string,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		await this.rest.delete(Routes.channelMessageOwnReaction(channelId, messageId, encodeURIComponent(emoji)), {
			signal,
		});
	}

	/**
	 * Deletes a reaction for a user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#delete-user-reaction}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete the reaction for
	 * @param emoji - The emoji to delete the reaction for
	 * @param userId - The id of the user to delete the reaction for
	 * @param options - The options for deleting the reaction
	 */
	public async deleteUserMessageReaction(
		channelId: Snowflake,
		messageId: Snowflake,
		emoji: string,
		userId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		await this.rest.delete(Routes.channelMessageUserReaction(channelId, messageId, encodeURIComponent(emoji), userId), {
			signal,
		});
	}

	/**
	 * Deletes all reactions for a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#delete-all-reactions}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete the reactions for
	 * @param options - The options for deleting the reactions
	 */
	public async deleteAllMessageReactions(
		channelId: Snowflake,
		messageId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		await this.rest.delete(Routes.channelMessageAllReactions(channelId, messageId), { signal });
	}

	/**
	 * Deletes all reactions of an emoji for a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#delete-all-reactions-for-emoji}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete the reactions for
	 * @param emoji - The emoji to delete the reactions for
	 * @param options - The options for deleting the reactions
	 */
	public async deleteAllMessageReactionsForEmoji(
		channelId: Snowflake,
		messageId: Snowflake,
		emoji: string,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		await this.rest.delete(Routes.channelMessageReaction(channelId, messageId, encodeURIComponent(emoji)), { signal });
	}

	/**
	 * Adds a reaction to a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#create-reaction}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to add the reaction to
	 * @param emoji - The emoji to add the reaction with
	 * @param options - The options for adding the reaction
	 */
	public async addMessageReaction(
		channelId: Snowflake,
		messageId: Snowflake,
		emoji: string,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		await this.rest.put(Routes.channelMessageOwnReaction(channelId, messageId, encodeURIComponent(emoji)), { signal });
	}

	/**
	 * Fetches a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#get-channel}
	 * @param channelId - The id of the channel
	 * @param options - The options for fetching the channel
	 */
	public async get(channelId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.channel(channelId), { signal }) as Promise<RESTGetAPIChannelResult>;
	}

	/**
	 * Edits a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#modify-channel}
	 * @param channelId - The id of the channel to edit
	 * @param body - The new channel data
	 * @param options - The options for editing the channel
	 */
	public async edit(
		channelId: Snowflake,
		body: RESTPatchAPIChannelJSONBody,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.patch(Routes.channel(channelId), { body, signal }) as Promise<RESTPatchAPIChannelResult>;
	}

	/**
	 * Deletes a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#deleteclose-channel}
	 * @param channelId - The id of the channel to delete
	 * @param options - The options for deleting the channel
	 */
	public async delete(channelId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.delete(Routes.channel(channelId), { signal }) as Promise<RESTDeleteAPIChannelResult>;
	}

	/**
	 * Fetches the messages of a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#get-channel-messages}
	 * @param channelId - The id of the channel to fetch messages from
	 * @param query - The query options to use when fetching messages
	 * @param options - The options for fetching the messages
	 */
	public async getMessages(
		channelId: Snowflake,
		query: RESTGetAPIChannelMessagesQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.channelMessages(channelId), {
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIChannelMessagesResult>;
	}

	/**
	 * Shows a typing indicator in a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#trigger-typing-indicator}
	 * @param channelId - The id of the channel to show the typing indicator in
	 * @param options - The options for showing the typing indicator
	 */
	public async showTyping(channelId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		await this.rest.post(Routes.channelTyping(channelId), { signal });
	}

	/**
	 * Fetches the pinned messages of a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#get-pinned-messages}
	 * @param channelId - The id of the channel to fetch pinned messages from
	 * @param options - The options for fetching the pinned messages
	 */
	public async getPins(channelId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.channelPins(channelId), { signal }) as Promise<RESTGetAPIChannelPinsResult>;
	}

	/**
	 * Pins a message in a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#pin-message}
	 * @param channelId - The id of the channel to pin the message in
	 * @param messageId - The id of the message to pin
	 * @param options - The options for pinning the message
	 */
	public async pinMessage(
		channelId: Snowflake,
		messageId: Snowflake,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.put(Routes.channelPin(channelId, messageId), { reason, signal });
	}

	/**
	 * Deletes a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#delete-message}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete
	 * @param options - The options for deleting the message
	 */
	public async deleteMessage(
		channelId: Snowflake,
		messageId: Snowflake,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.channelMessage(channelId, messageId), { reason, signal });
	}

	/**
	 * Bulk deletes messages
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#bulk-delete-messages}
	 * @param channelId - The id of the channel the messages are in
	 * @param messageIds - The ids of the messages to delete
	 * @param options - The options for deleting the messages
	 */
	public async bulkDeleteMessages(
		channelId: Snowflake,
		messageIds: Snowflake[],
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	): Promise<void> {
		await this.rest.post(Routes.channelBulkDelete(channelId), { reason, body: { messages: messageIds }, signal });
	}

	/**
	 * Fetches a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#get-channel-message}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to fetch
	 * @param options - The options for fetching the message
	 */
	public async getMessage(channelId: Snowflake, messageId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.channelMessage(channelId, messageId), {
			signal,
		}) as Promise<RESTGetAPIChannelMessageResult>;
	}

	/**
	 * Crossposts a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#crosspost-message}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to crosspost
	 * @param options - The options for crossposting the message
	 */
	public async crosspostMessage(
		channelId: Snowflake,
		messageId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.post(Routes.channelMessageCrosspost(channelId, messageId), {
			signal,
		}) as Promise<RESTPostAPIChannelMessageCrosspostResult>;
	}

	/**
	 * Unpins a message in a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#unpin-message}
	 * @param channelId - The id of the channel to unpin the message in
	 * @param messageId - The id of the message to unpin
	 * @param options - The options for unpinning the message
	 */
	public async unpinMessage(
		channelId: Snowflake,
		messageId: Snowflake,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.channelPin(channelId, messageId), { reason, signal });
	}

	/**
	 * Follows an announcement channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#follow-announcement-channel}
	 * @param channelId - The id of the announcement channel to follow
	 * @param webhookChannelId - The id of the webhook channel to follow the announcements in
	 * @param options - The options for following the announcement channel
	 */
	public async followAnnouncements(
		channelId: Snowflake,
		webhookChannelId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.post(Routes.channelFollowers(channelId), {
			body: { webhook_channel_id: webhookChannelId },
			signal,
		}) as Promise<RESTPostAPIChannelFollowersResult>;
	}

	/**
	 * Creates a new invite for a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#create-channel-invite}
	 * @param channelId - The id of the channel to create an invite for
	 * @param body - The data to use when creating the invite
	 * @param options - The options for creating the invite
	 */
	public async createInvite(
		channelId: Snowflake,
		body: RESTPostAPIChannelInviteJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.channelInvites(channelId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPostAPIChannelInviteResult>;
	}

	/**
	 * Fetches the invites of a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#get-channel-invites}
	 * @param channelId - The id of the channel to fetch invites from
	 * @param options - The options for fetching the invites
	 */
	public async getInvites(channelId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.channelInvites(channelId), { signal }) as Promise<RESTGetAPIChannelInvitesResult>;
	}

	/**
	 * Fetches the archived threads of a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#list-public-archived-threads}
	 * @see {@link https://discord.com/developers/docs/resources/channel#list-private-archived-threads}
	 * @param channelId - The id of the channel to fetch archived threads from
	 * @param archivedStatus - The archived status of the threads to fetch
	 * @param query - The options to use when fetching archived threads
	 * @param options - The options for fetching archived threads
	 */
	public async getArchivedThreads(
		channelId: Snowflake,
		archivedStatus: 'private' | 'public',
		query: RESTGetAPIChannelThreadsArchivedQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.channelThreads(channelId, archivedStatus), {
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIChannelUsersThreadsArchivedResult>;
	}

	/**
	 * Fetches the private joined archived threads of a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#list-joined-private-archived-threads}
	 * @param channelId - The id of the channel to fetch joined archived threads from
	 * @param query - The options to use when fetching joined archived threads
	 * @param options - The options for fetching joined archived threads
	 */
	public async getJoinedPrivateArchivedThreads(
		channelId: Snowflake,
		query: RESTGetAPIChannelThreadsArchivedQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.channelJoinedArchivedThreads(channelId), {
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIChannelUsersThreadsArchivedResult>;
	}

	/**
	 * Fetches the webhooks of a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#get-channel-webhooks}
	 * @param id - The id of the channel
	 */
	public async getWebhooks(id: Snowflake) {
		return this.rest.get(Routes.channelWebhooks(id)) as Promise<RESTGetAPIChannelWebhooksResult>;
	}
}
