'use strict';

const { Collection } = require('@discordjs/collection');
const BaseGuildEmojiManager = require('./BaseGuildEmojiManager');
const { TypeError } = require('../errors');
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
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] The roles to limit the emoji to
   * @property {string} [reason] The reason for creating the emoji
   */

  /**
   * Creates a new custom emoji in the guild.
   * @param {BufferResolvable|Base64Resolvable} attachment The image for the emoji
   * @param {string} name The name for the emoji
   * @param {GuildEmojiCreateOptions} [options] Options for creating the emoji
   * @returns {Promise<Emoji>} The created emoji
   * @example
   * // Create a new emoji from a URL
   * guild.emojis.create('https://i.imgur.com/w3duR07.png', 'rip')
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   * @example
   * // Create a new emoji from a file on your computer
   * guild.emojis.create('./memes/banana.png', 'banana')
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   */
  async create(attachment, name, { roles, reason } = {}) {
    attachment = await DataResolver.resolveImage(attachment);
    if (!attachment) throw new TypeError('REQ_RESOURCE_TYPE');

    const data = { image: attachment, name };
    if (roles) {
      if (!Array.isArray(roles) && !(roles instanceof Collection)) {
        throw new TypeError('INVALID_TYPE', 'options.roles', 'Array or Collection of Roles or Snowflakes', true);
      }
      data.roles = [];
      for (const role of roles.values()) {
        const resolvedRole = this.guild.roles.resolveId(role);
        if (!resolvedRole) throw new TypeError('INVALID_ELEMENT', 'Array or Collection', 'options.roles', role);
        data.roles.push(resolvedRole);
      }
    }

    const emoji = await this.client.api.guilds(this.guild.id).emojis.post({ data, reason });
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
      const emoji = await this.client.api.guilds(this.guild.id).emojis(id).get();
      return this._add(emoji, cache);
    }

    const data = await this.client.api.guilds(this.guild.id).emojis.get();
    const emojis = new Collection();
    for (const emoji of data) emojis.set(emoji.id, this._add(emoji, cache));
    return emojis;
  }
}

module.exports = GuildEmojiManager;
