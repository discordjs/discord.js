/* eslint-disable unicorn/consistent-function-scoping */
import { PermissionFlagsBits } from 'discord-api-types/v10';
import type { BitFieldResolvable } from './BitField.js';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a permission bit field. All {@link GuildMember}s have a set of
 * permissions in their guild, and each channel in the guild may also have {@link PermissionOverwrite}s for the member
 * that override their default permissions.
 */
export class PermissionsBitField extends BitField<keyof typeof PermissionFlagsBits> {
	/**
	 * Numeric permission flags.
	 *
	 * @see {@link https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags}
	 */
	public static override Flags = PermissionFlagsBits;

	/**
	 * Bit field representing every permission combined
	 */
	public static readonly All = Object.values(PermissionFlagsBits).reduce((all, perm) => all | perm, 0n);

	/**
	 * Bit field representing the default permissions for users
	 */
	public static readonly Default = 104_324_673n;

	/**
	 * Bit field representing the permissions required for moderators of stage channels
	 */
	public static readonly StageModerator =
		PermissionFlagsBits.ManageChannels | PermissionFlagsBits.MuteMembers | PermissionFlagsBits.MoveMembers;

	/**
	 * Gets all given bits that are missing from the bit field.
	 *
	 * @param bits - Bit(s) to check for
	 * @param checkAdmin - Whether to allow the administrator permission to override
	 * @returns A bit field containing the missing permissions
	 */
	public override missing(bits: BitFieldResolvable<keyof typeof PermissionFlagsBits>, checkAdmin = true) {
		return checkAdmin && this.has(PermissionFlagsBits.Administrator) ? [] : super.missing(bits);
	}

	/**
	 * Checks whether the bit field has a permission, or any of multiple permissions.
	 *
	 * @param permission - Permission(s) to check for
	 * @param checkAdmin - Whether to allow the administrator permission to override
	 * @returns Whether the bit field has the permission(s)
	 */
	public override any(permission: BitFieldResolvable<keyof typeof PermissionFlagsBits>, checkAdmin = true) {
		return (checkAdmin && super.has(PermissionFlagsBits.Administrator)) || super.any(permission);
	}

	/**
	 * Checks whether the bit field has a permission, or multiple permissions.
	 *
	 * @param permission - Permission(s) to check for
	 * @param checkAdmin - Whether to allow the administrator permission to override
	 * @returns Whether the bit field has the permission(s)
	 */
	public override has(permission: BitFieldResolvable<keyof typeof PermissionFlagsBits>, checkAdmin = true) {
		return (checkAdmin && super.has(PermissionFlagsBits.Administrator)) || super.has(permission);
	}

	/**
	 * Gets an Array of bitfield names based on the permissions available.
	 *
	 * @returns An Array of permission names
	 */
	public override toArray() {
		return super.toArray(false);
	}
}
