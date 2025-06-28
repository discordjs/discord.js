/* eslint-disable unicorn/consistent-function-scoping */
import { PermissionFlagsBits } from 'discord-api-types/v10';
import type { BitFieldResolvable } from './BitField.js';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a permission bitfield. All {@link GuildMember}s have a set of
 * permissions in their guild, and each channel in the guild may also have {@link PermissionOverwrites} for the member
 * that override their default permissions.
 */
export class PermissionsBitField extends BitField<keyof typeof PermissionFlagsBits, bigint> {
	/**
	 * Numeric permission flags.
	 *
	 * @see {@link https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags}
	 */
	public static override Flags = PermissionFlagsBits;

	/**
	 * Bitfield representing every permission combined
	 */
	public static readonly All = Object.values(PermissionFlagsBits).reduce((all, perm) => all | perm, 0n);

	/**
	 * Bitfield representing the default permissions for users
	 */
	public static readonly Default = 104_324_673n;

	/**
	 * Bitfield representing the permissions required for moderators of stage channels
	 */
	public static readonly StageModerator =
		PermissionFlagsBits.ManageChannels | PermissionFlagsBits.MuteMembers | PermissionFlagsBits.MoveMembers;

	public static override readonly DefaultBit = 0n;

	/**
	 * Gets all given bits that are missing from the bitfield.
	 *
	 * @param bits - Bit(s) to check for
	 * @param checkAdmin - Whether to allow the administrator permission to override
	 * @returns
	 */
	public override missing(bits: BitFieldResolvable<keyof typeof PermissionFlagsBits, bigint>, checkAdmin = true) {
		return checkAdmin && this.has(PermissionFlagsBits.Administrator) ? [] : super.missing(bits);
	}

	/**
	 * Checks whether the bitfield has a permission, or any of multiple permissions.
	 *
	 * @param permission - Permission(s) to check for
	 * @param checkAdmin - Whether to allow the administrator permission to override
	 * @returns
	 */
	public override any(permission: BitFieldResolvable<keyof typeof PermissionFlagsBits, bigint>, checkAdmin = true) {
		return (checkAdmin && super.has(PermissionFlagsBits.Administrator)) || super.any(permission);
	}

	/**
	 * Checks whether the bitfield has a permission, or multiple permissions.
	 *
	 * @param permission - Permission(s) to check for
	 * @param checkAdmin - Whether to allow the administrator permission to override
	 * @returns
	 */
	public override has(permission: BitFieldResolvable<keyof typeof PermissionFlagsBits, bigint>, checkAdmin = true) {
		return (checkAdmin && super.has(PermissionFlagsBits.Administrator)) || super.has(permission);
	}

	/**
	 * Gets an {@link Array} of bitfield names based on the permissions available.
	 *
	 * @returns
	 */
	public override toArray() {
		return super.toArray(false);
	}
}
