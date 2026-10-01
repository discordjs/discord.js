import { makeURLSearchParams, type REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIChannelThreadMemberQuery,
	type RESTGetAPIChannelThreadMemberResult,
	type RESTGetAPIChannelThreadMembersQuery,
	type RESTGetAPIChannelThreadMembersResult,
	type Snowflake,
} from 'discord-api-types/v10';
import type { RequestOptions } from '../util/types.js';

export class ThreadsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Adds the current user to a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#join-thread}
	 * @param threadId - The id of the thread to join
	 * @param options - The options for joining the thread
	 */
	public async join(threadId: Snowflake, options: RequestOptions = {}) {
		await this.rest.put(Routes.threadMembers(threadId, '@me'), options);
	}

	/**
	 * Adds a member to a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#add-thread-member}
	 * @param threadId - The id of the thread to add the member to
	 * @param userId - The id of the user to add to the thread
	 * @param options - The options for adding the member to the thread
	 */
	public async addMember(threadId: Snowflake, userId: Snowflake, options: RequestOptions = {}) {
		await this.rest.put(Routes.threadMembers(threadId, userId), options);
	}

	/**
	 * Removes the current user from a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#leave-thread}
	 * @param threadId - The id of the thread to leave
	 * @param options - The options for leaving the thread
	 */
	public async leave(threadId: Snowflake, options: RequestOptions = {}) {
		await this.rest.delete(Routes.threadMembers(threadId, '@me'), options);
	}

	/**
	 * Removes a member from a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#remove-thread-member}
	 * @param threadId - The id of the thread to remove the member from
	 * @param userId - The id of the user to remove from the thread
	 * @param options - The options for removing the member from the thread
	 */
	public async removeMember(threadId: Snowflake, userId: Snowflake, options: RequestOptions = {}) {
		await this.rest.delete(Routes.threadMembers(threadId, userId), options);
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
		options?: RequestOptions,
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
		options?: RequestOptions,
	): Promise<RESTGetAPIChannelThreadMemberResult>;

	public async getMember(
		threadId: Snowflake,
		userId: Snowflake,
		query: RESTGetAPIChannelThreadMemberQuery = {},
		options: RequestOptions = {},
	) {
		return this.rest.get(Routes.threadMembers(threadId, userId), {
			...options,
			query: makeURLSearchParams(query),
		});
	}

	/**
	 * Fetches members of a thread
	 *
	 * @see {@link https://discord.com/developers/docs/resources/channel#list-thread-members}
	 * @param threadId - The id of the thread to fetch the members from
	 * @param query - The query for fetching the members
	 * @param options - The options for fetching the members
	 */
	public async getMembers(
		threadId: Snowflake,
		query: RESTGetAPIChannelThreadMembersQuery = {},
		options: RequestOptions = {},
	) {
		return this.rest.get(Routes.threadMembers(threadId), {
			...options,
			query: makeURLSearchParams(query),
		}) as Promise<RESTGetAPIChannelThreadMembersResult>;
	}
}
