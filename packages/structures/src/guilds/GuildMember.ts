import type { APIGuildMember } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { dateToDiscordISOTimestamp } from '../utils/optimization.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

type GuildMemberOmittedKeys = 'communication_disabled_until' | 'joined_at' | 'premium_since';

/**
 * Represents a member of a guild.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructures `User` and `AvatarDecorationData`, which need to be instantiated and stored by an extending class using it
 */
export abstract class GuildMember<Omitted extends keyof APIGuildMember | '' = ''> extends Structure<
	APIGuildMember,
	GuildMemberOmittedKeys | Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each GuildMember
	 */
	public static override readonly DataTemplate: Partial<APIGuildMember> = {
		// Timestamps are optimized to numbers
		set joined_at(_: string | null) {},
		set premium_since(_: string | null) {},
		set communication_disabled_until(_: string | null) {},
	};

	/**
	 * @param data - The raw data received from the API for the guild member
	 */
	public constructor(data: Partialize<APIGuildMember, GuildMemberOmittedKeys | Omitted>) {
		super(data as Readonly<Partial<APIGuildMember>>);
		this.optimizeData(data as Partial<APIGuildMember>);
	}

	/**
	 * The user id of this member
	 */
	public get userId() {
		return (this[kData] as { user?: { id: string } }).user?.id;
	}

	/**
	 * The guild nickname of this member
	 */
	public get nick() {
		return this[kData].nick;
	}

	/**
	 * The member's guild avatar hash
	 */
	public get avatar() {
		return this[kData].avatar;
	}

	/**
	 * Array of role ids
	 */
	public get roles() {
		return this[kData].roles;
	}

	/**
	 * Timestamp the member joined the guild
	 */
	public get joinedTimestamp(): number | null {
		return (this[kData] as unknown as { joined_at_timestamp?: number }).joined_at_timestamp ?? null;
	}

	/**
	 * When the member joined the guild
	 */
	public get joinedAt() {
		const joinedTimestamp = this.joinedTimestamp;
		return joinedTimestamp ? new Date(joinedTimestamp) : null;
	}

	/**
	 * Timestamp of when the member started boosting the guild
	 */
	public get premiumSinceTimestamp(): number | null {
		return (this[kData] as unknown as { premium_since_timestamp?: number }).premium_since_timestamp ?? null;
	}

	/**
	 * When the member started boosting the guild
	 */
	public get premiumSince() {
		const premiumSinceTimestamp = this.premiumSinceTimestamp;
		return premiumSinceTimestamp ? new Date(premiumSinceTimestamp) : null;
	}

	/**
	 * Whether the member is deafened in voice channels
	 */
	public get deaf() {
		return this[kData].deaf;
	}

	/**
	 * Whether the member is muted in voice channels
	 */
	public get mute() {
		return this[kData].mute;
	}

	/**
	 * Guild member flags
	 */
	public get flags() {
		return this[kData].flags;
	}

	/**
	 * Whether the member has not yet passed the guild's Membership Screening requirements
	 */
	public get pending() {
		return this[kData].pending;
	}

	/**
	 * Total permissions of the member in the channel, including overwrites
	 */
	public get permissions() {
		return (this[kData] as { permissions?: string }).permissions;
	}

	/**
	 * Timestamp of when the time out will be removed
	 */
	public get communicationDisabledUntilTimestamp(): number | null {
		return (
			(this[kData] as unknown as { communication_disabled_until_timestamp?: number })
				.communication_disabled_until_timestamp ?? null
		);
	}

	/**
	 * When the timeout will be removed
	 */
	public get communicationDisabledUntil() {
		const timestamp = this.communicationDisabledUntilTimestamp;
		return timestamp ? new Date(timestamp) : null;
	}

	/**
	 * Whether this member is currently timed out
	 */
	public get isCommunicationDisabled() {
		const timestamp = this.communicationDisabledUntilTimestamp;
		return timestamp !== null && timestamp > Date.now();
	}

	protected override optimizeData(data: Partial<APIGuildMember>) {
		if (data.joined_at !== undefined && data.joined_at !== null) {
			(this[kData] as unknown as { joined_at_timestamp: number }).joined_at_timestamp = new Date(
				data.joined_at,
			).getTime();
		}

		if (data.premium_since !== undefined && data.premium_since !== null) {
			(this[kData] as unknown as { premium_since_timestamp: number }).premium_since_timestamp = new Date(
				data.premium_since,
			).getTime();
		}

		if (data.communication_disabled_until !== undefined && data.communication_disabled_until !== null) {
			(
				this[kData] as unknown as { communication_disabled_until_timestamp: number }
			).communication_disabled_until_timestamp = new Date(data.communication_disabled_until).getTime();
		}
	}

	public override toJSON(): APIGuildMember {
		const data = { ...this[kData] } as APIGuildMember;

		const joinedTimestamp = this.joinedTimestamp;
		if (joinedTimestamp !== null) {
			data.joined_at = dateToDiscordISOTimestamp(new Date(joinedTimestamp));
		}

		const premiumSinceTimestamp = this.premiumSinceTimestamp;
		if (premiumSinceTimestamp !== null) {
			data.premium_since = dateToDiscordISOTimestamp(new Date(premiumSinceTimestamp));
		}

		const communicationDisabledUntilTimestamp = this.communicationDisabledUntilTimestamp;
		if (communicationDisabledUntilTimestamp !== null) {
			data.communication_disabled_until = dateToDiscordISOTimestamp(new Date(communicationDisabledUntilTimestamp));
		}

		return data;
	}
}
