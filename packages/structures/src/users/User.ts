import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIUser } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';

/**
 * Represents any user on Discord.
 *
 * @typeParam Omitted - Specify the propeties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class User<Omitted extends keyof APIUser | '' = ''> extends Structure<APIUser, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each User
	 */
	public static DataTemplate: Partial<APIUser> = {};

	public constructor(
		/**
		 * The raw data received from the API for the user
		 */
		data: Omit<APIUser, Omitted>,
	) {
		super(data, { template: User.DataTemplate });
	}

	/**
	 * {@inheritDoc Structure._patch}
	 */
	public override _patch(data: Partial<APIUser>) {
		return super._patch(data, { template: User.DataTemplate });
	}

	/**
	 * The user's id
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The username of the user
	 */
	public get username() {
		return this[kData].username;
	}

	/**
	 * The user's 4 digit tag, if a bot or not migrated to unique usernames
	 */
	public get discriminator() {
		return this[kData].discriminator;
	}

	/**
	 * The user's display name, the application name for bots
	 */
	public get globalName() {
		return this[kData].global_name;
	}

	/**
	 * The name displayed in the client for this user when no nickname is set
	 */
	public get displayName() {
		return this.globalName ?? this.username;
	}

	/**
	 * The user avatar's hash
	 */
	public get avatar() {
		return this[kData].avatar;
	}

	/**
	 * Whether the user is a bot
	 */
	public get bot() {
		return this[kData].bot ?? false;
	}

	/**
	 * Whether the user is an Official Discord System user
	 */
	public get system() {
		return this[kData].system ?? false;
	}

	/**
	 * Whether the user has mfa enabled
	 *
	 * @remarks This property is only set when the user was fetched with an OAuth2 token and the `identify` scope
	 */
	public get mfaEnabled() {
		return this[kData].mfa_enabled;
	}

	/**
	 * The user's banner hash
	 *
	 * @remarks This property is only set when the user was manually fetched
	 */
	public get banner() {
		return this[kData].banner;
	}

	/**
	 * The base 10 accent color of the user's banner
	 *
	 * @remarks This property is only set when the user was manually fetched
	 */
	public get accentColor() {
		return this[kData].accent_color;
	}

	/**
	 * The user's primary discord language
	 *
	 * @remarks This property is only set when the user was fetched with an Oauth2 token and the `identify` scope
	 */
	public get locale() {
		return this[kData].locale;
	}

	/**
	 * Whether the email on the user's account has been verified
	 *
	 * @remarks This property is only set when the user was fetched with an OAuth2 token and the `email` scope
	 */
	public get verified() {
		return this[kData].verified;
	}

	/**
	 * The user's email
	 *
	 * @remarks This property is only set when the user was fetched with an OAuth2 token and the `email` scope
	 */
	public get email() {
		return this[kData].email;
	}

	/**
	 * The type of nitro subscription on the user's account
	 *
	 * @remarks This property is only set when the user was fetched with an OAuth2 token and the `identify` scope
	 */
	public get premiumType() {
		return this[kData].premium_type;
	}

	/**
	 * The user's avatar decoration hash
	 */
	public get avatarDecoration() {
		return this[kData].avatar_decoration;
	}

	/**
	 * The timestamp the user was created at
	 */
	public get createdTimestamp() {
		return typeof this.id === 'string' ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the user was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}

	/**
	 * The hexadecimal version of the user accent color, with a leading hash
	 *
	 * @remarks This property is only set when the user was manually fetched
	 */
	public get hexAccentColor() {
		if (typeof this.accentColor !== 'number') return this.accentColor;
		return `#${this.accentColor.toString(16).padStart(6, '0')}`;
	}
}
