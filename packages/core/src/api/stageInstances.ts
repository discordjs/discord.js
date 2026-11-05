/* eslint-disable jsdoc/check-param-names */

import type { RequestData, REST } from '@discordjs/rest';
import {
	type Snowflake,
	type RESTGetAPIStageInstanceResult,
	type RESTPatchAPIStageInstanceJSONBody,
	type RESTPatchAPIStageInstanceResult,
	type RESTPostAPIStageInstanceJSONBody,
	type RESTPostAPIStageInstanceResult,
	Routes,
} from 'discord-api-types/v10';

export class StageInstancesAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Creates a new stage instance
	 *
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#create-stage-instance}
	 * @param body - The data for creating the new stage instance
	 * @param options - The options for creating the new stage instance
	 */
	public async create(
		body: RESTPostAPIStageInstanceJSONBody,
		{ auth, reason, signal }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.stageInstances(), {
			auth,
			body,
			reason,
			signal,
		}) as Promise<RESTPostAPIStageInstanceResult>;
	}

	/**
	 * Fetches a stage instance
	 *
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#get-stage-instance}
	 * @param channelId - The id of the channel
	 * @param options - The options for fetching the stage instance
	 */
	public async get(channelId: Snowflake, { auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		return this.rest.get(Routes.stageInstance(channelId), { auth, signal }) as Promise<RESTGetAPIStageInstanceResult>;
	}

	/**
	 * Edits a stage instance
	 *
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#modify-stage-instance}
	 * @param channelId - The id of the channel
	 * @param body - The new stage instance data
	 * @param options - The options for editing the stage instance
	 */
	public async edit(
		channelId: Snowflake,
		body: RESTPatchAPIStageInstanceJSONBody,
		{ auth, reason, signal }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.stageInstance(channelId), {
			auth,
			body,
			reason,
			signal,
		}) as Promise<RESTPatchAPIStageInstanceResult>;
	}

	/**
	 * Deletes a stage instance
	 *
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#delete-stage-instance}
	 * @param channelId - The id of the channel
	 * @param options - The options for deleting the stage instance
	 */
	public async delete(
		channelId: Snowflake,
		{ auth, reason, signal }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.stageInstance(channelId), { auth, reason, signal });
	}
}
