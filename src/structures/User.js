'use strict';

const Base = require('./Base');
const { Presence } = require('./Presence');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const { Error } = require('../errors');
const Snowflake = require('../util/Snowflake');
const UserFlags = require('../util/UserFlags');

/**
 * Represents a user on Discord.
 * @implements {TextBasedChannel}
 * @extends {Base}
 */
class User extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the user
   */
  constructor(client, data) {
    super(client);

    /**
     * The ID of the user
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * Whether or not the user is a bot
     * @type {boolean}
     * @name User#bot
     */
    this.bot = Boolean(data.bot);

    this._patch(data);
  }

  _patch(data) {
    /**
     * The username of the user
     * @type {?string}
     * @name User#username
     */
    if (data.username) this.username = data.username;

    /**
     * A discriminator based on username for the user
     * @type {?string}
     * @name User#discriminator
     */
    if (data.discriminator) this.discriminator = data.discriminator;

    /**
     * The ID of the user's avatar
     * @type {?string}
     * @name User#avatar
     */
    if (typeof data.avatar !== 'undefined') this.avatar = data.avatar;

    if (typeof data.bot !== 'undefined') this.bot = Boolean(data.bot);

    /**
     * Whether the user is an Official Discord System user (part of the urgent message system)
     * @type {?boolean}
     * @name User#system
     */
    if (typeof data.system !== 'undefined') this.system = Boolean(data.system);

    /**
     * The locale of the user's client (ISO 639-1)
     * @type {?string}
     * @name User#locale
     */
    if (data.locale) this.locale = data.locale;

    /**
     * The flags for this user
     * @type {?UserFlags}
     */
    if (typeof data.public_flags !== 'undefined') this.flags = new UserFlags(data.public_flags);

    /**
     * The ID of the last message sent by the user, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageID = null;

    /**
     * The ID of the channel for the last message sent by the user, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageChannelID = null;
  }

  /**
   * Whether this User is a partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return typeof this.username !== 'string';
  }

  /**
   * The timestamp the user was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the user was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The Message object of the last message sent by the user, if one was sent
   * @type {?Message}
   * @readonly
   */
  get lastMessage() {
    const channel = this.client.channels.cache.get(this.lastMessageChannelID);
    return (channel && channel.messages.cache.get(this.lastMessageID)) || null;
  }

  /**
   * The presence of this user
   * @type {Presence}
   * @readonly
   */
  get presence() {
    for (const guild of this.client.guilds.cache.values()) {
      if (guild.presences.cache.has(this.id)) return guild.presences.cache.get(this.id);
    }
    return new Presence(this.client, { user: { id: this.id } });
  }

  /**
   * A link to the user's avatar.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  avatarURL({ format, size, dynamic } = {}) {
    if (!this.avatar) return null;
    return this.client.rest.cdn.Avatar(this.id, this.avatar, format, size, dynamic);
  }

  /**
   * A link to the user's default avatar
   * @type {string}
   * @readonly
   */
  get defaultAvatarURL() {
    return this.client.rest.cdn.DefaultAvatar(this.discriminator % 5);
  }

  /**
   * A link to the user's avatar if they have one.
   * Otherwise a link to their default avatar will be returned.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {string}
   */
  displayAvatarURL(options) {
    return this.avatarURL(options) || this.defaultAvatarURL;
  }

  /**
   * The Discord "tag" (e.g. `hydrabolt#0001`) for this user
   * @type {?string}
   * @readonly
   */
  get tag() {
    return typeof this.username === 'string' ? `${this.username}#${this.discriminator}` : null;
  }

  /**
   * Checks whether the user is typing in a channel.
   * @param {ChannelResolvable} channel The channel to check in
   * @returns {boolean}
   */
  typingIn(channel) {
    channel = this.client.channels.resolve(channel);
    return channel._typing.has(this.id);
  }

  /**
   * Gets the time that the user started typing.
   * @param {ChannelResolvable} channel The channel to get the time in
   * @returns {?Date}
   */
  typingSinceIn(channel) {
    channel = this.client.channels.resolve(channel);
    return channel._typing.has(this.id) ? new Date(channel._typing.get(this.id).since) : null;
  }

  /**
   * Gets the amount of time the user has been typing in a channel for (in milliseconds), or -1 if they're not typing.
   * @param {ChannelResolvable} channel The channel to get the time in
   * @returns {number}
   */
  typingDurationIn(channel) {
    channel = this.client.channels.resolve(channel);
    return channel._typing.has(this.id) ? channel._typing.get(this.id).elapsedTime : -1;
  }

  /**
   * The DM between the client's user and this user
   * @type {?DMChannel}
   * @readonly
   */
  get dmChannel() {
    return this.client.channels.cache.find(c => c.type === 'dm' && c.recipient.id === this.id) || null;
  }

  /**
   * Creates a DM channel between the client and the user.
   * @returns {Promise<DMChannel>}
   */
  async createDM() {
    const { dmChannel } = this;
    if (dmChannel && !dmChannel.partial) return dmChannel;
    const data = await this.client.api.users(this.client.user.id).channels.post({
      data: {
        recipient_id: this.id,
      },
    });
    return this.client.actions.ChannelCreate.handle(data).channel;
  }

  /**
   * Deletes a DM channel (if one exists) between the client and the user. Resolves with the channel if successful.
   * @returns {Promise<DMChannel>}
   */
  async deleteDM() {
    const { dmChannel } = this;
    if (!dmChannel) throw new Error('USER_NO_DMCHANNEL');
    const data = await this.client.api.channels(dmChannel.id).delete();
    return this.client.actions.ChannelDelete.handle(data).channel;
  }

  /**
   * Checks if the user is equal to another. It compares ID, username, discriminator, avatar, and bot flags.
   * It is recommended to compare equality by using `user.id === user2.id` unless you want to compare all properties.
   * @param {User} user User to compare with
   * @returns {boolean}
   */
  equals(user) {
    let equal =
      user &&
      this.id === user.id &&
      this.username === user.username &&
      this.discriminator === user.discriminator &&
      this.avatar === user.avatar;

    return equal;
  }

  /**
   * Fetches this user's flags.
   * @returns {Promise<UserFlags>}
   */
  async fetchFlags() {
    if (this.flags) return this.flags;
    const data = await this.client.api.users(this.id).get();
    this._patch(data);
    return this.flags;
  }

  /**
   * Fetches this user.
   * @returns {Promise<User>}
   */
  fetch() {
    return this.client.users.fetch(this.id, true);
  }

  /**
   * When concatenated with a string, this automatically returns the user's mention instead of the User object.
   * @returns {string}
   * @example
   * // Logs: Hello from <@123456789012345678>!
   * console.log(`Hello from ${user}!`);
   */
  toString() {
    return `<@${this.id}>`;
  }

  toJSON(...props) {
    const json = super.toJSON(
      {
        createdTimestamp: true,
        defaultAvatarURL: true,
        tag: true,
        lastMessage: false,
        lastMessageID: false,
      },
      ...props,
    );
    json.avatarURL = this.avatarURL();
    json.displayAvatarURL = this.displayAvatarURL();
    return json;
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
}

TextBasedChannel.applyToClass(User);

module.exports = User;
