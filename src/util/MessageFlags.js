'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with an {@link Message#flags} bitfield.
 * @extends {BitField}
 */
class MessageFlags extends BitField {}

/**
 * Numeric message flags. All available properties:
 * * `CROSSPOSTED`
 * * `IS_CROSSPOST`
 * * `SUPPRESS_EMBEDS`
 * @type {Object}
 * @see {@link https://discordapp.com/developers/docs/resources/channel#message-object-message-flags}
 */
MessageFlags.FLAGS = {
  CROSSPOSTED: 1 << 0,
  IS_CROSSPOST: 1 << 1,
  SUPPRESS_EMBEDS: 1 << 2,
};

module.exports = MessageFlags;
