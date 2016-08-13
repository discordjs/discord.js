const TextBasedChannel = require('./interface/TextBasedChannel');

/**
 * Represents a User on Discord.
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
    this.game = data.game || this.game;
  }

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

  equals(user) {
    let base = (
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
}

TextBasedChannel.applyToClass(User);

module.exports = User;
