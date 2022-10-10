import type { Buffer } from 'node:buffer';
import type { REST } from '@discordjs/rest';
import { makeURLSearchParams } from '@discordjs/rest';
import type {
	APIBan,
	APIChannel,
	APIGuild,
	APIGuildIntegration,
	APIGuildPreview,
	APIGuildWelcomeScreen,
	APIGuildWidget,
	APIGuildWidgetSettings,
	APIInvite,
	APIRole,
	APIThreadChannel,
	APIVoiceRegion,
	GuildMFALevel,
	GuildWidgetStyle,
	RESTGetAPIGuildPruneCountResult,
	RESTGetAPIGuildVanityUrlResult,
	RESTPatchAPIGuildChannelPositionsJSONBody,
	RESTPatchAPIGuildJSONBody,
	RESTPatchAPIGuildRoleJSONBody,
	RESTPatchAPIGuildRolePositionsJSONBody,
	RESTPatchAPIGuildVoiceStateUserJSONBody,
	RESTPatchAPIGuildWelcomeScreenJSONBody,
	RESTPatchAPIGuildWidgetSettingsJSONBody,
	RESTPostAPIGuildChannelJSONBody,
	RESTPostAPIGuildPruneJSONBody,
	RESTPostAPIGuildRoleJSONBody,
	RESTPostAPIGuildsJSONBody,
	RESTPutAPIGuildBanJSONBody,
} from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v10';

export const guilds = (api: REST) => ({
	async fetch(guildId: string) {
		return (await api.get(Routes.guild(guildId))) as APIGuild;
	},

	async fetchPreview(guildId: string) {
		return (await api.get(Routes.guildPreview(guildId))) as APIGuildPreview;
	},

	async create(options: RESTPostAPIGuildsJSONBody) {
		return (await api.post(Routes.guilds(), {
			body: {
				...options,
			},
		})) as APIGuild;
	},

	async edit(guildId: string, options: RESTPatchAPIGuildJSONBody, reason?: string) {
		return (await api.patch(Routes.guild(guildId), {
			reason,
			body: {
				...options,
			},
		})) as APIGuild;
	},

	async delete(guildId: string, reason?: string) {
		return (await api.delete(Routes.guild(guildId), { reason })) as APIGuild;
	},

	async fetchChannels(guildId: string) {
		return (await api.get(Routes.guildChannels(guildId))) as APIChannel[];
	},

	async createChannel(guildId: string, options: RESTPostAPIGuildChannelJSONBody, reason?: string) {
		return (await api.post(Routes.guildChannels(guildId), {
			reason,
			body: {
				...options,
			},
		})) as APIChannel;
	},

	async setChannelPosition(guildId: string, options: RESTPatchAPIGuildChannelPositionsJSONBody, reason?: string) {
		return api.patch(Routes.guildChannels(guildId), {
			reason,
			body: {
				...options,
			},
		});
	},

	async getActiveThreads(guildId: string) {
		return (await api.get(Routes.guildActiveThreads(guildId))) as APIThreadChannel[];
	},

	async getBans(guildId: string) {
		return (await api.get(Routes.guildBans(guildId))) as APIBan[];
	},

	async ban(guildId: string, userId: string, options?: RESTPutAPIGuildBanJSONBody, reason?: string) {
		return api.put(Routes.guildBan(guildId, userId), {
			reason,
			body: {
				...options,
			},
		});
	},

	async unban(guildId: string, userId: string, reason?: string) {
		return api.delete(Routes.guildBan(guildId, userId), { reason });
	},

	async getRoles(guildId: string) {
		return (await api.get(Routes.guildRoles(guildId))) as APIRole[];
	},

	async createRole(guildId: string, options: RESTPostAPIGuildRoleJSONBody, reason?: string) {
		return (await api.post(Routes.guildRoles(guildId), {
			reason,
			body: {
				...options,
			},
		})) as APIRole;
	},

	async setRolePosition(guildId: string, options: RESTPatchAPIGuildRolePositionsJSONBody, reason?: string) {
		return api.patch(Routes.guildRoles(guildId), {
			reason,
			body: {
				...options,
			},
		});
	},

	async editRole(guildId: string, roleId: string, options: RESTPatchAPIGuildRoleJSONBody, reason?: string) {
		return api.patch(Routes.guildRole(guildId, roleId), {
			reason,
			body: {
				...options,
			},
		});
	},

	async deleteRole(guildId: string, roleId: string, reason?: string) {
		return api.delete(Routes.guildRole(guildId, roleId), { reason });
	},

	async editMFALevel(guildId: string, level: number, reason?: string) {
		return (await api.patch(Routes.guild(guildId), {
			reason,
			body: {
				mfa_level: level,
			},
		})) as GuildMFALevel;
	},

	async getPruneCount(guildId: string, options: { days?: number; includeRoles?: string[] } = {}) {
		return (await api.get(Routes.guildPrune(guildId), {
			query: makeURLSearchParams({ ...options }),
		})) as RESTGetAPIGuildPruneCountResult;
	},

	async beginPrune(guildId: string, options?: RESTPostAPIGuildPruneJSONBody, reason?: string) {
		return (await api.post(Routes.guildPrune(guildId), {
			body: { ...options },
			reason,
		})) as RESTGetAPIGuildPruneCountResult;
	},

	async getVoiceRegions(guildId: string) {
		return (await api.get(Routes.guildVoiceRegions(guildId))) as APIVoiceRegion[];
	},

	async getInvites(guildId: string) {
		return (await api.get(Routes.guildInvites(guildId))) as APIInvite[];
	},

	async getIntegrations(guildId: string) {
		return (await api.get(Routes.guildIntegrations(guildId))) as APIGuildIntegration[];
	},

	async deleteIntegration(guildId: string, integrationId: string, reason?: string) {
		return api.delete(Routes.guildIntegration(guildId, integrationId), { reason });
	},

	async getWidgetSettings(guildId: string) {
		return (await api.get(Routes.guildWidgetSettings(guildId))) as APIGuildWidgetSettings;
	},

	async editWidgetSettings(guildId: string, options: RESTPatchAPIGuildWidgetSettingsJSONBody, reason?: string) {
		return (await api.patch(Routes.guildWidgetSettings(guildId), {
			reason,
			body: {
				...options,
			},
		})) as APIGuildWidget;
	},

	async getWidget(guildId: string) {
		return (await api.get(Routes.guildWidgetJSON(guildId))) as APIGuildWidget;
	},

	async getVanityURL(guildId: string) {
		return (await api.get(Routes.guildVanityUrl(guildId))) as RESTGetAPIGuildVanityUrlResult;
	},

	async getWidgetImage(guildId: string, style?: GuildWidgetStyle) {
		return (await api.get(Routes.guildWidgetImage(guildId), {
			query: makeURLSearchParams({ style }),
		})) as Buffer;
	},

	async getWelcomeScreen(guildId: string) {
		return (await api.get(Routes.guildWelcomeScreen(guildId))) as APIGuildWelcomeScreen;
	},

	async editWelcomeScreen(guildId: string, options?: RESTPatchAPIGuildWelcomeScreenJSONBody, reason?: string) {
		return (await api.patch(Routes.guildWelcomeScreen(guildId), {
			reason,
			body: {
				...options,
			},
		})) as APIGuildWelcomeScreen;
	},

	async modifyUserVoiceState(
		guildId: string,
		userId: string,
		options: RESTPatchAPIGuildVoiceStateUserJSONBody,
		reason?: string,
	) {
		return api.patch(Routes.guildVoiceState(guildId, userId), {
			reason,
			body: {
				...options,
			},
		});
	},
});
