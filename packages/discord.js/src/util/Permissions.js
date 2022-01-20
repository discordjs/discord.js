'use strict';

const { PermissionFlagsBits } = require('discord-api-types/v9');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a permission bitfield. All {@link GuildMember}s have a set of
 * permissions in their guild, and each channel in the guild may also have {@link PermissionOverwrites} for the member
 * that override their default permissions.
 * @extends {BitField}
 */
class Permissions extends BitField {
  /**
   * Bitfield of the packed bits
   * @type {bigint}
   * @name Permissions#bitfield
   */

  /**
   * Data that can be resolved to give a permission number. This can be:
   * * A string (see {@link PermissionFlagsBits})
   * * A permission number
   * * An instance of Permissions
   * * An Array of PermissionResolvable
   * @typedef {string|bigint|Permissions|PermissionResolvable[]} PermissionResolvable
   */

  /**
   * Checks whether the bitfield has a permission, or multiple permissions.
   * @param {PermissionResolvable} permission Permission(s) to check for
   * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
   * @returns {boolean}
   */
  has(permission, checkAdmin = true) {
    return (checkAdmin && super.has(PermissionFlagsBits.Administrator)) || super.has(permission);
  }
}

/**
 * Bitfield representing every permission combined
 * @type {bigint}
 */
Permissions.All = Object.values(PermissionFlagsBits).reduce((all, p) => all | p, 0n);

/**
 * Bitfield representing the default permissions for users
 * @type {bigint}
 */
Permissions.Default = BigInt(104324673);

/**
 * Bitfield representing the permissions required for moderators of stage channels
 * @type {bigint}
 */
Permissions.StageModerator =
  PermissionFlagsBits.ManageChannels | PermissionFlagsBits.MuteMembers | PermissionFlagsBits.MoveMembers;

Permissions.defaultBit = BigInt(0);

module.exports = Permissions;
