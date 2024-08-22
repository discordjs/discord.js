/* eslint-disable jsdoc/check-param-names */

import type { RequestData, REST } from '@discordjs/rest';
import {
	Routes,
	type APIThreadMember,
	type RESTGetAPIChannelThreadMembersResult,
	type Snowflake,
} from 'discord-api-types/v10';

export class ThreadsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Adds the current user to a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#join-thread}
	 * @param threadId - The id of the thread to join
	 * @param options - The options for joining the thread
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
	 * @param options - The options for adding the member to the thread
	 */
	public async addMember(threadId: Snowflake, userId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		await this.rest.put(Routes.threadMembers(threadId, userId), { signal });
	}

	/**
	 * Removes the current user from a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#leave-thread}
	 * @param threadId - The id of the thread to leave
	 * @param options - The options for leaving the thread
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
	 * @param options - The options for removing the member from the thread
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
	 * @param options - The options for fetching the member
	 */
	public async getMember(threadId: Snowflake, userId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.threadMembers(threadId, userId), { signal }) as Promise<APIThreadMember>;
	}

	/**
	 * Fetches all members of a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#list-thread-members}
	 * @param threadId - The id of the thread to fetch the members from
	 * @param options - The options for fetching the members
	 */
	public async getAllMembers(threadId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.threadMembers(threadId), { signal }) as Promise<RESTGetAPIChannelThreadMembersResult>;
	}
}
