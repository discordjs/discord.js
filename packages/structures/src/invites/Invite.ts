import { type APIInvite, type APIExtendedInvite, RouteBases } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { dateToDiscordISOTimestamp } from '../utils/optimization.js';
import { kData, kExpiresTimestamp, kCreatedTimestamp } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

export interface APIActualInvite extends APIInvite, Partial<Omit<APIExtendedInvite, keyof APIInvite>> {}

/**
 * Represents an invitation to a Discord channel
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class Invite<Omitted extends keyof APIActualInvite | '' = 'created_at' | 'expires_at'> extends Structure<
	APIActualInvite,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each Invite
	 *
	 * @remarks This template has defaults, if you want to remove additional data and keep the defaults,
	 * use `Object.defineProperties`. To override the defaults, set this value directly.
	 */
	public static override readonly DataTemplate: Partial<APIActualInvite> = {
		set created_at(_: string) {},
		set expires_at(_: string) {},
	};

	/**
	 * Optimized storage of {@link discord-api-types/v10#(APIActualInvite:interface).expires_at}
	 *
	 * @internal
	 */
	protected [kExpiresTimestamp]: number | null = null;

	/**
	 * Optimized storage of {@link discord-api-types/v10#(APIActualInvite:interface).created_at}
	 *
	 * @internal
	 */
	protected [kCreatedTimestamp]: number | null = null;

	/**
	 * @param data - The raw data received from the API for the invite
	 */
	public constructor(data: Partialize<APIActualInvite, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 *
	 * @internal
	 */
	protected override optimizeData(data: Partial<APIActualInvite>) {
		if (data.expires_at) {
			this[kExpiresTimestamp] = Date.parse(data.expires_at);
		}

		if (data.created_at) {
			this[kCreatedTimestamp] = Date.parse(data.created_at);
		}
	}

	/**
	 * The code for this invite
	 */
	public get code() {
		return this[kData].code;
	}

	/**
	 * The target type (for voice channel invites)
	 */
	public get targetType() {
		return this[kData].target_type;
	}

	/**
	 * The type of this invite
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * The approximate number of online members of the guild this invite is for
	 *
	 * @remarks Only available when the invite was fetched from `GET /invites/<code>` with counts
	 */
	public get approximatePresenceCount() {
		return this[kData].approximate_presence_count;
	}

	/**
	 * The approximate total number of members of the guild this invite is for
	 *
	 * @remarks Only available when the invite was fetched from `GET /invites/<code>` with counts
	 */
	public get approximateMemberCount() {
		return this[kData].approximate_member_count;
	}

	/**
	 * The timestamp this invite will expire at
	 */
	public get expiresTimestamp() {
		if (this[kExpiresTimestamp]) {
			return this[kExpiresTimestamp];
		}

		const createdTimestamp = this.createdTimestamp;
		const maxAge = this.maxAge;
		if (createdTimestamp && maxAge) {
			this[kExpiresTimestamp] = createdTimestamp + (maxAge as number) * 1_000;
		}

		return this[kExpiresTimestamp];
	}

	/**
	 * The time the invite will expire at
	 */
	public get expiresAt() {
		const expiresTimestamp = this.expiresTimestamp;
		return expiresTimestamp ? new Date(expiresTimestamp) : null;
	}

	/**
	 * The number of times this invite has been used
	 */
	public get uses() {
		return this[kData].uses;
	}

	/**
	 * The maximum number of times this invite can be used
	 */
	public get maxUses() {
		return this[kData].max_uses;
	}

	/**
	 * The maximum age of the invite, in seconds, 0 for non-expiring
	 */
	public get maxAge() {
		return this[kData].max_age;
	}

	/**
	 * Whether this invite only grants temporary membership
	 */
	public get temporary() {
		return this[kData].temporary;
	}

	/**
	 * The timestamp this invite was created at
	 */
	public get createdTimestamp() {
		return this[kCreatedTimestamp];
	}

	/**
	 * The time the invite was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}

	/**
	 * The URL to the invite
	 */
	public get url() {
		return this.code ? `${RouteBases.invite}/${this.code}` : null;
	}

	/**
	 * When concatenated with a string, this automatically concatenates the invite's URL instead of the object.
	 *
	 * @returns The URL to the invite or an empty string if it doesn't have a code
	 */
	public override toString() {
		return this.url ?? '';
	}

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();
		if (this[kExpiresTimestamp]) {
			clone.expires_at = dateToDiscordISOTimestamp(new Date(this[kExpiresTimestamp]));
		}

		if (this[kCreatedTimestamp]) {
			clone.created_at = dateToDiscordISOTimestamp(new Date(this[kCreatedTimestamp]));
		}

		return clone;
	}

	/**
	 * Returns the primitive value of the specified object.
	 */
	public override valueOf() {
		return this.code ?? super.valueOf();
	}
}
