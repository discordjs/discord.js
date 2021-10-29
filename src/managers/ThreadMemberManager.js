'use strict';

const { Collection } = require('@discordjs/collection');
const CachedManager = require('./CachedManager');
const { TypeError } = require('../errors');
const ThreadMember = require('../structures/ThreadMember');

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
    if (cache) existing?._patch(data);
    if (existing) return existing;

    const member = new ThreadMember(this.thread, data);
    if (cache) this.cache.set(data.user_id, member);
    return member;
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

  async _fetchOne(memberId, cache, force) {
    if (!force) {
      const existing = this.cache.get(memberId);
      if (existing) return existing;
    }

    const data = await this.client.api.channels(this.thread.id, 'thread-members', memberId).get();
    return this._add(data, cache);
  }

  async _fetchMany(cache) {
    const raw = await this.client.api.channels(this.thread.id, 'thread-members').get();
    return raw.reduce((col, member) => col.set(member.user_id, this._add(member, cache)), new Collection());
  }

  /**
   * Fetches member(s) for the thread from Discord, requires access to the `GUILD_MEMBERS` gateway intent.
   * @param {UserResolvable|boolean} [member] The member to fetch. If `undefined`, all members
   * in the thread are fetched, and will be cached based on `options.cache`. If boolean, this serves
   * the purpose of `options.cache`.
   * @param {BaseFetchOptions} [options] Additional options for this fetch
   * @returns {Promise<ThreadMember|Collection<Snowflake, ThreadMember>>}
   */
  fetch(member, { cache = true, force = false } = {}) {
    const id = this.resolveId(member);
    return id ? this._fetchOne(id, cache, force) : this._fetchMany(member ?? cache);
  }
}

module.exports = ThreadMemberManager;
