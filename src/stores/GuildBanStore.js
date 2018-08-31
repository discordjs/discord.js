const DataStore = require('./DataStore');
const Collection = require('../util/Collection');

class GuildBanStore extends DataStore {
  constructor(guild) {
    super(guild.client);
    this.guild = guild;
  }

  add(ban, cache) {
    return super.add(ban, cache, { id: ban.user.id });
  }

  /**
   * An object containing information about a guild member's ban.
   * @typedef {Object} BanInfo
   * @property {User} user User that was banned
   * @property {?string} reason Reason the user was banned
   */

  /**
   * Fetch either a single BanInfo or a Collection of BanInfo Objects.
   * @param {Object} [options] Options
   * @param {Snowflake} [options.id] Optional id of a banned user.
   * @param {boolean} [options.cache] cache settings of this request
   * @returns {Promise<Collection<Snowflake, BanInfo> | BanInfo | this>}
   * @example
   * // Fetch all bans in this guild
   * guild.bans.fetch()
   *   .then(bans => console.log(`${bans.size} users are banned from this Guild`))
   *   .catch(console.error);
   * @example
   * // Fetch a single ban in this guild
   * guild.bans.fetch('184632227894657025')
   *  .then(ban => console.log(`User ${ban.user} was banned with reason ${ban.reason}`))
   *  .catch(console.error);
   */
  fetch({ id, cache = true }) {
    return this.client.api.guilds(this.guild.id).bans(id).get()
      .then(data => {
        let result;
        if (id) {
          result = { reason: data.reason, user: this.client.users.add(data.user) };
          this.add(result, cache);
        } else if (cache) {
          for (const ban of data) { this.add(ban, cache); }
          return this;
        } else {
          return data.reduce((collection, ban) => collection.set(ban.user.id, {
            reason: ban.reason,
            user: this.client.users.add(ban.user),
          }), new Collection());
        }
        return result;
      });
  }
}

module.exports = GuildBanStore;
