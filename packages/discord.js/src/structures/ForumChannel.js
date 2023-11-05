'use strict';

const ThreadOnlyChannel = require('./ThreadOnlyChannel');

/**
 * Represents a forum channel.
 * @extends {ThreadOnlyChannel}
 */
class ForumChannel extends ThreadOnlyChannel {
  _patch(data) {
    super._patch(data);

    /**
     * The default layout type used to display posts
     * @type {ForumLayoutType}
     */
    this.defaultForumLayout = data.default_forum_layout;
  }

  /**
   * Sets the default forum layout type used to display posts
   * @param {ForumLayoutType} defaultForumLayout The default forum layout type to set on this channel
   * @param {string} [reason] Reason for changing the default forum layout
   * @returns {Promise<ForumChannel>}
   */
  setDefaultForumLayout(defaultForumLayout, reason) {
    return this.edit({ defaultForumLayout, reason });
  }
}

module.exports = ForumChannel;
