import type { REST } from '@discordjs/rest';
import type { APITemplate, RESTPostAPITemplateCreateGuildJSONBody } from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v10';

export class GuildTemplatesAPI {
	private readonly rest: REST;

	public constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Fetches a guild template
	 *
	 * @param templateCode - The code of the template
	 */
	public async get(templateCode: string) {
		return (await this.rest.get(Routes.template(templateCode))) as APITemplate;
	}

	/**
	 * Creates a new template
	 *
	 * @param templateCode - The code of the template
	 * @param options - The options to use when creating the template
	 */
	public async create(templateCode: string, options: RESTPostAPITemplateCreateGuildJSONBody) {
		return (await this.rest.post(Routes.template(templateCode), {
			body: options,
		})) as APITemplate;
	}
}
