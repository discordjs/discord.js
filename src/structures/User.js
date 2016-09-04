const TextBasedChannel = require('./interface/TextBasedChannel');
const Constants = require('../util/Constants');

/**
 * Represents a User on Discord.
 * @implements {TextBasedChannel}
 */
class User {
  constructor(client, data) {
    this.client = client;
    if (data) this.setup(data);
  }

  setup(data) {
    /**
     * The username of the User
     * @type {string}
     */
    this.username = data.username;
    /**
     * The ID of the User
     * @type {string}
     */
    this.id = data.id;
    /**
     * A discriminator based on username for the User
     * @type {string}
     */
    this.discriminator = data.discriminator;
    /**
     * The ID of the user's avatar
     * @type {string}
     */
    this.avatar = data.avatar;
    /**
     * Whether or not the User is a Bot.
     * @type {boolean}
     */
    this.bot = Boolean(data.bot);
    /**
     * The status of the user:
     *
     * * **`online`** - user is online
     * * **`offline`** - user is offline
     * * **`idle`** - user is AFK
     * @type {string}
     */
    this.status = data.status || this.status || 'offline';
    /**
     * The game that the user is playing, `null` if they aren't playing a game.
     * @type {string}
     */
    this.game = data.game || this.game;
  }

  /**
   * When concatenated with a string, this automatically concatenates the User's mention instead of the User object.
   * @returns {string}
   * @example
   * // logs: Hello from <@123456789>!
   * console.log(`Hello from ${user}!`);
   */
  toString() {
    return `<@${this.id}>`;
  }

  /**
   * A link to the user's avatar (if they have one, otherwise null)
   * @type {?string}
   * @readonly
   */
  get avatarURL() {
    if (!this.avatar) return null;
    return Constants.Endpoints.avatar(this.id, this.avatar);
  }

  /**
   * Deletes a DM Channel (if one exists) between the Client and the User. Resolves with the Channel if successful.
   * @returns {Promise<DMChannel>}
   */
  deleteDM() {
    return this.client.rest.methods.deleteChannel(this);
  }

  /**
   * Checks if the user is equal to another. It compares username, ID, discriminator, status and the game being played.
   * It is recommended to compare equality by using `user.id === user2.id` unless you want to compare all properties.
   * @param {User} user The user to compare
   * @returns {boolean}
   */
  equals(user) {
    let equal = user &&
      this.username === user.username &&
      this.id === user.id &&
      this.discriminator === user.discriminator &&
      this.avatar === user.avatar &&
      this.bot === Boolean(user.bot);

    if (equal) {
      if (user.status) equal = this.status === user.status;
      if (equal && user.game) equal = this.game === user.game;
    }

    return equal;
  }

  sendMessage() {
    return;
  }

  sendTTSMessage() {
    return;
  }

  sendFile() {
    return;
  }
}

TextBasedChannel.applyToClass(User);

module.exports = User;
