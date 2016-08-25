const TextBasedChannel = require('./interface/TextBasedChannel');

/**
 * Represents a User on Discord.
 * @implements {TextBasedChannel}
 */
class User {
  constructor(client, data) {
    this.client = client;
    if (data) {
      this.setup(data);
    }
  }

  setup(data) {
    /**
     * The username of the User
     * @type {String}
     */
    this.username = data.username;
    /**
     * The ID of the User
     * @type {String}
     */
    this.id = data.id;
    /**
     * A discriminator based on username for the User
     * @type {String}
     */
    this.discriminator = data.discriminator;
    /**
     * The ID of the user's avatar
     * @type {String}
     */
    this.avatar = data.avatar;
    /**
     * Whether or not the User is a Bot.
     * @type {Boolean}
     */
    this.bot = Boolean(data.bot);
    /**
     * The status of the user:
     *
     * * **`online`** - user is online
     * * **`offline`** - user is offline
     * * **`idle`** - user is AFK
     * @type {String}
     */
    this.status = data.status || this.status || 'offline';
    /**
     * The game that the user is playing, `null` if they aren't playing a game.
     * @type {String}
     */
    this.game = data.game || this.game;
  }

  /**
   * When concatenated with a String, this automatically concatenates the User's mention instead of the User object.
   * @returns {String}
   * @example
   * // logs: Hello from <@123456789>!
   * console.log(`Hello from ${user}!`);
   */
  toString() {
    return `<@${this.id}>`;
  }

  /**
   * Deletes a DM Channel (if one exists) between the Client and the User. Resolves with the Channel if successful.
   * @return {Promise<DMChannel>}
   */
  deleteDM() {
    return this.client.rest.methods.deleteChannel(this);
  }

  /**
   * Checks if the user is equal to another. It compares username, ID, discriminator, status and the game being played.
   * It is recommended to compare equality by using `user.id === user2.id` unless you want to compare all properties.
   * @param {User} user the user to compare
   * @returns {Boolean}
   */
  equals(user) {
    let base = (
      user &&
      this.username === user.username &&
      this.id === user.id &&
      this.discriminator === user.discriminator &&
      this.avatar === user.avatar &&
      this.bot === Boolean(user.bot)
    );

    if (base) {
      if (user.status) {
        base = this.status === user.status;
      }

      if (user.game) {
        base = this.game === user.game;
      }
    }

    return base;
  }

  sendMessage() {
    return;
  }

  sendTTSMessage() {
    return;
  }
}

TextBasedChannel.applyToClass(User);

module.exports = User;
