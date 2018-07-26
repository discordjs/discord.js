const User = require('./User');
const Collection = require('../util/Collection');
const ClientUserSettings = require('./ClientUserSettings');
const ClientUserGuildSettings = require('./ClientUserGuildSettings');
const Constants = require('../util/Constants');
const util = require('util');

/**
 * Represents the logged in client's Discord user.
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
     * <warn>This is only filled when using a user account.</warn>
     * @type {?string}
     */
    this.email = data.email;
    this.localPresence = {};
    this._typing = new Map();

    /**
     * A Collection of friends for the logged in user
     * <warn>This is only filled when using a user account.</warn>
     * @type {Collection<Snowflake, User>}
     */
    this.friends = new Collection();

    /**
     * A Collection of blocked users for the logged in user
     * <warn>This is only filled when using a user account.</warn>
     * @type {Collection<Snowflake, User>}
     */
    this.blocked = new Collection();

    /**
     * A Collection of notes for the logged in user
     * <warn>This is only filled when using a user account.</warn>
     * @type {Collection<Snowflake, string>}
     */
    this.notes = new Collection();

    /**
     * If the user has Discord premium (nitro)
     * <warn>This is only filled when using a user account.</warn>
     * @type {?boolean}
     */
    this.premium = typeof data.premium === 'boolean' ? data.premium : null;

    /**
     * If the user has MFA enabled on their account
     * <warn>This is only filled when using a user account.</warn>
     * @type {?boolean}
     */
    this.mfaEnabled = typeof data.mfa_enabled === 'boolean' ? data.mfa_enabled : null;

    /**
     * If the user has ever used a mobile device on Discord
     * <warn>This is only filled when using a user account.</warn>
     * @type {?boolean}
     */
    this.mobile = typeof data.mobile === 'boolean' ? data.mobile : null;

    /**
     * Various settings for this user
     * <warn>This is only filled when using a user account.</warn>
     * @type {?ClientUserSettings}
     */
    this.settings = data.user_settings ? new ClientUserSettings(this, data.user_settings) : null;

    /**
     * All of the user's guild settings
     * <warn>This is only filled when using a user account</warn>
     * @type {Collection<Snowflake, ClientUserGuildSettings>}
     */
    this.guildSettings = new Collection();
    if (data.user_guild_settings) {
      for (const settings of data.user_guild_settings) {
        this.guildSettings.set(settings.guild_id, new ClientUserGuildSettings(settings, this.client));
      }
    }
  }

  edit(data) {
    return this.client.rest.methods.updateCurrentUser(data);
  }

  /**
   * Set the username of the logged in client.
   * <info>Changing usernames in Discord is heavily rate limited, with only 2 requests
   * every hour. Use this sparingly!</info>
   * @param {string} username The new username
   * @param {string} [password] Current password (only for user accounts)
   * @returns {Promise<ClientUser>}
   * @example
   * // Set username
   * client.user.setUsername('discordjs')
   *   .then(user => console.log(`My new username is ${user.username}`))
   *   .catch(console.error);
   */
  setUsername(username, password) {
    return this.client.rest.methods.updateCurrentUser({ username }, password);
  }

  /**
   * Changes the email for the client user's account.
   * <warn>This is only available when using a user account.</warn>
   * @param {string} email New email to change to
   * @param {string} password Current password
   * @returns {Promise<ClientUser>}
   * @example
   * // Set email
   * client.user.setEmail('bob@gmail.com', 'some amazing password 123')
   *   .then(user => console.log(`My new email is ${user.email}`))
   *   .catch(console.error);
   */
  setEmail(email, password) {
    return this.client.rest.methods.updateCurrentUser({ email }, password);
  }

  /**
   * Changes the password for the client user's account.
   * <warn>This is only available when using a user account.</warn>
   * @param {string} newPassword New password to change to
   * @param {string} oldPassword Current password
   * @returns {Promise<ClientUser>}
   * @example
   * // Set password
   * client.user.setPassword('some new amazing password 456', 'some amazing password 123')
   *   .then(user => console.log('New password set!'))
   *   .catch(console.error);
   */
  setPassword(newPassword, oldPassword) {
    return this.client.rest.methods.updateCurrentUser({ password: newPassword }, oldPassword);
  }

  /**
   * Set the avatar of the logged in client.
   * @param {BufferResolvable|Base64Resolvable} avatar The new avatar
   * @returns {Promise<ClientUser>}
   * @example
   * // Set avatar
   * client.user.setAvatar('./avatar.png')
   *   .then(user => console.log(`New avatar set!`))
   *   .catch(console.error);
   */
  setAvatar(avatar) {
    return this.client.resolver.resolveImage(avatar).then(data =>
      this.client.rest.methods.updateCurrentUser({ avatar: data })
    );
  }

  /**
   * Data resembling a raw Discord presence.
   * @typedef {Object} PresenceData
   * @property {PresenceStatus} [status] Status of the user
   * @property {boolean} [afk] Whether the user is AFK
   * @property {Object} [game] Game the user is playing
   * @property {string} [game.name] Name of the game
   * @property {string} [game.url] Twitch stream URL
   * @property {?ActivityType|number} [game.type] Type of the activity
   */

  /**
   * Sets the full presence of the client user.
   * @param {PresenceData} data Data for the presence
   * @returns {Promise<ClientUser>}
   * @example
   * // Set the client user's presence
   * client.user.setPresence({ game: { name: 'with discord.js' }, status: 'idle' })
   *   .then(console.log)
   *   .catch(console.error);
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
        if (this.bot) {
          status = data.status;
        } else {
          this.settings.update(Constants.UserSettingsMap.status, data.status);
          status = 'invisible';
        }
      }

      if (data.game) {
        game = data.game;
        game.type = game.url && typeof game.type === 'undefined' ? 1 : game.type || 0;
        if (typeof game.type === 'string') {
          game.type = Constants.ActivityTypes.indexOf(game.type.toUpperCase());
        }
      } else if (typeof data.game !== 'undefined') {
        game = null;
      }

      if (typeof data.afk !== 'undefined') afk = data.afk;
      afk = Boolean(afk);

      this.localPresence = { status, game, afk };
      this.localPresence.since = 0;
      this.localPresence.game = this.localPresence.game || null;

      this.client.ws.send({
        op: 3,
        d: this.localPresence,
      });

      this.client._setPresence(this.id, this.localPresence);

      resolve(this);
    });
  }

  /**
   * A user's status. Must be one of:
   * * `online`
   * * `idle`
   * * `invisible`
   * * `dnd` (do not disturb)
   * @typedef {string} PresenceStatus
   */

  /**
   * Sets the status of the client user.
   * @param {PresenceStatus} status Status to change to
   * @returns {Promise<ClientUser>}
   * @example
   * // Set the client user's status
   * client.user.setStatus('idle')
   *   .then(console.log)
   *   .catch(console.error);
   */
  setStatus(status) {
    return this.setPresence({ status });
  }

  /**
   * Sets the game the client user is playing.
   * @param {?string} game Game being played
   * @param {?string} [streamingURL] Twitch stream URL
   * @returns {Promise<ClientUser>}
   * @deprecated
   */
  setGame(game, streamingURL) {
    if (!game) return this.setPresence({ game: null });
    return this.setPresence({
      game: {
        name: game,
        url: streamingURL,
      },
    });
  }

  /**
   * Sets the activity the client user is playing.
   * @param {?string} name Activity being played
   * @param {Object} [options] Options for setting the activity
   * @param {string} [options.url] Twitch stream URL
   * @param {ActivityType|number} [options.type] Type of the activity
   * @returns {Promise<Presence>}
   * @example
   * client.user.setActivity('YouTube', { type: 'WATCHING' })
   *   .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
   *   .catch(console.error);
   */
  setActivity(name, { url, type } = {}) {
    if (!name) return this.setPresence({ game: null });
    return this.setPresence({
      game: { name, type, url },
    }).then(clientUser => clientUser.presence);
  }

  /**
   * Sets/removes the AFK flag for the client user.
   * @param {boolean} afk Whether or not the user is AFK
   * @returns {Promise<ClientUser>}
   */
  setAFK(afk) {
    return this.setPresence({ afk });
  }

  /**
   * Fetches messages that mentioned the client's user.
   * <warn>This is only available when using a user account.</warn>
   * @param {Object} [options] Options for the fetch
   * @param {number} [options.limit=25] Maximum number of mentions to retrieve
   * @param {boolean} [options.roles=true] Whether to include role mentions
   * @param {boolean} [options.everyone=true] Whether to include everyone/here mentions
   * @param {GuildResolvable} [options.guild] Limit the search to a specific guild
   * @returns {Promise<Message[]>}
   * @example
   * // Fetch mentions
   * client.user.fetchMentions()
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch mentions from a guild
   * client.user.fetchMentions({ guild: '222078108977594368' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  fetchMentions(options = {}) {
    return this.client.rest.methods.fetchMentions(options);
  }

  /**
   * Send a friend request.
   * <warn>This is only available when using a user account.</warn>
   * @param {UserResolvable} user The user to send the friend request to
   * @returns {Promise<User>} The user the friend request was sent to
   */
  addFriend(user) {
    user = this.client.resolver.resolveUser(user);
    return this.client.rest.methods.addFriend(user);
  }

  /**
   * Remove a friend.
   * <warn>This is only available when using a user account.</warn>
   * @param {UserResolvable} user The user to remove from your friends
   * @returns {Promise<User>} The user that was removed
   */
  removeFriend(user) {
    user = this.client.resolver.resolveUser(user);
    return this.client.rest.methods.removeFriend(user);
  }

  /**
   * Creates a guild.
   * <warn>This is only available to bots in less than 10 guilds and user accounts.</warn>
   * @param {string} name The name of the guild
   * @param {string} [region] The region for the server
   * @param {BufferResolvable|Base64Resolvable} [icon=null] The icon for the guild
   * @returns {Promise<Guild>} The guild that was created
   */
  createGuild(name, region, icon = null) {
    if (typeof icon === 'string' && icon.startsWith('data:')) {
      return this.client.rest.methods.createGuild({ name, icon, region });
    } else {
      return this.client.resolver.resolveImage(icon).then(data =>
        this.client.rest.methods.createGuild({ name, icon: data, region })
      );
    }
  }

  /**
   * An object containing either a user or access token, and an optional nickname.
   * @typedef {Object} GroupDMRecipientOptions
   * @property {UserResolvable|Snowflake} [user] User to add to the Group DM
   * (only available if a user is creating the DM)
   * @property {string} [accessToken] Access token to use to add a user to the Group DM
   * (only available if a bot is creating the DM)
   * @property {string} [nick] Permanent nickname (only available if a bot is creating the DM)
   */

  /**
   * Creates a Group DM.
   * @param {GroupDMRecipientOptions[]} recipients The recipients
   * @returns {Promise<GroupDMChannel>}
   * @example
   * // Create a Group DM with a token provided from OAuth
   * client.user.createGroupDM([{
   *   user: '66564597481480192',
   *   accessToken: token
   * }])
   *   .then(console.log)
   *   .catch(console.error);
   */
  createGroupDM(recipients) {
    return this.client.rest.methods.createGroupDM({
      recipients: recipients.map(u => this.client.resolver.resolveUserID(u.user)),
      accessTokens: recipients.map(u => u.accessToken),
      nicks: recipients.reduce((o, r) => {
        if (r.nick) o[r.user ? r.user.id : r.id] = r.nick;
        return o;
      }, {}),
    });
  }

  /**
   * Accepts an invite to join a guild.
   * <warn>This is only available when using a user account.</warn>
   * @param {Invite|string} invite Invite or code to accept
   * @returns {Promise<Guild>} Joined guild
   */
  acceptInvite(invite) {
    return this.client.rest.methods.acceptInvite(invite);
  }
}

ClientUser.prototype.setGame =
  util.deprecate(ClientUser.prototype.setGame, 'ClientUser#setGame: use ClientUser#setActivity instead');

ClientUser.prototype.addFriend =
  util.deprecate(ClientUser.prototype.addFriend, 'ClientUser#addFriend: userbot methods will be removed');

ClientUser.prototype.removeFriend =
  util.deprecate(ClientUser.prototype.removeFriend, 'ClientUser#removeFriend: userbot methods will be removed');

ClientUser.prototype.setPassword =
  util.deprecate(ClientUser.prototype.setPassword, 'ClientUser#setPassword: userbot methods will be removed');

ClientUser.prototype.setEmail =
  util.deprecate(ClientUser.prototype.setEmail, 'ClientUser#setEmail: userbot methods will be removed');

ClientUser.prototype.fetchMentions =
  util.deprecate(ClientUser.prototype.fetchMentions, 'ClientUser#fetchMentions: userbot methods will be removed');

module.exports = ClientUser;
