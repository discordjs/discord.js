'use strict';

const Base = require('./Base');
const { StickerFormatTypes } = require('../util/Constants');
const Snowflake = require('../util/Snowflake');

/**
 * Represents a Sticker.
 * @extends {Base}
 */
class Sticker extends Base {
  constructor(client, sticker) {
    super(client);
    /**
     * The ID of the sticker
     * @type {Snowflake}
     */
    this.id = sticker.id;

    /**
     * The ID of the sticker's image
     * @type {string}
     */
    this.asset = sticker.asset;

    /**
     * The description of the sticker
     * @type {string}
     */
    this.description = sticker.description;

    /**
     * The format of the sticker
     * @type {string}
     */
    this.format = StickerFormatTypes[sticker.format_type];

    /**
     * The name of the sticker
     * @type {string}
     */
    this.name = sticker.name;

    /**
     * The ID of the pack the sticker is from
     * @type {Snowflake}
     */
    this.packID = sticker.pack_id;

    /**
     * The ID of sticker preview image
     * @type {?string}
     */
    this.previewAsset = sticker.preview_asset;

    /**
     * A comma-separated list of tags for the sticker
     * @type {?string}
     */
    this.tags = sticker.tags;
  }

  /**
   * A link to the sticker.
   * <info>If format is LOTTIE, it returns the URL of the Lottie json file.
   * Lottie json files must be converted to display in discord.</info>
   * @param {StickerURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  stickerURL({ size } = {}) {
    return this.client.rest.cdn.Sticker(this.id, this.asset, this.format, size);
  }

  /**
   * A link to the sticker preview image.
   * <info>If format is LOTTIE, it returns the URL of the Lottie json file.
   * Lottie json files must be converted to display in discord.</info>
   * @param {StickerURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  stickerPreviewURL({ size } = {}) {
    if (!this.previewAsset) return null;
    return this.client.rest.cdn.Sticker(this.id, this.previewAsset, this.format, size);
  }

  /**
   * The timestamp the sticker was created at
   * @type {?number}
   * @readonly
   */
  get createdTimestamp() {
    if (!this.id) return null;
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the stikcer was created at
   * @type {?Date}
   * @readonly
   */
  get createdAt() {
    if (!this.id) return null;
    return new Date(this.createdTimestamp);
  }
}

module.exports = Sticker;
