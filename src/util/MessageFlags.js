'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with an {@link Message#flags} bitfield.
 * @extends {BitField}
 */
class MessageFlags extends BitField {}

/**
 * @name MessageFlags
 * @kind constructor
 * @memberof MessageFlags
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Numeric message flags. All available properties:
 * * `CROSSPOSTED`
 * * `IS_CROSSPOST`
 * * `SUPPRESS_EMBEDS`
 * * `SOURCE_MESSAGE_DELETED`
 * * `URGENT`
 * @type {Object}
 * @see {@link https://discord.com/developers/docs/resources/channel#message-object-message-flags}
 */
MessageFlags.FLAGS = {
  CROSSPOSTED: 1 << 0,
  IS_CROSSPOST: 1 << 1,
  SUPPRESS_EMBEDS: 1 << 2,
  SOURCE_MESSAGE_DELETED: 1 << 3,
  URGENT: 1 << 4,
};

module.exports = MessageFlags;
