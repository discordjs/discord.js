'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with an {@link GuildMember#flags} bitfield.
 * @extends {BitField}
 */
class AttachmentFlags extends BitField {}

/**
 * @name AttachmentFlags
 * @kind constructor
 * @memberof AttachmentFlags
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/* eslint-disable max-len */
/**
 * Numeric guild member flags. All available properties:
 * * `IS_REMIX`
 * @type {Object}
 * @see {@link https://discord.com/developers/docs/resources/channel#attachment-object-attachment-structure-attachment-flags}
 */
AttachmentFlags.FLAGS = {
  IS_REMIX: 1 << 2,
};

/**
 * Data that can be resolved to give a guild attachment bitfield. This can be:
 * * A string (see {@link AttachmentFlags.FLAGS})
 * * A attachment flag
 * * An instance of AttachmentFlags
 * * An Array of AttachmentFlagsResolvable
 * @typedef {string|number|AttachmentFlags|AttachmentFlagsResolvable[]} AttachmentFlagsResolvable
 */

module.exports = AttachmentFlags;
