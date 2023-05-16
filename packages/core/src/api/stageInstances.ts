/* eslint-disable jsdoc/check-param-names */

import { type RequestData, type REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import type {
	RESTPatchAPIStageInstanceJSONBody,
	RESTPostAPIStageInstanceJSONBody,
	RESTPatchAPIStageInstanceResult,
	RESTGetAPIStageInstanceResult,
	RESTPostAPIStageInstanceResult,
} from 'discord-api-types/v10';

export class StageInstancesAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Creates a new stage instance
	 *
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#get-stage-instance}
	 * @param body - The data to use when creating a new stage instance
	 * @param options - The options to use when creating a new stage instance
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
	 * Gets a stage instance
	 *
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#get-stage-instance}
	 * @param stageInstanceId - The id of the stage instance
	 * @param options - The options to use when fetching the stage instance
	 */
	public async get(stageInstanceId: string, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.stageInstance(stageInstanceId), { signal }) as Promise<RESTGetAPIStageInstanceResult>;
	}

	/**
	 * Edits a stage instance
	 *
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#modify-stage-instance}
	 * @param stageInstanceId - The id of the stage instance to edit
	 * @param body - The new stage instance data
	 * @param options - The options to use when editing the stage instance
	 */
	public async edit(
		stageInstanceId: string,
		body: RESTPatchAPIStageInstanceJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.stageInstance(stageInstanceId), {
			body,
			reason,
			signal,
		}) as Promise<RESTPatchAPIStageInstanceResult>;
	}

	/**
	 * Deletes a stage instance
	 *
	 * @see {@link https://discord.com/developers/docs/resources/stage-instance#delete-stage-instance}
	 * @param stageInstanceId - The id of the stage instance to delete
	 * @param options - The options to use when deleting the stage instance
	 */
	public async delete(stageInstanceId: string, { reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {}) {
		await this.rest.delete(Routes.stageInstance(stageInstanceId), { reason, signal });
	}
}
