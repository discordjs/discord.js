'use strict';

const CachedManager = require('./CachedManager');
const GuildSticker = require('../structures/GuildSticker');

/**
 * Holds methods to resolve GuildStickers and stores their cache.
 * @extends {CachedManager}
 */
class BaseGuildStickerManager extends CachedManager {
  constructor(client, iterable) {
    super(client, GuildSticker, iterable);
  }

  /**
   * The cache of GuildStickers
   * @type {Collection<Snowflake, GuildSticker>}
   * @name BaseGuildStickerManager#cache
   */

  /**
   * Data that can be resolved into a GuildSticker object. This can be:
   * * A Snowflake
   * * A GuildSticker object
   * @typedef {Snowflake|GuildSticker} StickerResolvable
   */

  /**
   * Resolves an StickerResolvable to a Sticker object.
   * @param {StickerResolvable} sticker The Sticker resolvable to identify
   * @returns {?GuildSticker}
   */
  resolve(sticker) {
    return super.resolve(sticker);
  }

  /**
   * Resolves an StickerResolvable to a Sticker id string.
   * @param {StickerResolvable} sticker The Sticker resolvable to identify
   * @returns {?Snowflake}
   */
  resolveId(sticker) {
    return super.resolveId(sticker);
  }
}

module.exports = BaseGuildStickerManager;
