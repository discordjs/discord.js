import type { APIGuildMember, GuildMemberFlags } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import { GuildMemberFlagsBitField } from '../bitfields';
import { dateToDiscordISOTimestamp } from '../utils/optimization';
import { kCommunicationDisabledUntil, kData, kJoinedAt, kPremiumSince } from '../utils/symbols';
import type { Partialize } from '../utils/types';

/**
 * Represents a guild member on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks Intentionally does not export `roles`
 *  so extending classes can map each array to `Role[]`.
 * @remarks has substructures `User` and `AvatarDecorationData`, which needs to be instantiated and stored by any extending classes using it.
 */
export class GuildMember<
	Omitted extends keyof APIGuildMember | '' = 'communication_disabled_until' | 'joined_at' | 'premium_since',
> extends Structure<APIGuildMember, Omitted> {
	/**
	 * @param data - The raw data from the API for the guild member.
	 */

	/**
	 * The template used for removing data from the raw data stored for each GuildMember
	 *
	 * @remarks This template has defaults, if you want to remove additional data and keep the defaults,
	 * use `Object.defineProperties`. To override the defaults, set this value directly.
	 */
	public static override readonly DataTemplate: Partial<APIGuildMember> = {
		set communication_disabled_until(_: string) {},
		set joined_at(_: string) {},
		set premium_since(_: string) {},
	};

	protected [kCommunicationDisabledUntil]: number | null = null;

	protected [kJoinedAt]: number | null = null;

	protected [kPremiumSince]: number | null = null;

	/**
	 * @param data - The raw data from the API for the guild member.
	 */
	public constructor(data: Partialize<APIGuildMember, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * The user's guild nickname.
	 */
	public get nick() {
		return this[kData].nick;
	}

	/**
	 * The member's guild avatar hash.
	 */
	public get avatar() {
		return this[kData].avatar;
	}

	/**
	 * The member's guild banner hash.
	 */
	public get banner() {
		return this[kData].banner;
	}

	/**
	 * Whether the user is deafened in voice channels.
	 */
	public get deaf() {
		return this[kData].deaf;
	}

	/**
	 * Whether the user is muted in voice channels.
	 */
	public get mute() {
		return this[kData].mute;
	}

	/**
	 * Guild member flags represented as a bit set.
	 *
	 * @defaultValue `0`
	 */
	public get flags() {
		const flags = this[kData].flags;
		return new GuildMemberFlagsBitField(flags as GuildMemberFlags);
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 */
	protected override optimizeData(data: Partial<APIGuildMember>): void {
		if (data.communication_disabled_until) {
			this[kCommunicationDisabledUntil] = Date.parse(data.communication_disabled_until);
		}

		if (data.joined_at) {
			this[kJoinedAt] = Date.parse(data.joined_at);
		}

		if (data.premium_since) {
			this[kPremiumSince] = Date.parse(data.premium_since);
		}
	}

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();

		const communicationDisabledUntil = this[kCommunicationDisabledUntil];
		const joinedAt = this[kJoinedAt];
		const premiumSince = this[kPremiumSince];

		if (communicationDisabledUntil) {
			clone.communication_disabled_until = dateToDiscordISOTimestamp(new Date(communicationDisabledUntil));
		}

		if (joinedAt) {
			clone.joined_at = dateToDiscordISOTimestamp(new Date(joinedAt));
		}

		if (premiumSince) {
			clone.premium_since = dateToDiscordISOTimestamp(new Date(premiumSince));
		}

		return clone;
	}
}
