const User = require('./User');
const Collection = require('../util/Collection');
const ClientUserSettings = require('./ClientUserSettings');
const ClientUserGuildSettings = require('./ClientUserGuildSettings');
const Constants = require('../util/Constants');
const Util = require('../util/Util');
const Guild = require('./Guild');

/**
 * Represents the logged in client's Discord user.
 * @extends {User}
 */
class ClientUser extends User {
  _patch(data) {
    super._patch(data);

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
     * <warn>This is only filled when using a user account.</warn>
     * @type {Collection<Snowflake, ClientUserGuildSettings>}
     */
    this.guildSettings = new Collection();
    if (data.user_guild_settings) {
      for (const settings of data.user_guild_settings) {
        this.guildSettings.set(settings.guild_id, new ClientUserGuildSettings(this.client, settings));
      }
    }
  }

  /**
   * ClientUser's presence
   * @readonly
   * @type {Presence}
   */
  get presence() {
    return this.client.presences.clientPresence;
  }

  edit(data, passcode) {
    if (!this.bot) {
      if (typeof passcode !== 'object') {
        data.password = passcode;
      } else {
        data.code = passcode.mfaCode;
        data.password = passcode.password;
      }
    }
    return this.client.api.users('@me').patch({ data })
      .then(newData => {
        this.client.token = newData.token;
        return this.client.actions.UserUpdate.handle(newData).updated;
      });
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
    return this.edit({ username }, password);
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
    return this.edit({ email }, password);
  }

  /**
   * Changes the password for the client user's account.
   * <warn>This is only available when using a user account.</warn>
   * @param {string} newPassword New password to change to
   * @param {Object|string} options Object containing an MFA code, password or both.
   * Can be just a string for the password.
   * @param {string} [options.oldPassword] Current password
   * @param {string} [options.mfaCode] Timed MFA Code
   * @returns {Promise<ClientUser>}
   * @example
   * // Set password
   * client.user.setPassword('some new amazing password 456', 'some amazing password 123')
   *   .then(user => console.log('New password set!'))
   *   .catch(console.error);
   */
  setPassword(newPassword, options) {
    return this.edit({ new_password: newPassword }, { password: options.oldPassword, mfaCode: options.mfaCode });
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
  async setAvatar(avatar) {
    return this.edit({ avatar: await this.client.resolver.resolveImage(avatar) });
  }

  /**
   * Data resembling a raw Discord presence.
   * @typedef {Object} PresenceData
   * @property {PresenceStatus} [status] Status of the user
   * @property {boolean} [afk] Whether the user is AFK
   * @property {Object} [activity] activity the user is playing
   * @property {string} [activity.name] Name of the activity
   * @property {ActivityType|number} [activity.type] Type of the activity
   * @property {string} [activity.url] Stream url
   */

  /**
   * Sets the full presence of the client user.
   * @param {PresenceData} data Data for the presence
   * @returns {Promise<Presence>}
   */
  setPresence(data) {
    return this.client.presences.setClientPresence(data);
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
   * @returns {Promise<Presence>}
   */
  setStatus(status) {
    return this.setPresence({ status });
  }

  /**
   * Sets the activity the client user is playing.
   * @param {?string} name Activity being played
   * @param {Object} [options] Options for setting the activity
   * @param {string} [options.url] Twitch stream URL
   * @param {ActivityType|number} [options.type] Type of the activity
   * @returns {Promise<Presence>}
   */
  setActivity(name, { url, type } = {}) {
    if (!name) return this.setPresence({ activity: null });
    return this.setPresence({
      activity: { name, type, url },
    });
  }

  /**
   * Sets/removes the AFK flag for the client user.
   * @param {boolean} afk Whether or not the user is AFK
   * @returns {Promise<Presence>}
   */
  setAFK(afk) {
    return this.setPresence({ afk });
  }

  /**
   * Fetches messages that mentioned the client's user.
   * @param {Object} [options] Options for the fetch
   * @param {number} [options.limit=25] Maximum number of mentions to retrieve
   * @param {boolean} [options.roles=true] Whether to include role mentions
   * @param {boolean} [options.everyone=true] Whether to include everyone/here mentions
   * @param {Guild|Snowflake} [options.guild] Limit the search to a specific guild
   * @returns {Promise<Message[]>}
   */
  fetchMentions(options = {}) {
    if (options.guild instanceof Guild) options.guild = options.guild.id;
    Util.mergeDefault({ limit: 25, roles: true, everyone: true, guild: null }, options);

    return this.client.api.users('@me').mentions.get({ query: options })
      .then(data => data.map(m => this.client.channels.get(m.channel_id).messages.create(m, false)));
  }

  /**
   * Creates a guild.
   * <warn>This is only available when using a user account.</warn>
   * @param {string} name The name of the guild
   * @param {Object} [options] Options for the creating
   * @param {string} [options.region] The region for the server, defaults to the closest one available
   * @param {BufferResolvable|Base64Resolvable} [options.icon=null] The icon for the guild
   * @returns {Promise<Guild>} The guild that was created
   */
  createGuild(name, { region, icon = null } = {}) {
    if (!icon || (typeof icon === 'string' && icon.startsWith('data:'))) {
      return new Promise((resolve, reject) =>
        this.client.api.guilds.post({ data: { name, region, icon } })
          .then(data => {
            if (this.client.guilds.has(data.id)) return resolve(this.client.guilds.get(data.id));

            const handleGuild = guild => {
              if (guild.id === data.id) {
                this.client.removeListener(Constants.Events.GUILD_CREATE, handleGuild);
                this.client.clearTimeout(timeout);
                resolve(guild);
              }
            };
            this.client.on(Constants.Events.GUILD_CREATE, handleGuild);

            const timeout = this.client.setTimeout(() => {
              this.client.removeListener(Constants.Events.GUILD_CREATE, handleGuild);
              resolve(this.client.guilds.create(data));
            }, 10000);
            return undefined;
          }, reject)
      );
    }

    return this.client.resolver.resolveImage(icon)
      .then(data => this.createGuild(name, { region, icon: data || null }));
  }

  /**
   * An object containing either a user or access token, and an optional nickname.
   * @typedef {Object} GroupDMRecipientOptions
   * @property {UserResolvable} [user] User to add to the Group DM
   * @property {string} [accessToken] Access token to use to add a user to the Group DM
   * (only available if a bot is creating the DM)
   * @property {string} [nick] Permanent nickname (only available if a bot is creating the DM)
   * @property {string} [id] If no user resolvable is provided and you want to assign nicknames
   * you must provide user ids instead
   */

  /**
   * Creates a Group DM.
   * @param {GroupDMRecipientOptions[]} recipients The recipients
   * @returns {Promise<GroupDMChannel>}
   */
  createGroupDM(recipients) {
    const data = this.bot ? {
      access_tokens: recipients.map(u => u.accessToken),
      nicks: recipients.reduce((o, r) => {
        if (r.nick) o[r.user ? r.user.id : r.id] = r.nick;
        return o;
      }, {}),
    } : { recipients: recipients.map(u => this.client.resolver.resolveUserID(u.user || u.id)) };
    return this.client.api.users('@me').channels.post({ data })
      .then(res => this.client.channels.create(res));
  }
}

module.exports = ClientUser;
