'use strict';

const { Collection } = require('@discordjs/collection');
const { Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const { DiscordjsTypeError, ErrorCodes } = require('../errors');
const MessagePayload = require('../structures/MessagePayload');
const { Sticker } = require('../structures/Sticker');

/**
 * Manages API methods for Guild Stickers and stores their cache.
 * @extends {CachedManager}
 */
class GuildStickerManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, Sticker, iterable);

    /**
     * The guild this manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The cache of Guild Stickers
   * @type {Collection<Snowflake, Sticker>}
   * @name GuildStickerManager#cache
   */

  _add(data, cache) {
    return super._add(data, cache, { extras: [this.guild] });
  }

  /**
   * Options used to create a guild sticker.
   * @typedef {Object} GuildStickerCreateOptions
   * @property {BufferResolvable|Stream|JSONEncodable<AttachmentPayload>} file The file for the sticker
   * @property {string} name The name for the sticker
   * @property {string} tags The Discord name of a unicode emoji representing the sticker's expression
   * @property {?string} [description] The description for the sticker
   * @property {string} [reason] Reason for creating the sticker
   */

  /**
   * Creates a new custom sticker in the guild.
   * @param {GuildStickerCreateOptions} options Options for creating a guild sticker
   * @returns {Promise<Sticker>} The created sticker
   * @example
   * // Create a new sticker from a URL
   * guild.stickers.create({ file: 'https://i.imgur.com/w3duR07.png', name: 'rip', tags: 'headstone' })
   *   .then(sticker => console.log(`Created new sticker with name ${sticker.name}!`))
   *   .catch(console.error);
   * @example
   * // Create a new sticker from a file on your computer
   * guild.stickers.create({ file: './memes/banana.png', name: 'banana', tags: 'banana' })
   *   .then(sticker => console.log(`Created new sticker with name ${sticker.name}!`))
   *   .catch(console.error);
   */
  async create({ file, name, tags, description, reason } = {}) {
    const resolvedFile = await MessagePayload.resolveFile(file);
    if (!resolvedFile) throw new DiscordjsTypeError(ErrorCodes.ReqResourceType);
    file = { ...resolvedFile, key: 'file' };

    const body = { name, tags, description: description ?? '' };

    const sticker = await this.client.rest.post(Routes.guildStickers(this.guild.id), {
      appendToFormData: true,
      body,
      files: [file],
      reason,
    });
    return this.client.actions.GuildStickerCreate.handle(this.guild, sticker).sticker;
  }

  /**
   * Data that resolves to give a Sticker object. This can be:
   * * A Sticker object
   * * A Snowflake
   * @typedef {Sticker|Snowflake} StickerResolvable
   */

  /**
   * Resolves a StickerResolvable to a Sticker object.
   * @method resolve
   * @memberof GuildStickerManager
   * @instance
   * @param {StickerResolvable} sticker The Sticker resolvable to identify
   * @returns {?Sticker}
   */

  /**
   * Resolves a StickerResolvable to a Sticker id string.
   * @method resolveId
   * @memberof GuildStickerManager
   * @instance
   * @param {StickerResolvable} sticker The Sticker resolvable to identify
   * @returns {?Snowflake}
   */

  /**
   * Edits a sticker.
   * @param {StickerResolvable} sticker The sticker to edit
   * @param {GuildStickerEditData} [data={}] The new data for the sticker
   * @returns {Promise<Sticker>}
   */
  async edit(sticker, data = {}) {
    const stickerId = this.resolveId(sticker);
    if (!stickerId) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'sticker', 'StickerResolvable');

    const d = await this.client.rest.patch(Routes.guildSticker(this.guild.id, stickerId), {
      body: data,
      reason: data.reason,
    });

    const existing = this.cache.get(stickerId);
    if (existing) {
      const clone = existing._clone();
      clone._patch(d);
      return clone;
    }
    return this._add(d);
  }

  /**
   * Deletes a sticker.
   * @param {StickerResolvable} sticker The sticker to delete
   * @param {string} [reason] Reason for deleting this sticker
   * @returns {Promise<void>}
   */
  async delete(sticker, reason) {
    sticker = this.resolveId(sticker);
    if (!sticker) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'sticker', 'StickerResolvable');

    await this.client.rest.delete(Routes.guildSticker(this.guild.id, sticker), { reason });
  }

  /**
   * Obtains one or more stickers from Discord, or the sticker cache if they're already available.
   * @param {Snowflake} [id] The Sticker's id
   * @param {BaseFetchOptions} [options] Additional options for this fetch
   * @returns {Promise<Sticker|Collection<Snowflake, Sticker>>}
   * @example
   * // Fetch all stickers from the guild
   * message.guild.stickers.fetch()
   *   .then(stickers => console.log(`There are ${stickers.size} stickers.`))
   *   .catch(console.error);
   * @example
   * // Fetch a single sticker
   * message.guild.stickers.fetch('222078108977594368')
   *   .then(sticker => console.log(`The sticker name is: ${sticker.name}`))
   *   .catch(console.error);
   */
  async fetch(id, { cache = true, force = false } = {}) {
    if (id) {
      if (!force) {
        const existing = this.cache.get(id);
        if (existing) return existing;
      }
      const sticker = await this.client.rest.get(Routes.guildSticker(this.guild.id, id));
      return this._add(sticker, cache);
    }

    const data = await this.client.rest.get(Routes.guildStickers(this.guild.id));
    return new Collection(data.map(sticker => [sticker.id, this._add(sticker, cache)]));
  }

  /**
   * Fetches the user who uploaded this sticker, if this is a guild sticker.
   * @param {StickerResolvable} sticker The sticker to fetch the user for
   * @returns {Promise<?User>}
   */
  async fetchUser(sticker) {
    sticker = this.resolve(sticker);
    if (!sticker) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'sticker', 'StickerResolvable');
    const data = await this.client.rest.get(Routes.guildSticker(this.guild.id, sticker.id));
    sticker._patch(data);
    return sticker.user;
  }
}

module.exports = GuildStickerManager;
