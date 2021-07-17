'use strict';

const Base = require('./Base');
const { StickerFormatTypes } = require('../util/Constants');
const SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * Represents a Sticker.
 * @extends {Base}
 */
class Sticker extends Base {
  constructor(client, sticker) {
    super(client);
    /**
     * The sticker's id
     * @type {Snowflake}
     */
    this.id = sticker.id;

    /**
     * The sticker image's id
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
     * @type {StickerFormatType}
     */
    this.format = StickerFormatTypes[sticker.format_type];

    /**
     * The name of the sticker
     * @type {string}
     */
    this.name = sticker.name;

    /**
     * The id of the pack the sticker is from
     * @type {Snowflake}
     */
    this.packId = sticker.pack_id;

    /**
     * An array of tags for the sticker, if any
     * @type {string[]}
     */
    this.tags = sticker.tags?.split(', ') ?? [];
  }

  /**
   * The timestamp the sticker was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id).timestamp;
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
   * A link to the sticker
   * <info>If the sticker's format is LOTTIE, it returns the URL of the Lottie json file.
   * Lottie json files must be converted in order to be displayed in Discord.</info>
   * @type {string}
   */
  get url() {
    return `${this.client.options.http.cdn}/stickers/${this.id}/${this.asset}.${
      this.format === 'LOTTIE' ? 'json' : 'png'
    }`;
  }
}

module.exports = Sticker;
