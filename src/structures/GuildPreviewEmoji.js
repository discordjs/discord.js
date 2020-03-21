'use strict';

const BaseEmoji = require('./BaseEmoji');

/**
 * Represents an instance of an emoji belonging to a guild obtained through Discord's preview endpoint.
 * @extends {BaseEmoji}
 */
class GuildPreviewEmoji extends BaseEmoji {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the emoji
   * @param {Guild} guild The guild the emoji is a part of
   */
  constructor(client, data, guild) {
    super(client, data, guild);

    this._patch(data);
  }
}

module.exports = GuildPreviewEmoji;
