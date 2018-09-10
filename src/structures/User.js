const TextBasedChannel = require('./interfaces/TextBasedChannel');
const Constants = require('../util/Constants');
const Presence = require('./Presence').Presence;
const Snowflake = require('../util/Snowflake');
const util = require('util');

/**
 * Represents a user on Discord.
 * @implements {TextBasedChannel}
 */
class User {
  constructor(client, data) {
    /**
     * The client that created the instance of the user
     * @name User#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    if (data) this.setup(data);
  }

  setup(data) {
    /**
     * The ID of the user
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The username of the user
     * @type {string}
     */
    this.username = data.username;

    /**
     * A discriminator based on username for the user
     * @type {string}
     */
    this.discriminator = data.discriminator;

    /**
     * The ID of the user's avatar
     * @type {string}
     */
    this.avatar = data.avatar;

    /**
     * Whether or not the user is a bot
     * @type {boolean}
     */
    this.bot = Boolean(data.bot);

    /**
     * The ID of the last message sent by the user, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageID = null;

    /**
     * The Message object of the last message sent by the user, if one was sent
     * @type {?Message}
     */
    this.lastMessage = null;
  }

  patch(data) {
    for (const prop of ['id', 'username', 'discriminator', 'avatar', 'bot']) {
      if (typeof data[prop] !== 'undefined') this[prop] = data[prop];
    }
    if (data.token) this.client.token = data.token;
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
   * The time the user was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The presence of this user
   * @type {Presence}
   * @readonly
   */
  get presence() {
    if (this.client.presences.has(this.id)) return this.client.presences.get(this.id);
    for (const guild of this.client.guilds.values()) {
      if (guild.presences.has(this.id)) return guild.presences.get(this.id);
    }
    return new Presence(undefined, this.client);
  }

  /**
   * A link to the user's avatar
   * @type {?string}
   * @readonly
   */
  get avatarURL() {
    if (!this.avatar) return null;
    return Constants.Endpoints.User(this).Avatar(this.client.options.http.cdn, this.avatar);
  }

  /**
   * A link to the user's default avatar
   * @type {string}
   * @readonly
   */
  get defaultAvatarURL() {
    const avatars = Object.keys(Constants.DefaultAvatars);
    const avatar = avatars[this.discriminator % avatars.length];
    return Constants.Endpoints.CDN(this.client.options.http.host).Asset(`${Constants.DefaultAvatars[avatar]}.png`);
  }

  /**
   * A link to the user's avatar if they have one. Otherwise a link to their default avatar will be returned
   * @type {string}
   * @readonly
   */
  get displayAvatarURL() {
    return this.avatarURL || this.defaultAvatarURL;
  }

  /**
   * The Discord "tag" (e.g. `hydrabolt#0001`) for this user
   * @type {string}
   * @readonly
   */
  get tag() {
    return `${this.username}#${this.discriminator}`;
  }

  /**
   * The note that is set for the user
   * <warn>This is only available when using a user account.</warn>
   * @type {?string}
   * @readonly
   */
  get note() {
    return this.client.user.notes.get(this.id) || null;
  }

  /**
   * Check whether the user is typing in a channel.
   * @param {ChannelResolvable} channel The channel to check in
   * @returns {boolean}
   */
  typingIn(channel) {
    channel = this.client.resolver.resolveChannel(channel);
    return channel._typing.has(this.id);
  }

  /**
   * Get the time that the user started typing.
   * @param {ChannelResolvable} channel The channel to get the time in
   * @returns {?Date}
   */
  typingSinceIn(channel) {
    channel = this.client.resolver.resolveChannel(channel);
    return channel._typing.has(this.id) ? new Date(channel._typing.get(this.id).since) : null;
  }

  /**
   * Get the amount of time the user has been typing in a channel for (in milliseconds), or -1 if they're not typing.
   * @param {ChannelResolvable} channel The channel to get the time in
   * @returns {number}
   */
  typingDurationIn(channel) {
    channel = this.client.resolver.resolveChannel(channel);
    return channel._typing.has(this.id) ? channel._typing.get(this.id).elapsedTime : -1;
  }

  /**
   * The DM between the client's user and this user
   * @type {?DMChannel}
   * @readonly
   */
  get dmChannel() {
    return this.client.channels.find(c => c.type === 'dm' && c.recipient.id === this.id);
  }

  /**
   * Creates a DM channel between the client and the user.
   * @returns {Promise<DMChannel>}
   */
  createDM() {
    return this.client.rest.methods.createDM(this);
  }

  /**
   * Deletes a DM channel (if one exists) between the client and the user. Resolves with the channel if successful.
   * @returns {Promise<DMChannel>}
   */
  deleteDM() {
    return this.client.rest.methods.deleteChannel(this);
  }

  /**
   * Sends a friend request to the user.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<User>}
   */
  addFriend() {
    return this.client.rest.methods.addFriend(this);
  }

  /**
   * Removes the user from your friends.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<User>}
   */
  removeFriend() {
    return this.client.rest.methods.removeFriend(this);
  }

  /**
   * Blocks the user.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<User>}
   */
  block() {
    return this.client.rest.methods.blockUser(this);
  }

  /**
   * Unblocks the user.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<User>}
   */
  unblock() {
    return this.client.rest.methods.unblockUser(this);
  }

  /**
   * Get the profile of the user.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<UserProfile>}
   */
  fetchProfile() {
    return this.client.rest.methods.fetchUserProfile(this);
  }

  /**
   * Sets a note for the user.
   * <warn>This is only available when using a user account.</warn>
   * @param {string} note The note to set for the user
   * @returns {Promise<User>}
   */
  setNote(note) {
    return this.client.rest.methods.setNote(this, note);
  }

  /**
   * Checks if the user is equal to another. It compares ID, username, discriminator, avatar, and bot flags.
   * It is recommended to compare equality by using `user.id === user2.id` unless you want to compare all properties.
   * @param {User} user User to compare with
   * @returns {boolean}
   */
  equals(user) {
    let equal = user &&
      this.id === user.id &&
      this.username === user.username &&
      this.discriminator === user.discriminator &&
      this.avatar === user.avatar &&
      this.bot === Boolean(user.bot);

    return equal;
  }

  /**
   * When concatenated with a string, this automatically concatenates the user's mention instead of the User object.
   * @returns {string}
   * @example
   * // logs: Hello from <@123456789>!
   * console.log(`Hello from ${user}!`);
   */
  toString() {
    return `<@${this.id}>`;
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
  sendMessage() {}
  sendEmbed() {}
  sendFile() {}
  sendCode() {}
}

TextBasedChannel.applyToClass(User);

User.prototype.block =
  util.deprecate(User.prototype.block, 'User#block: userbot methods will be removed');

User.prototype.unblock =
  util.deprecate(User.prototype.unblock, 'User#unblock: userbot methods will be removed');

User.prototype.addFriend =
  util.deprecate(User.prototype.addFriend, 'User#addFriend: userbot methods will be removed');

User.prototype.removeFriend =
  util.deprecate(User.prototype.removeFriend, 'User#removeFriend: userbot methods will be removed');

User.prototype.setNote =
  util.deprecate(User.prototype.setNote, 'User#setNote, userbot methods will be removed');

User.prototype.fetchProfile =
  util.deprecate(User.prototype.fetchProfile, 'User#fetchProfile: userbot methods will be removed');

module.exports = User;
