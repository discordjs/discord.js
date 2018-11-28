'use strict';

const DataStore = require('./DataStore');
const GuildMember = require('../structures/GuildMember');
const { Events, OPCodes } = require('../util/Constants');
const Collection = require('../util/Collection');
const { Error, TypeError } = require('../errors');

/**
 * Stores guild members.
 * @extends {DataStore}
 */
class GuildMemberStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable, GuildMember);
    this.guild = guild;
  }

  add(data, cache = true) {
    return super.add(data, cache, { id: data.user.id, extras: [this.guild] });
  }

  /**
   * Data that resolves to give a GuildMember object. This can be:
   * * A GuildMember object
   * * A User resolvable
   * @typedef {GuildMember|UserResolvable} GuildMemberResolvable
   */

  /**
   * Resolves a GuildMemberResolvable to a GuildMember object.
   * @param {GuildMemberResolvable} member The user that is part of the guild
   * @returns {?GuildMember}
   */
  resolve(member) {
    const memberResolvable = super.resolve(member);
    if (memberResolvable) return memberResolvable;
    const userResolvable = this.client.users.resolveID(member);
    if (userResolvable) return super.resolve(userResolvable);
    return null;
  }

  /**
   * Resolves a GuildMemberResolvable to an member ID string.
   * @param {GuildMemberResolvable} member The user that is part of the guild
   * @returns {?Snowflake}
   */
  resolveID(member) {
    const memberResolvable = super.resolveID(member);
    if (memberResolvable) return memberResolvable;
    const userResolvable = this.client.users.resolveID(member);
    return this.has(userResolvable) ? userResolvable : null;
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
   * Fetches member(s) from Discord, even if they're offline.
   * @param {UserResolvable|FetchMemberOptions|FetchMembersOptions} [options] If a UserResolvable, the user to fetch.
   * If undefined, fetches all members.
   * If a query, it limits the results to users with similar usernames.
   * @returns {Promise<GuildMember>|Promise<Collection<Snowflake, GuildMember>>}
   * @example
   * // Fetch all members from a guild
   * guild.members.fetch()
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single member
   * guild.members.fetch('66564597481480192')
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single member without caching
   * guild.members.fetch({ user, cache: false })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch by query
   * guild.members.fetch({ query: 'hydra', limit: 1 })
   *   .then(console.log)
   *   .catch(console.error);
   */
  fetch(options) {
    if (!options) return this._fetchMany();
    const user = this.client.users.resolveID(options);
    if (user) return this._fetchSingle({ user, cache: true });
    if (options.user) {
      options.user = this.client.users.resolveID(options.user);
      if (options.user) return this._fetchSingle(options);
    }
    return this._fetchMany(options);
  }

  /**
   * Prunes members from the guild based on how long they have been inactive.
   * @param {Object} [options] Prune options
   * @param {number} [options.days=7] Number of days of inactivity required to kick
   * @param {boolean} [options.dry=false] Get number of users that will be kicked, without actually kicking them
   * @param {string} [options.reason] Reason for this prune
   * @returns {Promise<number>} The number of members that were/will be kicked
   * @example
   * // See how many members will be pruned
   * guild.members.prune({ dry: true })
   *   .then(pruned => console.log(`This will prune ${pruned} people!`))
   *   .catch(console.error);
   * @example
   * // Actually prune the members
   * guild.members.prune({ days: 1, reason: 'too many people!' })
   *   .then(pruned => console.log(`I just pruned ${pruned} people!`))
   *   .catch(console.error);
   */
  prune({ days = 7, dry = false, reason } = {}) {
    if (typeof days !== 'number') throw new TypeError('PRUNE_DAYS_TYPE');
    return this.client.api.guilds(this.guild.id).prune[dry ? 'get' : 'post']({ query: { days }, reason })
      .then(data => data.pruned);
  }

  /**
   * Bans a user from the guild.
   * @param {UserResolvable} user The user to ban
   * @param {Object} [options] Options for the ban
   * @param {number} [options.days=0] Number of days of messages to delete
   * @param {string} [options.reason] Reason for banning
   * @returns {Promise<GuildMember|User|Snowflake>} Result object will be resolved as specifically as possible.
   * If the GuildMember cannot be resolved, the User will instead be attempted to be resolved. If that also cannot
   * be resolved, the user ID will be the result.
   * @example
   * // Ban a user by ID (or with a user/guild member object)
   * guild.members.ban('84484653687267328')
   *   .then(user => console.log(`Banned ${user.username || user.id || user} from ${guild.name}`))
   *   .catch(console.error);
   */
  ban(user, options = { days: 0 }) {
    if (options.days) options['delete-message-days'] = options.days;
    const id = this.client.users.resolveID(user);
    if (!id) return Promise.reject(new Error('BAN_RESOLVE_ID', true));
    return this.client.api.guilds(this.guild.id).bans[id].put({ query: options })
      .then(() => {
        if (user instanceof GuildMember) return user;
        const _user = this.client.users.resolve(id);
        if (_user) {
          const member = this.resolve(_user);
          return member || _user;
        }
        return id;
      });
  }

  /**
   * Unbans a user from the guild.
   * @param {UserResolvable} user The user to unban
   * @param {string} [reason] Reason for unbanning user
   * @returns {Promise<User>}
   * @example
   * // Unban a user by ID (or with a user/guild member object)
   * guild.members.unban('84484653687267328')
   *   .then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
   *   .catch(console.error);
   */
  unban(user, reason) {
    const id = this.client.users.resolveID(user);
    if (!id) throw new Error('BAN_RESOLVE_ID');
    return this.client.api.guilds(this.guild.id).bans[id].delete({ reason })
      .then(() => this.client.users.resolve(user));
  }


  _fetchSingle({ user, cache }) {
    const existing = this.get(user);
    if (existing && existing.joinedTimestamp) return Promise.resolve(existing);
    return this.client.api.guilds(this.guild.id).members(user).get()
      .then(data => this.add(data, cache));
  }

  _fetchMany({ query = '', limit = 0 } = {}) {
    return new Promise((resolve, reject) => {
      if (this.guild.memberCount === this.size) {
        resolve(query || limit ? new Collection() : this);
        return;
      }
      this.guild.shard.send({
        op: OPCodes.REQUEST_GUILD_MEMBERS,
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
          this.guild.client.removeListener(Events.GUILD_MEMBERS_CHUNK, handler);
          resolve(query || limit ? fetchedMembers : this);
        }
      };
      this.guild.client.on(Events.GUILD_MEMBERS_CHUNK, handler);
      this.guild.client.setTimeout(() => {
        this.guild.client.removeListener(Events.GUILD_MEMBERS_CHUNK, handler);
        reject(new Error('GUILD_MEMBERS_TIMEOUT'));
      }, 120e3);
    });
  }
}

module.exports = GuildMemberStore;
