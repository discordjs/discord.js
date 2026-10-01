import { makeURLSearchParams, type REST } from '@discordjs/rest';
import {
	Routes,
	type RESTDeleteAPIInviteResult,
	type RESTGetAPIInviteQuery,
	type RESTGetAPIInviteResult,
} from 'discord-api-types/v10';
import type { RequestOptions, RequestOptionsWithReason } from '../util/types.js';

export class InvitesAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches an invite
	 *
	 * @see {@link https://discord.com/developers/docs/resources/invite#get-invite}
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
	 * @see {@link https://discord.com/developers/docs/resources/invite#delete-invite}
	 * @param code - The invite code
	 * @param options - The options for deleting the invite
	 */
	public async delete(code: string, options: RequestOptionsWithReason = {}) {
		return this.rest.delete(Routes.invite(code), options) as Promise<RESTDeleteAPIInviteResult>;
	}
}
