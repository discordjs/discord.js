import { type APIInvite, type APIExtendedInvite, RouteBases } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData, kExpiresTimestamp, kCreatedTimestamp } from '../utils/symbols.js';

export class Invite<
	Omitted extends keyof APIExtendedInvite | '' = 'created_at' | 'expires_at',
	Extended extends boolean = false,
> extends Structure<
	APIExtendedInvite,
	Omitted | (Extended extends true ? '' : Exclude<keyof APIExtendedInvite, keyof APIInvite>)
> {
	/**
	 * A regular expression that matches Discord invite links.
	 * The `code` group property is present on the `exec()` result of this expression.
	 */
	public static InvitesPattern = /discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/(?<code>[\w-]{2,255})/i;

	/**
	 * The template used for removing data from the raw data stored for each Invite
	 * <info>This template has defaults, if you want to remove additional data and keep the defaults,
	 * use `Object.defineProperties`. To override the defaults, set this value directly.</info>
	 */
	public static DataTemplate: Partial<APIExtendedInvite> = {
		set created_at(_: string) {},
		set expires_at(_: string) {},
	};

	protected [kExpiresTimestamp]: number | null = null;

	protected [kCreatedTimestamp]: number | null = null;

	public constructor(
		/**
		 * The raw data received from the API for the invite
		 */
		data: Omit<APIExtendedInvite, Omitted>,
	) {
		super(data, { template: Invite.DataTemplate });
	}

	public override _patch(data: Partial<APIExtendedInvite>) {
		super._patch(data, { template: Invite.DataTemplate });
		return this;
	}

	protected override _optimizeData(data: Partial<APIExtendedInvite>) {
		this[kExpiresTimestamp] = data.expires_at ? Date.parse(data.expires_at) : this[kExpiresTimestamp] ?? null;
		this[kCreatedTimestamp] = data.created_at ? Date.parse(data.created_at) : this[kCreatedTimestamp] ?? null;
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
	 * The approximate number of online members of the guild this invite is for
	 * <info>Only available when the invite was fetched from `GET /invites/<code>` with counts</info>
	 */
	public get presenceCount() {
		return this[kData].approximate_presence_count;
	}

	/**
	 * The approximate total number of members of the guild this invite is for
	 * <info>Only available when the invite was fetched from `GET /invites/<code>` with counts</info>
	 */
	public get memberCount() {
		return this[kData].approximate_member_count;
	}

	/**
	 * The timestamp this invite will expire at
	 */
	public get expiresTimestamp() {
		return (
			this[kExpiresTimestamp] ??
			(this[kCreatedTimestamp] && this.maxAge ? this[kCreatedTimestamp] + (this.maxAge as number) * 1_000 : null)
		);
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
		return this[kCreatedTimestamp] && new Date(this[kCreatedTimestamp]);
	}

	/**
	 * The URL to the invite
	 */
	public get url() {
		return `${RouteBases.invite}/${this.code}`;
	}

	/**
	 * When concatenated with a string, this automatically concatenates the invite's URL instead of the object.
	 *
	 * @returns the url
	 */
	public override toString() {
		return this.url;
	}

	public override toJSON() {
		const clone = super.toJSON();
		if (this[kExpiresTimestamp]) {
			clone.expires_at = new Date(this[kExpiresTimestamp]).toISOString();
		}

		if (this[kCreatedTimestamp]) {
			clone.created_at = new Date(this[kCreatedTimestamp]).toISOString();
		}

		return clone;
	}

	public override valueOf() {
		return this.code ?? super.valueOf();
	}
}

const test = new Invite({} as APIExtendedInvite);
if (test.code) {
}
