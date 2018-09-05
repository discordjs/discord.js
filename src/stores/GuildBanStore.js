const DataStore = require('./DataStore');
const GuildBan = require('../structures/GuildBan');
const Collection = require('../util/Collection');

/**
 * Stores guild bans
 */
class GuildBanStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable, GuildBan);
    /**
     * The Guild of this Store
     * @type {Guild}
     */
    this.guild = guild;
  }

  add(ban, cache) {
    const existing = this.get(ban.user.id);
    if (existing.reason === ban.reason && existing.fetched === ban.fetched) return existing;

    if (cache) this.set(ban.user.id, ban);
    return ban;
  }

  /**
   * Fetch either a single GuildBan or a Collection of GuildBan Instances.
   * @param {Object} [options] Options
   * @param {Snowflake} [options.id] Optional id of a banned user.
   * @param {boolean} [options.cache] cache settings of this request
   * @returns {Promise<Collection<Snowflake, GuildBan> | GuildBan | this>}
   * @example
   * // Fetch all bans in this guild
   * guild.bans.fetch()
   *   .then(bans => console.log(`${bans.size} users are banned from this Guild`))
   *   .catch(console.error);
   * @example
   * // Fetch a single ban in this guild
   * guild.bans.fetch({ id: '184632227894657025' })
   *  .then(ban => console.log(`User ${ban.user.tag} was banned with reason ${ban.reason}`))
   *  .catch(console.error);
   */
  fetch({ id, cache = true } = {}) {
    const cached = this.get(id);
    if (id && cached) return cached;
    return this.client.api.guilds(this.guild.id).bans(id).get()
      .then(data => {
        if (id) {
          const ban = new GuildBan(this.guild, data, true);
          this.add(ban, cache);
          return ban;
        } else if (cache) {
          for (const ban of data) {
            this.add(new GuildBan(this.guild, ban, true), cache);
          }
          return this;
        } else {
          return data.reduce(
            (collection, ban) => collection.set(ban.user.id, new GuildBan(this.guild, ban, true)),
            new Collection()
          );
        }
      });
  }
}

module.exports = GuildBanStore;
