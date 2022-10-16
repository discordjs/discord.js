import type { REST } from '@discordjs/rest';
import {
	Routes,
	type RESTPostAPITemplateCreateGuildJSONBody,
	type RESTGetAPITemplateResult,
	type RESTPostAPIGuildTemplatesResult,
} from 'discord-api-types/v10';

export class GuildTemplatesAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches a guild template
	 *
	 * @param templateCode - The code of the template
	 */
	public async get(templateCode: string) {
		return this.rest.get(Routes.template(templateCode)) as Promise<RESTGetAPITemplateResult>;
	}

	/**
	 * Creates a new template
	 *
	 * @param templateCode - The code of the template
	 * @param options - The options to use when creating the template
	 */
	public async create(templateCode: string, options: RESTPostAPITemplateCreateGuildJSONBody) {
		return this.rest.post(Routes.template(templateCode), { body: options }) as Promise<RESTPostAPIGuildTemplatesResult>;
	}
}
