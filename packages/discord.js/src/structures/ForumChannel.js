'use strict';

const GuildChannel = require('./GuildChannel');
const ThreadManager = require('../managers/ThreadManager');

/**
 * Represents a forum channel on Discord.
 * @extends {GuildChannel}
 */
class ForumChannel extends GuildChannel {
  _patch(data) {
    super._patch(data);

    /**
     * A manager of the threads belonging to this channel
     * @type {ThreadManager}
     */
     this.threads = new ThreadManager(this);
  }
}

module.exports = ForumChannel;