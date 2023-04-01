import type { RawFile, RequestData, REST } from '@discordjs/rest';
import {
	Routes,
	type APIThreadChannel,
	type APIThreadMember,
	type RESTGetAPIChannelThreadMembersResult,
	type RESTPostAPIChannelThreadsJSONBody,
	type RESTPostAPIChannelThreadsResult,
	type RESTPostAPIGuildForumThreadsJSONBody,
	type Snowflake,
} from 'discord-api-types/v10';

export interface StartForumThreadOptions extends RESTPostAPIGuildForumThreadsJSONBody {
	message: RESTPostAPIGuildForumThreadsJSONBody['message'] & { files?: RawFile[] };
}

export class ThreadsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#get-channel}
	 * @param threadId - The id of the thread
	 * @param options - The options to use when fetching the thread
	 */
	public async get(threadId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.channel(threadId), { signal }) as Promise<APIThreadChannel>;
	}

	/**
	 * Creates a new thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#start-thread-from-message}
	 * @see {@link https://discord.com/developers/docs/resources/channel#start-thread-without-message}
	 * @param channelId - The id of the channel to start the thread in
	 * @param body - The data to use when starting the thread
	 * @param messageId - The id of the message to start the thread from
	 * @param options - The options to use when starting the thread
	 */
	public async create(
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
	 * @see {@link https://discord.com/developers/docs/resources/channel#start-thread-in-forum-channel}
	 * @param channelId - The id of the forum channel to start the thread in
	 * @param body - The data to use when starting the thread
	 * @param options - The options to use when starting the thread
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
	 * Adds the current user to a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#join-thread}
	 * @param threadId - The id of the thread to join
	 * @param options - The options to use when joining the thread
	 */
	public async join(threadId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		await this.rest.put(Routes.threadMembers(threadId, '@me'), { signal });
	}

	/**
	 * Adds a member to a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#add-thread-member}
	 * @param threadId - The id of the thread to add the member to
	 * @param userId - The id of the user to add to the thread
	 * @param options - The options to use when adding the member to the thread
	 */
	public async addMember(threadId: Snowflake, userId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		await this.rest.put(Routes.threadMembers(threadId, userId), { signal });
	}

	/**
	 * Removes the current user from a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#leave-thread}
	 * @param threadId - The id of the thread to leave
	 * @param options - The options to use when leaving the thread
	 */
	public async leave(threadId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		await this.rest.delete(Routes.threadMembers(threadId, '@me'), { signal });
	}

	/**
	 * Removes a member from a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#remove-thread-member}
	 * @param threadId - The id of the thread to remove the member from
	 * @param userId - The id of the user to remove from the thread
	 * @param options - The options to use when removing the member from the thread
	 */
	public async removeMember(threadId: Snowflake, userId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		await this.rest.delete(Routes.threadMembers(threadId, userId), { signal });
	}

	/**
	 * Fetches a member of a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#get-thread-member}
	 * @param threadId - The id of the thread to fetch the member from
	 * @param userId - The id of the user
	 * @param options - The options to use when fetching the member
	 */
	public async getMember(threadId: Snowflake, userId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.threadMembers(threadId, userId), { signal }) as Promise<APIThreadMember>;
	}

	/**
	 * Fetches all members of a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#list-thread-members}
	 * @param threadId - The id of the thread to fetch the members from
	 * @param options - The options to use when fetching the members
	 */
	public async getAllMembers(threadId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.threadMembers(threadId), { signal }) as Promise<RESTGetAPIChannelThreadMembersResult>;
	}
}
