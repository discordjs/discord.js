/* eslint-disable jsdoc/check-param-names */

import { makeURLSearchParams, type RawFile, type REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIInviteTargetUsersResult,
	type RESTDeleteAPIInviteResult,
	type RESTGetAPIInviteQuery,
	type RESTGetAPIInviteResult,
	type RESTPutAPIInviteTargetUsersResult,
	type RESTGetAPIInviteTargetUsersJobStatusResult,
} from 'discord-api-types/v10';
import type { RequestOptions, RequestOptionsWithReason } from '../util/types.js';

export class InvitesAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches an invite
	 *
	 * @see {@link https://docs.discord.com/developers/resources/invite#get-invite}
	 * @param code - The invite code
	 * @param query - The options for fetching the invite
	 * @param options - The options for fetching the invite
	 */
	public async get(
		code: string,
		query: RESTGetAPIInviteQuery = {},
		{ auth, dispatcher, headers, rejectOnRateLimit, signal }: RequestOptions = {},
	) {
		return this.rest.get(Routes.invite(code), {
			auth,
			query: makeURLSearchParams(query),
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		}) as Promise<RESTGetAPIInviteResult>;
	}

	/**
	 * Deletes an invite
	 *
	 * @see {@link https://docs.discord.com/developers/resources/invite#delete-invite}
	 * @param code - The invite code
	 * @param options - The options for deleting the invite
	 */
	public async delete(
		code: string,
		{ auth, dispatcher, headers, reason, rejectOnRateLimit, signal }: RequestOptionsWithReason = {},
	) {
		return this.rest.delete(Routes.invite(code), {
			auth,
			dispatcher,
			headers,
			reason,
			rejectOnRateLimit,
			signal,
		}) as Promise<RESTDeleteAPIInviteResult>;
	}

	/**
	 * Fetches an invite's target users
	 *
	 * @see {@link https://docs.discord.com/developers/resources/invite#get-target-users}
	 * @param code - The invite code
	 * @param options - The options for fetching the invite target users
	 * @returns
	 */
	public async getTargetUsers(
		code: string,
		{ auth, dispatcher, headers, rejectOnRateLimit, signal }: RequestOptions = {},
	) {
		return this.rest.get(Routes.inviteTargetUsers(code), {
			auth,
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		}) as Promise<RESTGetAPIInviteTargetUsersResult>;
	}

	/**
	 * Updates an invite's target users
	 *
	 * @see {@link https://docs.discord.com/developers/resources/invite#update-target-users}
	 * @param code - The invite code
	 * @param targetUsersFile - A CSV file with a single column of user ids
	 * for all the users able to accept this invite
	 * @param options - The options for updating the invite target users
	 * @returns
	 */
	public async updateTargetUsers(
		code: string,
		targetUsersFile: RawFile,
		{ auth, dispatcher, headers, rejectOnRateLimit, signal }: RequestOptions = {},
	) {
		return this.rest.put(Routes.inviteTargetUsers(code), {
			auth,
			files: [{ key: 'target_users_file', contentType: 'text/csv', ...targetUsersFile }],
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		}) as Promise<RESTPutAPIInviteTargetUsersResult>;
	}

	/**
	 * Fetches an invite's target users job status
	 *
	 * @see {@link https://docs.discord.com/developers/resources/invite#get-target-users-job-status}
	 * @param code - The invite code
	 * @param options - The options for fetching the invite target users job status
	 * @returns
	 */
	public async getTargetUsersJobStatus(
		code: string,
		{ auth, dispatcher, headers, rejectOnRateLimit, signal }: RequestOptions = {},
	) {
		return this.rest.get(Routes.inviteTargetUsersJobStatus(code), {
			auth,
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		}) as Promise<RESTGetAPIInviteTargetUsersJobStatusResult>;
	}
}
