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
	public async get(code: string, query: RESTGetAPIInviteQuery = {}, options: RequestOptions = {}) {
		return this.rest.get(Routes.invite(code), {
			...options,
			query: makeURLSearchParams(query),
		}) as Promise<RESTGetAPIInviteResult>;
	}

	/**
	 * Deletes an invite
	 *
	 * @see {@link https://docs.discord.com/developers/resources/invite#delete-invite}
	 * @param code - The invite code
	 * @param options - The options for deleting the invite
	 */
	public async delete(code: string, options: RequestOptionsWithReason = {}) {
		return this.rest.delete(Routes.invite(code), options) as Promise<RESTDeleteAPIInviteResult>;
	}

	/**
	 * Fetches an invite's target users
	 *
	 * @see {@link https://docs.discord.com/developers/resources/invite#get-target-users}
	 * @param code - The invite code
	 * @param options - The options for fetching the invite target users
	 * @returns
	 */
	public async getTargetUsers(code: string, options: RequestOptions = {}) {
		return this.rest.get(Routes.inviteTargetUsers(code), options) as Promise<RESTGetAPIInviteTargetUsersResult>;
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
	public async updateTargetUsers(code: string, targetUsersFile: RawFile, options: RequestOptions = {}) {
		return this.rest.put(Routes.inviteTargetUsers(code), {
			...options,
			files: [{ key: 'target_users_file', contentType: 'text/csv', ...targetUsersFile }],
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
	public async getTargetUsersJobStatus(code: string, options: RequestOptions = {}) {
		return this.rest.get(
			Routes.inviteTargetUsersJobStatus(code),
			options,
		) as Promise<RESTGetAPIInviteTargetUsersJobStatusResult>;
	}
}
