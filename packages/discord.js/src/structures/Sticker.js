'use strict';

const { DiscordSnowflake } = require('@sapphire/snowflake');
const { Routes } = require('discord-api-types/v10');
const Base = require('./Base');
const { DiscordjsError, ErrorCodes } = require('../errors');
const { StickerFormatExtensionMap } = require('../util/Constants');

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
      this.type = sticker.type;
    } else {
      this.type ??= null;
    }

    if ('format_type' in sticker) {
      /**
       * The format of the sticker
       * @type {StickerFormatType}
       */
      this.format = sticker.format_type;
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
       * Autocomplete/suggestions for the sticker
       * @type {?string}
       */
      this.tags = sticker.tags;
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
   * <info>If the sticker's format is {@link StickerFormatType.Lottie}, it returns
   * the URL of the Lottie JSON file.</info>
   * @type {string}
   * @readonly
   */
  get url() {
    return this.client.rest.cdn.sticker(this.id, StickerFormatExtensionMap[this.format]);
  }

  /**
   * Fetches this sticker.
   * @returns {Promise<Sticker>}
   */
  async fetch() {
    const data = await this.client.rest.get(Routes.sticker(this.id));
    this._patch(data);
    return this;
  }

  /**
   * Fetches the pack that contains this sticker.
   * @returns {Promise<?StickerPack>} The sticker pack or `null` if this sticker does not belong to one.
   */
  async fetchPack() {
    if (!this.packId) return null;
    return this.client.fetchStickerPacks({ packId: this.packId });
  }

  /**
   * Fetches the user who uploaded this sticker, if this is a guild sticker.
   * @returns {Promise<?User>}
   */
  async fetchUser() {
    if (this.partial) await this.fetch();
    if (!this.guildId) throw new DiscordjsError(ErrorCodes.NotGuildSticker);
    return this.guild.stickers.fetchUser(this);
  }

  /**
   * Data for editing a sticker.
   * @typedef {Object} GuildStickerEditOptions
   * @property {string} [name] The name of the sticker
   * @property {?string} [description] The description of the sticker
   * @property {string} [tags] The Discord name of a unicode emoji representing the sticker's expression
   * @property {string} [reason] Reason for editing this sticker
   */

  /**
   * Edits the sticker.
   * @param {GuildStickerEditOptions} options The options to provide
   * @returns {Promise<Sticker>}
   * @example
   * // Update the name of a sticker
   * sticker.edit({ name: 'new name' })
   *   .then(sticker => console.log(`Updated the name of the sticker to ${sticker.name}`))
   *   .catch(console.error);
   */
  edit(options) {
    return this.guild.stickers.edit(this, options);
  }

  /**
   * Deletes the sticker.
   * @returns {Promise<Sticker>}
   * @param {string} [reason] Reason for deleting this sticker
   * @example
   * // Delete a sticker
   * sticker.delete()
   *   .then(sticker => console.log(`Deleted sticker ${sticker.name}`))
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
        other.tags === this.tags &&
        other.available === this.available &&
        other.guildId === this.guildId &&
        other.sortValue === this.sortValue
      );
    } else {
      return (
        other.id === this.id &&
        other.description === this.description &&
        other.name === this.name &&
        other.tags === this.tags
      );
    }
  }
}

exports.Sticker = Sticker;
