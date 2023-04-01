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
	type RESTPatchAPICurrentUserJSONBody,
	type RESTPatchAPICurrentUserResult,
	type RESTPatchAPIGuildMemberJSONBody,
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
	 * @param options - The options to use when fetching the user
	 */
	public async get(userId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.user(userId), { signal }) as Promise<RESTGetAPIUserResult>;
	}

	/**
	 * Returns the user object of the requester's account
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user}
	 * @param options - The options to use when fetching the current user
	 */
	public async getCurrent({ signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.user('@me'), { signal }) as Promise<RESTGetAPICurrentUserResult>;
	}

	/**
	 * Returns a list of partial guild objects the current user is a member of
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user-guilds}
	 * @param query - The query options to use when fetching the current user's guilds
	 * @param options - The options to use when fetching the guilds
	 */
	public async getGuilds(query: RESTGetAPICurrentUserGuildsQuery = {}, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.userGuilds(), {
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
	public async leaveGuild(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		await this.rest.delete(Routes.userGuild(guildId), { signal });
	}

	/**
	 * Edits the current user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#modify-current-user}
	 * @param body - The new data for the current user
	 * @param options - The options for editing the user
	 */
	public async edit(body: RESTPatchAPICurrentUserJSONBody, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.patch(Routes.user('@me'), { body, signal }) as Promise<RESTPatchAPICurrentUserResult>;
	}

	/**
	 * Fetches the guild member for the current user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user-guild-member}
	 * @param guildId - The id of the guild
	 * @param options - The options for fetching the guild member
	 */
	public async getGuildMember(guildId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.userGuildMember(guildId), { signal }) as Promise<RESTGetCurrentUserGuildMemberResult>;
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
		body: RESTPatchAPIGuildMemberJSONBody = {},
		{ reason, signal }: Pick<RequestData, 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.guildMember(guildId, '@me'), {
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
	public async createDM(userId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.post(Routes.userChannels(), {
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
	public async getConnections({ signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.userConnections(), { signal }) as Promise<RESTGetAPICurrentUserConnectionsResult>;
	}

	/**
	 * Gets the current user's active application role connection
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#get-user-application-role-connection}
	 * @param applicationId - The id of the application
	 * @param options - The options for fetching the role connections
	 */
	public async getApplicationRoleConnection(applicationId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.userApplicationRoleConnection(applicationId), {
			signal,
		}) as Promise<RESTGetAPICurrentUserApplicationRoleConnectionResult>;
	}

	/**
	 * Updates the current user's application role connection
	 *
	 * @see {@link https://discord.com/developers/docs/resources/user#update-user-application-role-connection}
	 * @param applicationId - The id of the application
	 * @param body - The data to use when updating the application role connection
	 * @param options - The options to use when updating the application role connection
	 */
	public async updateApplicationRoleConnection(
		applicationId: Snowflake,
		body: RESTPutAPICurrentUserApplicationRoleConnectionJSONBody,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.put(Routes.userApplicationRoleConnection(applicationId), {
			body,
			signal,
		}) as Promise<RESTPutAPICurrentUserApplicationRoleConnectionResult>;
	}
}
