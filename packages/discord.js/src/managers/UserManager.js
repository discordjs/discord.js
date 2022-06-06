'use strict';

const { ChannelType, Routes } = require('discord-api-types/v10');
const BaseManager = require('./BaseManager');
const { GuildMember } = require('../structures/GuildMember');
const { Message } = require('../structures/Message');
const ThreadMember = require('../structures/ThreadMember');
const User = require('../structures/User');

/**
 * Manages API methods for users and stores their cache.
 * @extends {CachedManager}
 */
class UserManager extends BaseManager {
  constructor(client) {
    super(client);

    /**
     * User that the client is logged in as
     * @type {?ClientUser}
     */
    this.me = null;
  }
  /**
   * Data that resolves to give a User object. This can be:
   * * A User object
   * * A Snowflake
   * * A Message object (resolves to the message author)
   * * A GuildMember object
   * * A ThreadMember object
   * @typedef {User|Snowflake|Message|GuildMember|ThreadMember} UserResolvable
   */

  /**
   * The DM between the client's user and a user
   * @param {Snowflake} userId The user id
   * @returns {?DMChannel}
   * @private
   */
  dmChannel(userId) {
    return this.client.channels.cache.find(c => c.type === ChannelType.DM && c.recipientId === userId) ?? null;
  }

  /**
   * Creates a {@link DMChannel} between the client and a user.
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
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {Promise<DMChannel>}
   */
  async deleteDM(user) {
    const id = this.resolveId(user);
    const dmChannel = this.dmChannel(id);
    if (!dmChannel) throw new Error('USER_NO_DM_CHANNEL');
    await this.client.rest.delete(Routes.channel(dmChannel.id));
    this.client.channels._remove(dmChannel.id);
    return dmChannel;
  }

  /**
   * Obtains a user from Discord, or the user cache if it's already available.
   * @param {UserResolvable} user The user to fetch
   * @returns {Promise<User>}
   */
  async fetch(user) {
    const id = this.resolveId(user);
    const data = await this.client.rest.get(Routes.user(id));
    if (user instanceof User) return user._patch(data);
    return new User(data);
  }

  /**
   * Fetches a user's flags.
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {Promise<UserFlagsBitField>}
   */
  async fetchFlags(user) {
    return (await this.fetch(user)).flags;
  }

  /**
   * Sends a message to a user.
   * @param {UserResolvable} user The UserResolvable to identify
   * @param {string|MessagePayload|MessageOptions} options The options to provide
   * @returns {Promise<Message>}
   */
  async send(user, options) {
    return (await this.createDM(user)).send(options);
  }

  /**
   * Resolves a {@link UserResolvable} to a {@link User} object.
   * @param {UserResolvable} user The UserResolvable to identify
   * @param {GuildResolvable} [guild] The guild to search members for to find a user object
   * @returns {?User}
   */
  resolve(user, guild) {
    if (user instanceof GuildMember || user instanceof ThreadMember) return user.user;
    if (user instanceof Message) return user.author;
    if (user instanceof User) return User;
    if (typeof user === 'string') return this.client.guilds.resolve(guild)?.members.cache.get(user)?.user ?? null;
    return null;
  }

  /**
   * Resolves a {@link UserResolvable} to a {@link User} id.
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {?Snowflake}
   */
  resolveId(user) {
    if (user instanceof ThreadMember) return user.id;
    if (user instanceof GuildMember) return user.user.id;
    if (user instanceof Message) return user.author.id;
    if (user instanceof User) return user.id;
    if (typeof user === 'string') return user;
    return null;
  }

  /**
   * Attempts to get a cached user from the appropriate guild and updates it
   * OR creates a new user and returns that instance if there is no cached user
   * @param {APIUser} data Raw data from discord used to update or create the user
   * @param {BaseGuild|null} guild The guild to search for an existing cached user,
   * accepts null for better support with uncached guilds
   * @private
   * @returns {User}
   */
  _obtain(data, guild) {
    return guild?.members?.cache.get(data.id)?._patch(data) ?? new User(this.client, data);
  }
}

module.exports = UserManager;
