'use strict';

const Base = require('./Base');
const ThreadMemberFlagsBitField = require('../util/ThreadMemberFlagsBitField');
const { emitDeprecationWarningForRemoveThreadMember } = require('../util/Util');

/**
 * Represents a Member for a Thread.
 * @extends {Base}
 */
class ThreadMember extends Base {
  constructor(thread, data, extra = {}) {
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
     * The flags for this thread member. This will be `null` if partial.
     * @type {?ThreadMemberFlagsBitField}
     */
    this.flags = null;

    /**
     * The id of the thread member
     * @type {Snowflake}
     */
    this.id = data.user_id;

    this._patch(data, extra);
  }

  _patch(data, extra = {}) {
    if ('join_timestamp' in data) this.joinedTimestamp = Date.parse(data.join_timestamp);
    if ('flags' in data) this.flags = new ThreadMemberFlagsBitField(data.flags).freeze();

    if ('member' in data) {
      /**
       * The guild member associated with this thread member.
       * @type {?GuildMember}
       * @private
       */
      this.member = this.thread.guild.members._add(data.member, extra.cache);
    } else {
      this.member ??= null;
    }
  }

  /**
   * Whether this thread member is a partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return this.flags === null;
  }

  /**
   * The guild member associated with this thread member
   * @type {?GuildMember}
   * @readonly
   */
  get guildMember() {
    return this.member ?? this.thread.guild.members.cache.get(this.id) ?? null;
  }

  /**
   * The last time this member joined the thread
   * @type {?Date}
   * @readonly
   */
  get joinedAt() {
    return this.joinedTimestamp && new Date(this.joinedTimestamp);
  }

  /**
   * The user associated with this thread member
   * @type {?User}
   * @readonly
   */
  get user() {
    return this.client.users.cache.get(this.id) ?? null;
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
   * <warn>This parameter is **deprecated**. Reasons cannot be used.</warn>
   * @returns {Promise<ThreadMember>}
   */
  async remove(reason) {
    if (reason !== undefined) {
      emitDeprecationWarningForRemoveThreadMember(this.constructor.name);
    }

    await this.thread.members.remove(this.id, reason);
    return this;
  }
}

module.exports = ThreadMember;
