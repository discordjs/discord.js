'use strict';

const { Collection } = require('@discordjs/collection');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const Base = require('./Base');
const { Sticker } = require('./Sticker');

/**
 * Represents a pack of standard stickers.
 * @extends {Base}
 */
class StickerPack extends Base {
  constructor(client, pack) {
    super(client);
    /**
     * The Sticker pack's id
     * @type {Snowflake}
     */
    this.id = pack.id;

    /**
     * The stickers in the pack
     * @type {Collection<Snowflake, Sticker>}
     */
    this.stickers = new Collection(pack.stickers.map(s => [s.id, new Sticker(client, s)]));

    /**
     * The name of the sticker pack
     * @type {string}
     */
    this.name = pack.name;

    /**
     * The id of the pack's SKU
     * @type {Snowflake}
     */
    this.skuId = pack.sku_id;

    /**
     * The id of a sticker in the pack which is shown as the pack's icon
     * @type {?Snowflake}
     */
    this.coverStickerId = pack.cover_sticker_id ?? null;

    /**
     * The description of the sticker pack
     * @type {string}
     */
    this.description = pack.description;

    /**
     * The id of the sticker pack's banner image
     * @type {?Snowflake}
     */
    this.bannerId = pack.banner_asset_id ?? null;
  }

  /**
   * The timestamp the sticker was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return DiscordSnowflake.timestampFrom(this.id);
  }

  /**
   * The time the sticker was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The sticker which is shown as the pack's icon
   * @type {?Sticker}
   * @readonly
   */
  get coverSticker() {
    return this.coverStickerId && this.stickers.get(this.coverStickerId);
  }

  /**
   * The URL to this sticker pack's banner.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  bannerURL(options = {}) {
    return this.bannerId && this.client.rest.cdn.stickerPackBanner(this.bannerId, options);
  }
}

module.exports = StickerPack;
