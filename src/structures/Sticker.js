'use strict';

const Base = require('./Base');
const { StickerFormatTypes, StickerTypes } = require('../util/Constants');
const SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * Represents a Sticker.
 * @extends {Base}
 */
class Sticker extends Base {
  constructor(client, sticker) {
    super(client);

    this._patch(sticker);
  }

  _patch(sticker) {
    /**
     * The sticker's id
     * @type {Snowflake}
     */
    this.id = sticker.id;

    if ('description' in sticker) {
      /**
       * The description of the sticker
       * @type {?string}
       */
      this.description = sticker.description;
    } else {
      this.description ??= null;
    }

    if ('type' in sticker) {
      /**
       * The type of the sticker
       * @type {?StickerType}
       */
      this.type = StickerTypes[sticker.type];
    } else {
      this.type ??= null;
    }

    if ('format_type' in sticker) {
      /**
       * The format of the sticker
       * @type {StickerFormatType}
       */
      this.format = StickerFormatTypes[sticker.format_type];
    }

    if ('name' in sticker) {
      /**
       * The name of the sticker
       * @type {string}
       */
      this.name = sticker.name;
    }

    if ('pack_id' in sticker) {
      /**
       * The id of the pack the sticker is from, for standard stickers
       * @type {?Snowflake}
       */
      this.packId = sticker.pack_id;
    } else {
      this.packId ??= null;
    }

    if ('tags' in sticker) {
      /**
       * An array of tags for the sticker
       * @type {?string[]}
       */
      this.tags = sticker.tags.split(', ');
    } else {
      this.tags ??= null;
    }

    if ('available' in sticker) {
      /**
       * Whether or not the guild sticker is available
       * @type {?boolean}
       */
      this.available = sticker.available;
    } else {
      this.available ??= null;
    }

    if ('guild_id' in sticker) {
      /**
       * The id of the guild that owns this sticker
       * @type {?Snowflake}
       */
      this.guildId = sticker.guild_id;
    } else {
      this.guildId ??= null;
    }

    if ('user' in sticker) {
      /**
       * The user that uploaded the guild sticker
       * @type {?User}
       */
      this.user = this.client.users._add(sticker.user);
    } else {
      this.user ??= null;
    }

    if ('sort_value' in sticker) {
      /**
       * The standard sticker's sort order within its pack
       * @type {?number}
       */
      this.sortValue = sticker.sort_value;
    } else {
      this.sortValue ??= null;
    }
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
   * Whether this sticker is partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return !this.type;
  }

  /**
   * The guild that owns this sticker
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.resolve(this.guildId);
  }

  /**
   * A link to the sticker
   * <info>If the sticker's format is LOTTIE, it returns the URL of the Lottie json file.</info>
   * @type {string}
   */
  get url() {
    return this.client.rest.cdn.Sticker(this.id, this.format);
  }

  /**
   * Fetches this sticker.
   * @returns {Promise<Sticker>}
   */
  async fetch() {
    const data = await this.client.api.stickers(this.id).get();
    this._patch(data);
    return this;
  }

  /**
   * Fetches the pack this sticker is part of from Discord, if this is a Nitro sticker.
   * @returns {Promise<?StickerPack>}
   */
  async fetchPack() {
    return (this.packId && (await this.client.fetchPremiumStickerPacks()).get(this.packId)) ?? null;
  }

  /**
   * Fetches the user who uploaded this sticker, if this is a guild sticker.
   * @returns {Promise<?User>}
   */
  async fetchUser() {
    if (this.partial) await this.fetch();
    if (!this.guildId) throw new Error('NOT_GUILD_STICKER');

    const data = await this.client.api.guilds(this.guildId).stickers(this.id).get();
    this._patch(data);
    return this.user;
  }

  /**
   * Data for editing a sticker.
   * @typedef {Object} GuildStickerEditData
   * @property {string} [name] The name of the sticker
   * @property {?string} [description] The description of the sticker
   * @property {string} [tags] The Discord name of a unicode emoji representing the sticker's expression
   */

  /**
   * Edits the sticker.
   * @param {GuildStickerEditData} [data] The new data for the sticker
   * @param {string} [reason] Reason for editing this sticker
   * @returns {Promise<Sticker>}
   * @example
   * // Update the name of a sticker
   * sticker.edit({ name: 'new name' })
   *   .then(s => console.log(`Updated the name of the sticker to ${s.name}`))
   *   .catch(console.error);
   */
  edit(data, reason) {
    return this.guild.stickers.edit(this, data, reason);
  }

  /**
   * Deletes the sticker.
   * @returns {Promise<Sticker>}
   * @param {string} [reason] Reason for deleting this sticker
   * @example
   * // Delete a message
   * sticker.delete()
   *   .then(s => console.log(`Deleted sticker ${s.name}`))
   *   .catch(console.error);
   */
  async delete(reason) {
    await this.guild.stickers.delete(this, reason);
    return this;
  }

  /**
   * Whether this sticker is the same as another one.
   * @param {Sticker|APISticker} other The sticker to compare it to
   * @returns {boolean}
   */
  equals(other) {
    if (other instanceof Sticker) {
      return (
        other.id === this.id &&
        other.description === this.description &&
        other.type === this.type &&
        other.format === this.format &&
        other.name === this.name &&
        other.packId === this.packId &&
        other.tags.length === this.tags.length &&
        other.tags.every(tag => this.tags.includes(tag)) &&
        other.available === this.available &&
        other.guildId === this.guildId &&
        other.sortValue === this.sortValue
      );
    } else {
      return (
        other.id === this.id &&
        other.description === this.description &&
        other.name === this.name &&
        other.tags === this.tags.join(', ')
      );
    }
  }
}

module.exports = Sticker;

/**
 * @external APISticker
 * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-object}
 */
