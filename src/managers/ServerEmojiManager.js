'use strict';

const BaseServerEmojiManager = require('./BaseServerEmojiManager');
const { TypeError } = require('../errors');
const Collection = require('../util/Collection');
const DataResolver = require('../util/DataResolver');

/**
 * Manages API methods for ServerEmojis and stores their cache.
 * @extends {BaseServerEmojiManager}
 */
class ServerEmojiManager extends BaseServerEmojiManager {
  constructor(server, iterable) {
    super(server.client, iterable);

    /**
     * The server this manager belongs to
     * @type {Server}
     */
    this.server = server;
  }

  add(data, cache) {
    return super.add(data, cache, { extras: [this.server] });
  }

  /**
   * Creates a new custom emoji in the server.
   * @param {BufferResolvable|Base64Resolvable} attachment The image for the emoji
   * @param {string} name The name for the emoji
   * @param {Object} [options] Options
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} [options.roles] Roles to limit the emoji to
   * @param {string} [options.reason] Reason for creating the emoji
   * @returns {Promise<Emoji>} The created emoji
   * @example
   * // Create a new emoji from a url
   * server.emojis.create('https://i.imgur.com/w3duR07.png', 'rip')
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   * @example
   * // Create a new emoji from a file on your computer
   * server.emojis.create('./memes/banana.png', 'banana')
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   */
  async create(attachment, name, { roles, reason } = {}) {
    attachment = await DataResolver.resolveImage(attachment);
    if (!attachment) throw new TypeError('REQ_RESOURCE_TYPE');

    const data = { image: attachment, name };
    if (roles) {
      data.roles = [];
      for (let role of roles instanceof Collection ? roles.values() : roles) {
        role = this.server.roles.resolve(role);
        if (!role) {
          return Promise.reject(
            new TypeError('INVALID_TYPE', 'options.roles', 'Array or Collection of Roles or Snowflakes', true),
          );
        }
        data.roles.push(role.id);
      }
    }

    return this.client.api
      .servers(this.server.id)
      .emojis.post({ data, reason })
      .then(emoji => this.client.actions.ServerEmojiCreate.handle(this.server, emoji).emoji);
  }

  /**
   * Obtains one or more emojis from Discord, or the emoji cache if they're already available.
   * @param {Snowflake} [id] ID of the emoji
   * @param {boolean} [cache=true] Whether to cache the new emoji objects if it weren't already
   * @param {boolean} [force=false] Whether to skip the cache check and request the API
   * @returns {Promise<ServerEmoji|Collection<Snowflake, ServerEmoji>>}
   * @example
   * // Fetch all emojis from the server
   * message.server.emojis.fetch()
   *   .then(emojis => console.log(`There are ${emojis.size} emojis.`))
   *   .catch(console.error);
   * @example
   * // Fetch a single emoji
   * message.server.emojis.fetch('222078108977594368')
   *   .then(emoji => console.log(`The emoji name is: ${emoji.name}`))
   *   .catch(console.error);
   */
  async fetch(id, cache = true, force = false) {
    if (id) {
      if (!force) {
        const existing = this.cache.get(id);
        if (existing) return existing;
      }
      const emoji = await this.client.api.servers(this.server.id).emojis(id).get();
      return this.add(emoji, cache);
    }

    const data = await this.client.api.servers(this.server.id).emojis.get();
    const emojis = new Collection();
    for (const emoji of data) emojis.set(emoji.id, this.add(emoji, cache));
    return emojis;
  }
}

module.exports = ServerEmojiManager;
