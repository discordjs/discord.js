import type { APIRole } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a role in a guild.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `RoleTags`, which needs to be instantiated and stored by an extending class using it
 */
export abstract class Role<Omitted extends keyof APIRole | '' = ''> extends Structure<APIRole, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each Role
	 */
	public static override readonly DataTemplate: Partial<APIRole> = {};

	/**
	 * @param data - The raw data received from the API for the role
	 */
	public constructor(data: Partialize<APIRole, Omitted>) {
		super(data);
	}

	/**
	 * The role id
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The role name
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * Integer representation of hexadecimal color code
	 */
	public get color() {
		return this[kData].color;
	}

	/**
	 * Whether this role is pinned in the user listing
	 */
	public get hoist() {
		return this[kData].hoist;
	}

	/**
	 * The role icon hash
	 */
	public get icon() {
		return this[kData].icon;
	}

	/**
	 * The role unicode emoji
	 */
	public get unicodeEmoji() {
		return this[kData].unicode_emoji;
	}

	/**
	 * Position of this role
	 */
	public get position() {
		return this[kData].position;
	}

	/**
	 * Permission bit set
	 */
	public get permissions() {
		return this[kData].permissions;
	}

	/**
	 * Whether this role is managed by an integration
	 */
	public get managed() {
		return this[kData].managed;
	}

	/**
	 * Whether this role is mentionable
	 */
	public get mentionable() {
		return this[kData].mentionable;
	}

	/**
	 * Role flags combined as a bitfield
	 */
	public get flags() {
		return this[kData].flags;
	}

	/**
	 * The hexadecimal version of the role color, with a leading hash
	 */
	public get hexColor() {
		const color = this.color as number;
		return `#${color.toString(16).padStart(6, '0')}`;
	}
}
