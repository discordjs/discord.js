'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link ClientApplication#flags} bitfield.
 * @extends {BitField}
 */
class ApplicationFlags extends BitField {}

/**
 * @name ApplicationFlags
 * @kind constructor
 * @memberof ApplicationFlags
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name ApplicationFlags#bitfield
 */

/**
 * Numeric application flags. All available properties:
 * * `APPLICATION_AUTO_MODERATION_RULE_CREATE_BADGE`
 * * `GATEWAY_PRESENCE`
 * * `GATEWAY_PRESENCE_LIMITED`
 * * `GATEWAY_GUILD_MEMBERS`
 * * `GATEWAY_GUILD_MEMBERS_LIMITED`
 * * `VERIFICATION_PENDING_GUILD_LIMIT`
 * * `EMBEDDED`
 * * `GATEWAY_MESSAGE_CONTENT`
 * * `GATEWAY_MESSAGE_CONTENT_LIMITED`
 * * `APPLICATION_COMMAND_BADGE`
 * @type {Object}
 * @see {@link https://discord.com/developers/docs/resources/application#application-object-application-flags}
 */
ApplicationFlags.FLAGS = {
  APPLICATION_AUTO_MODERATION_RULE_CREATE_BADGE: 1 << 6,
  GATEWAY_PRESENCE: 1 << 12,
  GATEWAY_PRESENCE_LIMITED: 1 << 13,
  GATEWAY_GUILD_MEMBERS: 1 << 14,
  GATEWAY_GUILD_MEMBERS_LIMITED: 1 << 15,
  VERIFICATION_PENDING_GUILD_LIMIT: 1 << 16,
  EMBEDDED: 1 << 17,
  GATEWAY_MESSAGE_CONTENT: 1 << 18,
  GATEWAY_MESSAGE_CONTENT_LIMITED: 1 << 19,
  APPLICATION_COMMAND_BADGE: 1 << 23,
};

module.exports = ApplicationFlags;
