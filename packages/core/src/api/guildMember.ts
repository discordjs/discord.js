import type { REST } from '@discordjs/rest';
import { makeURLSearchParams } from '@discordjs/rest';
import type {
	APIGuildMember,
	RESTGetAPIGuildMembersQuery,
	RESTPatchAPIGuildMemberJSONBody,
} from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v10';

export const guildMembers = (api: REST) => ({
	async fetch(guildId: string, userId: string) {
		return (await api.get(Routes.guildMember(guildId, userId))) as APIGuildMember;
	},

	async fetchAll(guildId: string, options: RESTGetAPIGuildMembersQuery = {}) {
		return (await api.get(Routes.guildMembers(guildId), {
			query: makeURLSearchParams({ ...options }),
		})) as APIGuildMember[];
	},

	async search(guildId: string, query: string, limit: number = 1) {
		return (await api.get(Routes.guildMembersSearch(guildId), {
			query: makeURLSearchParams({ query, limit }),
		})) as APIGuildMember[];
	},

	async edit(guildId: string, userId: string, options?: RESTPatchAPIGuildMemberJSONBody, reason?: string) {
		return (await api.patch(Routes.guildMember(guildId, userId), {
			reason,
			body: options,
		})) as APIGuildMember;
	},

	async addRole(guildId: string, userId: string, roleId: string, reason?: string) {
		await api.put(Routes.guildMemberRole(guildId, userId, roleId), { reason });
	},

	async removeRole(guildId: string, userId: string, roleId: string, reason?: string) {
		await api.delete(Routes.guildMemberRole(guildId, userId, roleId), { reason });
	},
});
