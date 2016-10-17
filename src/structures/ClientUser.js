const User = require('./User');
const Collection = require('../util/Collection');

/**
 * Represents the logged in client's Discord User
 * @extends {User}
 */
class ClientUser extends User {
  setup(data) {
    super.setup(data);

    /**
     * Whether or not this account has been verified
     * @type {boolean}
     */
    this.verified = data.verified;

    /**
     * The email of this account
     * @type {string}
     */
    this.email = data.email;
    this.localPresence = {};
    this._typing = new Map();

    /**
     * A Collection of friends for the logged in user.
     * <warn>This is only filled for user accounts, not bot accounts!</warn>
     * @type {Collection<string, User>}
     */
    this.friends = new Collection();
  }

  edit(data) {
    return this.client.rest.methods.updateCurrentUser(data);
  }

  /**
   * Set the username of the logged in Client.
   * <info>Changing usernames in Discord is heavily rate limited, with only 2 requests
   * every hour. Use this sparingly!</info>
   * @param {string} username The new username
   * @returns {Promise<ClientUser>}
   * @example
   * // set username
   * client.user.setUsername('discordjs')
   *  .then(user => console.log(`My new username is ${user.username}`))
   *  .catch(console.error);
   */
  setUsername(username) {
    return this.client.rest.methods.updateCurrentUser({ username });
  }

  /**
   * If this user is a "self bot" or logged in using a normal user's details (which should be avoided), you can set the
   * email here.
   * @param {string} email The new email
   * @returns {Promise<ClientUser>}
   * @example
   * // set email
   * client.user.setEmail('bob@gmail.com')
   *  .then(user => console.log(`My new email is ${user.email}`))
   *  .catch(console.error);
   */
  setEmail(email) {
    return this.client.rest.methods.updateCurrentUser({ email });
  }

  /**
   * If this user is a "self bot" or logged in using a normal user's details (which should be avoided), you can set the
   * password here.
   * @param {string} password The new password
   * @returns {Promise<ClientUser>}
   * @example
   * // set password
   * client.user.setPassword('password123')
   *  .then(user => console.log('New password set!'))
   *  .catch(console.error);
   */
  setPassword(password) {
    return this.client.rest.methods.updateCurrentUser({ password });
  }

  /**
   * Set the avatar of the logged in Client.
   * @param {Base64Resolvable} avatar The new avatar
   * @returns {Promise<ClientUser>}
   * @example
   * // set avatar
   * client.user.setAvatar(fs.readFileSync('./avatar.png'))
   *  .then(user => console.log(`New avatar set!`))
   *  .catch(console.error);
   */
  setAvatar(avatar) {
    return this.client.rest.methods.updateCurrentUser({ avatar });
  }

  /**
   * Set the status of the logged in user.
   * @param {string} status can be `online`, `idle`, `invisible` or `dnd` (do not disturb)
   * @returns {Promise<ClientUser>}
   */
  setStatus(status) {
    return this.setPresence({ status });
  }

  /**
   * Set the current game of the logged in user.
   * @param {string} game the game being played
   * @param {string} [streamingURL] an optional URL to a twitch stream, if one is available.
   * @returns {Promise<ClientUser>}
   */
  setGame(game, streamingURL) {
    return this.setPresence({ game: {
      name: game,
      url: streamingURL,
    } });
  }

  /**
   * Set/remove the AFK flag for the current user.
   * @param {boolean} afk whether or not the user is AFK.
   * @returns {Promise<ClientUser>}
   */
  setAFK(afk) {
    return this.setPresence({ afk });
  }

  /**
   * Send a friend request
   * <warn>This is only available for user accounts, not bot accounts!</warn>
   * @param {string|User} userOrID The user to send the friend request to.
   * @returns {Promise<User>} user The user the friend request was sent to.
   */
  addFriend(userOrID) {
    userOrID = this.client.resolver.resolveUser(userOrID);
    return this.client.rest.methods.addFriend(userOrID);
  }

  /**
   * Remove a friend
   * <warn>This is only available for user accounts, not bot accounts!</warn>
   * @param {string|User} userOrID The user to remove from your friends
   * @returns {Promise<User>} user The user that was removed
   */
  removeFriend(userOrID) {
    userOrID = this.client.resolver.resolveUser(userOrID);
    return this.client.rest.methods.removeFriend(userOrID);
  }

  /**
   * Set the full presence of the current user.
   * @param {Object} data the data to provide
   * @returns {Promise<ClientUser>}
   */
  setPresence(data) {
    // {"op":3,"d":{"status":"dnd","since":0,"game":null,"afk":false}}
    return new Promise(resolve => {
      let status = this.localPresence.status || this.presence.status;
      let game = this.localPresence.game;
      let afk = this.localPresence.afk || this.presence.afk;

      if (!game && this.presence.game) {
        game = {
          name: this.presence.game.name,
          type: this.presence.game.type,
          url: this.presence.game.url,
        };
      }

      if (data.status) {
        if (typeof data.status !== 'string') throw new TypeError('Status must be a string');
        status = data.status;
      }

      if (data.game) {
        game = data.game;
        if (game.url) game.type = 1;
      }

      if (typeof data.afk !== 'undefined') afk = data.afk;
      afk = Boolean(afk);

      this.localPresence = { status, game, afk };
      this.localPresence.since = 0;

      this.client.ws.send({
        op: 3,
        d: this.localPresence,
      });

      this.client._setPresence(this.id, this.localPresence);

      resolve(this);
    });
  }
}

module.exports = ClientUser;
