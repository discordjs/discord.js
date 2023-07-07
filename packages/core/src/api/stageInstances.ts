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
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#get-stage-instance}
	 * @param body - The data for creating the new stage instance
	 * @param options - The options for creating the new stage instance
	 */
	public async create(
		body: RESTPostAPIStageInstanceJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.stageInstances(), {
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
	public async get(channelId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.stageInstance(channelId), { signal }) as Promise<RESTGetAPIStageInstanceResult>;
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
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.stageInstance(channelId), {
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
	public async delete(channelId: Snowflake, { reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {}) {
		await this.rest.delete(Routes.stageInstance(channelId), { reason, signal });
	}
}
