import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIUser } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { data as kData } from '../utils/symbols.js';

/**
 * Represents any user on Discord.
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
	 * <info>This property is only set when the user was fetched with an OAuth2 token and the `identify` scope</info>
	 */
	public get mfaEnabled() {
		return this[kData].mfa_enabled;
	}

	/**
	 * The user's banner hash
	 * <info>This property is only set when the user was manually fetched</info>
	 */
	public get banner() {
		return this[kData].banner;
	}

	/**
	 * The base 10 accent color of the user's banner
	 * <info>This property is only set when the user was manually fetched</info>
	 */
	public get accentColor() {
		return this[kData].accent_color;
	}

	/**
	 * The user's primary discord language
	 * <info>This property is only set when the user was fetched with an Oauth2 token and the `identify` scope</info>
	 */
	public get locale() {
		return this[kData].locale;
	}

	/**
	 * Whether the email on the user's account has been verified
	 * <info>This property is only set when the user was fetched with an OAuth2 token and the `email` scope</info>
	 */
	public get verified() {
		return this[kData].verified;
	}

	/**
	 * The user's email
	 * <info>This property is only set when the user was fetched with an OAuth2 token and the `email` scope</info>
	 */
	public get email() {
		return this[kData].email;
	}

	/**
	 * The flags on the user's account
	 * <info> This property is only set when the user was fetched with an OAuth2 token and the `identity` scope</info>
	 */
	public get flags() {
		return this[kData].flags;
	}

	/**
	 * The type of nitro subscription on the user's account
	 * <info>This property is only set when the user was fetched with an OAuth2 token and the `identify` scope</info>
	 */
	public get premiumType() {
		return this[kData].premium_type;
	}

	/**
	 * The public flags for the user
	 */
	public get publicFlags() {
		return this[kData].public_flags;
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
		return this.createdTimestamp ? new Date(this.createdTimestamp) : null;
	}

	/**
	 * The hexadecimal version of the user accent color, with a leading hash
	 * <info>This property is only set when the user was manually fetched</info>
	 */
	public get hexAccentColor() {
		if (typeof this.accentColor !== 'number') return this.accentColor;
		return `#${this.accentColor.toString(16).padStart(6, '0')}`;
	}
}
