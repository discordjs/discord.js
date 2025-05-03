'use strict';

const { ChannelType, Routes } = require('discord-api-types/v10');
const { DiscordjsError, ErrorCodes } = require('../errors/index.js');
const { GuildMember } = require('../structures/GuildMember.js');
const { Message } = require('../structures/Message.js');
const { ThreadMember } = require('../structures/ThreadMember.js');
const { User } = require('../structures/User.js');
const { CachedManager } = require('./CachedManager.js');

/**
 * Manages API methods for users and stores their cache.
 *
 * @extends {CachedManager}
 */
class UserManager extends CachedManager {
  constructor(client, iterable) {
    super(client, User, iterable);
  }

  /**
   * The cache of this manager
   *
   * @type {Collection<Snowflake, User>}
   * @name UserManager#cache
   */

  /**
   * Data that resolves to give a User object. This can be:
   * - A User object
   * - A Snowflake
   * - A Message object (resolves to the message author)
   * - A GuildMember object
   * - A ThreadMember object
   *
   * @typedef {User|Snowflake|Message|GuildMember|ThreadMember} UserResolvable
   */

  /**
   * The DM between the client's user and a user
   *
   * @param {Snowflake} userId The user id
   * @returns {?DMChannel}
   * @private
   */
  dmChannel(userId) {
    return (
      this.client.channels.cache.find(channel => channel.type === ChannelType.DM && channel.recipientId === userId) ??
      null
    );
  }

  /**
   * Creates a {@link DMChannel} between the client and a user.
   *
   * @param {UserResolvable} user The UserResolvable to identify
   * @param {BaseFetchOptions} [options] Additional options for this fetch
   * @returns {Promise<DMChannel>}
   */
  async createDM(user, { cache = true, force = false } = {}) {
    const id = this.resolveId(user);

    if (!force) {
      const dmChannel = this.dmChannel(id);
      if (dmChannel && !dmChannel.partial) return dmChannel;
    }

    const data = await this.client.rest.post(Routes.userChannels(), { body: { recipient_id: id } });
    return this.client.channels._add(data, null, { cache });
  }

  /**
   * Deletes a {@link DMChannel} (if one exists) between the client and a user. Resolves with the channel if successful.
   *
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {Promise<DMChannel>}
   */
  async deleteDM(user) {
    const id = this.resolveId(user);
    const dmChannel = this.dmChannel(id);
    if (!dmChannel) throw new DiscordjsError(ErrorCodes.UserNoDMChannel);
    await this.client.rest.delete(Routes.channel(dmChannel.id));
    this.client.channels._remove(dmChannel.id);
    return dmChannel;
  }

  /**
   * Obtains a user from Discord, or the user cache if it's already available.
   *
   * @param {UserResolvable} user The user to fetch
   * @param {BaseFetchOptions} [options] Additional options for this fetch
   * @returns {Promise<User>}
   */
  async fetch(user, { cache = true, force = false } = {}) {
    const id = this.resolveId(user);
    if (!force) {
      const existing = this.cache.get(id);
      if (existing && !existing.partial) return existing;
    }

    const data = await this.client.rest.get(Routes.user(id));
    return this._add(data, cache);
  }

  /**
   * Sends a message to a user.
   *
   * @param {UserResolvable} user The UserResolvable to identify
   * @param {string|MessagePayload|MessageCreateOptions} options The options to provide
   * @returns {Promise<Message>}
   */
  async send(user, options) {
    return (await this.createDM(user)).send(options);
  }

  /**
   * Resolves a {@link UserResolvable} to a {@link User} object.
   *
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {?User}
   */
  resolve(user) {
    if (user instanceof GuildMember || user instanceof ThreadMember) return user.user;
    if (user instanceof Message) return user.author;
    return super.resolve(user);
  }

  /**
   * Resolves a {@link UserResolvable} to a {@link User} id.
   *
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {?Snowflake}
   */
  resolveId(user) {
    if (user instanceof ThreadMember) return user.id;
    if (user instanceof GuildMember) return user.user.id;
    if (user instanceof Message) return user.author.id;
    return super.resolveId(user);
  }
}

exports.UserManager = UserManager;
