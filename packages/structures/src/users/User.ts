import { DiscordSnowflake } from '@sapphire/snowflake';
import {
	CDNRoutes,
	ImageFormat,
	RouteBases,
	type APIUser,
	type DefaultUserAvatarAssets,
	type UserAvatarFormat,
	type UserBannerFormat,
} from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import { isFieldSet, isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any user on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `AvatarDecorationData`, which needs to be instantiated and stored by an extending class using it
 */
export class User<Omitted extends keyof APIUser | '' = ''> extends Structure<APIUser, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each User
	 */
	public static override readonly DataTemplate: Partial<APIUser> = {};

	/**
	 * @param data - The raw data received from the API for the user
	 */
	public constructor(data: Partialize<APIUser, Omitted>) {
		super(data);
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
	 * The user's 4 digit tag, if a bot
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
	 * Get the URL to the user avatar
	 *
	 * @param format - the file format to use
	 */
	public avatarURL(format: UserAvatarFormat = ImageFormat.WebP) {
		return isIdSet(this[kData].id) && isFieldSet(this[kData], 'avatar', 'string')
			? `${RouteBases.cdn}${CDNRoutes.userAvatar(this[kData].id.toString(), this[kData].avatar, format)}`
			: null;
	}

	/**
	 * Get the URL to the user's default avatar
	 */
	public get defaultAvatarURL() {
		return isIdSet(this[kData].id)
			? `${RouteBases.cdn}${CDNRoutes.defaultUserAvatar(
					(isFieldSet(this[kData], 'discriminator', 'string') && this[kData].discriminator.length === 4
						? Number(this[kData].discriminator) % 5
						: Number(BigInt(this[kData].id) >> 22n) % 6) as DefaultUserAvatarAssets,
				)}`
			: null;
	}

	/**
	 * Get the URL to the user avatar or their default avatar, if none is set
	 */
	public displayAvatarURL(format: UserAvatarFormat = ImageFormat.WebP) {
		return this.avatarURL(format) ?? this.defaultAvatarURL;
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
	 * Get the URL to the user banner
	 *
	 * @param format - the file format to use
	 */
	public bannerURL(format: UserBannerFormat = ImageFormat.WebP) {
		return isIdSet(this[kData].id) && isFieldSet(this[kData], 'banner', 'string')
			? `${RouteBases.cdn}${CDNRoutes.userBanner(this[kData].id.toString(), this[kData].banner, format)}`
			: null;
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
	 * The user's primary Discord language
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
	 * The timestamp the user was created at
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
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
		const accentColor = this.accentColor;
		if (typeof accentColor !== 'number') return accentColor;
		return `#${accentColor.toString(16).padStart(6, '0')}`;
	}
}
