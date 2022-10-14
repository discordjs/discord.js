import { makeURLSearchParams, type REST } from '@discordjs/rest';
import {
	Routes,
	type APIGuildMember,
	type APIDMChannel,
	type APIPartialGuild,
	type APIUser,
	type RESTGetAPICurrentUserGuildsQuery,
	type RESTPatchAPICurrentUserJSONBody,
	type RESTPatchAPIGuildMemberJSONBody,
	type RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
} from 'discord-api-types/v10';

export class BotsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Returns the user object of the requester's account
	 */
	public async getUser() {
		return (await this.rest.get(Routes.user('@me'))) as APIUser;
	}

	/**
	 * Returns a list of partial guild objects the current user is a member of
	 *
	 * @param options - The options to use when fetching the current user's guilds
	 */
	public async getGuilds(options: RESTGetAPICurrentUserGuildsQuery = {}) {
		return (await this.rest.get(Routes.userGuilds(), {
			query: makeURLSearchParams(options as Record<string, unknown>),
		})) as APIPartialGuild[];
	}

	/**
	 * Leaves the guild with the given id
	 *
	 * @param guildId - The id of the guild
	 */
	public async leaveGuild(guildId: string) {
		await this.rest.delete(Routes.userGuild(guildId));
	}

	/**
	 * Edits the current user
	 *
	 * @param user - The new data for the current user
	 */
	public async edit(user: RESTPatchAPICurrentUserJSONBody) {
		return (await this.rest.patch(Routes.user('@me'), { body: user })) as APIUser;
	}

	/**
	 * Fetches the guild member for the current user
	 *
	 * @param guildId - The id of the guild
	 */
	public async getMember(guildId: string) {
		return (await this.rest.get(Routes.userGuildMember(guildId))) as APIGuildMember;
	}

	/**
	 * Edits the guild member for the current user
	 *
	 * @param guildId - The id of the guild
	 * @param member - The new data for the guild member
	 * @param reason - The reason for editing this guild member
	 */
	public async editMember(guildId: string, member: RESTPatchAPIGuildMemberJSONBody = {}, reason?: string) {
		return (await this.rest.patch(Routes.guildMember(guildId, '@me'), {
			reason,
			body: member,
		})) as APIGuildMember;
	}

	/**
	 * Sets the voice state for the current user
	 *
	 * @param guildId - The id of the guild
	 * @param options - The options to use when setting the voice state
	 */
	public async setVoiceState(guildId: string, options: RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody = {}) {
		return (await this.rest.patch(Routes.guildVoiceState(guildId, '@me'), {
			body: options,
		})) as APIGuildMember;
	}

	/**
	 * Opens a new DM channel with a user
	 *
	 * @param userId - The id of the user to open a DM channel with
	 */
	public async createDM(userId: string) {
		return (await this.rest.post(Routes.userChannels(), {
			body: {
				recipient_id: userId,
			},
		})) as APIDMChannel;
	}
}
