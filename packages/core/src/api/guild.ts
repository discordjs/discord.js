import type { Buffer } from 'node:buffer';
import type { REST } from '@discordjs/rest';
import { makeURLSearchParams } from '@discordjs/rest';
import type {
	APIAuditLog,
	APIBan,
	APIChannel,
	APIEmoji,
	APIGuild,
	APIGuildIntegration,
	APIGuildPreview,
	APIGuildScheduledEvent,
	APIGuildWelcomeScreen,
	APIGuildWidget,
	APIGuildWidgetSettings,
	APIInvite,
	APIRole,
	APISticker,
	APITemplate,
	APIThreadChannel,
	APIVoiceRegion,
	GuildMFALevel,
	GuildWidgetStyle,
	RESTGetAPIAuditLogQuery,
	RESTGetAPIGuildPruneCountResult,
	RESTGetAPIGuildScheduledEventQuery,
	RESTGetAPIGuildScheduledEventsQuery,
	RESTGetAPIGuildScheduledEventUsersQuery,
	RESTGetAPIGuildVanityUrlResult,
	RESTPatchAPIGuildChannelPositionsJSONBody,
	RESTPatchAPIGuildEmojiJSONBody,
	RESTPatchAPIGuildJSONBody,
	RESTPatchAPIGuildRoleJSONBody,
	RESTPatchAPIGuildRolePositionsJSONBody,
	RESTPatchAPIGuildScheduledEventJSONBody,
	RESTPatchAPIGuildStickerJSONBody,
	RESTPatchAPIGuildTemplateJSONBody,
	RESTPatchAPIGuildVoiceStateUserJSONBody,
	RESTPatchAPIGuildWelcomeScreenJSONBody,
	RESTPatchAPIGuildWidgetSettingsJSONBody,
	RESTPostAPIGuildChannelJSONBody,
	RESTPostAPIGuildEmojiJSONBody,
	RESTPostAPIGuildPruneJSONBody,
	RESTPostAPIGuildRoleJSONBody,
	RESTPostAPIGuildScheduledEventJSONBody,
	RESTPostAPIGuildsJSONBody,
	RESTPostAPIGuildTemplatesJSONBody,
	RESTPutAPIGuildBanJSONBody,
} from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v10';

export const guilds = (api: REST) => ({
	async get(guildId: string) {
		return (await api.get(Routes.guild(guildId))) as APIGuild;
	},

	async getPreview(guildId: string) {
		return (await api.get(Routes.guildPreview(guildId))) as APIGuildPreview;
	},

	async create(guild: RESTPostAPIGuildsJSONBody) {
		return (await api.post(Routes.guilds(), {
			body: guild,
		})) as APIGuild;
	},

	async edit(guildId: string, guild: RESTPatchAPIGuildJSONBody, reason?: string) {
		return (await api.patch(Routes.guild(guildId), {
			reason,
			body: guild,
		})) as APIGuild;
	},

	async delete(guildId: string, reason?: string) {
		return (await api.delete(Routes.guild(guildId), { reason })) as APIGuild;
	},

	async getChannels(guildId: string) {
		return (await api.get(Routes.guildChannels(guildId))) as APIChannel[];
	},

	async createChannel(guildId: string, channel: RESTPostAPIGuildChannelJSONBody, reason?: string) {
		return (await api.post(Routes.guildChannels(guildId), {
			reason,
			body: {
				...channel,
			},
		})) as APIChannel;
	},

	async setChannelPosition(guildId: string, options: RESTPatchAPIGuildChannelPositionsJSONBody, reason?: string) {
		return api.patch(Routes.guildChannels(guildId), {
			reason,
			body: options,
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
			body: options,
		});
	},

	async unban(guildId: string, userId: string, reason?: string) {
		return api.delete(Routes.guildBan(guildId, userId), { reason });
	},

	async getRoles(guildId: string) {
		return (await api.get(Routes.guildRoles(guildId))) as APIRole[];
	},

	async createRole(guildId: string, role: RESTPostAPIGuildRoleJSONBody, reason?: string) {
		return (await api.post(Routes.guildRoles(guildId), {
			reason,
			body: role,
		})) as APIRole;
	},

	async setRolePosition(guildId: string, options: RESTPatchAPIGuildRolePositionsJSONBody, reason?: string) {
		return api.patch(Routes.guildRoles(guildId), {
			reason,
			body: options,
		});
	},

	async editRole(guildId: string, roleId: string, options: RESTPatchAPIGuildRoleJSONBody, reason?: string) {
		return api.patch(Routes.guildRole(guildId, roleId), {
			reason,
			body: options,
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
			body: options,
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

	async editWidgetSettings(guildId: string, widget: RESTPatchAPIGuildWidgetSettingsJSONBody, reason?: string) {
		return (await api.patch(Routes.guildWidgetSettings(guildId), {
			reason,
			body: widget,
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

	async editWelcomeScreen(guildId: string, welcomeScreen?: RESTPatchAPIGuildWelcomeScreenJSONBody, reason?: string) {
		return (await api.patch(Routes.guildWelcomeScreen(guildId), {
			reason,
			body: welcomeScreen,
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
			body: options,
		});
	},

	async listEmojis(guildId: string) {
		return (await api.get(Routes.guildEmojis(guildId))) as APIEmoji[];
	},

	async getEmoji(guildId: string, emojiId: string) {
		return (await api.get(Routes.guildEmoji(guildId, emojiId))) as APIEmoji;
	},

	async createEmoji(guildId: string, options: RESTPostAPIGuildEmojiJSONBody, reason?: string) {
		return (await api.post(Routes.guildEmojis(guildId), {
			reason,
			body: options,
		})) as APIEmoji;
	},

	async editEmoji(guildId: string, emojiId: string, options: RESTPatchAPIGuildEmojiJSONBody, reason?: string) {
		return (await api.patch(Routes.guildEmoji(guildId, emojiId), {
			reason,
			body: options,
		})) as APIEmoji;
	},

	async deleteEmoji(guildId: string, emojiId: string, reason?: string) {
		return api.delete(Routes.guildEmoji(guildId, emojiId), { reason });
	},

	async getAllEvents(guildId: string, options: RESTGetAPIGuildScheduledEventsQuery = {}) {
		return (await api.get(Routes.guildScheduledEvents(guildId), {
			query: makeURLSearchParams({ ...options }),
		})) as APIGuildScheduledEvent[];
	},

	async createEvent(guildId: string, event: RESTPostAPIGuildScheduledEventJSONBody, reason?: string) {
		return (await api.post(Routes.guildScheduledEvents(guildId), {
			reason,
			body: event,
		})) as APIGuildScheduledEvent;
	},

	async getEvent(guildId: string, eventId: string, options: RESTGetAPIGuildScheduledEventQuery = {}) {
		return (await api.get(Routes.guildScheduledEvent(guildId, eventId), {
			query: makeURLSearchParams({ ...options }),
		})) as APIGuildScheduledEvent;
	},

	async editEvent(guildId: string, eventId: string, event: RESTPatchAPIGuildScheduledEventJSONBody, reason?: string) {
		return (await api.patch(Routes.guildScheduledEvent(guildId, eventId), {
			reason,
			body: event,
		})) as APIGuildScheduledEvent;
	},

	async deleteEvent(guildId: string, eventId: string, reason?: string) {
		await api.delete(Routes.guildScheduledEvent(guildId, eventId), { reason });
	},

	async getEventUsers(guildId: string, eventId: string, options: RESTGetAPIGuildScheduledEventUsersQuery = {}) {
		return (await api.get(Routes.guildScheduledEventUsers(guildId, eventId), {
			query: makeURLSearchParams({ ...options }),
		})) as APIGuildScheduledEvent[];
	},

	async getTemplates(guildId: string) {
		return (await api.get(Routes.guildTemplates(guildId))) as APITemplate[];
	},

	async createTemplate(guildId: string, options: RESTPostAPIGuildTemplatesJSONBody) {
		return (await api.post(Routes.guildTemplates(guildId), {
			body: options,
		})) as APITemplate;
	},

	async syncTemplate(guildId: string, templateCode: string) {
		return (await api.put(Routes.guildTemplate(guildId, templateCode))) as APITemplate;
	},

	async editTemplate(guildId: string, templateCode: string, options: RESTPatchAPIGuildTemplateJSONBody) {
		return (await api.patch(Routes.guildTemplate(guildId, templateCode), {
			body: options,
		})) as APITemplate;
	},

	async deleteTemplate(guildId: string, templateCode: string) {
		await api.delete(Routes.guildTemplate(guildId, templateCode));
	},

	async getStickers(guildId: string) {
		return (await api.get(Routes.guildStickers(guildId))) as APISticker[];
	},

	async getSticker(guildId: string, stickerId: string) {
		return (await api.get(Routes.guildSticker(guildId, stickerId))) as APISticker;
	},

	async editSticker(guildId: string, stickerId: string, options: RESTPatchAPIGuildStickerJSONBody, reason?: string) {
		return (await api.patch(Routes.guildSticker(guildId, stickerId), {
			reason,
			body: options,
		})) as APISticker;
	},

	async deleteSticker(guildId: string, stickerId: string, reason?: string) {
		await api.delete(Routes.guildSticker(guildId, stickerId), { reason });
	},

	async getAuditLogs(guildId: string, options: RESTGetAPIAuditLogQuery = {}) {
		return (await api.get(Routes.guildAuditLog(guildId), {
			query: makeURLSearchParams({ ...options }),
		})) as APIAuditLog[];
	},
});
