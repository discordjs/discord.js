'use strict';

const { Channel } = require('./Channel');

/**
 * Represents a channel that displays a directory of guilds.
 * @extends {Channel}
 */
class DirectoryChannel extends Channel {
  _patch(data) {
    super._patch(data);
    /**
     * The channel's name
     * @type {string}
     */
    this.name = data.name;
  }
}

module.exports = DirectoryChannel;
