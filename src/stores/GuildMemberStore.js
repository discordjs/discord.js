const DataStore = require('./DataStore');
const GuildMember = require('../structures/GuildMember');
const Constants = require('../util/Constants');
const Collection = require('../util/Collection');
const { Error } = require('../errors');

/**
 * Stores guild members.
 * @extends {DataStore}
 */
class GuildMemberStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable);
    this.guild = guild;
  }

  create(data, cache = true) {
    const existing = this.get(data.user.id);
    if (existing) return existing;

    const member = new GuildMember(this.guild, data);
    if (cache) this.set(member.id, member);

    return member;
  }

  /**
   * Options used to fetch a single member from a guild.
   * @typedef {Object} FetchMemberOptions
   * @property {UserResolvable} user The user to fetch
   * @property {boolean} [cache=true] Whether or not to cache the fetched member
   */

  /**
   * Options used to fetch multiple members from a guild.
   * @typedef {Object} FetchMembersOptions
   * @property {string} [query=''] Limit fetch to members with similar usernames
   * @property {number} [limit=0] Maximum number of members to request
   */

  /**
   * Fetch member(s) from Discord, even if they're offline.
   * @param {UserResolvable|FetchMemberOptions|FetchMembersOptions} [options] If a UserResolvable, the user to fetch.
   * If undefined, fetches all members.
   * If a query, it limits the results to users with similar usernames.
   * @returns {Promise<GuildMember>|Promise<Collection<Snowflake, GuildMember>>}
   * @example
   * // Fetch all members from a guild
   * guild.members.fetch();
   * @example
   * // Fetch a single member
   * guild.members.fetch('66564597481480192');
   * guild.members.fetch(user);
   * guild.members.fetch({ user, cache: false }); // Fetch and don't cache
   * @example
   * // Fetch by query
   * guild.members.fetch({
   *   query: 'hydra',
   * });
   * guild.members.fetch({
   *   query: 'hydra',
   *   limit: 10,
   * });
   */
  fetch(options) {
    if (!options) return this._fetchMany();
    const user = this.client.resolver.resolveUserID(options);
    if (user) return this._fetchSingle({ user, cache: true });
    if (options.user) {
      options.user = this.client.resolver.resolveUserID(options.user);
      if (options.user) return this._fetchSingle(options);
    }
    return this._fetchMany(options);
  }

  _fetchSingle({ user, cache }) {
    if (this.has(user)) return Promise.resolve(this.get(user));
    return this.client.api.guilds(this.guild.id).members(user).get()
      .then(data => this.create(data, cache));
  }

  _fetchMany({ query = '', limit = 0 } = {}) {
    return new Promise((resolve, reject) => {
      if (this.guild.memberCount === this.size) {
        resolve(query || limit ? new Collection() : this);
        return;
      }
      this.guild.client.ws.send({
        op: Constants.OPCodes.REQUEST_GUILD_MEMBERS,
        d: {
          guild_id: this.guild.id,
          query,
          limit,
        },
      });
      const fetchedMembers = new Collection();
      const handler = (members, guild) => {
        if (guild.id !== this.guild.id) return;
        for (const member of members.values()) {
          if (query || limit) fetchedMembers.set(member.id, member);
        }
        if (this.guild.memberCount <= this.size ||
          ((query || limit) && members.size < 1000) ||
          (limit && fetchedMembers.size >= limit)) {
          this.guild.client.removeListener(Constants.Events.GUILD_MEMBERS_CHUNK, handler);
          resolve(query || limit ? fetchedMembers : this);
        }
      };
      this.guild.client.on(Constants.Events.GUILD_MEMBERS_CHUNK, handler);
      this.guild.client.setTimeout(() => {
        this.guild.client.removeListener(Constants.Events.GUILD_MEMBERS_CHUNK, handler);
        reject(new Error('GUILD_MEMBERS_TIMEOUT'));
      }, 120e3);
    });
  }
}

module.exports = GuildMemberStore;
