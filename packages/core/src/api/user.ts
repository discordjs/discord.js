import { makeURLSearchParams, type REST } from '@discordjs/rest';
import {
	Routes,
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
	type Snowflake,
} from 'discord-api-types/v10';

export class UsersAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches a user by their id
	 *
	 * @param userId - The id of the user to fetch
	 */
	public async get(userId: Snowflake) {
		return this.rest.get(Routes.user(userId)) as Promise<RESTGetAPIUserResult>;
	}

	/**
	 * Returns the user object of the requester's account
	 */
	public async getCurrent() {
		return this.rest.get(Routes.user('@me')) as Promise<RESTGetAPICurrentUserResult>;
	}

	/**
	 * Returns a list of partial guild objects the current user is a member of
	 *
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
	 * @param guildId - The id of the guild
	 */
	public async leaveGuild(guildId: Snowflake) {
		await this.rest.delete(Routes.userGuild(guildId));
	}

	/**
	 * Edits the current user
	 *
	 * @param user - The new data for the current user
	 */
	public async edit(user: RESTPatchAPICurrentUserJSONBody) {
		return this.rest.patch(Routes.user('@me'), { body: user }) as Promise<RESTPatchAPICurrentUserResult>;
	}

	/**
	 * Fetches the guild member for the current user
	 *
	 * @param guildId - The id of the guild
	 */
	public async getGuildMember(guildId: Snowflake) {
		return this.rest.get(Routes.userGuildMember(guildId)) as Promise<RESTGetCurrentUserGuildMemberResult>;
	}

	/**
	 * Edits the guild member for the current user
	 *
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
	 * @param userId - The id of the user to open a DM channel with
	 */
	public async createDM(userId: Snowflake) {
		return this.rest.post(Routes.userChannels(), {
			body: { recipient_id: userId },
		}) as Promise<RESTPostAPICurrentUserCreateDMChannelResult>;
	}
}
