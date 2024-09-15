'use strict';

const { Collection } = require('@discordjs/collection');
const { Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const { DiscordjsTypeError, ErrorCodes } = require('../errors');
const ApplicationEmoji = require('../structures/ApplicationEmoji');
const { resolveImage } = require('../util/DataResolver');

/**
 * Manages API methods for ApplicationEmojis and stores their cache.
 * @extends {CachedManager}
 */
class ApplicationEmojiManager extends CachedManager {
  constructor(application, iterable) {
    super(application.client, ApplicationEmoji, iterable);

    /**
     * The application this manager belongs to
     * @type {ClientApplication}
     */
    this.application = application;
  }

  _add(data, cache) {
    return super._add(data, cache, { extras: [this.application] });
  }

  /**
   * Options used for creating an emoji of the application
   * @typedef {Object} ApplicationEmojiCreateOptions
   * @property {BufferResolvable|Base64Resolvable} attachment The image for the emoji
   * @property {string} name The name for the emoji
   */

  /**
   * Creates a new custom emoji of the application.
   * @param {ApplicationEmojiCreateOptions} options Options for creating the emoji
   * @returns {Promise<Emoji>} The created emoji
   * @example
   * // Create a new emoji from a URL
   * application.emojis.create({ attachment: 'https://i.imgur.com/w3duR07.png', name: 'rip' })
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   * @example
   * // Create a new emoji from a file on your computer
   * application.emojis.create({ attachment: './memes/banana.png', name: 'banana' })
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   */
  async create({ attachment, name }) {
    attachment = await resolveImage(attachment);
    if (!attachment) throw new DiscordjsTypeError(ErrorCodes.ReqResourceType);

    const body = { image: attachment, name };

    const emoji = await this.client.rest.post(Routes.applicationEmojis(this.application.id), { body });
    return this._add(emoji);
  }

  /**
   * Obtains one or more emojis from Discord, or the emoji cache if they're already available.
   * @param {Snowflake} [id] The emoji's id
   * @param {BaseFetchOptions} [options] Additional options for this fetch
   * @returns {Promise<ApplicationEmoji|Collection<Snowflake, ApplicationEmoji>>}
   * @example
   * // Fetch all emojis from the application
   * application.emojis.fetch()
   *   .then(emojis => console.log(`There are ${emojis.size} emojis.`))
   *   .catch(console.error);
   * @example
   * // Fetch a single emoji
   * application.emojis.fetch('222078108977594368')
   *   .then(emoji => console.log(`The emoji name is: ${emoji.name}`))
   *   .catch(console.error);
   */
  async fetch(id, { cache = true, force = false } = {}) {
    if (id) {
      if (!force) {
        const existing = this.cache.get(id);
        if (existing) return existing;
      }
      const emoji = await this.client.rest.get(Routes.applicationEmoji(this.application.id, id));
      return this._add(emoji, cache);
    }

    const { items: data } = await this.client.rest.get(Routes.applicationEmojis(this.application.id));
    const emojis = new Collection();
    for (const emoji of data) emojis.set(emoji.id, this._add(emoji, cache));
    return emojis;
  }

  /**
   * Deletes an emoji.
   * @param {EmojiResolvable} emoji The Emoji resolvable to delete
   * @returns {Promise<void>}
   */
  async delete(emoji) {
    const id = this.resolveId(emoji);
    if (!id) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'emoji', 'EmojiResolvable', true);
    await this.client.rest.delete(Routes.applicationEmoji(this.application.id, id));
  }

  /**
   * Edits an emoji.
   * @param {EmojiResolvable} emoji The Emoji resolvable to edit
   * @param {ApplicationEmojiEditOptions} options The options to provide
   * @returns {Promise<ApplicationEmoji>}
   */
  async edit(emoji, options) {
    const id = this.resolveId(emoji);
    if (!id) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'emoji', 'EmojiResolvable', true);

    const newData = await this.client.rest.patch(Routes.applicationEmoji(this.application.id, id), {
      body: {
        name: options.name,
      },
    });
    const existing = this.cache.get(id);
    if (existing) {
      existing._patch(newData);
      return existing;
    }
    return this._add(newData);
  }

  /**
   * Fetches the author for this emoji
   * @param {EmojiResolvable} emoji The emoji to fetch the author of
   * @returns {Promise<User>}
   */
  async fetchAuthor(emoji) {
    const id = this.resolveId(emoji);
    if (!id) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'emoji', 'EmojiResolvable', true);

    const data = await this.client.rest.get(Routes.applicationEmoji(this.application.id, id));

    return this._add(data).author;
  }
}

module.exports = ApplicationEmojiManager;
