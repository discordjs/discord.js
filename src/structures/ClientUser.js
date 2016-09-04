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
     * @type {boolean}
     */
    this.verified = data.verified;
    /**
     * The email of this account
     * @type {string}
     */
    this.email = data.email;

    this._typing = new Map();
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
   *  .catch(console.log);
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
   *  .catch(console.log);
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
   * client.user.setPassword('password')
   *  .then(user => console.log('New password set!'))
   *  .catch(console.log);
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
   *  .catch(console.log);
   */
  setAvatar(avatar) {
    return this.client.rest.methods.updateCurrentUser({ avatar });
  }

  /**
   * Set the status and playing game of the logged in client.
   * @param {string} [status] The status, can be `online` or `idle`
   * @param {string|Object} [game] The game that is being played
   * @returns {Promise<ClientUser>}
   * @example
   * // set status
   * client.user.setStatus('status', 'game')
   *  .then(user => console.log('Changed status!'))
   *  .catch(console.log);
   */
  setStatus(status, game) {
    return new Promise(resolve => {
      if (status === 'online' || status === 'here' || status === 'available') {
        this.idleStatus = null;
      } else if (status === 'idle' || status === 'away') {
        this.idleStatus = Date.now();
      } else {
        this.idleStatus = this.idleStatus || null;
      }

      if (typeof game === 'string' && !game.length) game = null;

      if (game === null) {
        this.userGame = null;
      } else if (!game) {
        this.userGame = this.userGame || null;
      } else if (typeof game === 'string') {
        this.userGame = { name: game };
      } else {
        this.userGame = game;
      }

      this.client.ws.send({
        op: 3,
        d: {
          idle_since: this.idleStatus,
          game: this.userGame,
        },
      });

      this.status = this.idleStatus ? 'idle' : 'online';
      this.game = this.userGame;
      resolve(this);
    });
  }

  edit(data) {
    return this.client.rest.methods.updateCurrentUser(data);
  }
}

module.exports = ClientUser;
