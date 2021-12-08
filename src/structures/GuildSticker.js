'use strict';

const BaseGuildSticker = require('./BaseGuildSticker');
const { Error } = require('../errors');
const Permissions = require('../util/Permissions');

/**
 * Represents a custom sticker.
 * @extends {BaseGuildSticker}
 */
class GuildSticker extends BaseGuildSticker {
  constructor(client, data, guild) {
    super(client, data, guild);

    /**
     * The user who created this sticker
     * @type {?User}
     */
    this.author = null;

    this._patch(data);
  }

  /**
   * The guild this sticker is part of
   * @type {Guild}
   * @name GuildSticker#guild
   */

  _clone() {
    const clone = super._clone();
    return clone;
  }

  _patch(data) {
    super._patch(data);

    if (data.user) this.author = this.client.users._add(data.user);
  }

  /**
   * Whether the sticker is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    if (!this.guild.me) throw new Error('GUILD_UNCACHED_ME');
    return this.guild.me.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS);
  }

  /**
   * Fetches the author for this sticker
   * @returns {Promise<User>}
   */
  async fetchAuthor() {
    if (!this.guild.me) throw new Error('GUILD_UNCACHED_ME');
    if (!this.guild.me.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) {
      throw new Error('MISSING_MANAGE_EMOJIS_AND_STICKERS_PERMISSION', this.guild);
    }
    const data = await this.client.api.guilds(this.guild.id).stickers(this.id).get();
    this._patch(data);
    return this.author;
  }

  /**
   * Data for editing an sticker.
   * @typedef {Object} GuildStickerEditData
   * @property {string} [name] The name of the sticker
   */

  /**
   * Edits the sticker.
   * @param {GuildStickerEditData} data The new data for the sticker
   * @param {string} [reason] Reason for editing this sticker
   * @returns {Promise<GuildSticker>}
   * @example
   * // Edit an sticker
   * sticker.edit({ name: 'newsticker' })
   *   .then(e => console.log(`Edited sticker ${e}`))
   *   .catch(console.error);
   */
  async edit(data, reason) {
    const newData = await this.client.api
      .guilds(this.guild.id)
      .stickers(this.id)
      .patch({
        data: {
          name: data.name,
          description: data.description,
          tags: data.tags,
        },
        reason,
      });
    const clone = this._clone();
    clone._patch(newData);
    return clone;
  }

  /**
   * Sets the description of the sticker.
   * @param {string} description The new description for the sticker
   * @param {string} [reason] Reason for changing the sticker's description
   * @returns {Promise<GuildSticker>}
   */
  setDescription(description, reason) {
    return this.edit({ description }, reason);
  }

  /**
   * Sets the name of the sticker.
   * @param {string} name The new name for the sticker
   * @param {string} [reason] Reason for changing the sticker's name
   * @returns {Promise<GuildSticker>}
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Sets the tags of the sticker.
   * @param {string} tags The new tags for the sticker
   * @param {string} [reason] Reason for changing the sticker's tags
   * @returns {Promise<GuildSticker>}
   */
  setTags(tags, reason) {
    return this.edit({ tags }, reason);
  }

  /**
   * Deletes the sticker.
   * @param {string} [reason] Reason for deleting the sticker
   * @returns {Promise<GuildSticker>}
   */
  async delete(reason) {
    await this.client.api.guilds(this.guild.id).stickers(this.id).delete({ reason });
    return this;
  }

  /**
   * Whether this sticker is the same as another one.
   * @param {GuildSticker|APISticker} other The sticker to compare it to
   * @returns {boolean}
   */
  equals(other) {
    if (other instanceof GuildSticker) {
      return other.id === this.id && other.name === this.name && other.available === this.available;
    } else {
      return other.id === this.id && other.name === this.name;
    }
  }
}

module.exports = GuildSticker;
