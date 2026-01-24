import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APITeam } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import { isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any team on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructure `TeamMember` which needs to be instantiated and stored by an extending class using it
 * @remarks intentionally does not export `ownerUserId` so that extending classes can resolve `Snowflake` to `User`
 */
export class Team<Omitted extends keyof APITeam | '' = ''> extends Structure<APITeam, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each team.
	 */
	public static override readonly DataTemplate: Partial<APITeam> = {};

	/**
	 * @param data - The raw data received from the API for the team.
	 */
	public constructor(data: Partialize<APITeam, Omitted>) {
		super(data);
	}

	/**
	 * Hash of the image of the team's icon
	 */
	public get icon() {
		return this[kData].icon;
	}

	/**
	 * The unique id of the team
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * Name of the team
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The timestamp the team was created at
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the team was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}
