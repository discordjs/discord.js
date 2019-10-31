'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with an {@link SystemChannelFlags#flags} bitfield.
 * <info>Note that both welcome messages and boost messages are enabled by default,
 * and by setting their corresponding flags you are disabling them.</info>
 * @extends {BitField}
 */
class SystemChannelFlags extends BitField {}

/**
 * Numeric system channel flags. All available properties:
 * * `BOOST_MESSAGE_DISABLED`
 * * `WELCOME_MESSAGE_DISABLED`
 * @type {Object}
 */
SystemChannelFlags.FLAGS = {
  BOOST_MESSAGE_DISABLED: 1 << 0,
  WELCOME_MESSAGE_DISABLED: 1 << 1,
};

module.exports = SystemChannelFlags;
