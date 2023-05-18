/* eslint-disable jsdoc/check-param-names */

import { makeURLSearchParams, type REST, type RawFile, type RequestData } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import type {
	RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
	RESTPatchAPIGuildVoiceStateCurrentMemberResult,
	GuildMFALevel,
	GuildWidgetStyle,
	RESTGetAPIAuditLogQuery,
	RESTGetAPIAuditLogResult,
	RESTGetAPIAutoModerationRuleResult,
	RESTGetAPIAutoModerationRulesResult,
	RESTGetAPIGuildBanResult,
	RESTGetAPIGuildBansQuery,
	RESTGetAPIGuildBansResult,
	RESTGetAPIGuildChannelsResult,
	RESTGetAPIGuildEmojiResult,
	RESTGetAPIGuildEmojisResult,
	RESTGetAPIGuildIntegrationsResult,
	RESTGetAPIGuildInvitesResult,
	RESTGetAPIGuildMemberResult,
	RESTGetAPIGuildMembersResult,
	RESTGetAPIGuildMembersQuery,
	RESTGetAPIGuildMembersSearchResult,
	RESTGetAPIGuildPreviewResult,
	RESTGetAPIGuildPruneCountResult,
	RESTGetAPIGuildResult,
	RESTGetAPIGuildRolesResult,
	RESTGetAPIGuildScheduledEventQuery,
	RESTGetAPIGuildScheduledEventResult,
	RESTGetAPIGuildScheduledEventsQuery,
	RESTGetAPIGuildScheduledEventsResult,
	RESTGetAPIGuildScheduledEventUsersQuery,
	RESTGetAPIGuildScheduledEventUsersResult,
	RESTGetAPIGuildStickerResult,
	RESTGetAPIGuildStickersResult,
	RESTGetAPIGuildTemplatesResult,
	RESTGetAPIGuildThreadsResult,
	RESTGetAPIGuildVanityUrlResult,
	RESTGetAPIGuildVoiceRegionsResult,
	RESTGetAPIGuildPruneCountQuery,
	RESTPostAPIGuildStickerFormDataBody,
	RESTPostAPIGuildStickerResult,
	RESTGetAPIGuildMembersSearchQuery,
	RESTGetAPIGuildWebhooksResult,
	RESTGetAPIGuildWelcomeScreenResult,
	RESTGetAPIGuildWidgetImageResult,
	RESTGetAPIGuildWidgetJSONResult,
	RESTGetAPITemplateResult,
	RESTPatchAPIAutoModerationRuleJSONBody,
	RESTPatchAPIGuildChannelPositionsJSONBody,
	RESTPatchAPIGuildEmojiJSONBody,
	RESTPatchAPIGuildEmojiResult,
	RESTPatchAPIGuildJSONBody,
	RESTPatchAPIGuildMemberJSONBody,
	RESTPatchAPIGuildMemberResult,
	RESTPatchAPIGuildResult,
	RESTPatchAPIGuildRoleJSONBody,
	RESTPatchAPIGuildRolePositionsJSONBody,
	RESTPatchAPIGuildRolePositionsResult,
	RESTPatchAPIGuildRoleResult,
	RESTPatchAPIGuildScheduledEventJSONBody,
	RESTPatchAPIGuildScheduledEventResult,
	RESTPatchAPIGuildStickerJSONBody,
	RESTPatchAPIGuildStickerResult,
	RESTPatchAPIGuildTemplateJSONBody,
	RESTPatchAPIGuildTemplateResult,
	RESTPatchAPIGuildVoiceStateUserJSONBody,
	RESTPatchAPIGuildWelcomeScreenJSONBody,
	RESTPatchAPIGuildWelcomeScreenResult,
	RESTPatchAPIGuildWidgetSettingsJSONBody,
	RESTPatchAPIGuildWidgetSettingsResult,
	RESTPostAPIAutoModerationRuleJSONBody,
	RESTPostAPIAutoModerationRuleResult,
	RESTPostAPIGuildChannelJSONBody,
	RESTPostAPIGuildChannelResult,
	RESTPostAPIGuildEmojiJSONBody,
	RESTPostAPIGuildEmojiResult,
	RESTPostAPIGuildPruneJSONBody,
	RESTPostAPIGuildRoleJSONBody,
	RESTPostAPIGuildRoleResult,
	RESTPostAPIGuildScheduledEventJSONBody,
	RESTPostAPIGuildScheduledEventResult,
	RESTPostAPIGuildsJSONBody,
	RESTPostAPIGuildsMFAResult,
	RESTPostAPIGuildsResult,
	RESTPostAPIGuildTemplatesResult,
	RESTPostAPITemplateCreateGuildJSONBody,
	RESTPutAPIGuildBanJSONBody,
	RESTPutAPIGuildTemplateSyncResult,
	Snowflake,
} from 'discord-api-types/v10';

export class GuildsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild}
	 * @param guildId - The id of the guild
	 * @param options - The options for fetching the guild
	 */
	public async get(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guild(guildId), { signal }) as Promise<RESTGetAPIGuildResult>;
	}

	/**
	 * Fetches a guild preview
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-preview}
	 * @param guildId - The id of the guild to fetch the preview from
	 * @param options - The options for fetching the guild preview
	 */
	public async getPreview(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildPreview(guildId), {
			signal,
		}) as Promise<RESTGetAPIGuildPreviewResult>;
	}

	/**
	 * Creates a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild}
	 * @param body - The guild to create
	 * @param options - The options for creating the guild
	 */
	public async create(body: RESTPostAPIGuildsJSONBody, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.post(Routes.guilds(), { body, signal }) as Promise<RESTPostAPIGuildsResult>;
	}

	/**
	 * Edits a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild}
	 * @param guildId - The id of the guild to edit
	 * @param body - The new guild data
	 * @param options - The options for editing the guild
	 */
	public async edit(
		guildId: Snowflake,
		body: RESTPatchAPIGuildJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.guild(guildId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPatchAPIGuildResult>;
	}

	/**
	 * Deletes a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#delete-guild}
	 * @param guildId - The id of the guild to delete
	 * @param options - The options for deleting this guild
	 */
	public async delete(guildId: Snowflake, { signal, reason }: Pick<RequestData, 'reason' | 'signal'> = {}) {
		await this.rest.delete(Routes.guild(guildId), { reason, signal });
	}

	/**
	 * Fetches all the members of a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#list-guild-members}
	 * @param guildId - The id of the guild
	 * @param query - The query to use when fetching the guild members
	 * @param options - The options for fetching the guild members
	 */
	public async getMembers(
		guildId: Snowflake,
		query: RESTGetAPIGuildMembersQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.guildMembers(guildId), {
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIGuildMembersResult>;
	}

	/**
	 * Fetches a guild's channels
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-channels}
	 * @param guildId - The id of the guild to fetch the channels from
	 * @param options - The options for fetching the guild channels
	 */
	public async getChannels(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildChannels(guildId), {
			signal,
		}) as Promise<RESTGetAPIGuildChannelsResult>;
	}

	/**
	 * Creates a guild channel
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-channel}
	 * @param guildId - The id of the guild to create the channel in
	 * @param body - The data to create the new channel
	 * @param options - The options for creating the guild channel
	 */
	public async createChannel(
		guildId: Snowflake,
		body: RESTPostAPIGuildChannelJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.guildChannels(guildId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPostAPIGuildChannelResult>;
	}

	/**
	 * Edits a guild channel's positions
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-channel-positions}
	 * @param guildId - The id of the guild to edit the channel positions from
	 * @param body - The data to edit the channel positions with
	 * @param options - The options for editing the guild channel positions
	 */
	public async setChannelPositions(
		guildId: Snowflake,
		body: RESTPatchAPIGuildChannelPositionsJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.patch(Routes.guildChannels(guildId), { reason, body, signal });
	}

	/**
	 * Fetches the active threads in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#list-active-guild-threads}
	 * @param guildId - The id of the guild to fetch the active threads from
	 * @param options - The options for fetching the active threads
	 */
	public async getActiveThreads(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildActiveThreads(guildId), { signal }) as Promise<RESTGetAPIGuildThreadsResult>;
	}

	/**
	 * Fetches a guild member ban
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-ban}
	 * @param guildId - The id of the guild to fetch the ban from
	 * @param userId - The id of the user to fetch the ban
	 * @param options - The options for fetching the ban
	 */
	public async getMemberBan(guildId: Snowflake, userId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildBan(guildId, userId), { signal }) as Promise<RESTGetAPIGuildBanResult>;
	}

	/**
	 * Fetches guild member bans
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-bans}
	 * @param guildId - The id of the guild to fetch the bans from
	 * @param query - The query options for fetching the bans
	 * @param options - The options for fetching the bans
	 */
	public async getMemberBans(
		guildId: Snowflake,
		query: RESTGetAPIGuildBansQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.guildBans(guildId), {
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIGuildBansResult>;
	}

	/**
	 * Bans a user from a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-ban}
	 * @param guildId - The id of the guild to ban the member in
	 * @param userId - The id of the user to ban
	 * @param body - The payload for banning the user
	 * @param options - The options for banning the user
	 */
	public async banUser(
		guildId: Snowflake,
		userId: Snowflake,
		body: RESTPutAPIGuildBanJSONBody = {},
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.put(Routes.guildBan(guildId, userId), { reason, body, signal });
	}

	/**
	 * Unbans a user from a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#remove-guild-ban}
	 * @param guildId - The id of the guild to unban the member in
	 * @param userId - The id of the user to unban
	 * @param options - The options for unbanning the user
	 */
	public async unbanUser(
		guildId: Snowflake,
		userId: Snowflake,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.guildBan(guildId, userId), { reason, signal });
	}

	/**
	 * Gets all the roles in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-roles}
	 * @param guildId - The id of the guild to fetch the roles from
	 * @param options - The options for fetching the guild roles
	 */
	public async getRoles(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildRoles(guildId), { signal }) as Promise<RESTGetAPIGuildRolesResult>;
	}

	/**
	 * Creates a guild role
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-role}
	 * @param guildId - The id of the guild to create the role in
	 * @param body - The data to create the role with
	 * @param options - The options for creating the guild role
	 */
	public async createRole(
		guildId: Snowflake,
		body: RESTPostAPIGuildRoleJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.guildRoles(guildId), { reason, body, signal }) as Promise<RESTPostAPIGuildRoleResult>;
	}

	/**
	 * Sets role positions in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-role-positions}
	 * @param guildId - The id of the guild to set role positions for
	 * @param body - The data for setting a role position
	 * @param options - The options for setting role positions
	 */
	public async setRolePositions(
		guildId: Snowflake,
		body: RESTPatchAPIGuildRolePositionsJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.guildRoles(guildId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPatchAPIGuildRolePositionsResult>;
	}

	/**
	 * Edits a guild role
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-role}
	 * @param guildId - The id of the guild to edit the role in
	 * @param roleId - The id of the role to edit
	 * @param body - data for editing the role
	 * @param options - The options for editing the guild role
	 */
	public async editRole(
		guildId: Snowflake,
		roleId: Snowflake,
		body: RESTPatchAPIGuildRoleJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.guildRole(guildId, roleId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPatchAPIGuildRoleResult>;
	}

	/**
	 * Deletes a guild role
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#delete-guild-role}
	 * @param guildId - The id of the guild to delete the role in
	 * @param roleId - The id of the role to delete
	 * @param options - The options for deleting the guild role
	 */
	public async deleteRole(
		guildId: Snowflake,
		roleId: Snowflake,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.guildRole(guildId, roleId), { reason, signal });
	}

	/**
	 * Edits the multi-factor-authentication (MFA) level of a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-mfa-level}
	 * @param guildId - The id of the guild to edit the MFA level for
	 * @param level - The new MFA level
	 * @param options - The options for editing the MFA level
	 */
	public async editMFALevel(
		guildId: Snowflake,
		level: GuildMFALevel,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.guildMFA(guildId), {
			reason,
			signal,
			body: { mfa_level: level },
		}) as Promise<RESTPostAPIGuildsMFAResult>;
	}

	/**
	 * Fetch the number of members that can be pruned from a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-prune-count}
	 * @param guildId - The id of the guild to fetch the number of pruned members from
	 * @param query - The query options for fetching the number of pruned members
	 * @param options - The options for fetching the number of pruned members
	 */
	public async getPruneCount(
		guildId: Snowflake,
		query: RESTGetAPIGuildPruneCountQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.guildPrune(guildId), {
			signal,
			query: makeURLSearchParams(query),
		}) as Promise<RESTGetAPIGuildPruneCountResult>;
	}

	/**
	 * Prunes members in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#begin-guild-prune}
	 * @param guildId - The id of the guild to prune members in
	 * @param body - The options for pruning members
	 * @param options - The options for initiating the prune
	 */
	public async beginPrune(
		guildId: Snowflake,
		body: RESTPostAPIGuildPruneJSONBody = {},
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.guildPrune(guildId), {
			body,
			reason,
			signal,
		}) as Promise<RESTGetAPIGuildPruneCountResult>;
	}

	/**
	 * Fetches voice regions for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-voice-regions}
	 * @param guildId - The id of the guild to fetch the voice regions from
	 * @param options - The options for fetching the voice regions
	 */
	public async getVoiceRegions(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildVoiceRegions(guildId), { signal }) as Promise<RESTGetAPIGuildVoiceRegionsResult>;
	}

	/**
	 * Fetches the invites for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-invites}
	 * @param guildId - The id of the guild to fetch the invites from
	 * @param options - The options for fetching the invites
	 */
	public async getInvites(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildInvites(guildId), { signal }) as Promise<RESTGetAPIGuildInvitesResult>;
	}

	/**
	 * Fetches the integrations for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-integrations}
	 * @param guildId - The id of the guild to fetch the integrations from
	 * @param options - The options for fetching the integrations
	 */
	public async getIntegrations(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildIntegrations(guildId), { signal }) as Promise<RESTGetAPIGuildIntegrationsResult>;
	}

	/**
	 * Deletes an integration from a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#delete-guild-integration}
	 * @param guildId - The id of the guild to delete the integration from
	 * @param integrationId - The id of the integration to delete
	 * @param options - The options for deleting the integration
	 */
	public async deleteIntegration(
		guildId: Snowflake,
		integrationId: Snowflake,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.guildIntegration(guildId, integrationId), { reason, signal });
	}

	/**
	 * Fetches the widget settings for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget-settings}
	 * @param guildId - The id of the guild to fetch the widget settings from
	 * @param options - The options for fetching the widget settings
	 */
	public async getWidgetSettings(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildWidgetSettings(guildId), { signal }) as Promise<RESTGetAPIGuildWidgetImageResult>;
	}

	/**
	 * Edits the widget settings for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-widget}
	 * @param guildId - The id of the guild to edit the widget settings from
	 * @param body - The new widget settings data
	 * @param options - The options for editing the widget settings
	 */
	public async editWidgetSettings(
		guildId: Snowflake,
		body: RESTPatchAPIGuildWidgetSettingsJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.guildWidgetSettings(guildId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPatchAPIGuildWidgetSettingsResult>;
	}

	/**
	 * Fetches the widget for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget}
	 * @param guildId - The id of the guild to fetch the widget from
	 * @param options - The options for fetching the widget
	 */
	public async getWidget(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildWidgetJSON(guildId), { signal }) as Promise<RESTGetAPIGuildWidgetJSONResult>;
	}

	/**
	 * Fetches the vanity url for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-vanity-url}
	 * @param guildId - The id of the guild to fetch the vanity url from
	 * @param options - The options for fetching the vanity url
	 */
	public async getVanityURL(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildVanityUrl(guildId), { signal }) as Promise<RESTGetAPIGuildVanityUrlResult>;
	}

	/**
	 * Fetches the widget image for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget-image}
	 * @param guildId - The id of the guild to fetch the widget image from
	 * @param style - The style of the widget image
	 * @param options - The options for fetching the widget image
	 */
	public async getWidgetImage(
		guildId: Snowflake,
		style?: GuildWidgetStyle,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.guildWidgetImage(guildId), {
			query: makeURLSearchParams({ style }),
			signal,
		}) as Promise<RESTGetAPIGuildWidgetImageResult>;
	}

	/**
	 * Fetches the welcome screen for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-welcome-screen}
	 * @param guildId - The id of the guild to fetch the welcome screen from
	 * @param options - The options for fetching the welcome screen
	 */
	public async getWelcomeScreen(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildWelcomeScreen(guildId), { signal }) as Promise<RESTGetAPIGuildWelcomeScreenResult>;
	}

	/**
	 * Edits the welcome screen for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-welcome-screen}
	 * @param guildId - The id of the guild to edit the welcome screen for
	 * @param body - The new welcome screen data
	 * @param options - The options for editing the welcome screen
	 */
	public async editWelcomeScreen(
		guildId: Snowflake,
		body?: RESTPatchAPIGuildWelcomeScreenJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.guildWelcomeScreen(guildId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPatchAPIGuildWelcomeScreenResult>;
	}

	/**
	 * Edits a user's voice state in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-user-voice-state}
	 * @param guildId - The id of the guild to edit the current user's voice state in
	 * @param userId - The id of the user to edit the voice state for
	 * @param body - The data for editing the voice state
	 * @param options - The options for editing the voice state
	 */
	public async editUserVoiceState(
		guildId: Snowflake,
		userId: Snowflake,
		body: RESTPatchAPIGuildVoiceStateUserJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.patch(Routes.guildVoiceState(guildId, userId), { reason, body, signal });
	}

	/**
	 * Fetches all emojis for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#list-guild-emojis}
	 * @param guildId - The id of the guild to fetch the emojis from
	 * @param options - The options for fetching the emojis
	 */
	public async getEmojis(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildEmojis(guildId), { signal }) as Promise<RESTGetAPIGuildEmojisResult>;
	}

	/**
	 * Fetches an emoji for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#get-guild-emoji}
	 * @param guildId - The id of the guild to fetch the emoji from
	 * @param emojiId - The id of the emoji to fetch
	 * @param options - The options for fetching the emoji
	 */
	public async getEmoji(guildId: Snowflake, emojiId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildEmoji(guildId, emojiId), { signal }) as Promise<RESTGetAPIGuildEmojiResult>;
	}

	/**
	 * Creates a new emoji for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#create-guild-emoji}
	 * @param guildId - The id of the guild to create the emoji from
	 * @param body - The data for creating the emoji
	 * @param options - The options for creating the emoji
	 */
	public async createEmoji(
		guildId: Snowflake,
		body: RESTPostAPIGuildEmojiJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.guildEmojis(guildId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPostAPIGuildEmojiResult>;
	}

	/**
	 * Edits an emoji for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#modify-guild-emoji}
	 * @param guildId - The id of the guild to edit the emoji from
	 * @param emojiId - The id of the emoji to edit
	 * @param body - The data for editing the emoji
	 * @param options - The options for editing the emoji
	 */
	public async editEmoji(
		guildId: Snowflake,
		emojiId: Snowflake,
		body: RESTPatchAPIGuildEmojiJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.guildEmoji(guildId, emojiId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPatchAPIGuildEmojiResult>;
	}

	/**
	 * Deletes an emoji for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#delete-guild-emoji}
	 * @param guildId - The id of the guild to delete the emoji from
	 * @param emojiId - The id of the emoji to delete
	 * @param options - The options for deleting the emoji
	 */
	public async deleteEmoji(
		guildId: Snowflake,
		emojiId: Snowflake,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.guildEmoji(guildId, emojiId), { reason, signal });
	}

	/**
	 * Fetches all scheduled events for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#list-scheduled-events-for-guild}
	 * @param guildId - The id of the guild to fetch the scheduled events from
	 * @param query - The query options for fetching the scheduled events
	 * @param options - The options for fetching the scheduled events
	 */
	public async getScheduledEvents(
		guildId: Snowflake,
		query: RESTGetAPIGuildScheduledEventsQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.guildScheduledEvents(guildId), {
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIGuildScheduledEventsResult>;
	}

	/**
	 * Creates a new scheduled event for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#create-guild-scheduled-event}
	 * @param guildId - The id of the guild to create the scheduled event from
	 * @param body - The data to create the event with
	 * @param options - The options for creating the scheduled event
	 */
	public async createScheduledEvent(
		guildId: Snowflake,
		body: RESTPostAPIGuildScheduledEventJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.guildScheduledEvents(guildId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPostAPIGuildScheduledEventResult>;
	}

	/**
	 * Fetches a scheduled event for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#get-guild-scheduled-event}
	 * @param guildId - The id of the guild to fetch the scheduled event from
	 * @param eventId - The id of the scheduled event to fetch
	 * @param query - The options for fetching the scheduled event
	 * @param options - The options for fetching the scheduled event
	 */
	public async getScheduledEvent(
		guildId: Snowflake,
		eventId: Snowflake,
		query: RESTGetAPIGuildScheduledEventQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.guildScheduledEvent(guildId, eventId), {
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIGuildScheduledEventResult>;
	}

	/**
	 * Edits a scheduled event for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#modify-guild-scheduled-event}
	 * @param guildId - The id of the guild to edit the scheduled event from
	 * @param eventId - The id of the scheduled event to edit
	 * @param body - The new event data
	 * @param options - The options for editing the scheduled event
	 */
	public async editScheduledEvent(
		guildId: Snowflake,
		eventId: Snowflake,
		body: RESTPatchAPIGuildScheduledEventJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.guildScheduledEvent(guildId, eventId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPatchAPIGuildScheduledEventResult>;
	}

	/**
	 * Deletes a scheduled event for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#delete-guild-scheduled-event}
	 * @param guildId - The id of the guild to delete the scheduled event from
	 * @param eventId - The id of the scheduled event to delete
	 * @param options - The options for deleting the scheduled event
	 */
	public async deleteScheduledEvent(
		guildId: Snowflake,
		eventId: Snowflake,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.guildScheduledEvent(guildId, eventId), { reason, signal });
	}

	/**
	 * Gets all users that are interested in a scheduled event
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#get-guild-scheduled-event-users}
	 * @param guildId - The id of the guild to fetch the scheduled event users from
	 * @param eventId - The id of the scheduled event to fetch the users for
	 * @param query - The options for fetching the scheduled event users
	 * @param options - The options for fetching the scheduled event users
	 */
	public async getScheduledEventUsers(
		guildId: Snowflake,
		eventId: Snowflake,
		query: RESTGetAPIGuildScheduledEventUsersQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.guildScheduledEventUsers(guildId, eventId), {
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIGuildScheduledEventUsersResult>;
	}

	/**
	 * Fetches all the templates for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#get-guild-templates}
	 * @param guildId - The id of the guild to fetch the templates from
	 * @param options - The options for fetching the templates
	 */
	public async getTemplates(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildTemplates(guildId), { signal }) as Promise<RESTGetAPIGuildTemplatesResult>;
	}

	/**
	 * Syncs a template for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#sync-guild-template}
	 * @param guildId - The id of the guild to sync the template from
	 * @param templateCode - The code of the template to sync
	 * @param options - The options for syncing the template
	 */
	public async syncTemplate(guildId: Snowflake, templateCode: string, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.put(Routes.guildTemplate(guildId, templateCode), {
			signal,
		}) as Promise<RESTPutAPIGuildTemplateSyncResult>;
	}

	/**
	 * Edits a template for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#modify-guild-template}
	 * @param guildId - The id of the guild to edit the template from
	 * @param templateCode - The code of the template to edit
	 * @param body - The data for editing the template
	 * @param options - The options for editing the template
	 */
	public async editTemplate(
		guildId: Snowflake,
		templateCode: string,
		body: RESTPatchAPIGuildTemplateJSONBody,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.patch(Routes.guildTemplate(guildId, templateCode), {
			body,
			signal,
		}) as Promise<RESTPatchAPIGuildTemplateResult>;
	}

	/**
	 * Deletes a template for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#delete-guild-template}
	 * @param guildId - The id of the guild to delete the template from
	 * @param templateCode - The code of the template to delete
	 * @param options - The options for deleting the template
	 */
	public async deleteTemplate(guildId: Snowflake, templateCode: string, { signal }: Pick<RequestData, 'signal'> = {}) {
		await this.rest.delete(Routes.guildTemplate(guildId, templateCode), { signal });
	}

	/**
	 * Fetches all the stickers for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#list-guild-stickers}
	 * @param guildId - The id of the guild to fetch the stickers from
	 * @param options - The options for fetching the stickers
	 */
	public async getStickers(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildStickers(guildId), { signal }) as Promise<RESTGetAPIGuildStickersResult>;
	}

	/**
	 * Fetches a sticker for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#get-guild-sticker}
	 * @param guildId - The id of the guild to fetch the sticker from
	 * @param stickerId - The id of the sticker to fetch
	 * @param options - The options for fetching the sticker
	 */
	public async getSticker(guildId: Snowflake, stickerId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildSticker(guildId, stickerId), { signal }) as Promise<RESTGetAPIGuildStickerResult>;
	}

	/**
	 * Creates a sticker for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#create-guild-sticker}
	 * @param guildId - The id of the guild to create the sticker for
	 * @param body - The data for creating the sticker
	 * @param options - The options for creating the sticker
	 */
	public async createSticker(
		guildId: Snowflake,
		{ file, ...body }: Omit<RESTPostAPIGuildStickerFormDataBody, 'file'> & { file: RawFile },
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		const fileData = { ...file, key: 'file' };

		return this.rest.post(Routes.guildStickers(guildId), {
			appendToFormData: true,
			body,
			files: [fileData],
			reason,
			signal,
		}) as Promise<RESTPostAPIGuildStickerResult>;
	}

	/**
	 * Edits a sticker for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#modify-guild-sticker}
	 * @param guildId - The id of the guild to edit the sticker from
	 * @param stickerId - The id of the sticker to edit
	 * @param body - The data for editing the sticker
	 * @param options - The options for editing the sticker
	 */
	public async editSticker(
		guildId: Snowflake,
		stickerId: Snowflake,
		body: RESTPatchAPIGuildStickerJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.guildSticker(guildId, stickerId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPatchAPIGuildStickerResult>;
	}

	/**
	 * Deletes a sticker for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#delete-guild-sticker}
	 * @param guildId - The id of the guild to delete the sticker from
	 * @param stickerId - The id of the sticker to delete
	 * @param options - The options for deleting the sticker
	 */
	public async deleteSticker(
		guildId: Snowflake,
		stickerId: Snowflake,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.guildSticker(guildId, stickerId), { reason, signal });
	}

	/**
	 * Fetches the audit logs for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log}
	 * @param guildId - The id of the guild to fetch the audit logs from
	 * @param query - The query options for fetching the audit logs
	 * @param options - The options for fetching the audit logs
	 */
	public async getAuditLogs(
		guildId: Snowflake,
		query: RESTGetAPIAuditLogQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.guildAuditLog(guildId), {
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIAuditLogResult>;
	}

	/**
	 * Fetches all auto moderation rules for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#list-auto-moderation-rules-for-guild}
	 * @param guildId - The id of the guild to fetch the auto moderation rules from
	 * @param options - The options for fetching the auto moderation rules
	 */
	public async getAutoModerationRules(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildAutoModerationRules(guildId), {
			signal,
		}) as Promise<RESTGetAPIAutoModerationRulesResult>;
	}

	/**
	 * Fetches an auto moderation rule for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#get-auto-moderation-rule}
	 * @param guildId - The id of the guild to fetch the auto moderation rule from
	 * @param ruleId - The id of the auto moderation rule to fetch
	 * @param options - The options for fetching the auto moderation rule
	 */
	public async getAutoModerationRule(
		guildId: Snowflake,
		ruleId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.guildAutoModerationRule(guildId, ruleId), {
			signal,
		}) as Promise<RESTGetAPIAutoModerationRuleResult>;
	}

	/**
	 * Creates a new auto moderation rule for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#create-auto-moderation-rule}
	 * @param guildId - The id of the guild to create the auto moderation rule from
	 * @param body - The data for creating the auto moderation rule
	 * @param options - The options for creating the auto moderation rule
	 */
	public async createAutoModerationRule(
		guildId: Snowflake,
		body: RESTPostAPIAutoModerationRuleJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.post(Routes.guildAutoModerationRules(guildId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPostAPIAutoModerationRuleResult>;
	}

	/**
	 * Edits an auto moderation rule for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#modify-auto-moderation-rule}
	 * @param guildId - The id of the guild to edit the auto moderation rule from
	 * @param ruleId - The id of the auto moderation rule to edit
	 * @param body - The data for editing the auto moderation rule
	 * @param options - The options for editing the auto moderation rule
	 */
	public async editAutoModerationRule(
		guildId: Snowflake,
		ruleId: Snowflake,
		body: RESTPatchAPIAutoModerationRuleJSONBody,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.guildAutoModerationRule(guildId, ruleId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPatchAPIAutoModerationRuleJSONBody>;
	}

	/**
	 * Deletes an auto moderation rule for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#delete-auto-moderation-rule}
	 * @param guildId - The id of the guild to delete the auto moderation rule from
	 * @param ruleId - The id of the auto moderation rule to delete
	 * @param options - The options for deleting the auto moderation rule
	 */
	public async deleteAutoModerationRule(
		guildId: Snowflake,
		ruleId: Snowflake,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.guildAutoModerationRule(guildId, ruleId), { reason, signal });
	}

	/**
	 * Fetches a guild member
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-member}
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 * @param options - The options for fetching the guild member
	 */
	public async getMember(guildId: Snowflake, userId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.guildMember(guildId, userId), { signal }) as Promise<RESTGetAPIGuildMemberResult>;
	}

	/**
	 * Searches for guild members
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#search-guild-members}
	 * @param guildId - The id of the guild to search in
	 * @param query - The query to search for
	 * @param options - The options for searching for guild members
	 */
	public async searchForMembers(
		guildId: Snowflake,
		query: RESTGetAPIGuildMembersSearchQuery,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.guildMembersSearch(guildId), {
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIGuildMembersSearchResult>;
	}

	/**
	 * Edits a guild member
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-member}
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 * @param body - The data to use when editing the guild member
	 * @param options - The options for editing the guild member
	 */
	public async editMember(
		guildId: Snowflake,
		userId: Snowflake,
		body: RESTPatchAPIGuildMemberJSONBody = {},
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.guildMember(guildId, userId), {
			reason,
			body,
			signal,
		}) as Promise<RESTPatchAPIGuildMemberResult>;
	}

	/**
	 * Removes a member from a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#remove-guild-member}
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 * @param options - The options for removing the guild member
	 */
	public async removeMember(
		guildId: Snowflake,
		userId: Snowflake,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.delete(Routes.guildMember(guildId, userId), { reason, signal });
	}

	/**
	 * Adds a role to a guild member
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#add-guild-member-role}
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 * @param roleId - The id of the role
	 * @param options - The options for adding a role to a guild member
	 */
	public async addRoleToMember(
		guildId: Snowflake,
		userId: Snowflake,
		roleId: Snowflake,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.put(Routes.guildMemberRole(guildId, userId, roleId), { reason, signal });
	}

	/**
	 * Removes a role from a guild member
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#remove-guild-member-role}
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 * @param roleId - The id of the role
	 * @param options - The options for removing a role from a guild member
	 */
	public async removeRoleFromMember(
		guildId: Snowflake,
		userId: Snowflake,
		roleId: Snowflake,
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.guildMemberRole(guildId, userId, roleId), { reason, signal });
	}

	/**
	 * Fetches a guild template
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#get-guild-template}
	 * @param templateCode - The code of the template
	 * @param options - The options for fetching the guild template
	 */
	public async getTemplate(templateCode: string, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.template(templateCode), { signal }) as Promise<RESTGetAPITemplateResult>;
	}

	/**
	 * Creates a new template
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#create-guild-template}
	 * @param templateCode - The code of the template
	 * @param body - The data to use when creating the template
	 * @param options - The options for creating the template
	 */
	public async createTemplate(
		templateCode: string,
		body: RESTPostAPITemplateCreateGuildJSONBody,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.post(Routes.template(templateCode), { body, signal }) as Promise<RESTPostAPIGuildTemplatesResult>;
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

	/**
	 * Sets the voice state for the current user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state}
	 * @param guildId - The id of the guild
	 * @param body - The options to use when setting the voice state
	 */
	public async setVoiceState(guildId: Snowflake, body: RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody = {}) {
		return this.rest.patch(Routes.guildVoiceState(guildId, '@me'), {
			body,
		}) as Promise<RESTPatchAPIGuildVoiceStateCurrentMemberResult>;
	}
}
