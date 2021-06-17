'use strict';

const Base = require('./Base');
const { StickerFormatTypes, StickerTypes } = require('../util/Constants');
const SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * Represents a Sticker.
 * @extends {Base}
 */
class Sticker extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} sticker The data for the sticker
   */
  constructor(client, sticker) {
    super(client);
    /**
     * The ID of the sticker
     * @type {Snowflake}
     */
    this.id = sticker.id;

    /**
     * The description of the sticker
     * @type {string}
     */
    this.description = sticker.description;

    /**
     * The type of the sticker
     * @type {StickerType}
     */
    this.type = StickerTypes[sticker.type];

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
     * The ID of the pack the sticker is from, for standard stickers
     * @type {?Snowflake}
     */
    this.packID = sticker.pack_id ?? null;

    /**
     * An array of tags for the sticker, if any
     * @type {string[]}
     */
    this.tags = sticker.tags?.split(', ') ?? [];

    /**
     * Whether or not the guild sticker is available
     * @type {?boolean}
     */
    this.available = sticker.available ?? null;

    /**
     * The ID of the guild that owns this sticker
     * @type {?Snowflake}
     */
    this.guildID = sticker.guild_id ?? null;

    /**
     * The user that uploaded the guild sticker
     * @type {?User}
     */
    this.user = sticker.user ? this.client.users.add(sticker.user) : null;

    /**
     * The standard sticker's sort order within its pack
     * @type {?number}
     */
    this.sortValue = sticker.sort_value ?? null;
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
   * The guild that owns this sticker
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.resolve(this.guildID);
  }

  /**
   * A link to the sticker
   * <info>If the sticker's format is LOTTIE, it returns the URL of the Lottie json file.</info>
   * @type {string}
   */
  get url() {
    return `${this.client.options.http.cdn}/stickers/${this.id}.${this.format === 'LOTTIE' ? 'json' : 'png'}`;
  }

  /**
   * Fetches the pack this sticker is part of from Discord, if this is a Nitro sticker.
   * @returns {Promise<?StickerPack>}
   */
  async fetchPack() {
    return (this.packID && (await this.client.fetchNitroStickerPacks()).get(this.packID)) ?? null;
  }
}

module.exports = Sticker;
