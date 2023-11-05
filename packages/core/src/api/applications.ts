/* eslint-disable jsdoc/check-param-names */

import type { RequestData, REST } from '@discordjs/rest';
import {
	type RESTGetCurrentApplicationResult,
	type RESTPatchCurrentApplicationJSONBody,
	type RESTPatchCurrentApplicationResult,
	Routes,
} from 'discord-api-types/v10';

export class ApplicationsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches the application associated with the requesting bot user.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/application#get-current-application}
	 * @param options - The options for fetching the application
	 */
	public async getCurrent({ signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.currentApplication(), { signal }) as Promise<RESTGetCurrentApplicationResult>;
	}

	/**
	 * Edits properties of the application associated with the requesting bot user.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/application#edit-current-application}
	 * @param body - The new application data
	 * @param options - The options for editing the application
	 */
	public async editCurrent(body: RESTPatchCurrentApplicationJSONBody, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.patch(Routes.currentApplication(), {
			body,
			signal,
		}) as Promise<RESTPatchCurrentApplicationResult>;
	}
}
