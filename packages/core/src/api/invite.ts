/* eslint-disable jsdoc/check-param-names */

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
	 * @see {@link https://discord.com/developers/docs/resources/invite#delete-invite}
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
}
