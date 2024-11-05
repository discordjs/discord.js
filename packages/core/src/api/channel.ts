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
	type RESTGetAPIChannelMessagesQuery,
	type RESTGetAPIChannelMessagesResult,
	type RESTGetAPIChannelPinsResult,
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
	 * @see {@link https://discord.com/developers/docs/resources/message#edit-message}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to edit
	 * @param body - The data for editing the message
	 * @param options - The options for editing the message
	 */
	public async editMessage(
		channelId: Snowflake,
		messageId: Snowflake,
		{ files, ...body }: RESTPatchAPIChannelMessageJSONBody & { files?: RawFile[] },
		{ signal }: Pick<RequestData, 'signal'> = {},
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
	 * @see {@link https://discord.com/developers/docs/resources/message#get-reactions}
	 * @param channelId - The id of the channel the message is in
	 * @param messageId - The id of the message to get the reactions for
	 * @param emoji - The emoji to get the reactions for
	 * @param query - The query options for fetching the reactions
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
	 * @see {@link https://discord.com/developers/docs/resources/message#delete-own-reaction}
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
	 * @see {@link https://discord.com/developers/docs/resources/message#delete-user-reaction}
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
	 * @see {@link https://discord.com/developers/docs/resources/message#delete-all-reactions}
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
	 * @see {@link https://discord.com/developers/docs/resources/message#delete-all-reactions-for-emoji}
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
	 * @see {@link https://discord.com/developers/docs/resources/message#create-reaction}
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
	 * @see {@link https://discord.com/developers/docs/resources/message#get-channel-messages}
	 * @param channelId - The id of the channel to fetch messages from
	 * @param query - The query options for fetching messages
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
	 * @see {@link https://discord.com/developers/docs/resources/message#delete-message}
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
	 * @see {@link https://discord.com/developers/docs/resources/message#bulk-delete-messages}
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
	 * @see {@link https://discord.com/developers/docs/resources/message#get-channel-message}
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
	 * @see {@link https://discord.com/developers/docs/resources/message#crosspost-message}
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
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.channelFollowers(channelId), {
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
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.post(Routes.threads(channelId, messageId), {
			body,
			signal,
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
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		const { files, ...messageBody } = message;

		const body = {
			...optionsBody,
			message: messageBody,
		};

		return this.rest.post(Routes.threads(channelId), { files, body, signal }) as Promise<APIThreadChannel>;
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
	 * @param query - The options for fetching joined archived threads
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
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.channelWebhooks(channelId), {
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
	 */
	public async getWebhooks(channelId: Snowflake) {
		return this.rest.get(Routes.channelWebhooks(channelId)) as Promise<RESTGetAPIChannelWebhooksResult>;
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
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.put(Routes.channelPermission(channelId, overwriteId), {
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
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.channelPermission(channelId, overwriteId), {
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
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.post(Routes.sendSoundboardSound(channelId), {
			body,
			signal,
		}) as Promise<RESTPostAPISendSoundboardSoundResult>;
	}
}
