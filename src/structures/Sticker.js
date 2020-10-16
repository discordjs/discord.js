'use strict';

const Base = require('./Base');
const { StickerFormatTypes } = require('../util/Constants');
const Snowflake = require('../util/Snowflake');

class Sticker extends Base {
  constructor(client, sticker) {
    super(client);
    /**
     * The ID of sticker
     * @type {Snowflake}
     * @name Sticker#id
     */
    this.id = sticker.id;

    /**
     * The ID of the sticker's image
     * @type {string}
     * @name Sticker#asset
     */
    this.asset = sticker.asset;

    /**
     * The description of sticker
     * @type {string}
     * @name Sticker#description
     */
    this.description = sticker.description;

    /**
     * The type of sticker format
     * @type {string}
     * @name Sticker#format
     */
    this.format = StickerFormatTypes[sticker.format_type];

    /**
     * The name of the sticker
     */
    this.name = sticker.name;

    /**
     * The ID of the pack the sticker is from
     * @type {Snowflake}
     * @name Sticker#packID
     */
    this.packID = sticker.pack_id;

    /**
     * The ID of sticker preview image
     * @type {?string}
     * @name Sticker#previewAsset
     */
    this.previewAsset = sticker.preview_asset;

    /**
     * A comma-separated list of tags for the sticker
     * @type {?string}
     * @name Sticker#tags
     */
    this.tags = sticker.tags;
  }

  /**
   * A link to the sticker.
   * <warn>If format is "LOTTIE" it would return URL of Lottie json file</warn>
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  stickerURL({ size } = {}) {
    if (!this.id || !this.asset) return null;
    return this.client.rest.cdn.Sticker(this.id, this.asset, this.format, size);
  }

  /**
   * A link to the sticker preview image.
   * <warn>If format is "LOTTIE" it would return URL of Lottie json file</warn>
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  stickerPreviewURL({ size } = {}) {
    if (!this.id || !this.asset) return null;
    return this.client.rest.cdn.Sticker(this.id, this.previewAsset, this.format, size);
  }

  /**
   * The timestamp the sticker was created at, or null if unicode
   * @type {?number}
   * @readonly
   */
  get createdTimestamp() {
    if (!this.id) return null;
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the stikcer was created at, or null if unicode
   * @type {?Date}
   * @readonly
   */
  get createdAt() {
    if (!this.id) return null;
    return new Date(this.createTimestamp);
  }
}

module.exports = Sticker;
