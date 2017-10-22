const Collection = require('../util/Collection');
const { UserFlags } = require('../util/Constants');
const UserConnection = require('./UserConnection');
const Base = require('./Base');

/**
 * Represents a user's profile on Discord.
 * @extends {Base}
 */
class UserProfile extends Base {
  constructor(user, data) {
    super(user.client);

    /**
     * The owner of the profile
     * @type {User}
     */
    this.user = user;

    /**
     * The guilds that the client user and the user share
     * @type {Collection<Snowflake, Guild>}
     */
    this.mutualGuilds = new Collection();

    /**
     * The user's connections
     * @type {Collection<Snowflake, UserConnection>}
     */
    this.connections = new Collection();

    this._patch(data);
  }

  _patch(data) {
    /**
     * If the user has Discord Premium
     * @type {boolean}
     */
    this.premium = Boolean(data.premium_since);

    /**
     * The Bitfield of the users' flags
     * @type {number}
     * @private
     */
    this._flags = data.user.flags;

    /**
     * The date since which the user has had Discord Premium
     * @type {?Date}
     */
    this.premiumSince = data.premium_since ? new Date(data.premium_since) : null;

    for (const guild of data.mutual_guilds) {
      if (this.client.guilds.has(guild.id)) {
        this.mutualGuilds.set(guild.id, this.client.guilds.get(guild.id));
      }
    }
    for (const connection of data.connected_accounts) {
      this.connections.set(connection.id, new UserConnection(this.user, connection));
    }
  }

  /**
   * The flags the user has
   * @type {UserFlags[]}
   * @readonly
   */
  get flags() {
    const flags = [];
    for (const [name, flag] of Object.entries(UserFlags)) {
      if ((this._flags & flag) === flag) flags.push(name);
    }
    return flags;
  }
}

module.exports = UserProfile;
