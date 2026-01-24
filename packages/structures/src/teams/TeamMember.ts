import type { APITeamMember } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any team member on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructure `User` which needs to be instantiated and stored by an extending class using it
 */
export class TeamMember<Omitted extends keyof APITeamMember | '' = ''> extends Structure<APITeamMember, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each team member
	 */
	public static override readonly DataTemplate: Partial<APITeamMember> = {};

	/**
	 * @param data - The raw data received from the API for the team member
	 */
	public constructor(data: Partialize<APITeamMember, Omitted>) {
		super(data);
	}

	/**
	 * User's membership state on the team
	 *
	 * @see {@link https://discord.com/developers/docs/topics/teams#data-models-membership-state-enum}
	 */
	public get membershipState() {
		return this[kData].membership_state;
	}

	/**
	 * Id of the parent team of which they are a member
	 */
	public get teamId() {
		return this[kData].team_id;
	}

	/**
	 * Role of the team member
	 *
	 * @see {@link https://discord.com/developers/docs/topics/teams#team-member-roles-team-member-role-types}
	 */
	public get role() {
		return this[kData].role;
	}
}
