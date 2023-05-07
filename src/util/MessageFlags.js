'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link Message#flags} bitfield.
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
 * Bitfield of the packed bits
 * @type {number}
 * @name MessageFlags#bitfield
 */

/**
 * Numeric message flags. All available properties:
 * * `CROSSPOSTED`
 * * `IS_CROSSPOST`
 * * `SUPPRESS_EMBEDS`
 * * `SOURCE_MESSAGE_DELETED`
 * * `URGENT`
 * * `HAS_THREAD`
 * * `EPHEMERAL`
 * * `LOADING`
 * * `FAILED_TO_MENTION_SOME_ROLES_IN_THREAD`
 * * `SUPPRESS_NOTIFICATIONS`
 * * `IS_VOICE_MESSAGE`
 * @type {Object}
 * @see {@link https://discord.com/developers/docs/resources/channel#message-object-message-flags}
 */
MessageFlags.FLAGS = {
  CROSSPOSTED: 1 << 0,
  IS_CROSSPOST: 1 << 1,
  SUPPRESS_EMBEDS: 1 << 2,
  SOURCE_MESSAGE_DELETED: 1 << 3,
  URGENT: 1 << 4,
  HAS_THREAD: 1 << 5,
  EPHEMERAL: 1 << 6,
  LOADING: 1 << 7,
  FAILED_TO_MENTION_SOME_ROLES_IN_THREAD: 1 << 8,
  SUPPRESS_NOTIFICATIONS: 1 << 12,
  IS_VOICE_MESSAGE: 1 << 13,
};

module.exports = MessageFlags;
