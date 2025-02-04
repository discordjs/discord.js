'use strict';

const { BaseGuildEmoji } = require('./BaseGuildEmoji.js');

/**
 * Represents an instance of an emoji belonging to a public guild obtained through Discord's preview endpoint.
 * @extends {BaseGuildEmoji}
 */
class GuildPreviewEmoji extends BaseGuildEmoji {
  /**
   * The public guild this emoji is part of
   * @type {GuildPreview}
   * @name GuildPreviewEmoji#guild
   */

  constructor(client, data, guild) {
    super(client, data, guild);

    /**
     * The roles this emoji is active for
     * @type {Snowflake[]}
     */
    this.roles = data.roles;
  }
}

exports.GuildPreviewEmoji = GuildPreviewEmoji;
