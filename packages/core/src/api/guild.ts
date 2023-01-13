import type { RawFile } from '@discordjs/rest';
import { makeURLSearchParams, type REST } from '@discordjs/rest';
import {
	Routes,
	type GuildMFALevel,
	type GuildWidgetStyle,
	type RESTGetAPIAuditLogQuery,
	type RESTGetAPIAuditLogResult,
	type RESTGetAPIAutoModerationRuleResult,
	type RESTGetAPIAutoModerationRulesResult,
	type RESTGetAPIGuildBansResult,
	type RESTGetAPIGuildChannelsResult,
	type RESTGetAPIGuildEmojiResult,
	type RESTGetAPIGuildEmojisResult,
	type RESTGetAPIGuildIntegrationsResult,
	type RESTGetAPIGuildInvitesResult,
	type RESTGetAPIGuildMemberResult,
	type RESTGetAPIGuildMembersResult,
	type RESTGetAPIGuildMembersQuery,
	type RESTGetAPIGuildMembersSearchResult,
	type RESTGetAPIGuildPreviewResult,
	type RESTGetAPIGuildPruneCountResult,
	type RESTGetAPIGuildResult,
	type RESTGetAPIGuildRolesResult,
	type RESTGetAPIGuildScheduledEventQuery,
	type RESTGetAPIGuildScheduledEventResult,
	type RESTGetAPIGuildScheduledEventsQuery,
	type RESTGetAPIGuildScheduledEventsResult,
	type RESTGetAPIGuildScheduledEventUsersQuery,
	type RESTGetAPIGuildScheduledEventUsersResult,
	type RESTGetAPIGuildStickerResult,
	type RESTGetAPIGuildStickersResult,
	type RESTGetAPIGuildTemplatesResult,
	type RESTGetAPIGuildThreadsResult,
	type RESTGetAPIGuildVanityUrlResult,
	type RESTGetAPIGuildVoiceRegionsResult,
	type RESTGetAPIGuildPruneCountQuery,
	type RESTPostAPIGuildStickerFormDataBody,
	type RESTPostAPIGuildStickerResult,
	type RESTGetAPIGuildMembersSearchQuery,
	type RESTGetAPIGuildWelcomeScreenResult,
	type RESTGetAPIGuildWidgetImageResult,
	type RESTGetAPIGuildWidgetJSONResult,
	type RESTGetAPITemplateResult,
	type RESTPatchAPIAutoModerationRuleJSONBody,
	type RESTPatchAPIGuildChannelPositionsJSONBody,
	type RESTPatchAPIGuildEmojiJSONBody,
	type RESTPatchAPIGuildEmojiResult,
	type RESTPatchAPIGuildJSONBody,
	type RESTPatchAPIGuildMemberJSONBody,
	type RESTPatchAPIGuildMemberResult,
	type RESTPatchAPIGuildResult,
	type RESTPatchAPIGuildRoleJSONBody,
	type RESTPatchAPIGuildRolePositionsJSONBody,
	type RESTPatchAPIGuildRolePositionsResult,
	type RESTPatchAPIGuildRoleResult,
	type RESTPatchAPIGuildScheduledEventJSONBody,
	type RESTPatchAPIGuildScheduledEventResult,
	type RESTPatchAPIGuildStickerJSONBody,
	type RESTPatchAPIGuildStickerResult,
	type RESTPatchAPIGuildTemplateJSONBody,
	type RESTPatchAPIGuildTemplateResult,
	type RESTPatchAPIGuildVoiceStateUserJSONBody,
	type RESTPatchAPIGuildWelcomeScreenJSONBody,
	type RESTPatchAPIGuildWelcomeScreenResult,
	type RESTPatchAPIGuildWidgetSettingsJSONBody,
	type RESTPatchAPIGuildWidgetSettingsResult,
	type RESTPostAPIAutoModerationRuleJSONBody,
	type RESTPostAPIAutoModerationRuleResult,
	type RESTPostAPIGuildChannelJSONBody,
	type RESTPostAPIGuildChannelResult,
	type RESTPostAPIGuildEmojiJSONBody,
	type RESTPostAPIGuildEmojiResult,
	type RESTPostAPIGuildPruneJSONBody,
	type RESTPostAPIGuildRoleJSONBody,
	type RESTPostAPIGuildRoleResult,
	type RESTPostAPIGuildScheduledEventJSONBody,
	type RESTPostAPIGuildScheduledEventResult,
	type RESTPostAPIGuildsJSONBody,
	type RESTPostAPIGuildsMFAResult,
	type RESTPostAPIGuildsResult,
	type RESTPostAPIGuildTemplatesResult,
	type RESTPostAPITemplateCreateGuildJSONBody,
	type RESTPutAPIGuildBanJSONBody,
	type RESTPutAPIGuildTemplateSyncResult,
	type RESTGetAPIGuildWebhooksResult,
	type Snowflake,
} from 'discord-api-types/v10';

export class GuildsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild}
	 * @param guildId - The id of the guild
	 */
	public async get(guildId: string) {
		return this.rest.get(Routes.guild(guildId)) as Promise<RESTGetAPIGuildResult>;
	}

	/**
	 * Fetches a guild preview
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-preview}
	 * @param guildId - The id of the guild to fetch the preview from
	 */
	public async getPreview(guildId: Snowflake) {
		return this.rest.get(Routes.guildPreview(guildId)) as Promise<RESTGetAPIGuildPreviewResult>;
	}

	/**
	 * Creates a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild}
	 * @param data - The guild to create
	 */
	public async create(data: RESTPostAPIGuildsJSONBody) {
		return this.rest.post(Routes.guilds(), { body: data }) as Promise<RESTPostAPIGuildsResult>;
	}

	/**
	 * Edits a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild}
	 * @param guildId - The id of the guild to edit
	 * @param data - The new guild data
	 * @param reason - The reason for editing this guild
	 */
	public async edit(guildId: Snowflake, data: RESTPatchAPIGuildJSONBody, reason?: string) {
		return this.rest.patch(Routes.guild(guildId), { reason, body: data }) as Promise<RESTPatchAPIGuildResult>;
	}

	/**
	 * Deletes a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#delete-guild}
	 * @param guildId - The id of the guild to delete
	 * @param reason - The reason for deleting this guild
	 */
	public async delete(guildId: Snowflake, reason?: string) {
		await this.rest.delete(Routes.guild(guildId), { reason });
	}

	/**
	 * Fetches all the members of a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#list-guild-members}
	 * @param guildId - The id of the guild
	 * @param options - The options to use when fetching the guild members
	 */
	public async getMembers(guildId: Snowflake, options: RESTGetAPIGuildMembersQuery = {}) {
		return this.rest.get(Routes.guildMembers(guildId), {
			query: makeURLSearchParams(options),
		}) as Promise<RESTGetAPIGuildMembersResult>;
	}

	/**
	 * Fetches a guild's channels
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-channels}
	 * @param guildId - The id of the guild to fetch the channels from
	 */
	public async getChannels(guildId: Snowflake) {
		return this.rest.get(Routes.guildChannels(guildId)) as Promise<RESTGetAPIGuildChannelsResult>;
	}

	/**
	 * Creates a guild channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-channel}
	 * @param guildId - The id of the guild to create the channel in
	 * @param data - The data to create the new channel
	 * @param reason - The reason for creating this channel
	 */
	public async createChannel(guildId: Snowflake, data: RESTPostAPIGuildChannelJSONBody, reason?: string) {
		return this.rest.post(Routes.guildChannels(guildId), {
			reason,
			body: data,
		}) as Promise<RESTPostAPIGuildChannelResult>;
	}

	/**
	 * Edits a guild channel's positions
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-channel-positions}
	 * @param guildId - The id of the guild to edit the channel positions from
	 * @param data - The data to edit the channel positions with
	 * @param reason - The reason for editing the channel positions
	 */
	public async setChannelPositions(
		guildId: Snowflake,
		data: RESTPatchAPIGuildChannelPositionsJSONBody,
		reason?: string,
	) {
		await this.rest.patch(Routes.guildChannels(guildId), { reason, body: data });
	}

	/**
	 * Fetches the active threads in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#list-active-guild-threads}
	 * @param guildId - The id of the guild to fetch the active threads from
	 */
	public async getActiveThreads(guildId: Snowflake) {
		return this.rest.get(Routes.guildActiveThreads(guildId)) as Promise<RESTGetAPIGuildThreadsResult>;
	}

	/**
	 * Fetches a guild member ban
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-bans}
	 * @param guildId - The id of the guild to fetch the ban from
	 */
	public async getMemberBans(guildId: Snowflake) {
		return this.rest.get(Routes.guildBans(guildId)) as Promise<RESTGetAPIGuildBansResult>;
	}

	/**
	 * Bans a user from a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-ban}
	 * @param guildId - The id of the guild to ban the member in
	 * @param userId - The id of the user to ban
	 * @param options - Options for banning the user
	 * @param reason - The reason for banning the user
	 */
	public async banUser(
		guildId: Snowflake,
		userId: Snowflake,
		options: RESTPutAPIGuildBanJSONBody = {},
		reason?: string,
	) {
		await this.rest.put(Routes.guildBan(guildId, userId), { reason, body: options });
	}

	/**
	 * Unbans a user from a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#remove-guild-ban}
	 * @param guildId - The id of the guild to unban the member in
	 * @param userId - The id of the user to unban
	 * @param reason - The reason for unbanning the user
	 */
	public async unbanUser(guildId: Snowflake, userId: Snowflake, reason?: string) {
		await this.rest.delete(Routes.guildBan(guildId, userId), { reason });
	}

	/**
	 * Gets all the roles in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-roles}
	 * @param guildId - The id of the guild to fetch the roles from
	 */
	public async getRoles(guildId: Snowflake) {
		return this.rest.get(Routes.guildRoles(guildId)) as Promise<RESTGetAPIGuildRolesResult>;
	}

	/**
	 * Creates a guild role
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-role}
	 * @param guildId - The id of the guild to create the role in
	 * @param data - The data to create the role with
	 * @param reason - The reason for creating the role
	 */
	public async createRole(guildId: Snowflake, data: RESTPostAPIGuildRoleJSONBody, reason?: string) {
		return this.rest.post(Routes.guildRoles(guildId), { reason, body: data }) as Promise<RESTPostAPIGuildRoleResult>;
	}

	/**
	 * Sets role positions in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-role-positions}
	 * @param guildId - The id of the guild to set role positions for
	 * @param data - The data for setting a role position
	 * @param reason - The reason for setting the role position
	 */
	public async setRolePositions(guildId: Snowflake, data: RESTPatchAPIGuildRolePositionsJSONBody, reason?: string) {
		return this.rest.patch(Routes.guildRoles(guildId), {
			reason,
			body: data,
		}) as Promise<RESTPatchAPIGuildRolePositionsResult>;
	}

	/**
	 * Edits a guild role
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-role}
	 * @param guildId - The id of the guild to edit the role in
	 * @param roleId - The id of the role to edit
	 * @param data - data for editing the role
	 * @param reason - The reason for editing the role
	 */
	public async editRole(guildId: Snowflake, roleId: Snowflake, data: RESTPatchAPIGuildRoleJSONBody, reason?: string) {
		return this.rest.patch(Routes.guildRole(guildId, roleId), {
			reason,
			body: data,
		}) as Promise<RESTPatchAPIGuildRoleResult>;
	}

	/**
	 * Deletes a guild role
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#delete-guild-role}
	 * @param guildId - The id of the guild to delete the role in
	 * @param roleId - The id of the role to delete
	 * @param reason - The reason for deleting the role
	 */
	public async deleteRole(guildId: Snowflake, roleId: Snowflake, reason?: string) {
		await this.rest.delete(Routes.guildRole(guildId, roleId), { reason });
	}

	/**
	 * Edits the multi-factor-authentication (MFA) level of a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-mfa-level}
	 * @param guildId - The id of the guild to edit the MFA level for
	 * @param level - The new MFA level
	 * @param reason - The reason for editing the MFA level
	 */
	public async editMFALevel(guildId: Snowflake, level: GuildMFALevel, reason?: string) {
		return this.rest.post(Routes.guildMFA(guildId), {
			reason,
			body: { mfa_level: level },
		}) as Promise<RESTPostAPIGuildsMFAResult>;
	}

	/**
	 * Fetch the number of members that can be pruned from a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-prune-count}
	 * @param guildId - The id of the guild to fetch the number of pruned members from
	 * @param options - The options for fetching the number of pruned members
	 */
	public async getPruneCount(guildId: Snowflake, options: RESTGetAPIGuildPruneCountQuery = {}) {
		return this.rest.get(Routes.guildPrune(guildId), {
			query: makeURLSearchParams(options),
		}) as Promise<RESTGetAPIGuildPruneCountResult>;
	}

	/**
	 * Prunes members in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#begin-guild-prune}
	 * @param guildId - The id of the guild to prune members in
	 * @param options - The options for pruning members
	 * @param reason - The reason for pruning members
	 */
	public async beginPrune(guildId: Snowflake, options: RESTPostAPIGuildPruneJSONBody = {}, reason?: string) {
		return this.rest.post(Routes.guildPrune(guildId), {
			body: options,
			reason,
		}) as Promise<RESTGetAPIGuildPruneCountResult>;
	}

	/**
	 * Fetches voice regions for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-voice-regions}
	 * @param guildId - The id of the guild to fetch the voice regions from
	 */
	public async getVoiceRegions(guildId: Snowflake) {
		return this.rest.get(Routes.guildVoiceRegions(guildId)) as Promise<RESTGetAPIGuildVoiceRegionsResult>;
	}

	/**
	 * Fetches the invites for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-invites}
	 * @param guildId - The id of the guild to fetch the invites from
	 */
	public async getInvites(guildId: Snowflake) {
		return this.rest.get(Routes.guildInvites(guildId)) as Promise<RESTGetAPIGuildInvitesResult>;
	}

	/**
	 * Fetches the integrations for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-integrations}
	 * @param guildId - The id of the guild to fetch the integrations from
	 */
	public async getIntegrations(guildId: Snowflake) {
		return this.rest.get(Routes.guildIntegrations(guildId)) as Promise<RESTGetAPIGuildIntegrationsResult>;
	}

	/**
	 * Deletes an integration from a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#delete-guild-integration}
	 * @param guildId - The id of the guild to delete the integration from
	 * @param integrationId - The id of the integration to delete
	 * @param reason - The reason for deleting the integration
	 */
	public async deleteIntegration(guildId: Snowflake, integrationId: Snowflake, reason?: string) {
		await this.rest.delete(Routes.guildIntegration(guildId, integrationId), { reason });
	}

	/**
	 * Fetches the widget settings for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget-settings}
	 * @param guildId - The id of the guild to fetch the widget settings from
	 */
	public async getWidgetSettings(guildId: Snowflake) {
		return this.rest.get(Routes.guildWidgetSettings(guildId)) as Promise<RESTGetAPIGuildWidgetImageResult>;
	}

	/**
	 * Edits the widget settings for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-widget}
	 * @param guildId - The id of the guild to edit the widget settings from
	 * @param data - The new widget settings data
	 * @param reason - The reason for editing the widget settings
	 */
	public async editWidgetSettings(guildId: Snowflake, data: RESTPatchAPIGuildWidgetSettingsJSONBody, reason?: string) {
		return this.rest.patch(Routes.guildWidgetSettings(guildId), {
			reason,
			body: data,
		}) as Promise<RESTPatchAPIGuildWidgetSettingsResult>;
	}

	/**
	 * Fetches the widget for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget}
	 * @param guildId - The id of the guild to fetch the widget from
	 */
	public async getWidget(guildId: Snowflake) {
		return this.rest.get(Routes.guildWidgetJSON(guildId)) as Promise<RESTGetAPIGuildWidgetJSONResult>;
	}

	/**
	 * Fetches the vanity url for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-vanity-url}
	 * @param guildId - The id of the guild to fetch the vanity url from
	 */
	public async getVanityURL(guildId: Snowflake) {
		return this.rest.get(Routes.guildVanityUrl(guildId)) as Promise<RESTGetAPIGuildVanityUrlResult>;
	}

	/**
	 * Fetches the widget image for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget-image}
	 * @param guildId - The id of the guild to fetch the widget image from
	 * @param style - The style of the widget image
	 */
	public async getWidgetImage(guildId: Snowflake, style?: GuildWidgetStyle) {
		return this.rest.get(Routes.guildWidgetImage(guildId), {
			query: makeURLSearchParams({ style }),
		}) as Promise<RESTGetAPIGuildWidgetImageResult>;
	}

	/**
	 * Fetches the welcome screen for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-welcome-screen}
	 * @param guildId - The id of the guild to fetch the welcome screen from
	 */
	public async getWelcomeScreen(guildId: Snowflake) {
		return this.rest.get(Routes.guildWelcomeScreen(guildId)) as Promise<RESTGetAPIGuildWelcomeScreenResult>;
	}

	/**
	 * Edits the welcome screen for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-welcome-screen}
	 * @param guildId - The id of the guild to edit the welcome screen for
	 * @param data - The new welcome screen data
	 * @param reason - The reason for editing the welcome screen
	 */
	public async editWelcomeScreen(guildId: Snowflake, data?: RESTPatchAPIGuildWelcomeScreenJSONBody, reason?: string) {
		return this.rest.patch(Routes.guildWelcomeScreen(guildId), {
			reason,
			body: data,
		}) as Promise<RESTPatchAPIGuildWelcomeScreenResult>;
	}

	/**
	 * Edits a user's voice state in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-user-voice-state}
	 * @param guildId - The id of the guild to edit the current user's voice state in
	 * @param userId - The id of the user to edit the voice state for
	 * @param data - The data for editing the voice state
	 * @param reason - The reason for editing the voice state
	 */
	public async editUserVoiceState(
		guildId: Snowflake,
		userId: Snowflake,
		data: RESTPatchAPIGuildVoiceStateUserJSONBody,
		reason?: string,
	) {
		await this.rest.patch(Routes.guildVoiceState(guildId, userId), { reason, body: data });
	}

	/**
	 * Fetches all emojis for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#list-guild-emojis}
	 * @param guildId - The id of the guild to fetch the emojis from
	 */
	public async getEmojis(guildId: Snowflake) {
		return this.rest.get(Routes.guildEmojis(guildId)) as Promise<RESTGetAPIGuildEmojisResult>;
	}

	/**
	 * Fetches an emoji for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#get-guild-emoji}
	 * @param guildId - The id of the guild to fetch the emoji from
	 * @param emojiId - The id of the emoji to fetch
	 */
	public async getEmoji(guildId: Snowflake, emojiId: Snowflake) {
		return this.rest.get(Routes.guildEmoji(guildId, emojiId)) as Promise<RESTGetAPIGuildEmojiResult>;
	}

	/**
	 * Creates a new emoji for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#create-guild-emoji}
	 * @param guildId - The id of the guild to create the emoji from
	 * @param data - The data for creating the emoji
	 * @param reason - The reason for creating the emoji
	 */
	public async createEmoji(guildId: Snowflake, data: RESTPostAPIGuildEmojiJSONBody, reason?: string) {
		return this.rest.post(Routes.guildEmojis(guildId), {
			reason,
			body: data,
		}) as Promise<RESTPostAPIGuildEmojiResult>;
	}

	/**
	 * Edits an emoji for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#modify-guild-emoji}
	 * @param guildId - The id of the guild to edit the emoji from
	 * @param emojiId - The id of the emoji to edit
	 * @param data - The data for editing the emoji
	 * @param reason - The reason for editing the emoji
	 */
	public async editEmoji(
		guildId: Snowflake,
		emojiId: Snowflake,
		data: RESTPatchAPIGuildEmojiJSONBody,
		reason?: string,
	) {
		return this.rest.patch(Routes.guildEmoji(guildId, emojiId), {
			reason,
			body: data,
		}) as Promise<RESTPatchAPIGuildEmojiResult>;
	}

	/**
	 * Deletes an emoji for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#delete-guild-emoji}
	 * @param guildId - The id of the guild to delete the emoji from
	 * @param emojiId - The id of the emoji to delete
	 * @param reason - The reason for deleting the emoji
	 */
	public async deleteEmoji(guildId: Snowflake, emojiId: Snowflake, reason?: string) {
		await this.rest.delete(Routes.guildEmoji(guildId, emojiId), { reason });
	}

	/**
	 * Fetches all scheduled events for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#list-scheduled-events-for-guild}
	 * @param guildId - The id of the guild to fetch the scheduled events from
	 * @param options - The options for fetching the scheduled events
	 */
	public async getScheduledEvents(guildId: Snowflake, options: RESTGetAPIGuildScheduledEventsQuery = {}) {
		return this.rest.get(Routes.guildScheduledEvents(guildId), {
			query: makeURLSearchParams(options),
		}) as Promise<RESTGetAPIGuildScheduledEventsResult>;
	}

	/**
	 * Creates a new scheduled event for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#create-guild-scheduled-event}
	 * @param guildId - The id of the guild to create the scheduled event from
	 * @param data - The data to create the event with
	 * @param reason - The reason for creating the scheduled event
	 */
	public async createScheduledEvent(guildId: Snowflake, data: RESTPostAPIGuildScheduledEventJSONBody, reason?: string) {
		return this.rest.post(Routes.guildScheduledEvents(guildId), {
			reason,
			body: data,
		}) as Promise<RESTPostAPIGuildScheduledEventResult>;
	}

	/**
	 * Fetches a scheduled event for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#get-guild-scheduled-event}
	 * @param guildId - The id of the guild to fetch the scheduled event from
	 * @param eventId - The id of the scheduled event to fetch
	 * @param options - The options for fetching the scheduled event
	 */
	public async getScheduledEvent(
		guildId: Snowflake,
		eventId: Snowflake,
		options: RESTGetAPIGuildScheduledEventQuery = {},
	) {
		return this.rest.get(Routes.guildScheduledEvent(guildId, eventId), {
			query: makeURLSearchParams(options),
		}) as Promise<RESTGetAPIGuildScheduledEventResult>;
	}

	/**
	 * Edits a scheduled event for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#modify-guild-scheduled-event}
	 * @param guildId - The id of the guild to edit the scheduled event from
	 * @param eventId - The id of the scheduled event to edit
	 * @param data - The new event data
	 * @param reason - The reason for editing the scheduled event
	 */
	public async editScheduledEvent(
		guildId: Snowflake,
		eventId: Snowflake,
		data: RESTPatchAPIGuildScheduledEventJSONBody,
		reason?: string,
	) {
		return this.rest.patch(Routes.guildScheduledEvent(guildId, eventId), {
			reason,
			body: data,
		}) as Promise<RESTPatchAPIGuildScheduledEventResult>;
	}

	/**
	 * Deletes a scheduled event for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#delete-guild-scheduled-event}
	 * @param guildId - The id of the guild to delete the scheduled event from
	 * @param eventId - The id of the scheduled event to delete
	 * @param reason - The reason for deleting the scheduled event
	 */
	public async deleteScheduledEvent(guildId: Snowflake, eventId: Snowflake, reason?: string) {
		await this.rest.delete(Routes.guildScheduledEvent(guildId, eventId), { reason });
	}

	/**
	 * Gets all users that are interested in a scheduled event
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#get-guild-scheduled-event-users}
	 * @param guildId - The id of the guild to fetch the scheduled event users from
	 * @param eventId - The id of the scheduled event to fetch the users for
	 * @param options - The options for fetching the scheduled event users
	 */
	public async getScheduledEventUsers(
		guildId: Snowflake,
		eventId: Snowflake,
		options: RESTGetAPIGuildScheduledEventUsersQuery = {},
	) {
		return this.rest.get(Routes.guildScheduledEventUsers(guildId, eventId), {
			query: makeURLSearchParams(options),
		}) as Promise<RESTGetAPIGuildScheduledEventUsersResult>;
	}

	/**
	 * Fetches all the templates for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#get-guild-templates}
	 * @param guildId - The id of the guild to fetch the templates from
	 */
	public async getTemplates(guildId: Snowflake) {
		return this.rest.get(Routes.guildTemplates(guildId)) as Promise<RESTGetAPIGuildTemplatesResult>;
	}

	/**
	 * Syncs a template for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#sync-guild-template}
	 * @param guildId - The id of the guild to sync the template from
	 * @param templateCode - The code of the template to sync
	 */
	public async syncTemplate(guildId: Snowflake, templateCode: string) {
		return this.rest.put(Routes.guildTemplate(guildId, templateCode)) as Promise<RESTPutAPIGuildTemplateSyncResult>;
	}

	/**
	 * Edits a template for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#modify-guild-template}
	 * @param guildId - The id of the guild to edit the template from
	 * @param templateCode - The code of the template to edit
	 * @param data - The data for editing the template
	 */
	public async editTemplate(guildId: Snowflake, templateCode: string, data: RESTPatchAPIGuildTemplateJSONBody) {
		return this.rest.patch(Routes.guildTemplate(guildId, templateCode), {
			body: data,
		}) as Promise<RESTPatchAPIGuildTemplateResult>;
	}

	/**
	 * Deletes a template for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#delete-guild-template}
	 * @param guildId - The id of the guild to delete the template from
	 * @param templateCode - The code of the template to delete
	 */
	public async deleteTemplate(guildId: Snowflake, templateCode: string) {
		await this.rest.delete(Routes.guildTemplate(guildId, templateCode));
	}

	/**
	 * Fetches all the stickers for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#list-guild-stickers}
	 * @param guildId - The id of the guild to fetch the stickers from
	 */
	public async getStickers(guildId: Snowflake) {
		return this.rest.get(Routes.guildStickers(guildId)) as Promise<RESTGetAPIGuildStickersResult>;
	}

	/**
	 * Fetches a sticker for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#get-guild-sticker}
	 * @param guildId - The id of the guild to fetch the sticker from
	 * @param stickerId - The id of the sticker to fetch
	 */
	public async getSticker(guildId: Snowflake, stickerId: Snowflake) {
		return this.rest.get(Routes.guildSticker(guildId, stickerId)) as Promise<RESTGetAPIGuildStickerResult>;
	}

	/**
	 * Creates a sticker for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#create-guild-sticker}
	 * @param guildId - The id of the guild to create the sticker for
	 * @param data - The data for creating the sticker
	 * @param reason - The reason for creating the sticker
	 */
	public async createSticker(
		guildId: Snowflake,
		{ file, ...body }: Omit<RESTPostAPIGuildStickerFormDataBody, 'file'> & { file: RawFile },
		reason?: string,
	) {
		const fileData = { ...file, key: 'file' };

		return this.rest.post(Routes.guildStickers(guildId), {
			appendToFormData: true,
			body,
			files: [fileData],
			reason,
		}) as Promise<RESTPostAPIGuildStickerResult>;
	}

	/**
	 * Edits a sticker for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#modify-guild-sticker}
	 * @param guildId - The id of the guild to edit the sticker from
	 * @param stickerId - The id of the sticker to edit
	 * @param data - The data for editing the sticker
	 * @param reason - The reason for editing the sticker
	 */
	public async editSticker(
		guildId: Snowflake,
		stickerId: Snowflake,
		data: RESTPatchAPIGuildStickerJSONBody,
		reason?: string,
	) {
		return this.rest.patch(Routes.guildSticker(guildId, stickerId), {
			reason,
			body: data,
		}) as Promise<RESTPatchAPIGuildStickerResult>;
	}

	/**
	 * Deletes a sticker for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#delete-guild-sticker}
	 * @param guildId - The id of the guild to delete the sticker from
	 * @param stickerId - The id of the sticker to delete
	 * @param reason - The reason for deleting the sticker
	 */
	public async deleteSticker(guildId: Snowflake, stickerId: Snowflake, reason?: string) {
		await this.rest.delete(Routes.guildSticker(guildId, stickerId), { reason });
	}

	/**
	 * Fetches the audit logs for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log}
	 * @param guildId - The id of the guild to fetch the audit logs from
	 * @param options - The options for fetching the audit logs
	 */
	public async getAuditLogs(guildId: Snowflake, options: RESTGetAPIAuditLogQuery = {}) {
		return this.rest.get(Routes.guildAuditLog(guildId), {
			query: makeURLSearchParams(options),
		}) as Promise<RESTGetAPIAuditLogResult>;
	}

	/**
	 * Fetches all auto moderation rules for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#list-auto-moderation-rules-for-guild}
	 * @param guildId - The id of the guild to fetch the auto moderation rules from
	 */
	public async getAutoModerationRules(guildId: Snowflake) {
		return this.rest.get(Routes.guildAutoModerationRules(guildId)) as Promise<RESTGetAPIAutoModerationRulesResult>;
	}

	/**
	 * Fetches an auto moderation rule for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#get-auto-moderation-rule}
	 * @param guildId - The id of the guild to fetch the auto moderation rule from
	 * @param ruleId - The id of the auto moderation rule to fetch
	 */
	public async getAutoModerationRule(guildId: Snowflake, ruleId: Snowflake) {
		return this.rest.get(
			Routes.guildAutoModerationRule(guildId, ruleId),
		) as Promise<RESTGetAPIAutoModerationRuleResult>;
	}

	/**
	 * Creates a new auto moderation rule for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#create-auto-moderation-rule}
	 * @param guildId - The id of the guild to create the auto moderation rule from
	 * @param data - The data for creating the auto moderation rule
	 */
	public async createAutoModerationRule(
		guildId: Snowflake,
		data: RESTPostAPIAutoModerationRuleJSONBody,
		reason?: string,
	) {
		return this.rest.post(Routes.guildAutoModerationRules(guildId), {
			reason,
			body: data,
		}) as Promise<RESTPostAPIAutoModerationRuleResult>;
	}

	/**
	 * Edits an auto moderation rule for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#modify-auto-moderation-rule}
	 * @param guildId - The id of the guild to edit the auto moderation rule from
	 * @param ruleId - The id of the auto moderation rule to edit
	 * @param data - The data for editing the auto moderation rule
	 * @param reason - The reason for editing the auto moderation rule
	 */
	public async editAutoModerationRule(
		guildId: Snowflake,
		ruleId: Snowflake,
		data: RESTPatchAPIAutoModerationRuleJSONBody,
		reason?: string,
	) {
		return this.rest.patch(Routes.guildAutoModerationRule(guildId, ruleId), {
			reason,
			body: data,
		}) as Promise<RESTPatchAPIAutoModerationRuleJSONBody>;
	}

	/**
	 * Deletes an auto moderation rule for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#delete-auto-moderation-rule}
	 * @param guildId - The id of the guild to delete the auto moderation rule from
	 * @param ruleId - The id of the auto moderation rule to delete
	 * @param reason - The reason for deleting the auto moderation rule
	 */
	public async deleteAutoModerationRule(guildId: Snowflake, ruleId: Snowflake, reason?: string) {
		await this.rest.delete(Routes.guildAutoModerationRule(guildId, ruleId), { reason });
	}

	/**
	 * Fetches a guild member
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-member}
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 */
	public async getMember(guildId: Snowflake, userId: Snowflake) {
		return this.rest.get(Routes.guildMember(guildId, userId)) as Promise<RESTGetAPIGuildMemberResult>;
	}

	/**
	 * Searches for guild members
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#search-guild-members}
	 * @param guildId - The id of the guild to search in
	 * @param query - The query to search for
	 * @param limit - The maximum number of members to return
	 */
	public async searchForMembers(guildId: Snowflake, options: RESTGetAPIGuildMembersSearchQuery) {
		return this.rest.get(Routes.guildMembersSearch(guildId), {
			query: makeURLSearchParams(options),
		}) as Promise<RESTGetAPIGuildMembersSearchResult>;
	}

	/**
	 * Edits a guild member
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-member}
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 * @param data - The data to use when editing the guild member
	 * @param reason - The reason for editing this guild member
	 */
	public async editMember(
		guildId: Snowflake,
		userId: Snowflake,
		data: RESTPatchAPIGuildMemberJSONBody = {},
		reason?: string,
	) {
		return this.rest.patch(Routes.guildMember(guildId, userId), {
			reason,
			body: data,
		}) as Promise<RESTPatchAPIGuildMemberResult>;
	}

	/**
	 * Adds a role to a guild member
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#add-guild-member-role}
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 * @param roleId - The id of the role
	 * @param reason - The reason for adding this role to the guild member
	 */
	public async addRoleToMember(guildId: Snowflake, userId: Snowflake, roleId: Snowflake, reason?: string) {
		await this.rest.put(Routes.guildMemberRole(guildId, userId, roleId), { reason });
	}

	/**
	 * Removes a role from a guild member
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#remove-guild-member-role}
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 * @param roleId - The id of the role
	 * @param reason - The reason for removing this role from the guild member
	 */
	public async removeRoleFromMember(guildId: Snowflake, userId: Snowflake, roleId: Snowflake, reason?: string) {
		await this.rest.delete(Routes.guildMemberRole(guildId, userId, roleId), { reason });
	}

	/**
	 * Fetches a guild template
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#get-guild-template}
	 * @param templateCode - The code of the template
	 */
	public async getTemplate(templateCode: string) {
		return this.rest.get(Routes.template(templateCode)) as Promise<RESTGetAPITemplateResult>;
	}

	/**
	 * Creates a new template
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#create-guild-template}
	 * @param templateCode - The code of the template
	 * @param data - The data to use when creating the template
	 */
	public async createTemplate(templateCode: string, data: RESTPostAPITemplateCreateGuildJSONBody) {
		return this.rest.post(Routes.template(templateCode), { body: data }) as Promise<RESTPostAPIGuildTemplatesResult>;
	}

	/**
	 * Fetches webhooks for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#get-guild-webhooks}
	 * @param id - The id of the guild
	 */
	public async getWebhooks(id: Snowflake) {
		return this.rest.get(Routes.guildWebhooks(id)) as Promise<RESTGetAPIGuildWebhooksResult>;
	}
}
