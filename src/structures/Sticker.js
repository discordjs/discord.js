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
     * @type {StickerFormatTypes}
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
     * The ID of the sticker preview image
     * @type {?string}
     */
    this.previewAsset = sticker.preview_asset;

    /**
     * An array of tags for the sticker, if any
     * @type {string[]}
     */
    this.tags = sticker.tags?.split(', ') ?? [];

    /**
     * A link to the sticker
     * <info>If the sticker's format is LOTTIE, it returns the URL of the Lottie json file.
     * Lottie json files must be converted in order to be displayed in Discord.</info>
     * @type {string}
     */
    this.url = `${client.options.http.cdn}/stickers/${this.id}/${this.asset}.${
      this.format === 'LOTTIE' ? 'json' : 'png'
    }`;
  }

  /**
   * The timestamp the sticker was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the sticker was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }
}

module.exports = Sticker;
