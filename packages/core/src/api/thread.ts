/* eslint-disable jsdoc/check-param-names */

import { makeURLSearchParams, type RequestData, type REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIChannelThreadMemberQuery,
	type RESTGetAPIChannelThreadMemberResult,
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
	public async join(threadId: Snowflake, { auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		await this.rest.put(Routes.threadMembers(threadId, '@me'), { auth, signal });
	}

	/**
	 * Adds a member to a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#add-thread-member}
	 * @param threadId - The id of the thread to add the member to
	 * @param userId - The id of the user to add to the thread
	 * @param options - The options for adding the member to the thread
	 */
	public async addMember(
		threadId: Snowflake,
		userId: Snowflake,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		await this.rest.put(Routes.threadMembers(threadId, userId), { auth, signal });
	}

	/**
	 * Removes the current user from a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#leave-thread}
	 * @param threadId - The id of the thread to leave
	 * @param options - The options for leaving the thread
	 */
	public async leave(threadId: Snowflake, { auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		await this.rest.delete(Routes.threadMembers(threadId, '@me'), { auth, signal });
	}

	/**
	 * Removes a member from a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#remove-thread-member}
	 * @param threadId - The id of the thread to remove the member from
	 * @param userId - The id of the user to remove from the thread
	 * @param options - The options for removing the member from the thread
	 */
	public async removeMember(
		threadId: Snowflake,
		userId: Snowflake,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.threadMembers(threadId, userId), { auth, signal });
	}

	/**
	 * Fetches a member of a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#get-thread-member}
	 * @param threadId - The id of the thread to fetch the member from
	 * @param userId - The id of the user
	 * @param query - The query for fetching the member
	 * @param options - The options for fetching the member
	 */
	public async getMember(
		threadId: Snowflake,
		userId: Snowflake,
		query: RESTGetAPIChannelThreadMemberQuery & { with_member: true },
		options?: Pick<RequestData, 'auth' | 'signal'>,
	): Promise<Required<Pick<RESTGetAPIChannelThreadMemberResult, 'member'>> & RESTGetAPIChannelThreadMemberResult>;

	/**
	 * Fetches a member of a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#get-thread-member}
	 * @param threadId - The id of the thread to fetch the member from
	 * @param userId - The id of the user
	 * @param query - The query for fetching the member
	 * @param options - The options for fetching the member
	 */
	public async getMember(
		threadId: Snowflake,
		userId: Snowflake,
		query?: RESTGetAPIChannelThreadMemberQuery,
		options?: Pick<RequestData, 'auth' | 'signal'>,
	): Promise<RESTGetAPIChannelThreadMemberResult>;

	public async getMember(
		threadId: Snowflake,
		userId: Snowflake,
		query: RESTGetAPIChannelThreadMemberQuery = {},
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.threadMembers(threadId, userId), {
			auth,
			signal,
			query: makeURLSearchParams(query),
		});
	}

	/**
	 * Fetches all members of a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#list-thread-members}
	 * @param threadId - The id of the thread to fetch the members from
	 * @param options - The options for fetching the members
	 */
	public async getAllMembers(threadId: Snowflake, { auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		return this.rest.get(Routes.threadMembers(threadId), {
			auth,
			signal,
		}) as Promise<RESTGetAPIChannelThreadMembersResult>;
	}
}
