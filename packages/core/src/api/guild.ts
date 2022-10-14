/* eslint-disable jsdoc/check-param-names */
import type { Buffer } from 'node:buffer';
import { makeURLSearchParams, type REST } from '@discordjs/rest';
import {
	Routes,
	type APIAuditLog,
	type APIBan,
	type APIChannel,
	type APIEmoji,
	type APIGuild,
	type APIGuildIntegration,
	type APIGuildMember,
	type APIGuildPreview,
	type APIGuildScheduledEvent,
	type APIGuildWelcomeScreen,
	type APIGuildWidget,
	type APIGuildWidgetSettings,
	type APIInvite,
	type APIRole,
	type APISticker,
	type APITemplate,
	type APIThreadChannel,
	type APIVoiceRegion,
	type GuildMFALevel,
	type GuildWidgetStyle,
	type RESTGetAPIAuditLogQuery,
	type RESTGetAPIGuildMembersQuery,
	type RESTGetAPIGuildPruneCountResult,
	type RESTGetAPIGuildScheduledEventQuery,
	type RESTGetAPIGuildScheduledEventsQuery,
	type RESTGetAPIGuildScheduledEventUsersQuery,
	type RESTGetAPIGuildVanityUrlResult,
	type RESTPatchAPIGuildChannelPositionsJSONBody,
	type RESTPatchAPIGuildEmojiJSONBody,
	type RESTPatchAPIGuildJSONBody,
	type RESTPatchAPIGuildRoleJSONBody,
	type RESTPatchAPIGuildRolePositionsJSONBody,
	type RESTPatchAPIGuildScheduledEventJSONBody,
	type RESTPatchAPIGuildStickerJSONBody,
	type RESTPatchAPIGuildTemplateJSONBody,
	type RESTPatchAPIGuildVoiceStateUserJSONBody,
	type RESTPatchAPIGuildWelcomeScreenJSONBody,
	type RESTPatchAPIGuildWidgetSettingsJSONBody,
	type RESTPostAPIGuildChannelJSONBody,
	type RESTPostAPIGuildEmojiJSONBody,
	type RESTPostAPIGuildPruneJSONBody,
	type RESTPostAPIGuildRoleJSONBody,
	type RESTPostAPIGuildScheduledEventJSONBody,
	type RESTPostAPIGuildsJSONBody,
	type RESTPostAPIGuildTemplatesJSONBody,
	type RESTPutAPIGuildBanJSONBody,
} from 'discord-api-types/v10';

export class GuildsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches a guild
	 *
	 * @param guildId - The id of the guild
	 */
	public async get(guildId: string) {
		return (await this.rest.get(Routes.guild(guildId))) as APIGuild;
	}

	/**
	 * Fetches a guild preview
	 *
	 * @param guildId - The id of the guild to fetch the preview for
	 */
	public async getPreview(guildId: string) {
		return (await this.rest.get(Routes.guildPreview(guildId))) as APIGuildPreview;
	}

	/**
	 * Creates a guild
	 *
	 * @param guild - The guild to create
	 */
	public async create(guild: RESTPostAPIGuildsJSONBody) {
		return (await this.rest.post(Routes.guilds(), {
			body: guild,
		})) as APIGuild;
	}

	/**
	 * Edits a guild
	 *
	 * @param guildId - The id of the guild to edit
	 * @param guild - The new guild data
	 * @param reason - The reason for editing this guild
	 */
	public async edit(guildId: string, guild: RESTPatchAPIGuildJSONBody, reason?: string) {
		return (await this.rest.patch(Routes.guild(guildId), {
			reason,
			body: guild,
		})) as APIGuild;
	}

	/**
	 * Deletes a guild
	 *
	 * @param guildId - The id of the guild to delete
	 * @param reason - The reason for deleting this guild
	 */
	public async delete(guildId: string, reason?: string) {
		return (await this.rest.delete(Routes.guild(guildId), { reason })) as APIGuild;
	}

	/**
	 * Fetches all the members of a guild
	 *
	 * @param guildId - The id of the guild
	 * @param options - The options to use when fetching the guild members
	 */
	public async getAll(guildId: string, options: RESTGetAPIGuildMembersQuery = {}) {
		return (await this.rest.get(Routes.guildMembers(guildId), {
			query: makeURLSearchParams(options as Record<string, unknown>),
		})) as APIGuildMember[];
	}

	/**
	 * Fetches a guild's channels
	 *
	 * @param guildId - The id of the guild to fetch the channels for
	 */
	public async getChannels(guildId: string) {
		return (await this.rest.get(Routes.guildChannels(guildId))) as APIChannel[];
	}

	/**
	 * Creates a guild channel
	 *
	 * @param guildId - The id of the guild to create the channel in
	 * @param channel - The data to create the new channel
	 * @param reason - The reason for creating this channel
	 * @returns
	 */
	public async createChannel(guildId: string, channel: RESTPostAPIGuildChannelJSONBody, reason?: string) {
		return (await this.rest.post(Routes.guildChannels(guildId), {
			reason,
			body: channel,
		})) as APIChannel;
	}

	/**
	 * Edits a guild channel's positions
	 *
	 * @param guildId - The id of the guild to edit the channel positions for
	 * @param options - The options to edit the channel positions with
	 * @param reason - The reason for editing the channel positions
	 */
	public async setChannelPosition(
		guildId: string,
		options: RESTPatchAPIGuildChannelPositionsJSONBody,
		reason?: string,
	) {
		return this.rest.patch(Routes.guildChannels(guildId), {
			reason,
			body: options,
		});
	}

	/**
	 * Fetches the active threads in a guild
	 *
	 * @param guildId - The id of the guild to fetch the active threads for
	 */
	public async getActiveThreads(guildId: string) {
		return (await this.rest.get(Routes.guildActiveThreads(guildId))) as APIThreadChannel[];
	}

	/**
	 * Fetches a guild member ban
	 *
	 * @param guildId - The id of the guild to fetch the ban for
	 */
	public async getBans(guildId: string) {
		return (await this.rest.get(Routes.guildBans(guildId))) as APIBan[];
	}

	/**
	 * Bans a guild member
	 *public
	 *
	 * @param guildId - The id of the guild to ban the member in
	 * @param userId - The id of the user to ban
	 * @param options - Options for banning the user
	 * @param reason - The reason for banning the user
	 * @returns
	 */
	public async ban(guildId: string, userId: string, options: RESTPutAPIGuildBanJSONBody = {}, reason?: string) {
		return this.rest.put(Routes.guildBan(guildId, userId), {
			reason,
			body: options,
		});
	}

	/**
	 * Unbans a guild member
	 *
	 * @param guildId - The id of the guild to unban the member in
	 * @param userId - The id of the user to unban
	 * @param reason - The reason for unbanning the user
	 */
	public async unban(guildId: string, userId: string, reason?: string) {
		return this.rest.delete(Routes.guildBan(guildId, userId), { reason });
	}

	/**
	 * Gets all the roles in a guild
	 *
	 * @param guildId - The id of the guild to fetch the roles fo
	 */
	public async getRoles(guildId: string) {
		return (await this.rest.get(Routes.guildRoles(guildId))) as APIRole[];
	}

	/**
	 * Creates a guild role
	 *
	 * @param guildId - The id of the guild to create the role in
	 * @param role - The data to create the role with
	 * @param reason - The reason for creating the role
	 */
	public async createRole(guildId: string, role: RESTPostAPIGuildRoleJSONBody, reason?: string) {
		return (await this.rest.post(Routes.guildRoles(guildId), {
			reason,
			body: role,
		})) as APIRole;
	}

	/**
	 * Sets a role position in a guild
	 *
	 * @param guildId - The id of the guild to set role positions for
	 * @param options - The options for setting a role position
	 * @param reason - The reason for setting the role position
	 */
	public async setRolePosition(guildId: string, options: RESTPatchAPIGuildRolePositionsJSONBody, reason?: string) {
		return this.rest.patch(Routes.guildRoles(guildId), {
			reason,
			body: options,
		});
	}

	/**
	 * Edits a guild role
	 *
	 * @param guildId - The id of the guild to edit the role in
	 * @param roleId - The id of the role to edit
	 * @param options - Options for editing the role
	 * @param reason - The reason for editing the role
	 */
	public async editRole(guildId: string, roleId: string, options: RESTPatchAPIGuildRoleJSONBody, reason?: string) {
		return this.rest.patch(Routes.guildRole(guildId, roleId), {
			reason,
			body: options,
		});
	}

	/**
	 * Deletes a guild role
	 *
	 * @param guildId - The id of the guild to delete the role in
	 * @param roleId - The id of the role to delete
	 * @param reason - The reason for deleting the role
	 */
	public async deleteRole(guildId: string, roleId: string, reason?: string) {
		return this.rest.delete(Routes.guildRole(guildId, roleId), { reason });
	}

	/**
	 * Edits the multi-factor-authentication (MFA) level of a guild
	 *
	 * @param guildId - The id of the guild to edit the MFA level for
	 * @param level - The new MFA level
	 * @param reason - The reason for editing the MFA level
	 */
	public async editMFALevel(guildId: string, level: number, reason?: string) {
		return (await this.rest.patch(Routes.guild(guildId), {
			reason,
			body: {
				mfa_level: level,
			},
		})) as GuildMFALevel;
	}

	/**
	 * Fetch the number of pruned members in a guild
	 *
	 *
	 * @param guildId - The id of the guild to fetch the number of pruned members for
	 * @param options - The options for fetching the number of pruned members
	 */
	public async getPruneCount(guildId: string, options: { days?: number; includeRoles?: string[] } = {}) {
		return (await this.rest.get(Routes.guildPrune(guildId), {
			query: makeURLSearchParams(options as Record<string, unknown>),
		})) as RESTGetAPIGuildPruneCountResult;
	}

	/**
	 * Prunes members in a guild
	 *
	 * @param guildId - The id of the guild to prune members in
	 * @param options - The options for pruning members
	 * @param reason - The reason for pruning members
	 */
	public async beginPrune(guildId: string, options: RESTPostAPIGuildPruneJSONBody = {}, reason?: string) {
		return (await this.rest.post(Routes.guildPrune(guildId), {
			body: options,
			reason,
		})) as RESTGetAPIGuildPruneCountResult;
	}

	/**
	 * Fetches voice regions for a guild
	 *
	 * @param guildId - The id of the guild to fetch the voice regions for
	 */
	public async getVoiceRegions(guildId: string) {
		return (await this.rest.get(Routes.guildVoiceRegions(guildId))) as APIVoiceRegion[];
	}

	/**
	 * Fetches the invites for a guild
	 *
	 * @param guildId - The id of the guild to fetch the invites for
	 */
	public async getInvites(guildId: string) {
		return (await this.rest.get(Routes.guildInvites(guildId))) as APIInvite[];
	}

	/**
	 * Fetches the integrations for a guild
	 *
	 * @param guildId - The id of the guild to fetch the integrations for
	 */
	public async getIntegrations(guildId: string) {
		return (await this.rest.get(Routes.guildIntegrations(guildId))) as APIGuildIntegration[];
	}

	/**
	 * Deletes an integration from a guild
	 *
	 * @param guildId - The id of the guild to delete the integration from
	 * @param integrationId - The id of the integration to delete
	 * @param reason - The reason for deleting the integration
	 */
	public async deleteIntegration(guildId: string, integrationId: string, reason?: string) {
		return this.rest.delete(Routes.guildIntegration(guildId, integrationId), { reason });
	}

	/**
	 * Fetches the widget settings for a guild
	 *
	 * @param guildId - The id of the guild to fetch the widget settings for
	 */
	public async getWidgetSettings(guildId: string) {
		return (await this.rest.get(Routes.guildWidgetSettings(guildId))) as APIGuildWidgetSettings;
	}

	/**
	 * Edits the widget settings for a guild
	 *
	 * @param guildId - The id of the guild to edit the widget settings for
	 * @param widgetSettings - The new widget settings
	 * @param reason - The reason for editing the widget settings
	 */
	public async editWidgetSettings(
		guildId: string,
		widgetSettings: RESTPatchAPIGuildWidgetSettingsJSONBody,
		reason?: string,
	) {
		return (await this.rest.patch(Routes.guildWidgetSettings(guildId), {
			reason,
			body: widgetSettings,
		})) as APIGuildWidget;
	}

	/**
	 * Fetches the widget for a guild
	 *
	 * @param guildId - The id of the guild to fetch the widget for
	 */
	public async getWidget(guildId: string) {
		return (await this.rest.get(Routes.guildWidgetJSON(guildId))) as APIGuildWidget;
	}

	/**
	 * Fetches the vanity url for a guild
	 *
	 * @param guildId - The id of the guild to fetch the vanity url for
	 */
	public async getVanityURL(guildId: string) {
		return (await this.rest.get(Routes.guildVanityUrl(guildId))) as RESTGetAPIGuildVanityUrlResult;
	}

	/**
	 * Fetches the widget image for a guild
	 *
	 * @param guildId - The id of the guild to fetch the widget image for
	 * @param style - The style of the widget image
	 */
	public async getWidgetImage(guildId: string, style?: GuildWidgetStyle) {
		return (await this.rest.get(Routes.guildWidgetImage(guildId), {
			query: makeURLSearchParams({ style }),
		})) as Buffer;
	}

	/**
	 * Fetches the welcome screen for a guild
	 *
	 * @param guildId - The id of the guild to fetch the welcome screen for
	 */
	public async getWelcomeScreen(guildId: string) {
		return (await this.rest.get(Routes.guildWelcomeScreen(guildId))) as APIGuildWelcomeScreen;
	}

	/**
	 * Edits the welcome screen for a guild
	 *
	 * @param guildId - The id of the guild to edit the welcome screen for
	 * @param welcomeScreen - The new welcome screen
	 * @param reason - The reason for editing the welcome screen
	 */
	public async editWelcomeScreen(
		guildId: string,
		welcomeScreen?: RESTPatchAPIGuildWelcomeScreenJSONBody,
		reason?: string,
	) {
		return (await this.rest.patch(Routes.guildWelcomeScreen(guildId), {
			reason,
			body: welcomeScreen,
		})) as APIGuildWelcomeScreen;
	}

	/**
	 * Edits a user's voice state in a guild
	 *
	 * @param guildId - The id of the guild to edit the current user's voice state in
	 * @param userId - The id of the user to edit the voice state for
	 * @param options - The options for editing the voice state
	 * @param reason - The reason for editing the voice state
	 */
	public async editUserVoiceState(
		guildId: string,
		userId: string,
		options: RESTPatchAPIGuildVoiceStateUserJSONBody,
		reason?: string,
	) {
		return this.rest.patch(Routes.guildVoiceState(guildId, userId), {
			reason,
			body: options,
		});
	}

	/**
	 * Fetches all emojis for a guild
	 *
	 * @param guildId - The id of the guild to fetch the emojis for
	 */
	public async getEmojis(guildId: string) {
		return (await this.rest.get(Routes.guildEmojis(guildId))) as APIEmoji[];
	}

	/**
	 * Fetches an emoji for a guild
	 *
	 * @param guildId - The id of the guild to fetch the emoji for
	 * @param emojiId - The id of the emoji to fetch
	 */
	public async getEmoji(guildId: string, emojiId: string) {
		return (await this.rest.get(Routes.guildEmoji(guildId, emojiId))) as APIEmoji;
	}

	/**
	 * Creates a new emoji for a guild
	 *
	 * @param guildId - The id of the guild to create the emoji for
	 * @param options - The options for creating the emoji
	 * @param reason - The reason for creating the emoji
	 */
	public async createEmoji(guildId: string, options: RESTPostAPIGuildEmojiJSONBody, reason?: string) {
		return (await this.rest.post(Routes.guildEmojis(guildId), {
			reason,
			body: options,
		})) as APIEmoji;
	}

	/**
	 * Edits an emoji for a guild
	 *
	 * @param guildId - The id of the guild to edit the emoji for
	 * @param emojiId - The id of the emoji to edit
	 * @param options - The options for editing the emoji
	 * @param reason - The reason for editing the emoji
	 */
	public async editEmoji(guildId: string, emojiId: string, options: RESTPatchAPIGuildEmojiJSONBody, reason?: string) {
		return (await this.rest.patch(Routes.guildEmoji(guildId, emojiId), {
			reason,
			body: options,
		})) as APIEmoji;
	}

	/**
	 * Deletes an emoji for a guild
	 *
	 * @param guildId - The id of the guild to delete the emoji for
	 * @param emojiId - The id of the emoji to delete
	 * @param reason - The reason for deleting the emoji
	 */
	public async deleteEmoji(guildId: string, emojiId: string, reason?: string) {
		return this.rest.delete(Routes.guildEmoji(guildId, emojiId), { reason });
	}

	/**
	 * Fetches all scheduled events for a guild
	 *
	 * @param guildId - The id of the guild to fetch the scheduled events for
	 * @param options - The options for fetching the scheduled events
	 */
	public async getAllEvents(guildId: string, options: RESTGetAPIGuildScheduledEventsQuery = {}) {
		return (await this.rest.get(Routes.guildScheduledEvents(guildId), {
			query: makeURLSearchParams(options as Record<string, unknown>),
		})) as APIGuildScheduledEvent[];
	}

	/**
	 * Creates a new scheduled event for a guild
	 *
	 * @param guildId - The id of the guild to create the scheduled event for
	 * @param event - The event to create
	 * @param reason - The reason for creating the scheduled event
	 */
	public async createEvent(guildId: string, event: RESTPostAPIGuildScheduledEventJSONBody, reason?: string) {
		return (await this.rest.post(Routes.guildScheduledEvents(guildId), {
			reason,
			body: event,
		})) as APIGuildScheduledEvent;
	}

	/**
	 * Fetches a scheduled event for a guild
	 *
	 * @param guildId - The id of the guild to fetch the scheduled event for
	 * @param eventId - The id of the scheduled event to fetch
	 * @param options - The options for fetching the scheduled event
	 */
	public async getEvent(guildId: string, eventId: string, options: RESTGetAPIGuildScheduledEventQuery = {}) {
		return (await this.rest.get(Routes.guildScheduledEvent(guildId, eventId), {
			query: makeURLSearchParams(options as Record<string, unknown>),
		})) as APIGuildScheduledEvent;
	}

	/**
	 * Edits a scheduled event for a guild
	 *
	 * @param guildId - The id of the guild to edit the scheduled event for
	 * @param eventId - The id of the scheduled event to edit
	 * @param event - The new event data
	 * @param reason - The reason for editing the scheduled event
	 */
	public async editEvent(
		guildId: string,
		eventId: string,
		event: RESTPatchAPIGuildScheduledEventJSONBody,
		reason?: string,
	) {
		return (await this.rest.patch(Routes.guildScheduledEvent(guildId, eventId), {
			reason,
			body: event,
		})) as APIGuildScheduledEvent;
	}

	/**
	 * Deletes a scheduled event for a guild
	 *
	 * @param guildId - The id of the guild to delete the scheduled event for
	 * @param eventId - The id of the scheduled event to delete
	 * @param reason - The reason for deleting the scheduled event
	 */
	public async deleteEvent(guildId: string, eventId: string, reason?: string) {
		await this.rest.delete(Routes.guildScheduledEvent(guildId, eventId), { reason });
	}

	/**
	 * Gets all users that are interested in a scheduled event
	 *
	 * @param guildId - The id of the guild to fetch the scheduled event users for
	 * @param eventId - The id of the scheduled event to fetch the users for
	 * @param options - The options for fetching the scheduled event users
	 */
	public async getEventUsers(guildId: string, eventId: string, options: RESTGetAPIGuildScheduledEventUsersQuery = {}) {
		return (await this.rest.get(Routes.guildScheduledEventUsers(guildId, eventId), {
			query: makeURLSearchParams(options as Record<string, unknown>),
		})) as APIGuildScheduledEvent[];
	}

	/**
	 * Fetches all the templates for a guild
	 *
	 * @param guildId - The id of the guild to fetch the templates for
	 */
	public async getTemplates(guildId: string) {
		return (await this.rest.get(Routes.guildTemplates(guildId))) as APITemplate[];
	}

	/**
	 * Creates a new template for a guild
	 *
	 * @param guildId - The id of the guild to create the template for
	 * @param options - The options for creating the template
	 */
	public async createTemplate(guildId: string, options: RESTPostAPIGuildTemplatesJSONBody) {
		return (await this.rest.post(Routes.guildTemplates(guildId), {
			body: options,
		})) as APITemplate;
	}

	/**
	 * Syncs a template for a guild
	 *
	 * @param guildId - The id of the guild to sync the template for
	 * @param templateCode - The code of the template to sync
	 */
	public async syncTemplate(guildId: string, templateCode: string) {
		return (await this.rest.put(Routes.guildTemplate(guildId, templateCode))) as APITemplate;
	}

	/**
	 * Edits a template for a guild
	 *
	 * @param guildId - The id of the guild to edit the template for
	 * @param templateCode - The code of the template to edit
	 * @param options - The options for editing the template
	 */
	public async editTemplate(guildId: string, templateCode: string, options: RESTPatchAPIGuildTemplateJSONBody) {
		return (await this.rest.patch(Routes.guildTemplate(guildId, templateCode), {
			body: options,
		})) as APITemplate;
	}

	/**
	 * Deletes a template for a guild
	 *
	 * @param guildId - The id of the guild to delete the template for
	 * @param templateCode - The code of the template to delete
	 */
	public async deleteTemplate(guildId: string, templateCode: string) {
		await this.rest.delete(Routes.guildTemplate(guildId, templateCode));
	}

	/**
	 * Fetches all the stickers for a guild
	 *
	 * @param guildId - The id of the guild to fetch the stickers for
	 */
	public async getStickers(guildId: string) {
		return (await this.rest.get(Routes.guildStickers(guildId))) as APISticker[];
	}

	/**
	 * Fetches a sticker for a guild
	 *
	 * @param guildId - The id of the guild to fetch the sticker for
	 * @param stickerId - The id of the sticker to fetch
	 */
	public async getSticker(guildId: string, stickerId: string) {
		return (await this.rest.get(Routes.guildSticker(guildId, stickerId))) as APISticker;
	}

	/**
	 * Edits a sticker for a guild
	 *
	 * @param guildId - The id of the guild to edit the sticker for
	 * @param stickerId - The id of the sticker to edit
	 * @param options - The options for editing the sticker
	 * @param reason - The reason for editing the sticker
	 */
	public async editSticker(
		guildId: string,
		stickerId: string,
		options: RESTPatchAPIGuildStickerJSONBody,
		reason?: string,
	) {
		return (await this.rest.patch(Routes.guildSticker(guildId, stickerId), {
			reason,
			body: options,
		})) as APISticker;
	}

	/**
	 * Deletes a sticker for a guild
	 *
	 * @param guildId - The id of the guild to delete the sticker for
	 * @param stickerId - The id of the sticker to delete
	 * @param reason - The reason for deleting the sticker
	 */
	public async deleteSticker(guildId: string, stickerId: string, reason?: string) {
		await this.rest.delete(Routes.guildSticker(guildId, stickerId), { reason });
	}

	/**
	 * Fetches the audit logs for a guild
	 *
	 * @param guildId - The id of the guild to fetch the audit logs for
	 * @param options - The options for fetching the audit logs
	 */
	public async getAuditLogs(guildId: string, options: RESTGetAPIAuditLogQuery = {}) {
		return (await this.rest.get(Routes.guildAuditLog(guildId), {
			query: makeURLSearchParams(options as Record<string, unknown>),
		})) as APIAuditLog[];
	}
}
