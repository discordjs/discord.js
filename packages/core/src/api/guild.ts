/* eslint-disable jsdoc/check-param-names */

import { makeURLSearchParams, type REST, type RawFile } from '@discordjs/rest';
import {
	Routes,
	type GuildWidgetStyle,
	type RESTGetAPIAuditLogQuery,
	type RESTGetAPIAuditLogResult,
	type RESTGetAPIAutoModerationRuleResult,
	type RESTGetAPIAutoModerationRulesResult,
	type RESTGetAPIGuildBanResult,
	type RESTGetAPIGuildBansQuery,
	type RESTGetAPIGuildBansResult,
	type RESTGetAPIGuildChannelsResult,
	type RESTGetAPIGuildEmojiResult,
	type RESTGetAPIGuildEmojisResult,
	type RESTGetAPIGuildIntegrationsResult,
	type RESTGetAPIGuildInvitesResult,
	type RESTGetAPIGuildMemberResult,
	type RESTGetAPIGuildMembersQuery,
	type RESTGetAPIGuildMembersResult,
	type RESTGetAPIGuildMembersSearchQuery,
	type RESTGetAPIGuildMembersSearchResult,
	type RESTGetAPIGuildMessagesSearchQuery,
	type RESTGetAPIGuildMessagesSearchResult,
	type RESTGetAPIGuildOnboardingResult,
	type RESTGetAPIGuildPreviewResult,
	type RESTGetAPIGuildPruneCountQuery,
	type RESTGetAPIGuildPruneCountResult,
	type RESTGetAPIGuildQuery,
	type RESTGetAPIGuildResult,
	type RESTGetAPIGuildRoleMemberCountsResult,
	type RESTGetAPIGuildRoleResult,
	type RESTGetAPIGuildRolesResult,
	type RESTGetAPIGuildScheduledEventQuery,
	type RESTGetAPIGuildScheduledEventResult,
	type RESTGetAPIGuildScheduledEventUsersQuery,
	type RESTGetAPIGuildScheduledEventUsersResult,
	type RESTGetAPIGuildScheduledEventsQuery,
	type RESTGetAPIGuildScheduledEventsResult,
	type RESTGetAPIGuildSoundboardSoundResult,
	type RESTGetAPIGuildSoundboardSoundsResult,
	type RESTGetAPIGuildStickerResult,
	type RESTGetAPIGuildStickersResult,
	type RESTGetAPIGuildTemplatesResult,
	type RESTGetAPIGuildThreadsResult,
	type RESTGetAPIGuildVanityUrlResult,
	type RESTGetAPIGuildVoiceRegionsResult,
	type RESTGetAPIGuildWebhooksResult,
	type RESTGetAPIGuildWelcomeScreenResult,
	type RESTGetAPIGuildWidgetImageResult,
	type RESTGetAPIGuildWidgetJSONResult,
	type RESTGetAPIGuildWidgetSettingsResult,
	type RESTGetAPITemplateResult,
	type RESTPatchAPIAutoModerationRuleJSONBody,
	type RESTPatchAPIAutoModerationRuleResult,
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
	type RESTPatchAPIGuildSoundboardSoundJSONBody,
	type RESTPatchAPIGuildSoundboardSoundResult,
	type RESTPatchAPIGuildStickerJSONBody,
	type RESTPatchAPIGuildStickerResult,
	type RESTPatchAPIGuildTemplateJSONBody,
	type RESTPatchAPIGuildTemplateResult,
	type RESTPatchAPIGuildWelcomeScreenJSONBody,
	type RESTPatchAPIGuildWelcomeScreenResult,
	type RESTPatchAPIGuildWidgetSettingsJSONBody,
	type RESTPatchAPIGuildWidgetSettingsResult,
	type RESTPostAPIAutoModerationRuleJSONBody,
	type RESTPostAPIAutoModerationRuleResult,
	type RESTPostAPIGuildBulkBanJSONBody,
	type RESTPostAPIGuildBulkBanResult,
	type RESTPostAPIGuildChannelJSONBody,
	type RESTPostAPIGuildChannelResult,
	type RESTPostAPIGuildEmojiJSONBody,
	type RESTPostAPIGuildEmojiResult,
	type RESTPostAPIGuildPruneJSONBody,
	type RESTPostAPIGuildPruneResult,
	type RESTPostAPIGuildRoleJSONBody,
	type RESTPostAPIGuildRoleResult,
	type RESTPostAPIGuildScheduledEventJSONBody,
	type RESTPostAPIGuildScheduledEventResult,
	type RESTPostAPIGuildSoundboardSoundJSONBody,
	type RESTPostAPIGuildSoundboardSoundResult,
	type RESTPostAPIGuildStickerFormDataBody,
	type RESTPostAPIGuildStickerResult,
	type RESTPostAPIGuildTemplatesJSONBody,
	type RESTPostAPIGuildTemplatesResult,
	type RESTPutAPIGuildBanJSONBody,
	type RESTPutAPIGuildIncidentActionsJSONBody,
	type RESTPutAPIGuildIncidentActionsResult,
	type RESTPutAPIGuildMemberJSONBody,
	type RESTPutAPIGuildMemberResult,
	type RESTPutAPIGuildOnboardingJSONBody,
	type RESTPutAPIGuildOnboardingResult,
	type RESTPutAPIGuildTemplateSyncResult,
	type Snowflake,
} from 'discord-api-types/v10';
import type { RequestOptions, RequestOptionsWithReason } from '../util/types.js';

export interface CreateStickerOptions extends Omit<RESTPostAPIGuildStickerFormDataBody, 'file'> {
	file: RawFile;
}

export class GuildsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild}
	 * @param guildId - The id of the guild
	 * @param query - The query options for fetching the guild
	 * @param options - The options for fetching the guild
	 */
	public async get(guildId: Snowflake, query: RESTGetAPIGuildQuery = {}, options: RequestOptions = {}) {
		return this.rest.get(Routes.guild(guildId), {
			...options,
			query: makeURLSearchParams(query),
		}) as Promise<RESTGetAPIGuildResult>;
	}

	/**
	 * Fetches a guild preview
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-preview}
	 * @param guildId - The id of the guild to fetch the preview from
	 * @param options - The options for fetching the guild preview
	 */
	public async getPreview(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildPreview(guildId), options) as Promise<RESTGetAPIGuildPreviewResult>;
	}

	/**
	 * Edits a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild}
	 * @param guildId - The id of the guild to edit
	 * @param body - The new guild data
	 * @param options - The options for editing the guild
	 */
	public async edit(guildId: Snowflake, body: RESTPatchAPIGuildJSONBody, options: RequestOptionsWithReason = {}) {
		return this.rest.patch(Routes.guild(guildId), {
			...options,
			body,
		}) as Promise<RESTPatchAPIGuildResult>;
	}

	/**
	 * Adds user to the guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#add-guild-member}
	 * @param guildId - The id of the guild to add the user to
	 * @param userId - The id of the user to add
	 * @param body - The data for adding users to the guild
	 * @param options - The options for adding users to the guild
	 */
	public async addMember(
		guildId: Snowflake,
		userId: Snowflake,
		body: RESTPutAPIGuildMemberJSONBody,
		options: RequestOptions = {},
	) {
		return this.rest.put(Routes.guildMember(guildId, userId), {
			...options,
			body,
		}) as Promise<RESTPutAPIGuildMemberResult>;
	}

	/**
	 * Fetches members of a guild.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#list-guild-members}
	 * @param guildId - The id of the guild
	 * @param query - The query for fetching the guild members
	 * @param options - The options for fetching the guild members
	 */
	public async getMembers(guildId: Snowflake, query: RESTGetAPIGuildMembersQuery = {}, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildMembers(guildId), {
			...options,
			query: makeURLSearchParams(query),
		}) as Promise<RESTGetAPIGuildMembersResult>;
	}

	/**
	 * Fetches a guild's channels
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-channels}
	 * @param guildId - The id of the guild to fetch the channels from
	 * @param options - The options for fetching the guild channels
	 */
	public async getChannels(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildChannels(guildId), options) as Promise<RESTGetAPIGuildChannelsResult>;
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.post(Routes.guildChannels(guildId), {
			...options,
			body,
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
		options: RequestOptionsWithReason = {},
	) {
		await this.rest.patch(Routes.guildChannels(guildId), {
			...options,
			body,
		});
	}

	/**
	 * Fetches the active threads in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#list-active-guild-threads}
	 * @param guildId - The id of the guild to fetch the active threads from
	 * @param options - The options for fetching the active threads
	 */
	public async getActiveThreads(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildActiveThreads(guildId), options) as Promise<RESTGetAPIGuildThreadsResult>;
	}

	/**
	 * Fetches a guild member ban
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-ban}
	 * @param guildId - The id of the guild to fetch the ban from
	 * @param userId - The id of the user to fetch the ban
	 * @param options - The options for fetching the ban
	 */
	public async getMemberBan(guildId: Snowflake, userId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildBan(guildId, userId), options) as Promise<RESTGetAPIGuildBanResult>;
	}

	/**
	 * Fetches guild member bans
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-bans}
	 * @param guildId - The id of the guild to fetch the bans from
	 * @param query - The query options for fetching the bans
	 * @param options - The options for fetching the bans
	 */
	public async getMemberBans(guildId: Snowflake, query: RESTGetAPIGuildBansQuery = {}, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildBans(guildId), {
			...options,
			query: makeURLSearchParams(query),
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
		options: RequestOptionsWithReason = {},
	) {
		await this.rest.put(Routes.guildBan(guildId, userId), {
			...options,
			body,
		});
	}

	/**
	 * Unbans a user from a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#remove-guild-ban}
	 * @param guildId - The id of the guild to unban the member in
	 * @param userId - The id of the user to unban
	 * @param options - The options for unbanning the user
	 */
	public async unbanUser(guildId: Snowflake, userId: Snowflake, options: RequestOptionsWithReason = {}) {
		await this.rest.delete(Routes.guildBan(guildId, userId), options);
	}

	/**
	 * Bulk ban users from a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#bulk-guild-ban}
	 * @param guildId - The id of the guild to bulk ban users in
	 * @param body - The data for bulk banning users
	 * @param options - The options for bulk banning users
	 */
	public async bulkBanUsers(
		guildId: Snowflake,
		body: RESTPostAPIGuildBulkBanJSONBody,
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.post(Routes.guildBulkBan(guildId), {
			...options,
			body,
		}) as Promise<RESTPostAPIGuildBulkBanResult>;
	}

	/**
	 * Gets all the roles in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-roles}
	 * @param guildId - The id of the guild to fetch the roles from
	 * @param options - The options for fetching the guild roles
	 */
	public async getRoles(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildRoles(guildId), options) as Promise<RESTGetAPIGuildRolesResult>;
	}

	/**
	 * Get a role in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-role}
	 * @param guildId - The id of the guild to fetch the role from
	 * @param roleId - The id of the role to fetch
	 * @param options - The options for fetching the guild role
	 */
	public async getRole(guildId: Snowflake, roleId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildRole(guildId, roleId), options) as Promise<RESTGetAPIGuildRoleResult>;
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.post(Routes.guildRoles(guildId), {
			...options,
			body,
		}) as Promise<RESTPostAPIGuildRoleResult>;
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.patch(Routes.guildRoles(guildId), {
			...options,
			body,
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.patch(Routes.guildRole(guildId, roleId), {
			...options,
			body,
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
	public async deleteRole(guildId: Snowflake, roleId: Snowflake, options: RequestOptionsWithReason = {}) {
		await this.rest.delete(Routes.guildRole(guildId, roleId), options);
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
		options: RequestOptions = {},
	) {
		return this.rest.get(Routes.guildPrune(guildId), {
			...options,
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.post(Routes.guildPrune(guildId), {
			...options,
			body,
		}) as Promise<RESTPostAPIGuildPruneResult>;
	}

	/**
	 * Fetches voice regions for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-voice-regions}
	 * @param guildId - The id of the guild to fetch the voice regions from
	 * @param options - The options for fetching the voice regions
	 */
	public async getVoiceRegions(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildVoiceRegions(guildId), options) as Promise<RESTGetAPIGuildVoiceRegionsResult>;
	}

	/**
	 * Fetches the invites for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-invites}
	 * @param guildId - The id of the guild to fetch the invites from
	 * @param options - The options for fetching the invites
	 */
	public async getInvites(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildInvites(guildId), options) as Promise<RESTGetAPIGuildInvitesResult>;
	}

	/**
	 * Fetches the integrations for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-integrations}
	 * @param guildId - The id of the guild to fetch the integrations from
	 * @param options - The options for fetching the integrations
	 */
	public async getIntegrations(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildIntegrations(guildId), options) as Promise<RESTGetAPIGuildIntegrationsResult>;
	}

	/**
	 * Deletes an integration from a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#delete-guild-integration}
	 * @param guildId - The id of the guild to delete the integration from
	 * @param integrationId - The id of the integration to delete
	 * @param options - The options for deleting the integration
	 */
	public async deleteIntegration(guildId: Snowflake, integrationId: Snowflake, options: RequestOptionsWithReason = {}) {
		await this.rest.delete(Routes.guildIntegration(guildId, integrationId), options);
	}

	/**
	 * Fetches the widget settings for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget-settings}
	 * @param guildId - The id of the guild to fetch the widget settings from
	 * @param options - The options for fetching the widget settings
	 */
	public async getWidgetSettings(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildWidgetSettings(guildId), options) as Promise<RESTGetAPIGuildWidgetSettingsResult>;
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.patch(Routes.guildWidgetSettings(guildId), {
			...options,
			body,
		}) as Promise<RESTPatchAPIGuildWidgetSettingsResult>;
	}

	/**
	 * Fetches the widget for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget}
	 * @param guildId - The id of the guild to fetch the widget from
	 * @param options - The options for fetching the widget
	 */
	public async getWidget(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildWidgetJSON(guildId), options) as Promise<RESTGetAPIGuildWidgetJSONResult>;
	}

	/**
	 * Fetches the vanity url for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-vanity-url}
	 * @param guildId - The id of the guild to fetch the vanity url from
	 * @param options - The options for fetching the vanity url
	 */
	public async getVanityURL(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildVanityUrl(guildId), options) as Promise<RESTGetAPIGuildVanityUrlResult>;
	}

	/**
	 * Fetches the widget image for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget-image}
	 * @param guildId - The id of the guild to fetch the widget image from
	 * @param style - The style of the widget image
	 * @param options - The options for fetching the widget image
	 */
	public async getWidgetImage(guildId: Snowflake, style?: GuildWidgetStyle, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildWidgetImage(guildId), {
			...options,
			query: makeURLSearchParams({ style }),
		}) as Promise<RESTGetAPIGuildWidgetImageResult>;
	}

	/**
	 * Fetches the welcome screen for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-welcome-screen}
	 * @param guildId - The id of the guild to fetch the welcome screen from
	 * @param options - The options for fetching the welcome screen
	 */
	public async getWelcomeScreen(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildWelcomeScreen(guildId), options) as Promise<RESTGetAPIGuildWelcomeScreenResult>;
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.patch(Routes.guildWelcomeScreen(guildId), {
			...options,
			body,
		}) as Promise<RESTPatchAPIGuildWelcomeScreenResult>;
	}

	/**
	 * Fetches all emojis for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#list-guild-emojis}
	 * @param guildId - The id of the guild to fetch the emojis from
	 * @param options - The options for fetching the emojis
	 */
	public async getEmojis(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildEmojis(guildId), options) as Promise<RESTGetAPIGuildEmojisResult>;
	}

	/**
	 * Fetches an emoji for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#get-guild-emoji}
	 * @param guildId - The id of the guild to fetch the emoji from
	 * @param emojiId - The id of the emoji to fetch
	 * @param options - The options for fetching the emoji
	 */
	public async getEmoji(guildId: Snowflake, emojiId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildEmoji(guildId, emojiId), options) as Promise<RESTGetAPIGuildEmojiResult>;
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.post(Routes.guildEmojis(guildId), {
			...options,
			body,
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.patch(Routes.guildEmoji(guildId, emojiId), {
			...options,
			body,
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
	public async deleteEmoji(guildId: Snowflake, emojiId: Snowflake, options: RequestOptionsWithReason = {}) {
		await this.rest.delete(Routes.guildEmoji(guildId, emojiId), options);
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
		options: RequestOptions = {},
	) {
		return this.rest.get(Routes.guildScheduledEvents(guildId), {
			...options,
			query: makeURLSearchParams(query),
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.post(Routes.guildScheduledEvents(guildId), {
			...options,
			body,
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
		options: RequestOptions = {},
	) {
		return this.rest.get(Routes.guildScheduledEvent(guildId, eventId), {
			...options,
			query: makeURLSearchParams(query),
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.patch(Routes.guildScheduledEvent(guildId, eventId), {
			...options,
			body,
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
	public async deleteScheduledEvent(guildId: Snowflake, eventId: Snowflake, options: RequestOptionsWithReason = {}) {
		await this.rest.delete(Routes.guildScheduledEvent(guildId, eventId), options);
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
		options: RequestOptions = {},
	) {
		return this.rest.get(Routes.guildScheduledEventUsers(guildId, eventId), {
			...options,
			query: makeURLSearchParams(query),
		}) as Promise<RESTGetAPIGuildScheduledEventUsersResult>;
	}

	/**
	 * Fetches all the templates for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#get-guild-templates}
	 * @param guildId - The id of the guild to fetch the templates from
	 * @param options - The options for fetching the templates
	 */
	public async getTemplates(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildTemplates(guildId), options) as Promise<RESTGetAPIGuildTemplatesResult>;
	}

	/**
	 * Syncs a template for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#sync-guild-template}
	 * @param guildId - The id of the guild to sync the template from
	 * @param templateCode - The code of the template to sync
	 * @param options - The options for syncing the template
	 */
	public async syncTemplate(guildId: Snowflake, templateCode: string, options: RequestOptions = {}) {
		return this.rest.put(
			Routes.guildTemplate(guildId, templateCode),
			options,
		) as Promise<RESTPutAPIGuildTemplateSyncResult>;
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
		options: RequestOptions = {},
	) {
		return this.rest.patch(Routes.guildTemplate(guildId, templateCode), {
			...options,
			body,
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
	public async deleteTemplate(guildId: Snowflake, templateCode: string, options: RequestOptions = {}) {
		await this.rest.delete(Routes.guildTemplate(guildId, templateCode), options);
	}

	/**
	 * Fetches all the stickers for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#list-guild-stickers}
	 * @param guildId - The id of the guild to fetch the stickers from
	 * @param options - The options for fetching the stickers
	 */
	public async getStickers(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildStickers(guildId), options) as Promise<RESTGetAPIGuildStickersResult>;
	}

	/**
	 * Fetches a sticker for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#get-guild-sticker}
	 * @param guildId - The id of the guild to fetch the sticker from
	 * @param stickerId - The id of the sticker to fetch
	 * @param options - The options for fetching the sticker
	 */
	public async getSticker(guildId: Snowflake, stickerId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildSticker(guildId, stickerId), options) as Promise<RESTGetAPIGuildStickerResult>;
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
		{ file, ...body }: CreateStickerOptions,
		options: RequestOptionsWithReason = {},
	) {
		const fileData = { ...file, key: 'file' };

		return this.rest.post(Routes.guildStickers(guildId), {
			...options,
			appendToFormData: true,
			body,
			files: [fileData],
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.patch(Routes.guildSticker(guildId, stickerId), {
			...options,
			body,
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
	public async deleteSticker(guildId: Snowflake, stickerId: Snowflake, options: RequestOptionsWithReason = {}) {
		await this.rest.delete(Routes.guildSticker(guildId, stickerId), options);
	}

	/**
	 * Fetches the audit logs for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log}
	 * @param guildId - The id of the guild to fetch the audit logs from
	 * @param query - The query options for fetching the audit logs
	 * @param options - The options for fetching the audit logs
	 */
	public async getAuditLogs(guildId: Snowflake, query: RESTGetAPIAuditLogQuery = {}, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildAuditLog(guildId), {
			...options,
			query: makeURLSearchParams(query),
		}) as Promise<RESTGetAPIAuditLogResult>;
	}

	/**
	 * Fetches all auto moderation rules for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#list-auto-moderation-rules-for-guild}
	 * @param guildId - The id of the guild to fetch the auto moderation rules from
	 * @param options - The options for fetching the auto moderation rules
	 */
	public async getAutoModerationRules(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(
			Routes.guildAutoModerationRules(guildId),
			options,
		) as Promise<RESTGetAPIAutoModerationRulesResult>;
	}

	/**
	 * Fetches an auto moderation rule for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#get-auto-moderation-rule}
	 * @param guildId - The id of the guild to fetch the auto moderation rule from
	 * @param ruleId - The id of the auto moderation rule to fetch
	 * @param options - The options for fetching the auto moderation rule
	 */
	public async getAutoModerationRule(guildId: Snowflake, ruleId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(
			Routes.guildAutoModerationRule(guildId, ruleId),
			options,
		) as Promise<RESTGetAPIAutoModerationRuleResult>;
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.post(Routes.guildAutoModerationRules(guildId), {
			...options,
			body,
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
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.patch(Routes.guildAutoModerationRule(guildId, ruleId), {
			...options,
			body,
		}) as Promise<RESTPatchAPIAutoModerationRuleResult>;
	}

	/**
	 * Deletes an auto moderation rule for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#delete-auto-moderation-rule}
	 * @param guildId - The id of the guild to delete the auto moderation rule from
	 * @param ruleId - The id of the auto moderation rule to delete
	 * @param options - The options for deleting the auto moderation rule
	 */
	public async deleteAutoModerationRule(guildId: Snowflake, ruleId: Snowflake, options: RequestOptionsWithReason = {}) {
		await this.rest.delete(Routes.guildAutoModerationRule(guildId, ruleId), options);
	}

	/**
	 * Fetches a guild member
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-member}
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 * @param options - The options for fetching the guild member
	 */
	public async getMember(guildId: Snowflake, userId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildMember(guildId, userId), options) as Promise<RESTGetAPIGuildMemberResult>;
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
		options: RequestOptions = {},
	) {
		return this.rest.get(Routes.guildMembersSearch(guildId), {
			...options,
			query: makeURLSearchParams(query),
		}) as Promise<RESTGetAPIGuildMembersSearchResult>;
	}

	/**
	 * Searches for messages.
	 *
	 * @see {@link https://docs.discord.com/developers/resources/message#search-guild-messages}
	 * @param guildId - The id of the guild to search in
	 * @param query - The query to search for
	 * @param options - The options for searching for messages
	 */
	public async searchForMessages(
		guildId: Snowflake,
		query: RESTGetAPIGuildMessagesSearchQuery,
		options: RequestOptions = {},
	) {
		return this.rest.get(Routes.guildMessagesSearch(guildId), {
			...options,
			query: makeURLSearchParams(query),
		}) as Promise<RESTGetAPIGuildMessagesSearchResult>;
	}

	/**
	 * Edits a guild member
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-member}
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 * @param body - The data for editing the guild member
	 * @param options - The options for editing the guild member
	 */
	public async editMember(
		guildId: Snowflake,
		userId: Snowflake,
		body: RESTPatchAPIGuildMemberJSONBody = {},
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.patch(Routes.guildMember(guildId, userId), {
			...options,
			body,
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
	public async removeMember(guildId: Snowflake, userId: Snowflake, options: RequestOptionsWithReason = {}) {
		await this.rest.delete(Routes.guildMember(guildId, userId), options);
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
		options: RequestOptionsWithReason = {},
	) {
		await this.rest.put(Routes.guildMemberRole(guildId, userId, roleId), options);
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
		options: RequestOptionsWithReason = {},
	) {
		await this.rest.delete(Routes.guildMemberRole(guildId, userId, roleId), options);
	}

	/**
	 * Fetches a guild template
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#get-guild-template}
	 * @param templateCode - The code of the template
	 * @param options - The options for fetching the guild template
	 */
	public async getTemplate(templateCode: string, options: RequestOptions = {}) {
		return this.rest.get(Routes.template(templateCode), options) as Promise<RESTGetAPITemplateResult>;
	}

	/**
	 * Creates a new template
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-template#create-guild-template}
	 * @param guildId - The id of the guild
	 * @param body - The data for creating the template
	 * @param options - The options for creating the template
	 */
	public async createTemplate(
		guildId: Snowflake,
		body: RESTPostAPIGuildTemplatesJSONBody,
		options: RequestOptions = {},
	) {
		return this.rest.post(Routes.guildTemplates(guildId), {
			...options,
			body,
		}) as Promise<RESTPostAPIGuildTemplatesResult>;
	}

	/**
	 * Fetches webhooks for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#get-guild-webhooks}
	 * @param id - The id of the guild
	 * @param options - The options for fetching the webhooks
	 */
	public async getWebhooks(id: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildWebhooks(id), options) as Promise<RESTGetAPIGuildWebhooksResult>;
	}

	/**
	 * Fetches a guild onboarding
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-onboarding}
	 * @param guildId - The id of the guild
	 * @param options - The options for fetching the guild onboarding
	 */
	public async getOnboarding(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(Routes.guildOnboarding(guildId), options) as Promise<RESTGetAPIGuildOnboardingResult>;
	}

	/**
	 * Edits a guild onboarding
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-onboarding}
	 * @param guildId - The id of the guild
	 * @param body - The data for editing the guild onboarding
	 * @param options - The options for editing the guild onboarding
	 */
	public async editOnboarding(
		guildId: Snowflake,
		body: RESTPutAPIGuildOnboardingJSONBody,
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.put(Routes.guildOnboarding(guildId), {
			...options,
			body,
		}) as Promise<RESTPutAPIGuildOnboardingResult>;
	}

	/**
	 * Fetches all the soundboard sounds for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#list-guild-soundboard-sounds}
	 * @param guildId - The id of the guild to fetch the soundboard sounds for
	 * @param options - The options for fetching the soundboard sounds
	 */
	public async getSoundboardSounds(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(
			Routes.guildSoundboardSounds(guildId),
			options,
		) as Promise<RESTGetAPIGuildSoundboardSoundsResult>;
	}

	/**
	 * Fetches a soundboard sound for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#get-guild-soundboard-sound}
	 * @param guildId - The id of the guild to fetch the soundboard sound for
	 * @param soundId - The id of the soundboard sound to fetch
	 * @param options - The options for fetching the soundboard sound
	 */
	public async getSoundboardSound(guildId: Snowflake, soundId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(
			Routes.guildSoundboardSound(guildId, soundId),
			options,
		) as Promise<RESTGetAPIGuildSoundboardSoundResult>;
	}

	/**
	 * Creates a new soundboard sound for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#create-guild-soundboard-sound}
	 * @param guildId - The id of the guild to create the soundboard sound for
	 * @param body - The data for creating the soundboard sound
	 * @param options - The options for creating the soundboard sound
	 */
	public async createSoundboardSound(
		guildId: Snowflake,
		body: RESTPostAPIGuildSoundboardSoundJSONBody,
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.post(Routes.guildSoundboardSounds(guildId), {
			...options,
			body,
		}) as Promise<RESTPostAPIGuildSoundboardSoundResult>;
	}

	/**
	 * Edits a soundboard sound for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#modify-guild-soundboard-sound}
	 * @param guildId - The id of the guild to edit the soundboard sound for
	 * @param soundId - The id of the soundboard sound to edit
	 * @param body - The data for editing the soundboard sound
	 * @param options - The options for editing the soundboard sound
	 */
	public async editSoundboardSound(
		guildId: Snowflake,
		soundId: Snowflake,
		body: RESTPatchAPIGuildSoundboardSoundJSONBody,
		options: RequestOptionsWithReason = {},
	) {
		return this.rest.patch(Routes.guildSoundboardSound(guildId, soundId), {
			...options,
			body,
		}) as Promise<RESTPatchAPIGuildSoundboardSoundResult>;
	}

	/**
	 * Deletes a soundboard sound for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#delete-guild-soundboard-sound}
	 * @param guildId - The id of the guild to delete the soundboard sound for
	 * @param soundId - The id of the soundboard sound to delete
	 * @param options - The options for deleting the soundboard sound
	 */
	public async deleteSoundboardSound(guildId: Snowflake, soundId: Snowflake, options: RequestOptionsWithReason = {}) {
		await this.rest.delete(Routes.guildSoundboardSound(guildId, soundId), options);
	}

	/**
	 * Modifies incident actions for a guild.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-incident-actions}
	 * @param guildId - The id of the guild
	 * @param body - The data for modifying guild incident actions
	 * @param options - The options for modifying guild incident actions
	 */
	public async editIncidentActions(
		guildId: Snowflake,
		body: RESTPutAPIGuildIncidentActionsJSONBody,
		options: RequestOptions = {},
	) {
		return this.rest.put(Routes.guildIncidentActions(guildId), {
			...options,
			body,
		}) as Promise<RESTPutAPIGuildIncidentActionsResult>;
	}

	/**
	 * Fetches role member counts for a guild.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-role-member-counts}
	 * @param guildId - The id of the guild to fetch role member counts for
	 * @param options - The options for fetching role member counts
	 */
	public async getRoleMemberCounts(guildId: Snowflake, options: RequestOptions = {}) {
		return this.rest.get(
			Routes.guildRoleMemberCounts(guildId),
			options,
		) as Promise<RESTGetAPIGuildRoleMemberCountsResult>;
	}
}
