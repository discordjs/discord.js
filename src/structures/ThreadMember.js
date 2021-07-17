'use strict';

const Base = require('./Base');
const ThreadMemberFlags = require('../util/ThreadMemberFlags');

/**
 * Represents a Member for a Thread.
 * @extends {Base}
 */
class ThreadMember extends Base {
  /**
   * @param {ThreadChannel} thread The thread that this member is associated with
   * @param {APIThreadMember} data The data for the thread member
   */
  constructor(thread, data) {
    super(thread.client);

    /**
     * The thread that this member is a part of
     * @type {ThreadChannel}
     */
    this.thread = thread;

    /**
     * The timestamp the member last joined the thread at
     * @type {?number}
     */
    this.joinedTimestamp = null;

    /**
     * The id of the thread member
     * @type {Snowflake}
     */
    this.id = data.user_id;

    this._patch(data);
  }

  _patch(data) {
    this.joinedTimestamp = new Date(data.join_timestamp).getTime();

    /**
     * The flags for this thread member
     * @type {ThreadMemberFlags}
     */
    this.flags = new ThreadMemberFlags(data.flags).freeze();
  }

  /**
   * The guild member associated with this thread member
   * @type {?GuildMember}
   * @readonly
   */
  get guildMember() {
    return this.thread.guild.members.resolve(this.id);
  }

  /**
   * The last time this member joined the thread
   * @type {?Date}
   * @readonly
   */
  get joinedAt() {
    return this.joinedTimestamp ? new Date(this.joinedTimestamp) : null;
  }

  /**
   * The user associated with this thread member
   * @type {?User}
   * @readonly
   */
  get user() {
    return this.client.users.resolve(this.id);
  }

  /**
   * Whether the client user can manage this thread member
   * @type {boolean}
   * @readonly
   */
  get manageable() {
    return !this.thread.archived && this.thread.editable;
  }

  /**
   * Removes this member from the thread.
   * @param {string} [reason] Reason for removing the member
   * @returns {ThreadMember}
   */
  remove(reason) {
    return this.thread.members.remove(this.id, reason).then(() => this);
  }
}

module.exports = ThreadMember;

/**
 * @external APIThreadMember
 * @see {@link https://discord.com/developers/docs/resources/channel#thread-member-object}
 */
