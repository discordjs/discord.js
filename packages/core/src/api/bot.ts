import type { REST } from '@discordjs/rest';
import { makeURLSearchParams } from '@discordjs/rest';
import type {
	APIDMChannel,
	APIPartialGuild,
	APIUser,
	RESTGetAPICurrentUserGuildsQuery,
	RESTPatchAPICurrentUserJSONBody,
	RESTPatchAPIGuildMemberJSONBody,
	RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
} from 'discord-api-types/v10';
import { Routes, type APIGuildMember } from 'discord-api-types/v10';

export const bots = (api: REST) => ({
	async getUser() {
		return (await api.get(Routes.user('@me'))) as APIUser;
	},

	async getGuilds(options: RESTGetAPICurrentUserGuildsQuery = {}) {
		return (await api.get(Routes.userGuilds(), { query: makeURLSearchParams({ ...options }) })) as APIPartialGuild[];
	},

	async leaveGuild(guildId: string) {
		await api.delete(Routes.userGuild(guildId));
	},

	async edit(options: RESTPatchAPICurrentUserJSONBody) {
		return (await api.patch(Routes.user('@me'), { body: options })) as APIUser;
	},

	async getMember(guildId: string) {
		return (await api.get(Routes.userGuildMember(guildId))) as APIGuildMember;
	},

	async editMember(guildId: string, options: RESTPatchAPIGuildMemberJSONBody = {}, reason?: string) {
		return (await api.patch(Routes.guildMember(guildId, '@me'), {
			reason,
			body: options,
		})) as APIGuildMember;
	},

	async setVoiceState(guildId: string, options: RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody = {}) {
		return (await api.patch(Routes.guildVoiceState(guildId, '@me'), {
			body: options,
		})) as APIGuildMember;
	},

	async createDM(userId: string) {
		return (await api.post(Routes.userChannels(), {
			body: {
				recipient_id: userId,
			},
		})) as APIDMChannel;
	},
});
