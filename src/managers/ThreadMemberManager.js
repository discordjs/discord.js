'use strict';
const process = require('node:process');

const { Collection } = require('@discordjs/collection');
const CachedManager = require('./CachedManager');
const { TypeError } = require('../errors');
const ThreadMember = require('../structures/ThreadMember');

let deprecationEmittedForPassingBoolean = false;

/**
 * Manages API methods for GuildMembers and stores their cache.
 * @extends {CachedManager}
 */
class ThreadMemberManager extends CachedManager {
  constructor(thread, iterable) {
    super(thread.client, ThreadMember, iterable);

    /**
     * The thread this manager belongs to
     * @type {ThreadChannel}
     */
    this.thread = thread;
  }

  /**
   * The cache of this Manager
   * @type {Collection<Snowflake, ThreadMember>}
   * @name ThreadMemberManager#cache
   */

  _add(data, cache = true) {
    const existing = this.cache.get(data.user_id);
    if (cache) existing?._patch(data, { cache });
    if (existing) return existing;

    const member = new ThreadMember(this.thread, data, { cache });
    if (cache) this.cache.set(data.user_id, member);
    return member;
  }

  /**
   * Fetches the client user as a ThreadMember of the thread.
   * @param {BaseFetchOptions} [options] The options for fetching the member
   * @returns {Promise<ThreadMember>}
   */
  fetchMe(options) {
    return this.fetch(this.client.user.id, options);
  }

  /**
   * The client user as a ThreadMember of this ThreadChannel
   * @type {?ThreadMember}
   * @readonly
   */
  get me() {
    return this.resolve(this.client.user.id);
  }

  /**
   * Data that resolves to give a ThreadMember object. This can be:
   * * A ThreadMember object
   * * A User resolvable
   * @typedef {ThreadMember|UserResolvable} ThreadMemberResolvable
   */

  /**
   * Resolves a {@link ThreadMemberResolvable} to a {@link ThreadMember} object.
   * @param {ThreadMemberResolvable} member The user that is part of the thread
   * @returns {?GuildMember}
   */
  resolve(member) {
    const memberResolvable = super.resolve(member);
    if (memberResolvable) return memberResolvable;
    const userResolvable = this.client.users.resolveId(member);
    if (userResolvable) return super.resolve(userResolvable);
    return null;
  }

  /**
   * Resolves a {@link ThreadMemberResolvable} to a {@link ThreadMember} id string.
   * @param {ThreadMemberResolvable} member The user that is part of the guild
   * @returns {?Snowflake}
   */
  resolveId(member) {
    const memberResolvable = super.resolveId(member);
    if (memberResolvable) return memberResolvable;
    const userResolvable = this.client.users.resolveId(member);
    return this.cache.has(userResolvable) ? userResolvable : null;
  }

  /**
   * Adds a member to the thread.
   * @param {UserResolvable|'@me'} member The member to add
   * @param {string} [reason] The reason for adding this member
   * @returns {Promise<Snowflake>}
   */
  async add(member, reason) {
    const id = member === '@me' ? member : this.client.users.resolveId(member);
    if (!id) throw new TypeError('INVALID_TYPE', 'member', 'UserResolvable');
    await this.client.api.channels(this.thread.id, 'thread-members', id).put({ reason });
    return id;
  }

  /**
   * Remove a user from the thread.
   * @param {Snowflake|'@me'} id The id of the member to remove
   * @param {string} [reason] The reason for removing this member from the thread
   * @returns {Promise<Snowflake>}
   */
  async remove(id, reason) {
    await this.client.api.channels(this.thread.id, 'thread-members', id).delete({ reason });
    return id;
  }

  async _fetchOne(memberId, { cache, force = false, withMember }) {
    if (!force) {
      const existing = this.cache.get(memberId);
      if (existing) return existing;
    }

    const data = await this.client.api.channels(this.thread.id, 'thread-members', memberId).get({
      query: { with_member: withMember },
    });
    return this._add(data, cache);
  }

  async _fetchMany({ cache, limit, after, withMember } = {}) {
    const raw = await this.client.api.channels(this.thread.id, 'thread-members').get({
      query: { with_member: withMember, limit, after },
    });
    return raw.reduce((col, member) => col.set(member.user_id, this._add(member, cache)), new Collection());
  }
  /**
   * Options used to fetch a thread member.
   * @typedef {BaseFetchOptions} FetchThreadMemberOptions
   * @property {boolean} [withMember] Whether to also return the guild member associated with this thread member
   */
  /**
   * Options used to fetch multiple thread members with guild member data.
   * <info>With `withMember` set to `true`, pagination is enabled.</info>
   * @typedef {Object} FetchThreadMembersWithGuildMemberDataOptions
   * @property {true} withMember Whether to also return the guild member data
   * @property {Snowflake} [after] Consider only thread members after this id
   * @property {number} [limit] The maximum number of thread members to return
   * @property {boolean} [cache] Whether to cache the fetched thread members and guild members
   */

  /**
   * Options used to fetch multiple thread members without guild member data.
   * @typedef {Object} FetchThreadMembersWithoutGuildMemberDataOptions
   * @property {false} [withMember] Whether to also return the guild member data
   * @property {boolean} [cache] Whether to cache the fetched thread members
   */

  /**
   * Options used to fetch multiple thread members.
   * @typedef {FetchThreadMembersWithGuildMemberDataOptions|
   * FetchThreadMembersWithoutGuildMemberDataOptions} FetchThreadMembersOptions
   */

  /**
   * Fetches member(s) for the thread from Discord, requires access to the `GUILD_MEMBERS` gateway intent.
   * @param {UserResolvable|FetchThreadMembersOptions|boolean} [member] The member to fetch. If `undefined`, all members
   * in the thread are fetched, and will be cached based on `options.cache`.
   * @param {FetchThreadMemberOptions|FetchThreadMembersOptions} [options] Additional options for this fetch
   * @returns {Promise<ThreadMember|Collection<Snowflake, ThreadMember>>}
   */
  fetch(member, options = { cache: true, force: false }) {
    if (typeof member === 'boolean' && !deprecationEmittedForPassingBoolean) {
      process.emitWarning(
        'Passing boolean to member option is deprecated, use cache property instead.',
        'DeprecationWarning',
      );
      deprecationEmittedForPassingBoolean = true;
    }
    const id = this.resolveId(member);
    return id
      ? this._fetchOne(id, options)
      : this._fetchMany(typeof member !== 'boolean' ? member : { ...options, cache: member });
  }
}

module.exports = ThreadMemberManager;
