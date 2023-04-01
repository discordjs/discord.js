'use strict';

const { Collection } = require('@discordjs/collection');
const { Routes, PermissionFlagsBits } = require('discord-api-types/v10');
const BaseGuildEmojiManager = require('./BaseGuildEmojiManager');
const { DiscordjsError, DiscordjsTypeError, ErrorCodes } = require('../errors');
const DataResolver = require('../util/DataResolver');

/**
 * Manages API methods for GuildEmojis and stores their cache.
 * @extends {BaseGuildEmojiManager}
 */
class GuildEmojiManager extends BaseGuildEmojiManager {
  constructor(guild, iterable) {
    super(guild.client, iterable);

    /**
     * The guild this manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  _add(data, cache) {
    return super._add(data, cache, { extras: [this.guild] });
  }

  /**
   * Options used for creating an emoji in a guild.
   * @typedef {Object} GuildEmojiCreateOptions
   * @property {BufferResolvable|Base64Resolvable} attachment The image for the emoji
   * @property {string} name The name for the emoji
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] The roles to limit the emoji to
   * @property {string} [reason] The reason for creating the emoji
   */

  /**
   * Creates a new custom emoji in the guild.
   * @param {GuildEmojiCreateOptions} options Options for creating the emoji
   * @returns {Promise<Emoji>} The created emoji
   * @example
   * // Create a new emoji from a URL
   * guild.emojis.create({ attachment: 'https://i.imgur.com/w3duR07.png', name: 'rip' })
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   * @example
   * // Create a new emoji from a file on your computer
   * guild.emojis.create({ attachment: './memes/banana.png', name: 'banana' })
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   */
  async create({ attachment, name, roles, reason }) {
    attachment = await DataResolver.resolveImage(attachment);
    if (!attachment) throw new DiscordjsTypeError(ErrorCodes.ReqResourceType);

    const body = { image: attachment, name };
    if (roles) {
      if (!Array.isArray(roles) && !(roles instanceof Collection)) {
        throw new DiscordjsTypeError(
          ErrorCodes.InvalidType,
          'options.roles',
          'Array or Collection of Roles or Snowflakes',
          true,
        );
      }
      body.roles = [];
      for (const role of roles.values()) {
        const resolvedRole = this.guild.roles.resolveId(role);
        if (!resolvedRole) {
          throw new DiscordjsTypeError(ErrorCodes.InvalidElement, 'Array or Collection', 'options.roles', role);
        }
        body.roles.push(resolvedRole);
      }
    }

    const emoji = await this.client.rest.post(Routes.guildEmojis(this.guild.id), { body, reason });
    return this.client.actions.GuildEmojiCreate.handle(this.guild, emoji).emoji;
  }

  /**
   * Obtains one or more emojis from Discord, or the emoji cache if they're already available.
   * @param {Snowflake} [id] The emoji's id
   * @param {BaseFetchOptions} [options] Additional options for this fetch
   * @returns {Promise<GuildEmoji|Collection<Snowflake, GuildEmoji>>}
   * @example
   * // Fetch all emojis from the guild
   * message.guild.emojis.fetch()
   *   .then(emojis => console.log(`There are ${emojis.size} emojis.`))
   *   .catch(console.error);
   * @example
   * // Fetch a single emoji
   * message.guild.emojis.fetch('222078108977594368')
   *   .then(emoji => console.log(`The emoji name is: ${emoji.name}`))
   *   .catch(console.error);
   */
  async fetch(id, { cache = true, force = false } = {}) {
    if (id) {
      if (!force) {
        const existing = this.cache.get(id);
        if (existing) return existing;
      }
      const emoji = await this.client.rest.get(Routes.guildEmoji(this.guild.id, id));
      return this._add(emoji, cache);
    }

    const data = await this.client.rest.get(Routes.guildEmojis(this.guild.id));
    const emojis = new Collection();
    for (const emoji of data) emojis.set(emoji.id, this._add(emoji, cache));
    return emojis;
  }

  /**
   * Deletes an emoji.
   * @param {EmojiResolvable} emoji The Emoji resolvable to delete
   * @param {string} [reason] Reason for deleting the emoji
   * @returns {Promise<void>}
   */
  async delete(emoji, reason) {
    const id = this.resolveId(emoji);
    if (!id) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'emoji', 'EmojiResolvable', true);
    await this.client.rest.delete(Routes.guildEmoji(this.guild.id, id), { reason });
  }

  /**
   * Edits an emoji.
   * @param {EmojiResolvable} emoji The Emoji resolvable to edit
   * @param {GuildEmojiEditOptions} options The options to provide
   * @returns {Promise<GuildEmoji>}
   */
  async edit(emoji, options) {
    const id = this.resolveId(emoji);
    if (!id) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'emoji', 'EmojiResolvable', true);
    const roles = options.roles?.map(r => this.guild.roles.resolveId(r));
    const newData = await this.client.rest.patch(Routes.guildEmoji(this.guild.id, id), {
      body: {
        name: options.name,
        roles,
      },
      reason: options.reason,
    });
    const existing = this.cache.get(id);
    if (existing) {
      const clone = existing._clone();
      clone._patch(newData);
      return clone;
    }
    return this._add(newData);
  }

  /**
   * Fetches the author for this emoji
   * @param {EmojiResolvable} emoji The emoji to fetch the author of
   * @returns {Promise<User>}
   */
  async fetchAuthor(emoji) {
    emoji = this.resolve(emoji);
    if (!emoji) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'emoji', 'EmojiResolvable', true);
    if (emoji.managed) {
      throw new DiscordjsError(ErrorCodes.EmojiManaged);
    }

    const { me } = this.guild.members;
    if (!me) throw new DiscordjsError(ErrorCodes.GuildUncachedMe);
    if (!me.permissions.has(PermissionFlagsBits.ManageEmojisAndStickers)) {
      throw new DiscordjsError(ErrorCodes.MissingManageEmojisAndStickersPermission, this.guild);
    }

    const data = await this.client.rest.get(Routes.guildEmoji(this.guild.id, emoji.id));
    emoji._patch(data);
    return emoji.author;
  }
}

module.exports = GuildEmojiManager;
