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
     * The Client that created the instance of the the UserProfile.
     * @name UserProfile#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: user.client });

    /**
     * Guilds that the client user and the user share
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
    /**
     * If the user has Discord Premium
     * @type {boolean}
     */
    this.premium = data.premium;

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
