/* eslint-disable jsdoc/check-param-names */

import { makeURLSearchParams, type RawFile, type REST, type RequestData } from '@discordjs/rest';
import {
	Routes,
	type RESTPostAPIChannelWebhookJSONBody,
	type RESTPostAPIChannelWebhookResult,
	type RESTDeleteAPIChannelResult,
	type RESTGetAPIChannelInvitesResult,
	type RESTGetAPIChannelMessageReactionUsersQuery,
	type RESTGetAPIChannelMessageReactionUsersResult,
	type RESTGetAPIChannelMessageResult,
	type RESTGetAPIChannelMessagesPinsQuery,
	type RESTGetAPIChannelMessagesPinsResult,
	type RESTGetAPIChannelMessagesQuery,
	type RESTGetAPIChannelMessagesResult,
	type RESTGetAPIChannelResult,
	type RESTGetAPIChannelThreadsArchivedQuery,
	type RESTGetAPIChannelUsersThreadsArchivedResult,
	type RESTGetAPIChannelWebhooksResult,
	type RESTPatchAPIChannelMessageJSONBody,
	type RESTPatchAPIChannelJSONBody,
	type RESTPatchAPIChannelMessageResult,
	type RESTPatchAPIChannelResult,
	type RESTPostAPIChannelFollowersResult,
	type RESTPostAPIChannelInviteJSONBody,
	type RESTPostAPIChannelInviteResult,
	type RESTPostAPIChannelMessageCrosspostResult,
	type RESTPostAPIChannelMessageJSONBody,
	type RESTPostAPIChannelMessageResult,
	type RESTPutAPIChannelPermissionJSONBody,
	type Snowflake,
	type RESTPostAPIChannelThreadsJSONBody,
	type RESTPostAPIChannelThreadsResult,
	type APIThreadChannel,
	type RESTPostAPIGuildForumThreadsJSONBody,
	type RESTPostAPISoundboardSendSoundJSONBody,
	type RESTPostAPISendSoundboardSoundResult,
} from 'discord-api-types/v10';

export interface StartForumThreadOptions extends RESTPostAPIGuildForumThreadsJSONBody {
	message: RESTPostAPIGuildForumThreadsJSONBody['message'] & { files?: RawFile[] };
}

export interface CreateMessageOptions extends RESTPostAPIChannelMessageJSONBody {
	files?: RawFile[];
}

export interface EditMessageOptions extends RESTPatchAPIChannelMessageJSONBody {
	files?: RawFile[];
}

export class ChannelsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Sends a message in a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#create-message}
	 * @param channelId - The id of the channel to send the message in
	 * @param body - The data for sending the message
	 * @param options - The options for sending the message
	 */
	public async createMessage(
		channelId: Snowflake,
		{ files, ...body }: CreateMessageOptions,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.post(Routes.channelMessages(channelId), {
			auth,
			files,
			body,
			signal,
		}) as Promise<RESTPostAPIChannelMessageResult>;
	}

	/**
	 * Edits a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#edit-message}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to edit
	 * @param body - The data for editing the message
	 * @param options - The options for editing the message
	 */
	public async editMessage(
		channelId: Snowflake,
		messageId: Snowflake,
		{ files, ...body }: EditMessageOptions,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.channelMessage(channelId, messageId), {
			auth,
			files,
			body,
			signal,
		}) as Promise<RESTPatchAPIChannelMessageResult>;
	}

	/**
	 * Fetches the reactions for a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#get-reactions}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to get the reactions for
	 * @param emoji - The emoji to get the reactions for. URL encoding happens internally
	 * @param query - The query options for fetching the reactions
	 * @param options - The options for fetching the message reactions
	 * @example
	 * ```ts
	 * // Unicode.
	 * await api.channels.getMessageReactions('1234567890', '1234567890', '👍');
	 *
	 * // Custom emoji.
	 * await api.channels.getMessageReactions('1234567890', '1234567890', 'emoji_name:1234567890');
	 * ```
	 */
	public async getMessageReactions(
		channelId: Snowflake,
		messageId: Snowflake,
		emoji: string,
		query: RESTGetAPIChannelMessageReactionUsersQuery = {},
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.channelMessageReaction(channelId, messageId, encodeURIComponent(emoji)), {
			auth,
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIChannelMessageReactionUsersResult>;
	}

	/**
	 * Deletes a reaction for the current user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#delete-own-reaction}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete the reaction for
	 * @param emoji - The emoji to delete the reaction for. URL encoding happens internally
	 * @param options - The options for deleting the reaction
	 * @example
	 * ```ts
	 * // Unicode.
	 * await api.channels.deleteOwnMessageReaction('1234567890', '1234567890', '👍');
	 *
	 * // Custom emoji.
	 * await api.channels.deleteOwnMessageReaction('1234567890', '1234567890', 'emoji_name:1234567890');
	 * ```
	 */
	public async deleteOwnMessageReaction(
		channelId: Snowflake,
		messageId: Snowflake,
		emoji: string,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.channelMessageOwnReaction(channelId, messageId, encodeURIComponent(emoji)), {
			auth,
			signal,
		});
	}

	/**
	 * Deletes a reaction for a user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#delete-user-reaction}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete the reaction for
	 * @param emoji - The emoji to delete the reaction for. URL encoding happens internally
	 * @param userId - The id of the user to delete the reaction for
	 * @param options - The options for deleting the reaction
	 * @example
	 * ```ts
	 * // Unicode.
	 * await api.channels.deleteUserMessageReaction('1234567890', '1234567890', '👍', '1234567890');
	 *
	 * // Custom emoji.
	 * await api.channels.deleteUserMessageReaction('1234567890', '1234567890', 'emoji_name:1234567890', '1234567890');
	 * ```
	 */
	public async deleteUserMessageReaction(
		channelId: Snowflake,
		messageId: Snowflake,
		emoji: string,
		userId: Snowflake,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.channelMessageUserReaction(channelId, messageId, encodeURIComponent(emoji), userId), {
			auth,
			signal,
		});
	}

	/**
	 * Deletes all reactions for a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#delete-all-reactions}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete the reactions for
	 * @param options - The options for deleting the reactions
	 */
	public async deleteAllMessageReactions(
		channelId: Snowflake,
		messageId: Snowflake,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.channelMessageAllReactions(channelId, messageId), { auth, signal });
	}

	/**
	 * Deletes all reactions of an emoji for a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#delete-all-reactions-for-emoji}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete the reactions for
	 * @param emoji - The emoji to delete the reactions for. URL encoding happens internally
	 * @param options - The options for deleting the reactions
	 * @example
	 * ```ts
	 * // Unicode.
	 * await api.channels.deleteAllMessageReactionsForEmoji('1234567890', '1234567890', '👍');
	 *
	 * // Custom emoji.
	 * await api.channels.deleteAllMessageReactionsForEmoji('1234567890', '1234567890', 'emoji_name:1234567890');
	 * ```
	 */
	public async deleteAllMessageReactionsForEmoji(
		channelId: Snowflake,
		messageId: Snowflake,
		emoji: string,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.channelMessageReaction(channelId, messageId, encodeURIComponent(emoji)), {
			auth,
			signal,
		});
	}

	/**
	 * Adds a reaction to a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#create-reaction}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to add the reaction to
	 * @param emoji - The emoji to add the reaction with. URL encoding happens internally
	 * @param options - The options for adding the reaction
	 * @example
	 * ```ts
	 * // Unicode.
	 * await api.channels.addMessageReaction('1234567890', '1234567890', '👍');
	 *
	 * // Custom emoji.
	 * await api.channels.addMessageReaction('1234567890', '1234567890', 'emoji_name:1234567890');
	 * ```
	 */
	public async addMessageReaction(
		channelId: Snowflake,
		messageId: Snowflake,
		emoji: string,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		await this.rest.put(Routes.channelMessageOwnReaction(channelId, messageId, encodeURIComponent(emoji)), {
			auth,
			signal,
		});
	}

	/**
	 * Fetches a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#get-channel}
	 * @param channelId - The id of the channel
	 * @param options - The options for fetching the channel
	 */
	public async get(channelId: Snowflake, { auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		return this.rest.get(Routes.channel(channelId), { auth, signal }) as Promise<RESTGetAPIChannelResult>;
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
		{ auth, signal, reason }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.channel(channelId), {
			auth,
			reason,
			body,
			signal,
		}) as Promise<RESTPatchAPIChannelResult>;
	}

	/**
	 * Deletes a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#deleteclose-channel}
	 * @param channelId - The id of the channel to delete
	 * @param options - The options for deleting the channel
	 */
	public async delete(
		channelId: Snowflake,
		{ auth, signal, reason }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		return this.rest.delete(Routes.channel(channelId), { auth, signal, reason }) as Promise<RESTDeleteAPIChannelResult>;
	}

	/**
	 * Fetches the messages of a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#get-channel-messages}
	 * @param channelId - The id of the channel to fetch messages from
	 * @param query - The query options for fetching messages
	 * @param options - The options for fetching the messages
	 */
	public async getMessages(
		channelId: Snowflake,
		query: RESTGetAPIChannelMessagesQuery = {},
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.channelMessages(channelId), {
			auth,
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
	public async showTyping(channelId: Snowflake, { auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		await this.rest.post(Routes.channelTyping(channelId), { auth, signal });
	}

	/**
	 * Fetches pinned messages of a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#get-channel-pins}
	 * @param channelId - The id of the channel to fetch pinned messages from
	 * @param query - The query options for fetching pinned messages
	 * @param options - The options for fetching pinned messages
	 */
	public async getPins(
		channelId: Snowflake,
		query: RESTGetAPIChannelMessagesPinsQuery = {},
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.channelMessagesPins(channelId), {
			auth,
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIChannelMessagesPinsResult>;
	}

	/**
	 * Pins a message in a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#pin-message}
	 * @param channelId - The id of the channel to pin the message in
	 * @param messageId - The id of the message to pin
	 * @param options - The options for pinning the message
	 */
	public async pinMessage(
		channelId: Snowflake,
		messageId: Snowflake,
		{ auth, reason, signal }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		await this.rest.put(Routes.channelMessagesPin(channelId, messageId), { auth, reason, signal });
	}

	/**
	 * Deletes a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#delete-message}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to delete
	 * @param options - The options for deleting the message
	 */
	public async deleteMessage(
		channelId: Snowflake,
		messageId: Snowflake,
		{ auth, reason, signal }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.channelMessage(channelId, messageId), { auth, reason, signal });
	}

	/**
	 * Bulk deletes messages
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#bulk-delete-messages}
	 * @param channelId - The id of the channel the messages are in
	 * @param messageIds - The ids of the messages to delete
	 * @param options - The options for deleting the messages
	 */
	public async bulkDeleteMessages(
		channelId: Snowflake,
		messageIds: Snowflake[],
		{ auth, reason, signal }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	): Promise<void> {
		await this.rest.post(Routes.channelBulkDelete(channelId), { auth, reason, body: { messages: messageIds }, signal });
	}

	/**
	 * Fetches a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#get-channel-message}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to fetch
	 * @param options - The options for fetching the message
	 */
	public async getMessage(
		channelId: Snowflake,
		messageId: Snowflake,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.channelMessage(channelId, messageId), {
			auth,
			signal,
		}) as Promise<RESTGetAPIChannelMessageResult>;
	}

	/**
	 * Crossposts a message
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#crosspost-message}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to crosspost
	 * @param options - The options for crossposting the message
	 */
	public async crosspostMessage(
		channelId: Snowflake,
		messageId: Snowflake,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.post(Routes.channelMessageCrosspost(channelId, messageId), {
			auth,
			signal,
		}) as Promise<RESTPostAPIChannelMessageCrosspostResult>;
	}

	/**
	 * Unpins a message in a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/message#unpin-message}
	 * @param channelId - The id of the channel to unpin the message in
	 * @param messageId - The id of the message to unpin
	 * @param options - The options for unpinning the message
	 */
	public async unpinMessage(
		channelId: Snowflake,
		messageId: Snowflake,
		{ auth, reason, signal }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.channelMessagesPin(channelId, messageId), { auth, reason, signal });
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
		{ auth, reason, signal }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.channelFollowers(channelId), {
			auth,
			body: { webhook_channel_id: webhookChannelId },
			reason,
			signal,
		}) as Promise<RESTPostAPIChannelFollowersResult>;
	}

	/**
	 * Creates a new invite for a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#create-channel-invite}
	 * @param channelId - The id of the channel to create an invite for
	 * @param body - The data for creating the invite
	 * @param options - The options for creating the invite
	 */
	public async createInvite(
		channelId: Snowflake,
		body: RESTPostAPIChannelInviteJSONBody,
		{ auth, reason, signal }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.channelInvites(channelId), {
			auth,
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
	public async getInvites(channelId: Snowflake, { auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		return this.rest.get(Routes.channelInvites(channelId), { auth, signal }) as Promise<RESTGetAPIChannelInvitesResult>;
	}

	/**
	 * Creates a new thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#start-thread-from-message}
	 * @see {@link https://discord.com/developers/docs/resources/channel#start-thread-without-message}
	 * @param channelId - The id of the channel to start the thread in
	 * @param body - The data for starting the thread
	 * @param messageId - The id of the message to start the thread from
	 * @param options - The options for starting the thread
	 */
	public async createThread(
		channelId: Snowflake,
		body: RESTPostAPIChannelThreadsJSONBody,
		messageId?: Snowflake,
		{ auth, signal, reason }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.threads(channelId, messageId), {
			auth,
			body,
			signal,
			reason,
		}) as Promise<RESTPostAPIChannelThreadsResult>;
	}

	/**
	 * Creates a new forum post
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#start-thread-in-forum-or-media-channel}
	 * @param channelId - The id of the forum channel to start the thread in
	 * @param body - The data for starting the thread
	 * @param options - The options for starting the thread
	 */
	public async createForumThread(
		channelId: Snowflake,
		{ message, ...optionsBody }: StartForumThreadOptions,
		{ auth, signal, reason }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		const { files, ...messageBody } = message;

		const body = {
			...optionsBody,
			message: messageBody,
		};

		return this.rest.post(Routes.threads(channelId), {
			auth,
			files,
			body,
			reason,
			signal,
		}) as Promise<APIThreadChannel>;
	}

	/**
	 * Fetches the archived threads of a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#list-public-archived-threads}
	 * @see {@link https://discord.com/developers/docs/resources/channel#list-private-archived-threads}
	 * @param channelId - The id of the channel to fetch archived threads from
	 * @param archivedStatus - The archived status of the threads to fetch
	 * @param query - The options for fetching archived threads
	 * @param options - The options for fetching archived threads
	 */
	public async getArchivedThreads(
		channelId: Snowflake,
		archivedStatus: 'private' | 'public',
		query: RESTGetAPIChannelThreadsArchivedQuery = {},
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.channelThreads(channelId, archivedStatus), {
			auth,
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIChannelUsersThreadsArchivedResult>;
	}

	/**
	 * Fetches the private joined archived threads of a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#list-joined-private-archived-threads}
	 * @param channelId - The id of the channel to fetch joined archived threads from
	 * @param query - The options for fetching joined archived threads
	 * @param options - The options for fetching joined archived threads
	 */
	public async getJoinedPrivateArchivedThreads(
		channelId: Snowflake,
		query: RESTGetAPIChannelThreadsArchivedQuery = {},
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.channelJoinedArchivedThreads(channelId), {
			auth,
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIChannelUsersThreadsArchivedResult>;
	}

	/**
	 * Creates a new webhook
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#create-webhook}
	 * @param channelId - The id of the channel to create the webhook in
	 * @param body - The data for creating the webhook
	 * @param options - The options for creating the webhook
	 */
	public async createWebhook(
		channelId: Snowflake,
		body: RESTPostAPIChannelWebhookJSONBody,
		{ auth, reason, signal }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.channelWebhooks(channelId), {
			auth,
			reason,
			body,
			signal,
		}) as Promise<RESTPostAPIChannelWebhookResult>;
	}

	/**
	 * Fetches the webhooks of a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#get-channel-webhooks}
	 * @param channelId - The id of the channel
	 * @param options - The options for fetching the webhooks
	 */
	public async getWebhooks(channelId: Snowflake, { auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		return this.rest.get(Routes.channelWebhooks(channelId), {
			auth,
			signal,
		}) as Promise<RESTGetAPIChannelWebhooksResult>;
	}

	/**
	 * Edits the permission overwrite for a user or role in a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#edit-channel-permissions}
	 * @param channelId - The id of the channel to edit the permission overwrite in
	 * @param overwriteId - The id of the user or role to edit the permission overwrite for
	 * @param body - The data for editing the permission overwrite
	 * @param options - The options for editing the permission overwrite
	 */
	public async editPermissionOverwrite(
		channelId: Snowflake,
		overwriteId: Snowflake,
		body: RESTPutAPIChannelPermissionJSONBody,
		{ auth, reason, signal }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		await this.rest.put(Routes.channelPermission(channelId, overwriteId), {
			auth,
			reason,
			body,
			signal,
		});
	}

	/**
	 * Deletes the permission overwrite for a user or role in a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#delete-channel-permission}
	 * @param channelId - The id of the channel to delete the permission overwrite in
	 * @param overwriteId - The id of the user or role to delete the permission overwrite for
	 * @param options - The options for deleting the permission overwrite
	 */
	public async deletePermissionOverwrite(
		channelId: Snowflake,
		overwriteId: Snowflake,
		{ auth, reason, signal }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.channelPermission(channelId, overwriteId), {
			auth,
			reason,
			signal,
		});
	}

	/**
	 * Sends a soundboard sound in a channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#send-soundboard-sound}
	 * @param channelId - The id of the channel to send the soundboard sound in
	 * @param body - The data for sending the soundboard sound
	 * @param options - The options for sending the soundboard sound
	 */
	public async sendSoundboardSound(
		channelId: Snowflake,
		body: RESTPostAPISoundboardSendSoundJSONBody,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.post(Routes.sendSoundboardSound(channelId), {
			auth,
			body,
			signal,
		}) as Promise<RESTPostAPISendSoundboardSoundResult>;
	}
}
