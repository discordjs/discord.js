'use strict';

const BaseServerEmoji = require('./BaseServerEmoji');

/**
 * Represents an instance of an emoji belonging to a public server obtained through Discord's preview endpoint.
 * @extends {BaseServerEmoji}
 */
class ServerPreviewEmoji extends BaseServerEmoji {
  /**
   * The public server this emoji is part of
   * @type {ServerPreview}
   * @name ServerPreviewEmoji#server
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

module.exports = ServerPreviewEmoji;
