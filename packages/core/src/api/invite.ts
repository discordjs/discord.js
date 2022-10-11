import type { REST } from '@discordjs/rest';
import { Routes, type APIInvite } from 'discord-api-types/v10';

export const invites = (api: REST) => ({
	async get(code: string) {
		return (await api.get(Routes.invite(code))) as APIInvite;
	},

	async delete(code: string, reason?: string) {
		await api.delete(Routes.invite(code), { reason });
	},
});
