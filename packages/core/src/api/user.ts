/* eslint-disable jsdoc/check-param-names */

import { makeURLSearchParams, type RequestData, type REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPICurrentUserApplicationRoleConnectionResult,
	type RESTGetAPICurrentUserConnectionsResult,
	type RESTGetAPICurrentUserGuildsQuery,
	type RESTGetAPICurrentUserGuildsResult,
	type RESTGetAPICurrentUserResult,
	type RESTGetAPIUserResult,
	type RESTGetCurrentUserGuildMemberResult,
	type RESTPatchAPICurrentGuildMemberJSONBody,
	type RESTPatchAPICurrentUserJSONBody,
	type RESTPatchAPICurrentUserResult,
	type RESTPatchAPIGuildMemberResult,
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
	 * @param options - The options for fetching the user
	 */
	public async get(userId: Snowflake, { auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		return this.rest.get(Routes.user(userId), { auth, signal }) as Promise<RESTGetAPIUserResult>;
	}

	/**
	 * Returns the user object of the requester's account
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user}
	 * @param options - The options for fetching the current user
	 */
	public async getCurrent({ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		return this.rest.get(Routes.user('@me'), { auth, signal }) as Promise<RESTGetAPICurrentUserResult>;
	}

	/**
	 * Returns a list of partial guild objects the current user is a member of
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user-guilds}
	 * @param query - The query options for fetching the current user's guilds
	 * @param options - The options for fetching the guilds
	 */
	public async getGuilds(
		query: RESTGetAPICurrentUserGuildsQuery = {},
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.userGuilds(), {
			auth,
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPICurrentUserGuildsResult>;
	}

	/**
	 * Leaves the guild with the given id
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#leave-guild}
	 * @param guildId - The id of the guild
	 * @param options - The options for leaving the guild
	 */
	public async leaveGuild(guildId: Snowflake, { auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		await this.rest.delete(Routes.userGuild(guildId), { auth, signal });
	}

	/**
	 * Edits the current user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#modify-current-user}
	 * @param body - The new data for the current user
	 * @param options - The options for editing the user
	 */
	public async edit(
		body: RESTPatchAPICurrentUserJSONBody,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.user('@me'), { auth, body, signal }) as Promise<RESTPatchAPICurrentUserResult>;
	}

	/**
	 * Fetches the guild member for the current user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user-guild-member}
	 * @param guildId - The id of the guild
	 * @param options - The options for fetching the guild member
	 */
	public async getGuildMember(guildId: Snowflake, { auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		return this.rest.get(Routes.userGuildMember(guildId), {
			auth,
			signal,
		}) as Promise<RESTGetCurrentUserGuildMemberResult>;
	}

	/**
	 * Edits the guild member for the current user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-current-member}
	 * @param guildId - The id of the guild
	 * @param body - The new data for the guild member
	 * @param options - The options for editing the guild member
	 */
	public async editCurrentGuildMember(
		guildId: Snowflake,
		body: RESTPatchAPICurrentGuildMemberJSONBody = {},
		{ auth, reason, signal }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.guildMember(guildId, '@me'), {
			auth,
			reason,
			body,
			signal,
		}) as Promise<RESTPatchAPIGuildMemberResult>;
	}

	/**
	 * Opens a new DM channel with a user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#create-dm}
	 * @param userId - The id of the user to open a DM channel with
	 * @param options - The options for opening the DM
	 */
	public async createDM(userId: Snowflake, { auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		return this.rest.post(Routes.userChannels(), {
			auth,
			body: { recipient_id: userId },
			signal,
		}) as Promise<RESTPostAPICurrentUserCreateDMChannelResult>;
	}

	/**
	 * Gets the current user's connections
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-user-connections}
	 * @param options - The options for fetching the user's connections
	 */
	public async getConnections({ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		return this.rest.get(Routes.userConnections(), { auth, signal }) as Promise<RESTGetAPICurrentUserConnectionsResult>;
	}

	/**
	 * Gets the current user's active application role connection
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-user-application-role-connection}
	 * @param applicationId - The id of the application
	 * @param options - The options for fetching the role connections
	 */
	public async getApplicationRoleConnection(
		applicationId: Snowflake,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.userApplicationRoleConnection(applicationId), {
			auth,
			signal,
		}) as Promise<RESTGetAPICurrentUserApplicationRoleConnectionResult>;
	}

	/**
	 * Updates the current user's application role connection
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#update-user-application-role-connection}
	 * @param applicationId - The id of the application
	 * @param body - The data for updating the application role connection
	 * @param options - The options for updating the application role connection
	 */
	public async updateApplicationRoleConnection(
		applicationId: Snowflake,
		body: RESTPutAPICurrentUserApplicationRoleConnectionJSONBody,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.put(Routes.userApplicationRoleConnection(applicationId), {
			auth,
			body,
			signal,
		}) as Promise<RESTPutAPICurrentUserApplicationRoleConnectionResult>;
	}
}
