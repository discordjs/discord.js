'use strict';
const { Collection } = require('@discordjs/collection');
const { Routes, PermissionFlagsBits } = require('discord-api-types/v10');
const { CachedManager } = require('./CachedManager.js');
const { DiscordjsError, DiscordjsTypeError, ErrorCodes } = require('../errors/index.js');
const { ApplicationEmoji } = require('../structures/ApplicationEmoji.js');
const { GuildEmoji } = require('../structures/GuildEmoji.js');
const { ReactionEmoji } = require('../structures/ReactionEmoji.js');
const { resolveImage } = require('../util/DataResolver.js');
const { parseEmoji } = require('../util/Util.js');

/**
 * Manages API methods for GuildEmojis and stores their cache.
 * @extends {CachedManager}
 */
class GuildEmojiManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, GuildEmoji, iterable);

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
   * The cache of GuildEmojis
   * @type {Collection<Snowflake, GuildEmoji>}
   * @name GuildEmojiManager#cache
   */

  /**
   * Data that can be resolved into a GuildEmoji object. This can be:
   * * A Snowflake
   * * A GuildEmoji object
   * * A ReactionEmoji object
   * * An ApplicationEmoji object
   * @typedef {Snowflake|GuildEmoji|ReactionEmoji|ApplicationEmoji} EmojiResolvable
   */

  /**
   * Resolves an EmojiResolvable to an Emoji object.
   * @param {EmojiResolvable} emoji The Emoji resolvable to identify
   * @returns {?GuildEmoji}
   */
  resolve(emoji) {
    if (emoji instanceof ReactionEmoji) return super.cache.get(emoji.id) ?? null;
    if (emoji instanceof ApplicationEmoji) return super.cache.get(emoji.id) ?? null;
    return super.resolve(emoji);
  }

  /**
   * Resolves an EmojiResolvable to an Emoji id string.
   * @param {EmojiResolvable} emoji The Emoji resolvable to identify
   * @returns {?Snowflake}
   */
  resolveId(emoji) {
    if (emoji instanceof ReactionEmoji) return emoji.id;
    if (emoji instanceof ApplicationEmoji) return emoji.id;
    return super.resolveId(emoji);
  }

  /**
   * Data that can be resolved to give an emoji identifier. This can be:
   * * An EmojiResolvable
   * * The `<a:name:id>`, `<:name:id>`, `a:name:id` or `name:id` emoji identifier string of an emoji
   * * The Unicode representation of an emoji
   * @typedef {string|EmojiResolvable} EmojiIdentifierResolvable
   */

  /**
   * Resolves an EmojiResolvable to an emoji identifier.
   * @param {EmojiIdentifierResolvable} emoji The emoji resolvable to resolve
   * @returns {?string}
   */
  resolveIdentifier(emoji) {
    const emojiResolvable = this.resolve(emoji);
    if (emojiResolvable) return emojiResolvable.identifier;
    if (emoji instanceof ReactionEmoji) return emoji.identifier;
    if (emoji instanceof ApplicationEmoji) return emoji.identifier;
    if (typeof emoji === 'string') {
      const res = parseEmoji(emoji);
      let identifier = emoji;
      if (res?.name.length) {
        identifier = `${res.animated ? 'a:' : ''}${res.name}${res.id ? `:${res.id}` : ''}`;
      }
      if (!identifier.includes('%')) return encodeURIComponent(identifier);
      return identifier;
    }
    return null;
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
    const image = await resolveImage(attachment);
    if (!image) throw new DiscordjsTypeError(ErrorCodes.ReqResourceType);

    const body = { image, name };
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
    const roles = options.roles?.map(role => this.guild.roles.resolveId(role));
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
    const resolvedEmoji = this.resolve(emoji);
    if (!resolvedEmoji) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'emoji', 'EmojiResolvable', true);
    if (resolvedEmoji.managed) {
      throw new DiscordjsError(ErrorCodes.EmojiManaged);
    }

    const { me } = this.guild.members;
    if (!me) throw new DiscordjsError(ErrorCodes.GuildUncachedMe);
    if (!me.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) {
      throw new DiscordjsError(ErrorCodes.MissingManageGuildExpressionsPermission, this.guild);
    }

    const data = await this.client.rest.get(Routes.guildEmoji(this.guild.id, resolvedEmoji.id));
    resolvedEmoji._patch(data);
    return resolvedEmoji.author;
  }
}

exports.GuildEmojiManager = GuildEmojiManager;
