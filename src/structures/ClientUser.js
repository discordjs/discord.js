const User = require('./User');

/**
 * Represents the logged in client's Discord User
 * @extends {User}
 */
class ClientUser extends User {
  setup(data) {
    super.setup(data);
    /**
     * Whether or not this account has been verified
     * @type {Boolean}
     */
    this.verified = data.verified;
    /**
     * The email of this account
     * @type {String}
     */
    this.email = data.email;
  }

  /**
   * Set the username of the logged in Client.
   * <info>Changing usernames in Discord is heavily rate limited, with only 2 requests
   * every hour. Use this sparingly!</info>
   * @param {String} username the new username
   * @returns {Promise<ClientUser>}
   * @example
   * // set username
   * client.user.setUsername('discordjs')
   *  .then(user => console.log(`My new username is ${user.username}`))
   *  .catch(console.log);
   */
  setUsername(username) {
    return this.client.rest.methods.updateCurrentUser({ username });
  }

  /**
   * If this user is a "self bot" or logged in using a normal user's details (which should be avoided), you can set the
   * email here.
   * @param {String} email the new email
   * @returns {Promise<ClientUser>}
   * @example
   * // set email
   * client.user.setEmail('bob@gmail.com')
   *  .then(user => console.log(`My new email is ${user.email}`))
   *  .catch(console.log);
   */
  setEmail(email) {
    return this.client.rest.methods.updateCurrentUser({ email });
  }

  /**
   * If this user is a "self bot" or logged in using a normal user's details (which should be avoided), you can set the
   * password here.
   * @param {String} password the new password
   * @returns {Promise<ClientUser>}
   * @example
   * // set password
   * client.user.setPassword('password')
   *  .then(user => console.log('New password set!'))
   *  .catch(console.log);
   */
  setPassword(password) {
    return this.client.rest.methods.updateCurrentUser({ password });
  }

  /**
   * Set the avatar of the logged in Client.
   * @param {Base64Resolvable} avatar the new avatar
   * @returns {Promise<ClientUser>}
   * @example
   * // set avatar
   * client.user.setAvatar(fs.readFileSync('./avatar.png'))
   *  .then(user => console.log(`New avatar set!`))
   *  .catch(console.log);
   */
  setAvatar(avatar) {
    return this.client.rest.methods.updateCurrentUser({ avatar });
  }

  /**
   * Set the playing status of the logged in client.
   * @param {String} status
   * @param {String} game
   * @returns {Promise<ClientUser>}
   * @example
   * // set status
   * client.user.setStatus('status', 'game')
   *  .then(user => console.log('Changed status!'))
   *  .catch(console.log);
   */
  setStatus(status, game) {
    if (status === "online" || status === "here" || status === "available") {
      this.idleStatus = null;
    } else if (status === "idle" || status === "away") {
      this.idleStatus = Date.now();
    } else {
      this.idleStatus = this.idleStatus || null;
    }

    if (typeof game === "string" && !game.length) game = null;
    this.userGame = game === null ? null : !game ? this.userGame || null : typeof game === "string" ? {name: game} : game;

    this.client.ws.send({
      op: 3,
      d: {
        idle_since: this.idleStatus,
        game: this.userGame
      }
    });

    this.status = this.idleStatus ? "idle" : "online";
    this.game = this.userGame;

    return Promise.resolve();
  }

  edit(data) {
    return this.client.rest.methods.updateCurrentUser(data);
  }
}

module.exports = ClientUser;
