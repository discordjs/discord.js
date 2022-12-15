import { makeURLSearchParams, type REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPICurrentUserApplicationRoleConnectionResult,
	type RESTGetAPICurrentUserConnectionsResult,
	type RESTGetAPICurrentUserGuildsQuery,
	type RESTGetAPICurrentUserGuildsResult,
	type RESTGetAPICurrentUserResult,
	type RESTGetAPIUserResult,
	type RESTGetCurrentUserGuildMemberResult,
	type RESTPatchAPICurrentUserJSONBody,
	type RESTPatchAPICurrentUserResult,
	type RESTPatchAPIGuildMemberJSONBody,
	type RESTPatchAPIGuildMemberResult,
	type RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
	type RESTPatchAPIGuildVoiceStateCurrentMemberResult,
	type RESTPostAPICurrentUserCreateDMChannelResult,
	type RESTPutAPICurrentUserApplicationRoleConnectionJSONBody,
	type RESTPutAPICurrentUserApplicationRoleConnectionResult,
	type Snowflake,
} from 'discord-api-types/v10';

export class UsersAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches a user by their id
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-user}
	 * @param userId - The id of the user to fetch
	 */
	public async get(userId: Snowflake) {
		return this.rest.get(Routes.user(userId)) as Promise<RESTGetAPIUserResult>;
	}

	/**
	 * Returns the user object of the requester's account
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user}
	 */
	public async getCurrent() {
		return this.rest.get(Routes.user('@me')) as Promise<RESTGetAPICurrentUserResult>;
	}

	/**
	 * Returns a list of partial guild objects the current user is a member of
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user-guilds}
	 * @param options - The options to use when fetching the current user's guilds
	 */
	public async getGuilds(options: RESTGetAPICurrentUserGuildsQuery = {}) {
		return this.rest.get(Routes.userGuilds(), {
			query: makeURLSearchParams(options),
		}) as Promise<RESTGetAPICurrentUserGuildsResult>;
	}

	/**
	 * Leaves the guild with the given id
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#leave-guild}
	 * @param guildId - The id of the guild
	 */
	public async leaveGuild(guildId: Snowflake) {
		await this.rest.delete(Routes.userGuild(guildId));
	}

	/**
	 * Edits the current user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#modify-current-user}
	 * @param user - The new data for the current user
	 */
	public async edit(user: RESTPatchAPICurrentUserJSONBody) {
		return this.rest.patch(Routes.user('@me'), { body: user }) as Promise<RESTPatchAPICurrentUserResult>;
	}

	/**
	 * Fetches the guild member for the current user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user-guild-member}
	 * @param guildId - The id of the guild
	 */
	public async getGuildMember(guildId: Snowflake) {
		return this.rest.get(Routes.userGuildMember(guildId)) as Promise<RESTGetCurrentUserGuildMemberResult>;
	}

	/**
	 * Edits the guild member for the current user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-current-member}
	 * @param guildId - The id of the guild
	 * @param member - The new data for the guild member
	 * @param reason - The reason for editing this guild member
	 */
	public async editGuildMember(guildId: Snowflake, member: RESTPatchAPIGuildMemberJSONBody = {}, reason?: string) {
		return this.rest.patch(Routes.guildMember(guildId, '@me'), {
			reason,
			body: member,
		}) as Promise<RESTPatchAPIGuildMemberResult>;
	}

	/**
	 * Sets the voice state for the current user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state}
	 * @param guildId - The id of the guild
	 * @param options - The options to use when setting the voice state
	 */
	public async setVoiceState(guildId: Snowflake, options: RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody = {}) {
		return this.rest.patch(Routes.guildVoiceState(guildId, '@me'), {
			body: options,
		}) as Promise<RESTPatchAPIGuildVoiceStateCurrentMemberResult>;
	}

	/**
	 * Opens a new DM channel with a user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#create-dm}
	 * @param userId - The id of the user to open a DM channel with
	 */
	public async createDM(userId: Snowflake) {
		return this.rest.post(Routes.userChannels(), {
			body: { recipient_id: userId },
		}) as Promise<RESTPostAPICurrentUserCreateDMChannelResult>;
	}

	/**
	 * Gets the current user's connections
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-user-connections}
	 */
	public async getConnections() {
		return this.rest.get(Routes.userConnections()) as Promise<RESTGetAPICurrentUserConnectionsResult>;
	}

	/**
	 * Gets the current user's active application role connection
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-user-application-role-connection}
	 * @param applicationId - The id of the application
	 */
	public async getApplicationRoleConnection(applicationId: Snowflake) {
		return this.rest.get(
			Routes.userApplicationRoleConnection(applicationId),
		) as Promise<RESTGetAPICurrentUserApplicationRoleConnectionResult>;
	}

	/**
	 * Updates the current user's application role connection
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#update-user-application-role-connection}
	 * @param applicationId - The id of the application
	 * @param options - The options to use when updating the application role connection
	 */
	public async updateApplicationRoleConnection(
		applicationId: Snowflake,
		options: RESTPutAPICurrentUserApplicationRoleConnectionJSONBody,
	) {
		return this.rest.put(Routes.userApplicationRoleConnection(applicationId), {
			body: options,
		}) as Promise<RESTPutAPICurrentUserApplicationRoleConnectionResult>;
	}
}
