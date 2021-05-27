'use strict';

const BaseGuildEmoji = require('./BaseGuildEmoji');

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

  /**
   * Set of roles this emoji is active for
   * @type {Set<Snowflake>}
   * @readonly
   */
  get roles() {
    return new Set(this._roles);
  }
}

module.exports = GuildPreviewEmoji;
