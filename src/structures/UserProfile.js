const Collection = require('../util/Collection');
const UserConnection = require('./UserConnection');

/**
 * Represents a user's profile on Discord.
 */
class UserProfile {
  constructor(user, data) {
    /**
     * The owner of the profile
     * @type {User}
     */
    this.user = user;

    /**
     * The Client that created the instance of the the User.
     * @type {Client}
     */
    this.client = this.user.client;
    Object.defineProperty(this, 'client', { enumerable: false, configurable: false });

    /**
     * Guilds that the ClientUser and the User share
     * @type {Collection<Guild>}
     */
    this.mutualGuilds = new Collection();

    /**
     * The user's connections
     * @type {Collection<UserConnection>}
     */
    this.connections = new Collection();

    this.setup(data);
  }

  setup(data) {
    for (const guild of data.mutual_guilds) {
      if (this.client.guilds.has(guild.id)) {
        this.mutualGuilds.set(guild.id, this.client.guilds.get(guild.id));
      }
    }
    for (const connection of data.connected_accounts) {
      this.connections.set(connection.id, new UserConnection(this.user, connection));
    }
  }
}

module.exports = UserProfile;
