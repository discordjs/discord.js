/* eslint-disable jsdoc/check-param-names */

import type { RequestData, REST } from '@discordjs/rest';
import { type RESTGetCurrentApplicationResult, Routes } from 'discord-api-types/v10';

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
}
