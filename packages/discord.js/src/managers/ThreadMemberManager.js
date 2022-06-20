'use strict';

const { Collection } = require('@discordjs/collection');
const { Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const { TypeError, ErrorCodes } = require('../errors');
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
   * Fetches the client user as a ThreadMember of the thread.
   * @param {BaseFetchOptions} [options] The options for fetching the member
   * @returns {Promise<ThreadMember>}
   */
  fetchMe(options) {
    return this.fetch({ ...options, member: this.client.user.id });
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
    if (!id) throw new TypeError(ErrorCodes.InvalidType, 'member', 'UserResolvable');
    await this.client.rest.put(Routes.threadMembers(this.thread.id, id), { reason });
    return id;
  }

  /**
   * Remove a user from the thread.
   * @param {Snowflake|'@me'} id The id of the member to remove
   * @param {string} [reason] The reason for removing this member from the thread
   * @returns {Promise<Snowflake>}
   */
  async remove(id, reason) {
    await this.client.rest.delete(Routes.threadMembers(this.thread.id, id), { reason });
    return id;
  }

  /**
   * @typedef {BaseFetchOptions} FetchThreadMemberOptions
   * @property {ThreadMemberResolvable} member The thread member to fetch
   */

  /**
   * @typedef {Object} FetchThreadMembersOptions
   * @property {boolean} [cache] Whether to cache the fetched thread members
   */

  /**
   * Fetches thread member(s) from Discord. Requires the `GUILD_MEMBERS` gateway intent.
   * @param {ThreadMemberResolvable|FetchThreadMemberOptions|FetchThreadMembersOptions} [options]
   * Options for fetching thread member(s)
   * @returns {Promise<ThreadMember|Collection<Snowflake, ThreadMember>>}
   */
  fetch(options) {
    if (!options) return this._fetchMany();
    const { member, cache, force } = options;
    const resolvedMember = this.resolveId(member ?? options);
    if (resolvedMember) return this._fetchSingle({ member: resolvedMember, cache, force });
    return this._fetchMany(options);
  }

  async _fetchSingle({ member, cache, force = false }) {
    if (!force) {
      const existing = this.cache.get(member);
      if (existing) return existing;
    }

    const data = await this.client.rest.get(Routes.threadMembers(this.thread.id, member));
    return this._add(data, cache);
  }

  async _fetchMany(options = {}) {
    const data = await this.client.rest.get(Routes.threadMembers(this.thread.id));
    return data.reduce((col, member) => col.set(member.user_id, this._add(member, options.cache)), new Collection());
  }
}

module.exports = ThreadMemberManager;
