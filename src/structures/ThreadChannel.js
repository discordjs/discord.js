'use strict';

const { Channel } = require('./Channel');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const { RangeError } = require('../errors');
const MessageManager = require('../managers/MessageManager');
const ThreadMemberManager = require('../managers/ThreadMemberManager');
const ChannelFlags = require('../util/ChannelFlags');
const Permissions = require('../util/Permissions');
const { resolveAutoArchiveMaxLimit } = require('../util/Util');

/**
 * Represents a thread channel on Discord.
 * @extends {Channel}
 * @implements {TextBasedChannel}
 */
class ThreadChannel extends Channel {
  constructor(guild, data, client, fromInteraction = false) {
    super(guild?.client ?? client, data, false);

    /**
     * The guild the thread is in
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The id of the guild the channel is in
     * @type {Snowflake}
     */
    this.guildId = guild?.id ?? data.guild_id;

    /**
     * A manager of the messages sent to this thread
     * @type {MessageManager}
     */
    this.messages = new MessageManager(this);

    /**
     * A manager of the members that are part of this thread
     * @type {ThreadMemberManager}
     */
    this.members = new ThreadMemberManager(this);
    if (data) this._patch(data, fromInteraction);
  }

  _patch(data, partial = false) {
    super._patch(data);

    if ('name' in data) {
      /**
       * The name of the thread
       * @type {string}
       */
      this.name = data.name;
    }

    if ('guild_id' in data) {
      this.guildId = data.guild_id;
    }

    if ('parent_id' in data) {
      /**
       * The id of the parent channel of this thread
       * @type {?Snowflake}
       */
      this.parentId = data.parent_id;
    } else {
      this.parentId ??= null;
    }

    if ('thread_metadata' in data) {
      /**
       * Whether the thread is locked
       * @type {?boolean}
       */
      this.locked = data.thread_metadata.locked ?? false;

      /**
       * Whether members without `MANAGE_THREADS` can invite other members without `MANAGE_THREADS`
       * <info>Always `null` in public threads</info>
       * @type {?boolean}
       */
      this.invitable = this.type === 'GUILD_PRIVATE_THREAD' ? data.thread_metadata.invitable ?? false : null;

      /**
       * Whether the thread is archived
       * @type {?boolean}
       */
      this.archived = data.thread_metadata.archived;

      /**
       * The amount of time (in minutes) after which the thread will automatically archive in case of no recent activity
       * @type {?number}
       */
      this.autoArchiveDuration = data.thread_metadata.auto_archive_duration;

      /**
       * The timestamp when the thread's archive status was last changed
       * <info>If the thread was never archived or unarchived, this is the timestamp at which the thread was
       * created</info>
       * @type {?number}
       */
      this.archiveTimestamp = new Date(data.thread_metadata.archive_timestamp).getTime();

      if ('create_timestamp' in data.thread_metadata) {
        // Note: this is needed because we can't assign directly to getters
        this._createdTimestamp = Date.parse(data.thread_metadata.create_timestamp);
      }
    } else {
      this.locked ??= null;
      this.archived ??= null;
      this.autoArchiveDuration ??= null;
      this.archiveTimestamp ??= null;
      this.invitable ??= null;
    }

    this._createdTimestamp ??= this.type === 'GUILD_PRIVATE_THREAD' ? super.createdTimestamp : null;

    if ('owner_id' in data) {
      /**
       * The id of the member who created this thread
       * @type {?Snowflake}
       */
      this.ownerId = data.owner_id;
    } else {
      this.ownerId ??= null;
    }

    if ('last_message_id' in data) {
      /**
       * The last message id sent in this thread, if one was sent
       * @type {?Snowflake}
       */
      this.lastMessageId = data.last_message_id;
    } else {
      this.lastMessageId ??= null;
    }

    if ('last_pin_timestamp' in data) {
      /**
       * The timestamp when the last pinned message was pinned, if there was one
       * @type {?number}
       */
      this.lastPinTimestamp = data.last_pin_timestamp ? new Date(data.last_pin_timestamp).getTime() : null;
    } else {
      this.lastPinTimestamp ??= null;
    }

    if ('rate_limit_per_user' in data || !partial) {
      /**
       * The rate limit per user (slowmode) for this thread in seconds
       * @type {?number}
       */
      this.rateLimitPerUser = data.rate_limit_per_user ?? 0;
    } else {
      this.rateLimitPerUser ??= null;
    }

    if ('message_count' in data) {
      /**
       * <info>Threads created before July 1, 2022 may have an inaccurate count.
       * If you need an approximate value higher than that, use `ThreadChannel#messages.cache.size`</info>
       * @type {?number}
       */
      this.messageCount = data.message_count;
    } else {
      this.messageCount ??= null;
    }

    if ('member_count' in data) {
      /**
       * The approximate count of users in this thread
       * <info>This stops counting at 50. If you need an approximate value higher than that, use
       * `ThreadChannel#members.cache.size`</info>
       * @type {?number}
       */
      this.memberCount = data.member_count;
    } else {
      this.memberCount ??= null;
    }

    if ('total_message_sent' in data) {
      /**
       * The number of messages ever sent in a thread, similar to {@link ThreadChannel#messageCount} except it
       * will not decrement whenever a message is deleted
       * @type {?number}
       */
      this.totalMessageSent = data.total_message_sent;
    } else {
      this.totalMessageSent ??= null;
    }

    if ('applied_tags' in data) {
      /**
       * The tags applied to this thread
       * @type {Snowflake[]}
       */
      this.appliedTags = data.applied_tags;
    } else {
      this.appliedTags ??= [];
    }

    if (data.member && this.client.user) this.members._add({ user_id: this.client.user.id, ...data.member });
    if (data.messages) for (const message of data.messages) this.messages._add(message);
  }

  /**
   * The timestamp when this thread was created. This isn't available for threads
   * created before 2022-01-09
   * @type {?number}
   * @readonly
   */
  get createdTimestamp() {
    return this._createdTimestamp;
  }

  /**
   * A collection of associated guild member objects of this thread's members
   * @type {Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get guildMembers() {
    return this.members.cache.mapValues(member => member.guildMember);
  }

  /**
   * The time at which this thread's archive status was last changed
   * <info>If the thread was never archived or unarchived, this is the time at which the thread was created</info>
   * @type {?Date}
   * @readonly
   */
  get archivedAt() {
    if (!this.archiveTimestamp) return null;
    return new Date(this.archiveTimestamp);
  }

  /**
   * The time the thread was created at
   * @type {?Date}
   * @readonly
   */
  get createdAt() {
    return this.createdTimestamp && new Date(this.createdTimestamp);
  }

  /**
   * The parent channel of this thread
   * @type {?(NewsChannel|TextChannel|ForumChannel)}
   * @readonly
   */
  get parent() {
    return this.guild.channels.resolve(this.parentId);
  }

  /**
   * Makes the client user join the thread.
   * @returns {Promise<ThreadChannel>}
   */
  async join() {
    await this.members.add('@me');
    return this;
  }

  /**
   * Makes the client user leave the thread.
   * @returns {Promise<ThreadChannel>}
   */
  async leave() {
    await this.members.remove('@me');
    return this;
  }

  /**
   * Gets the overall set of permissions for a member or role in this thread's parent channel, taking overwrites into
   * account.
   * @param {GuildMemberResolvable|RoleResolvable} memberOrRole The member or role to obtain the overall permissions for
   * @param {boolean} [checkAdmin=true] Whether having `ADMINISTRATOR` will return all permissions
   * @returns {?Readonly<Permissions>}
   */
  permissionsFor(memberOrRole, checkAdmin) {
    return this.parent?.permissionsFor(memberOrRole, checkAdmin) ?? null;
  }

  /**
   * Fetches the owner of this thread. If the thread member object isn't needed,
   * use {@link ThreadChannel#ownerId} instead.
   * @param {BaseFetchOptions} [options] The options for fetching the member
   * @returns {Promise<?ThreadMember>}
   */
  async fetchOwner({ cache = true, force = false } = {}) {
    if (!force) {
      const existing = this.members.cache.get(this.ownerId);
      if (existing) return existing;
    }

    // We cannot fetch a single thread member, as of this commit's date, Discord API responds with 405
    const members = await this.members.fetch(cache);
    return members.get(this.ownerId) ?? null;
  }

  /**
   * Fetches the message that started this thread, if any.
   * <info>The `Promise` will reject if the original message in a forum post is deleted
   * or when the original message in the parent channel is deleted.
   * If you just need the id of that message, use {@link ThreadChannel#id} instead.</info>
   * @param {BaseFetchOptions} [options] Additional options for this fetch
   * @returns {Promise<Message|null>}
   */
  // eslint-disable-next-line require-await
  async fetchStarterMessage(options) {
    const channel = this.parent?.type === 'GUILD_FORUM' ? this : this.parent;
    return channel?.messages.fetch({ message: this.id, ...options }) ?? null;
  }

  /**
   * The options used to edit a thread channel
   * @typedef {Object} ThreadEditData
   * @property {string} [name] The new name for the thread
   * @property {boolean} [archived] Whether the thread is archived
   * @property {ThreadAutoArchiveDuration} [autoArchiveDuration] The amount of time (in minutes) after which the thread
   * should automatically archive in case of no recent activity
   * @property {number} [rateLimitPerUser] The rate limit per user (slowmode) for the thread in seconds
   * @property {boolean} [locked] Whether the thread is locked
   * @property {boolean} [invitable] Whether non-moderators can add other non-moderators to a thread
   * @property {ChannelFlagsResolvable} [flags] The flags to set on the channel
   * <info>Can only be edited on `GUILD_PRIVATE_THREAD`</info>
   */

  /**
   * Edits this thread.
   * @param {ThreadEditData} data The new data for this thread
   * @param {string} [reason] Reason for editing this thread
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Edit a thread
   * thread.edit({ name: 'new-thread' })
   *   .then(editedThread => console.log(editedThread))
   *   .catch(console.error);
   */
  async edit(data, reason) {
    let autoArchiveDuration = data.autoArchiveDuration;
    if (autoArchiveDuration === 'MAX') autoArchiveDuration = resolveAutoArchiveMaxLimit(this.guild);

    const newData = await this.client.api.channels(this.id).patch({
      data: {
        name: (data.name ?? this.name).trim(),
        archived: data.archived,
        auto_archive_duration: autoArchiveDuration,
        rate_limit_per_user: data.rateLimitPerUser,
        locked: data.locked,
        invitable: this.type === 'GUILD_PRIVATE_THREAD' ? data.invitable : undefined,
        applied_tags: data.appliedTags,
        flags: 'flags' in data ? ChannelFlags.resolve(data.flags) : undefined,
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
   * // Archive the thread
   * thread.setArchived(true)
   *   .then(newThread => console.log(`Thread is now ${newThread.archived ? 'archived' : 'active'}`))
   *   .catch(console.error);
   */
  setArchived(archived = true, reason) {
    return this.edit({ archived }, reason);
  }

  /**
   * Sets the duration after which the thread will automatically archive in case of no recent activity.
   * @param {ThreadAutoArchiveDuration} autoArchiveDuration The amount of time (in minutes) after which the thread
   * should automatically archive in case of no recent activity
   * @param {string} [reason] Reason for changing the auto archive duration
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Set the thread's auto archive time to 1 hour
   * thread.setAutoArchiveDuration(60)
   *   .then(newThread => {
   *     console.log(`Thread will now archive after ${newThread.autoArchiveDuration} minutes of inactivity`);
   *    });
   *   .catch(console.error);
   */
  setAutoArchiveDuration(autoArchiveDuration, reason) {
    return this.edit({ autoArchiveDuration }, reason);
  }

  /**
   * Sets whether members without the `MANAGE_THREADS` permission can invite other members without the
   * `MANAGE_THREADS` permission to this thread.
   * @param {boolean} [invitable=true] Whether non-moderators can invite non-moderators to this thread
   * @param {string} [reason] Reason for changing invite
   * @returns {Promise<ThreadChannel>}
   */
  setInvitable(invitable = true, reason) {
    if (this.type !== 'GUILD_PRIVATE_THREAD') return Promise.reject(new RangeError('THREAD_INVITABLE_TYPE', this.type));
    return this.edit({ invitable }, reason);
  }

  /**
   * Sets whether the thread can be **unarchived** by anyone with `SEND_MESSAGES` permission.
   * When a thread is locked only members with `MANAGE_THREADS` can unarchive it.
   * @param {boolean} [locked=true] Whether the thread is locked
   * @param {string} [reason] Reason for locking or unlocking the thread
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
   * Sets a new name for this thread.
   * @param {string} name The new name for the thread
   * @param {string} [reason] Reason for changing the thread's name
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Change the thread's name
   * thread.setName('not_general')
   *   .then(newThread => console.log(`Thread's new name is ${newThread.name}`))
   *   .catch(console.error);
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Sets the rate limit per user (slowmode) for this thread.
   * @param {number} rateLimitPerUser The new rate limit in seconds
   * @param {string} [reason] Reason for changing the thread's rate limit
   * @returns {Promise<ThreadChannel>}
   */
  setRateLimitPerUser(rateLimitPerUser, reason) {
    return this.edit({ rateLimitPerUser }, reason);
  }

  /**
   * Pins this thread from the forum channel.
   * @param {string} [reason] Reason for pinning
   * @returns {Promise<ThreadChannel>}
   */
  pin(reason) {
    return this.edit({ flags: this.flags.add(ChannelFlags.FLAGS.PINNED) }, reason);
  }

  /**
   * Unpins this thread from the forum channel.
   * @param {string} [reason] Reason for unpinning
   * @returns {Promise<ThreadChannel>}
   */
  unpin(reason) {
    return this.edit({ flags: this.flags.remove(ChannelFlags.FLAGS.PINNED) }, reason);
  }

  /**
   * Set the applied tags for this channel (only applicable to forum threads)
   * @param {Snowflake[]} appliedTags The tags to set for this channel
   * @param {string} [reason] Reason for changing the thread's applied tags
   * @returns {Promise<GuildForumThreadChannel>}
   */
  setAppliedTags(appliedTags, reason) {
    return this.edit({ appliedTags }, reason);
  }

  /**
   * Whether the client user is a member of the thread.
   * @type {boolean}
   * @readonly
   */
  get joined() {
    return this.members.cache.has(this.client.user?.id);
  }

  /**
   * Whether the thread is editable by the client user (name, archived, autoArchiveDuration)
   * @type {boolean}
   * @readonly
   */
  get editable() {
    return (
      (this.ownerId === this.client.user.id && (this.type !== 'GUILD_PRIVATE_THREAD' || this.joined)) || this.manageable
    );
  }

  /**
   * Whether the thread is joinable by the client user
   * @type {boolean}
   * @readonly
   */
  get joinable() {
    return (
      !this.archived &&
      !this.joined &&
      this.permissionsFor(this.client.user)?.has(
        this.type === 'GUILD_PRIVATE_THREAD' ? Permissions.FLAGS.MANAGE_THREADS : Permissions.FLAGS.VIEW_CHANNEL,
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
    const permissions = this.permissionsFor(this.client.user);
    if (!permissions) return false;
    // This flag allows managing even if timed out
    if (permissions.has(Permissions.FLAGS.ADMINISTRATOR, false)) return true;

    return (
      this.guild.me.communicationDisabledUntilTimestamp < Date.now() &&
      permissions.has(Permissions.FLAGS.MANAGE_THREADS, false)
    );
  }

  /**
   * Whether the thread is viewable by the client user
   * @type {boolean}
   * @readonly
   */
  get viewable() {
    if (this.client.user.id === this.guild.ownerId) return true;
    const permissions = this.permissionsFor(this.client.user);
    if (!permissions) return false;
    return permissions.has(Permissions.FLAGS.VIEW_CHANNEL, false);
  }

  /**
   * Whether the client user can send messages in this thread
   * @type {boolean}
   * @readonly
   */
  get sendable() {
    const permissions = this.permissionsFor(this.client.user);
    if (!permissions) return false;
    // This flag allows sending even if timed out
    if (permissions.has(Permissions.FLAGS.ADMINISTRATOR, false)) return true;

    return (
      !(this.archived && this.locked && !this.manageable) &&
      (this.type !== 'GUILD_PRIVATE_THREAD' || this.joined || this.manageable) &&
      permissions.has(Permissions.FLAGS.SEND_MESSAGES_IN_THREADS, false) &&
      this.guild.me.communicationDisabledUntilTimestamp < Date.now()
    );
  }

  /**
   * Whether the thread is unarchivable by the client user
   * @type {boolean}
   * @readonly
   */
  get unarchivable() {
    return this.archived && this.sendable && (!this.locked || this.manageable);
  }

  /**
   * Whether this thread is a private thread
   * @returns {boolean}
   */
  isPrivate() {
    return this.type === 'GUILD_PRIVATE_THREAD';
  }

  /**
   * Deletes this thread.
   * @param {string} [reason] Reason for deleting this thread
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Delete the thread
   * thread.delete('cleaning out old threads')
   *   .then(deletedThread => console.log(deletedThread))
   *   .catch(console.error);
   */
  async delete(reason) {
    await this.guild.channels.delete(this.id, reason);
    return this;
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  get lastMessage() {}
  get lastPinAt() {}
  send() {}
  sendTyping() {}
  createMessageCollector() {}
  awaitMessages() {}
  createMessageComponentCollector() {}
  awaitMessageComponent() {}
  bulkDelete() {}
  // Doesn't work on Thread channels; setRateLimitPerUser() {}
  // Doesn't work on Thread channels; setNSFW() {}
}

TextBasedChannel.applyToClass(ThreadChannel, true, ['fetchWebhooks', 'setRateLimitPerUser', 'setNSFW']);

module.exports = ThreadChannel;
