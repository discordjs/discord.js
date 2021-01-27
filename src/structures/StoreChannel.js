'use strict';

const ServerChannel = require('./ServerChannel');

/**
 * Represents a server store channel on Discord.
 * @extends {ServerChannel}
 */
class StoreChannel extends ServerChannel {
  /**
   * @param {*} server The server the store channel is part of
   * @param {*} data The data for the store channel
   */
  constructor(server, data) {
    super(server, data);

    /**
     * If the server considers this channel NSFW
     * @type {boolean}
     * @readonly
     */
    this.nsfw = Boolean(data.nsfw);
  }

  _patch(data) {
    super._patch(data);

    if (typeof data.nsfw !== 'undefined') this.nsfw = Boolean(data.nsfw);
  }
}

module.exports = StoreChannel;
