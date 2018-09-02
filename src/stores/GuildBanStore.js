const DataStore = require('./DataStore');
const Collection = require('../util/Collection');

class GuildBanStore extends DataStore {
  constructor(guild) {
    super(guild.client);
    this.guild = guild;
  }

  add(ban, cache) {
    const existing = this.get(ban.user.id);
    if (existing.reason === ban.reason && existing.fetched === ban.fetched) return existing;

    if (cache) this.set(ban.user.id, ban);
    return ban;
  }

  /**
   * An object containing information about a guild member's ban.
   * @typedef {Object} BanInfo
   * @property {User} user User that was banned
   * @property {?string} reason Reason the user was banned
   * @property {boolean} fetched If this BanInfo is fetched and will be accurate about the reason
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
   * guild.bans.fetch({ id: '184632227894657025' })
   *  .then(ban => console.log(`User ${ban.user} was banned with reason ${ban.reason}`))
   *  .catch(console.error);
   */
  fetch({ id, cache = true }) {
    return this.client.api.guilds(this.guild.id).bans(id).get()
      .then(data => {
        let result;
        if (id) {
          result = { reason: data.reason, user: this.client.users.add(data.user), fetched: true };
          this.add(result, cache);
        } else if (cache) {
          for (const ban of data) {
            this.add({ reason: ban.reason, user: this.client.users.add(ban.user), fetched: true }, cache);
          }
          return this;
        } else {
          return data.reduce((collection, ban) => collection.set(ban.user.id, {
            reason: ban.reason,
            user: this.client.users.add(ban.user),
            fetched: true,
          }), new Collection());
        }
        return result;
      });
  }
}

module.exports = GuildBanStore;
