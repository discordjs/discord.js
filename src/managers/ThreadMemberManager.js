'use strict';

const BaseManager = require('./BaseManager');
const ThreadMember = require('../structures/ThreadMember');
const Collection = require('../util/Collection');

/**
 * Manages API methods for GuildMembers and stores their cache.
 * @extends {BaseManager}
 */
class ThreadMemberManager extends BaseManager {
  constructor(thread, iterable) {
    super(thread.client, iterable, ThreadMember);
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

  add(data, cache = true) {
    const existing = this.cache.get(data.user_id);
    if (existing && existing._patch && cache) existing._patch(data);
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
   * Resolves a ThreadMemberResolvable to a ThreadMember object.
   * @param {ThreadMemberResolvable} member The user that is part of the thread
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
   * Resolves a ThreadMemberResolvable to a thread member ID string.
   * @param {ThreadMemberResolvable} member The user that is part of the guild
   * @returns {?Snowflake}
   */
  resolveID(member) {
    const memberResolvable = super.resolveID(member);
    if (memberResolvable) return memberResolvable;
    const userResolvable = this.client.users.resolveID(member);
    return this.cache.has(userResolvable) ? userResolvable : null;
  }

  /**
   * Remove a user from the thread.
   * @param {Snowflake} id The id of the member to remove
   * @param {string} [reason] The reason for removing this member from the thread
   * @returns {Promise<Snowflake>}
   */
  kick(id, reason) {
    return this.client.api
      .channels(this.thread.id, 'thread-members', id)
      .delete({ reason })
      .then(() => id);
  }

  /**
   * Fetches member(s) for the thread from Discord, requires `GUILD_MEMBERS` gateway intent.
   * @param {boolean} [cache=true] Whether or not to cache the fetched members
   * @returns {Promise<Collection<Snowflake, ThreadMember>>}
   */
  async fetch(cache = true) {
    const raw = await this.client.api.channels(this.thread.id, 'thread-members').get();
    const members = new Collection();
    raw.forEach(rawMember => {
      const member = this.add(rawMember, cache);
      members.set(member.id, member);
    });
    return members;
  }
}

module.exports = ThreadMemberManager;
