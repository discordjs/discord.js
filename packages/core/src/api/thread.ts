/* eslint-disable jsdoc/check-param-names */
import type { RawFile, REST } from '@discordjs/rest';
import {
	Routes,
	type APIThreadChannel,
	type APIThreadMember,
	type RESTPostAPIChannelThreadsJSONBody,
	type RESTPostAPIGuildForumThreadsJSONBody,
} from 'discord-api-types/v10';

export interface StartThreadOptions extends RESTPostAPIChannelThreadsJSONBody {
	message_id?: string;
}

export interface StartForumThreadOptions extends RESTPostAPIGuildForumThreadsJSONBody {
	message: RESTPostAPIGuildForumThreadsJSONBody['message'] & { files?: RawFile[] };
}

export class ThreadsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches a thread
	 *
	 * @param channelId - The id of the channel to fetch the thread from
	 * @param threadId - The id of the thread
	 */
	public async get(channelId: string, threadId: string) {
		return (await this.rest.get(Routes.threads(channelId, threadId))) as APIThreadChannel;
	}

	/**
	 * Creates a new thread
	 *
	 * @param channelId - The id of the channel to start the thread in
	 * @param options - The options to use when starting the thread
	 */
	public async start(channelId: string, { message_id, ...body }: StartThreadOptions) {
		return (await this.rest.post(Routes.threads(channelId, message_id), {
			body,
		})) as APIThreadChannel;
	}

	/**
	 * Creates a new forum post
	 *
	 * @param channelId - The id of the forum channel to start the thread in
	 * @param options - The options to use when starting the thread
	 */
	public async startForumThread(channelId: string, { message, ...optionsBody }: StartForumThreadOptions) {
		const { files, ...messageBody } = message;

		const body = {
			...optionsBody,
			message: messageBody,
		};

		return (await this.rest.post(Routes.threads(channelId), {
			files,
			body,
		})) as APIThreadChannel;
	}

	/**
	 * Adds the current user to a thread
	 *
	 * @param threadId - The id of the thread to join
	 */
	public async join(threadId: string) {
		return this.rest.put(Routes.threadMembers(threadId, '@me'));
	}

	/**
	 * Adds a member to a thread
	 *
	 * @param threadId - The id of the thread to add the member to
	 * @param userId - The id of the user to add to the thread
	 */
	public async addMember(threadId: string, userId: string) {
		return this.rest.put(Routes.threadMembers(threadId, userId));
	}

	/**
	 * Removes the current user from a thread
	 *
	 * @param threadId - The id of the thread to leave
	 */
	public async leave(threadId: string) {
		return this.rest.delete(Routes.threadMembers(threadId, '@me'));
	}

	/**
	 * Removes a member from a thread
	 *
	 * @param threadId - The id of the thread to remove the member from
	 * @param userId - The id of the user to remove from the thread
	 */
	public async removeMember(threadId: string, userId: string) {
		return this.rest.delete(Routes.threadMembers(threadId, userId));
	}

	/**
	 * Fetches a member of a thread
	 *
	 * @param threadId - The id of the thread to fetch the member from
	 * @param userId - The id of the user
	 */
	public async getMember(threadId: string, userId: string) {
		return (await this.rest.get(Routes.threadMembers(threadId, userId))) as APIThreadMember;
	}

	/**
	 * Fetches all members of a thread
	 *
	 * @param threadId - The id of the thread to fetch the members from
	 */
	public async getAllMembers(threadId: string) {
		return (await this.rest.get(Routes.threadMembers(threadId))) as APIThreadMember[];
	}
}
