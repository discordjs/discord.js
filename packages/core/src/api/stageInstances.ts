import type { REST } from '@discordjs/rest';
import {
	type Snowflake,
	type RESTGetAPIStageInstanceResult,
	type RESTPatchAPIStageInstanceJSONBody,
	type RESTPatchAPIStageInstanceResult,
	type RESTPostAPIStageInstanceJSONBody,
	type RESTPostAPIStageInstanceResult,
	Routes,
} from 'discord-api-types/v10';
import type { RequestOptions, RequestOptionsWithReason } from '../util/types.js';

export class StageInstancesAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Creates a new stage instance
	 *
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#create-stage-instance}
	 * @param body - The data for creating the new stage instance
	 * @param options - The options for creating the new stage instance
	 */
	public async create(body: RESTPostAPIStageInstanceJSONBody, options: RequestOptionsWithReason = {}) {
		return this.rest.post(Routes.stageInstances(), {
			...options,
			body,
		}) as Promise<RESTPostAPIStageInstanceResult>;
	}

	/**
	 * Fetches a stage instance
	 *
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#get-stage-instance}
	 * @param channelId - The id of the channel
	 * @param options - The options for fetching the stage instance
	 */
	public async get(channelId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.stageInstance(channelId), options) as Promise<RESTGetAPIStageInstanceResult>;
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.patch(Routes.stageInstance(channelId), {
			...options,
			body,
		}) as Promise<RESTPatchAPIStageInstanceResult>;
	}

	/**
	 * Deletes a stage instance
	 *
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#delete-stage-instance}
	 * @param channelId - The id of the channel
	 * @param options - The options for deleting the stage instance
	 */
	public async delete(channelId: Snowflake, options: RequestOptionsWithReason = {}) {
		await this.rest.delete(Routes.stageInstance(channelId), options);
	}
}
