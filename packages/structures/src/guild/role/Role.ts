import {
	CDNRoutes,
	ImageFormat,
	RouteBases,
	type APIRole,
	type RoleFlags,
	type RoleIconFormat,
} from 'discord-api-types/v10';
import { Structure } from '../../Structure';
import { PermissionsBitField, RoleFlagsBitField } from '../../bitfields';
import { kData, kPermissions } from '../../utils/symbols';
import { isFieldSet, isIdSet } from '../../utils/type-guards';
import type { Partialize } from '../../utils/types';

/**
 * Represents a role on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructures `RoleColors` and `RoleTags`, which need to be instantiated and stored by an extending class using it
 */
export class Role<Omitted extends keyof APIRole | '' = ''> extends Structure<APIRole, Omitted> {
	protected [kPermissions]: bigint | null = null;

	/**
	 * The template used for removing data from the raw data stored for each role.
	 */
	public static override readonly DataTemplate: Partial<APIRole> = {};

	/**
	 * @param data - The raw data from the API for the role.
	 */
	public constructor(data: Partialize<APIRole, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * The id of the role.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the role.
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The base 10 color of the role.
	 *
	 * @deprecated Use `colors` instead
	 */
	public get color() {
		return this[kData].color;
	}

	/**
	 * Whether this role is pinned in the user listing.
	 */
	public get hoist() {
		return this[kData].hoist;
	}

	/**
	 * The icon hash of the role.
	 *
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting}
	 */
	public get icon() {
		return this[kData].icon;
	}

	/**
	 * Get the URL to the role icon.
	 *
	 * @param format - the file format to use
	 */
	public iconURL(format: RoleIconFormat = ImageFormat.WebP) {
		return isIdSet(this[kData].id) && isFieldSet(this[kData], 'icon', 'string')
			? `${RouteBases.cdn}${CDNRoutes.roleIcon(this[kData].id.toString(), this[kData].icon, format)}`
			: null;
	}

	/**
	 * The role unicode emoji.
	 */
	public get unicodeEmoji() {
		return this[kData].unicode_emoji;
	}

	/**
	 * Position of the role
	 *
	 * @remarks Roles with the same position are sorted by id.
	 */
	public get position() {
		return this[kData].position;
	}

	/**
	 * The permissions of the role.
	 */
	public get permissions() {
		const permissions = this[kPermissions];
		return typeof permissions === 'bigint' ? new PermissionsBitField(permissions) : null;
	}

	/**
	 * Whether this role is managed by an integration.
	 */
	public get managed() {
		return this[kData].managed;
	}

	/**
	 * Whether this role is mentionable.
	 */
	public get mentionable() {
		return this[kData].mentionable;
	}

	/**
	 * Role flags represented as a bit set.
	 */
	public get flags() {
		return isFieldSet(this[kData], 'flags', 'number') ? new RoleFlagsBitField(this[kData].flags as RoleFlags) : null;
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 */
	protected override optimizeData(data: Partial<APIRole>): void {
		if (data.permissions) {
			this[kPermissions] = BigInt(data.permissions);
		}
	}
}
