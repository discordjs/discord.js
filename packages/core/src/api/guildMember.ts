import type { REST } from '@discordjs/rest';
import { makeURLSearchParams } from '@discordjs/rest';
import type { APIGuildMember, RESTPatchAPIGuildMemberJSONBody } from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v10';

export class GuildMembersAPI {
	private readonly rest: REST;

	public constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Fetches a guild member
	 *
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 */
	public async get(guildId: string, userId: string) {
		return (await this.rest.get(Routes.guildMember(guildId, userId))) as APIGuildMember;
	}

	/**
	 * Searches for guild members
	 *
	 * @param guildId - The id of the guild to search in
	 * @param query - The query to search for
	 * @param limit - The maximum number of members to return
	 */
	public async search(guildId: string, query: string, limit: number = 1) {
		return (await this.rest.get(Routes.guildMembersSearch(guildId), {
			query: makeURLSearchParams({ query, limit }),
		})) as APIGuildMember[];
	}

	/**
	 * Edits a guild member
	 *
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 * @param options - The options to use when editing the guild member
	 * @param reason - The reason for editing this guild member
	 */
	public async edit(guildId: string, userId: string, options?: RESTPatchAPIGuildMemberJSONBody, reason?: string) {
		return (await this.rest.patch(Routes.guildMember(guildId, userId), {
			reason,
			body: options,
		})) as APIGuildMember;
	}

	/**
	 * Adds a role to a guild member
	 *
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 * @param roleId - The id of the role
	 * @param reason - The reason for adding this role to the guild member
	 */
	public async addRole(guildId: string, userId: string, roleId: string, reason?: string) {
		await this.rest.put(Routes.guildMemberRole(guildId, userId, roleId), { reason });
	}

	/**
	 * Removes a role from a guild member
	 *
	 * @param guildId - The id of the guild
	 * @param userId - The id of the user
	 * @param roleId - The id of the role
	 * @param reason - The reason for removing this role from the guild member
	 */
	public async removeRole(guildId: string, userId: string, roleId: string, reason?: string) {
		await this.rest.delete(Routes.guildMemberRole(guildId, userId, roleId), { reason });
	}
}
