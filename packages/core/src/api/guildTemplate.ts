import type { REST } from '@discordjs/rest';
import type { APITemplate, RESTPostAPITemplateCreateGuildJSONBody } from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v10';

export const guildTemplates = (api: REST) => ({
	async get(templateCode: string) {
		return (await api.get(Routes.template(templateCode))) as APITemplate;
	},

	async create(templateCode: string, options: RESTPostAPITemplateCreateGuildJSONBody) {
		return (await api.post(Routes.template(templateCode), {
			body: options,
		})) as APITemplate;
	},
});
