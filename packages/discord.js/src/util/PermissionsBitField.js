'use strict';

const { PermissionFlagsBits } = require('discord-api-types/v9');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a permission bitfield. All {@link GuildMember}s have a set of
 * permissions in their guild, and each channel in the guild may also have {@link PermissionOverwrites} for the member
 * that override their default permissions.
 * @extends {BitField}
 */
class PermissionsBitField extends BitField {
  /**
   * Bitfield of the packed bits
   * @type {bigint}
   * @name Permissions#bitfield
   */

  /**
   * Data that can be resolved to give a permission number. This can be:
   * * A string (see {@link PermissionsBitField.Flags})
   * * A permission number
   * * An instance of {@link PermissionsBitField}
   * * An Array of PermissionResolvable
   * @typedef {string|bigint|PermissionsBitField|PermissionResolvable[]} PermissionResolvable
   */

  /**
   * Gets all given bits that are missing from the bitfield.
   * @param {BitFieldResolvable} bits Bit(s) to check for
   * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
   * @returns {string[]}
   */
  missing(bits, checkAdmin = true) {
    return checkAdmin && this.has(PermissionFlagsBits.Administrator) ? [] : super.missing(bits);
  }

  /**
   * Checks whether the bitfield has a permission, or any of multiple permissions.
   * @param {PermissionResolvable} permission Permission(s) to check for
   * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
   * @returns {boolean}
   */
  any(permission, checkAdmin = true) {
    return (checkAdmin && super.has(PermissionFlagsBits.Administrator)) || super.any(permission);
  }

  /**
   * Checks whether the bitfield has a permission, or multiple permissions.
   * @param {PermissionResolvable} permission Permission(s) to check for
   * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
   * @returns {boolean}
   */
  has(permission, checkAdmin = true) {
    return (checkAdmin && super.has(PermissionFlagsBits.Administrator)) || super.has(permission);
  }

  /**
   * Gets an {@link Array} of bitfield names based on the permissions available.
   * @returns {string[]}
   */
  toArray() {
    return super.toArray(false);
  }
}

/**
 * Numeric permission flags.
 * @type {PermissionFlagsBits}
 * @see {@link https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags}
 */
PermissionsBitField.Flags = PermissionFlagsBits;

/**
 * Bitfield representing every permission combined
 * @type {bigint}
 */
PermissionsBitField.All = Object.values(PermissionFlagsBits).reduce((all, p) => all | p, 0n);

/**
 * Bitfield representing the default permissions for users
 * @type {bigint}
 */
PermissionsBitField.Default = BigInt(104324673);

/**
 * Bitfield representing the permissions required for moderators of stage channels
 * @type {bigint}
 */
PermissionsBitField.StageModerator =
  PermissionFlagsBits.ManageChannels | PermissionFlagsBits.MuteMembers | PermissionFlagsBits.MoveMembers;

PermissionsBitField.defaultBit = BigInt(0);

module.exports = PermissionsBitField;
