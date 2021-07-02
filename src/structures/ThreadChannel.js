'use strict';

const Channel = require('./Channel');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const MessageManager = require('../managers/MessageManager');
const ThreadMemberManager = require('../managers/ThreadMemberManager');
const Permissions = require('../util/Permissions');

/**
 * Represents a thread channel on Discord.
 * @extends {Channel}
 * @implements {TextBasedChannel}
 */
class ThreadChannel extends Channel {
  /**
   * @param {Guild} guild The guild the thread channel is part of
   * @param {APIChannel} data The data for the thread channel
   */
  constructor(guild, data) {
    super(guild.client, data, false);

    /**
     * The guild the thread is in
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * A manager of the messages set to this thread
     * @type {MessageManager}
     */
    this.messages = new MessageManager(this);

    /**
     * A manager of the members that are part of this thread
     * @type {ThreadMemberManager}
     */
    this.members = new ThreadMemberManager(this);

    this._typing = new Map();
    if (data) this._patch(data);
  }

  _patch(data) {
    super._patch(data);

    /**
     * The name of the thread
     * @type {string}
     */
    this.name = data.name;

    if ('parent_id' in data) {
      /**
       * The ID of the parent channel to this thread
       * @type {Snowflake}
       */
      this.parentID = data.parent_id;
    }

    if ('thread_metadata' in data) {
      /**
       * Whether the thread is locked
       * @type {boolean}
       */
      this.locked = data.thread_metadata.locked ?? false;

      /**
       * Whether the thread is active (false) or archived (true)
       * @type {boolean}
       */
      this.archived = data.thread_metadata.archived;

      /**
       * How long in minutes after recent activity before the thread is automatically archived
       * @type {number}
       */
      this.autoArchiveDuration = data.thread_metadata.auto_archive_duration;

      /**
       * The timestamp when the thread's archive status was last changed
       * <info>If the thread was never archived or unarchived, this is set when it's created</info>
       * @type {number}
       */
      this.archiveTimestamp = new Date(data.thread_metadata.archive_timestamp).getTime();
    }

    if ('owner_id' in data) {
      /**
       * The id of the member that created this thread
       * @type {?Snowflake}
       */
      this.ownerID = data.owner_id;
    }

    if ('last_message_id' in data) {
      /**
       * The ID of the last message sent in this thread, if one was sent
       * @type {?Snowflake}
       */
      this.lastMessageID = data.last_message_id;
    }

    if ('last_pin_timestamp' in data) {
      /**
       * The timestamp when the last pinned message was pinned, if there was one
       * @type {?number}
       */
      this.lastPinTimestamp = data.last_pin_timestamp ? new Date(data.last_pin_timestamp).getTime() : null;
    }

    if ('rate_limit_per_user' in data) {
      /**
       * The ratelimit per user for this thread in seconds
       * @type {number}
       */
      this.rateLimitPerUser = data.rate_limit_per_user ?? 0;
    }

    if ('message_count' in data) {
      /**
       * The approximate count of messages in this thread
       * <info>This value will not count above 50 even when there are more than 50 messages
       * If you need an approximate value higher than this, use ThreadChannel#messages.cache.size</info>
       * @type {number}
       */
      this.messageCount = data.message_count;
    }

    if ('member_count' in data) {
      /**
       * The approximate count of users in this thread
       * <info>This value will not count above 50 even when there are more than 50 members</info>
       * @type {number}
       */
      this.memberCount = data.member_count;
    }

    if (data.member && this.client.user) this.members._add({ user_id: this.client.user.id, ...data.member });
    if (data.messages) for (const message of data.messages) this.messages.add(message);
  }

  /**
   * A collection of the guild member objects for each of this thread's members
   * @type {Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get guildMembers() {
    return this.members.cache.mapValues(member => member.guildMember);
  }

  /**
   * The time when the thread's archive status was last changed
   * <info>If the thread was never archived or unarchived, this is set when it's created</info>
   * @type {Date}
   * @readonly
   */
  get archivedAt() {
    return new Date(this.archiveTimestamp);
  }

  /**
   * The parent channel of this thread
   * @type {?(NewsChannel|TextChannel)}
   * @readonly
   */
  get parent() {
    return this.guild.channels.resolve(this.parentID);
  }

  /**
   * Makes the client user join the thread.
   * @returns {Promise<ThreadChannel>}
   */
  join() {
    return this.members.add('@me').then(() => this);
  }

  /**
   * Makes the client user leave the thread.
   * @returns {Promise<ThreadChannel>}
   */
  leave() {
    return this.members.remove('@me').then(() => this);
  }

  /**
   * Gets the overall set of permissions for a member or role in this threads' parent, taking into account overwrites.
   * @param {GuildMemberResolvable|RoleResolvable} memberOrRole The member or role to obtain the overall permissions for
   * @returns {?Readonly<Permissions>}
   */
  permissionsFor(memberOrRole) {
    return this.parent?.permissionsFor(memberOrRole) ?? null;
  }

  /**
   * Edits the thread.
   * @param {APIChannel} data The new data for the thread
   * @param {string} [data.name] The new name for the trhead
   * @param {boolean} [data.archived] Whether the thread is archived
   * @param {number} [data.autoArchiveDuration] How long in minutes before the thread is automatically archived,
   * one of `60`, `1440`, `4320`, or `10080`
   * @param {number} [data.rateLimitPerUser] The ratelimit per user for the thread in seconds
   * @param {boolean} [data.locked] Whether the thread is locked
   * @param {string} [reason] Reason for editing this thread
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Edit a thread
   * thread.edit({ name: 'new-thread' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async edit(data, reason) {
    const newData = await this.client.api.channels(this.id).patch({
      data: {
        name: (data.name ?? this.name).trim(),
        archived: data.archived,
        auto_archive_duration: data.autoArchiveDuration,
        rate_limit_per_user: data.rateLimitPerUser,
        locked: data.locked,
      },
      reason,
    });

    return this.client.actions.ChannelUpdate.handle(newData).updated;
  }

  /**
   * Sets whether the thread is archived.
   * @param {boolean} [archived=true] Whether the thread is archived
   * @param {string} [reason] Reason for archiving or unarchiving
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Set the thread to archived
   * thread.setArchived(true)
   *   .then(newThread => console.log(`Thread is now ${newThread.archived ? 'archived' : 'active'}`))
   *   .catch(console.error);
   */
  setArchived(archived = true, reason) {
    return this.edit({ archived }, reason);
  }

  /**
   * Sets the duration before the channel is automatically archived.
   * @param {ThreadAutoArchiveDuration} autoArchiveDuration How long before the thread is automatically archived
   * @param {string} [reason] Reason for changing the archive time
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Set the thread auto archive time to 1 hour
   * thread.setAutoArchiveDuration(60)
   *   .then(newThread => {
   *     console.log(`Thread will now archive after ${newThread.autoArchiveDuration}`);
   *    });
   *   .catch(console.error);
   */
  setAutoArchiveDuration(autoArchiveDuration, reason) {
    return this.edit({ autoArchiveDuration }, reason);
  }

  /**
   * Sets whether the thread can be archived by anyone or just mods.
   * @param {boolean} [locked=true] Whether the thread is locked
   * @param {string} [reason] Reason for archiving or unarchiving
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Set the thread to locked
   * thread.setLocked(true)
   *   .then(newThread => console.log(`Thread is now ${newThread.locked ? 'locked' : 'unlocked'}`))
   *   .catch(console.error);
   */
  setLocked(locked = true, reason) {
    return this.edit({ locked }, reason);
  }

  /**
   * Sets a new name for the thread.
   * @param {string} name The new name for the thread
   * @param {string} [reason] Reason for changing the thread's name
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Set a new thread name
   * thread.setName('not_general')
   *   .then(newThread => console.log(`Thread's new name is ${newThread.name}`))
   *   .catch(console.error);
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Sets the rate limit per user for this thread.
   * @param {number} rateLimitPerUser The new ratelimit in seconds
   * @param {string} [reason] Reason for changing the thread's ratelimits
   * @returns {Promise<ThreadChannel>}
   */
  setRateLimitPerUser(rateLimitPerUser, reason) {
    return this.edit({ rateLimitPerUser }, reason);
  }

  /**
   * Whether the thread is editable by the client user (name, archived, autoArchiveDuration)
   * @type {boolean}
   * @readonly
   */
  get editable() {
    return this.ownerID === this.client.user.id || this.manageable;
  }

  /**
   * Whether the thread is joinable by the client user
   * @type {boolean}
   * @readonly
   */
  get joinable() {
    return (
      !this.archived &&
      this.permissionsFor(this.client.user)?.has(
        this.type === 'private_thread' ? Permissions.FLAGS.MANAGE_THREADS : Permissions.FLAGS.VIEW_CHANNEL,
        false,
      )
    );
  }

  /**
   * Whether the thread is manageable by the client user, for deleting or editing rateLimitPerUser or locked.
   * @type {boolean}
   * @readonly
   */
  get manageable() {
    return this.permissionsFor(this.client.user)?.has(Permissions.FLAGS.MANAGE_THREADS, false);
  }

  /**
   * Whether the client user can send messages in this thread
   * @type {boolean}
   * @readonly
   */
  get sendable() {
    return (
      !this.archived &&
      this.permissionsFor(this.client.user)?.any(
        [
          Permissions.FLAGS.SEND_MESSAGES,
          this.type === 'private_thread' ? Permissions.FLAGS.USE_PRIVATE_THREADS : Permissions.FLAGS.USE_PUBLIC_THREADS,
        ],
        false,
      )
    );
  }

  /**
   * Whether the thread is unarchivable by the client user
   * @type {boolean}
   * @readonly
   */
  get unarchivable() {
    return this.archived && (this.locked ? this.manageable : this.sendable);
  }

  /**
   * Deletes this thread.
   * @param {string} [reason] Reason for deleting this thread
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Delete the thread
   * thread.delete('cleaning out old threads')
   *   .then(console.log)
   *   .catch(console.error);
   */
  delete(reason) {
    return this.client.api
      .channels(this.id)
      .delete({ reason })
      .then(() => this);
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  get lastMessage() {}
  get lastPinAt() {}
  send() {}
  startTyping() {}
  stopTyping() {}
  get typing() {}
  get typingCount() {}
  createMessageCollector() {}
  awaitMessages() {}
  createMessageComponentInteractionCollector() {}
  awaitMessageComponentInteractions() {}
  bulkDelete() {}
}

TextBasedChannel.applyToClass(ThreadChannel, true);

module.exports = ThreadChannel;
