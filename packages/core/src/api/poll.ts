/* eslint-disable jsdoc/check-param-names */

import { makeURLSearchParams, type RequestData, type REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIPollAnswerVotersQuery,
	type RESTGetAPIPollAnswerVotersResult,
	type RESTPostAPIPollExpireResult,
	type Snowflake,
} from 'discord-api-types/v10';

export class PollAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Gets the list of users that voted for a specific answer in a poll
	 *
	 * @see {@link https://discord.com/developers/docs/resources/poll#get-answer-voters}
	 * @param channelId - The id of the channel containing the message
	 * @param messageId - The id of the message containing the poll
	 * @param answerId - The id of the answer to get voters for
	 * @param query - The query for getting the list of voters
	 * @param options - The options for getting the list of voters
	 */
	public async getAnswerVoters(
		channelId: Snowflake,
		messageId: Snowflake,
		answerId: number,
		query: RESTGetAPIPollAnswerVotersQuery,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.pollAnswerVoters(channelId, messageId, answerId), {
			signal,
			query: makeURLSearchParams(query),
		}) as Promise<RESTGetAPIPollAnswerVotersResult>;
	}

	/**
	 * Immediately expires (i.e. ends) a poll
	 *
	 * @see {@link https://discord.com/developers/docs/resources/poll#expire-poll}
	 * @param channelId - The id of the channel containing the message
	 * @param messageId - The id of the message containing the poll
	 * @param options - The options for expiring the poll
	 */
	public async expirePoll(channelId: Snowflake, messageId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.post(Routes.expirePoll(channelId, messageId), {
			signal,
		}) as Promise<RESTPostAPIPollExpireResult>;
	}
}
