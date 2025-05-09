'use strict';

const { lazy } = require('@discordjs/util');
const { ChannelFlags, ChannelType, PermissionFlagsBits, Routes } = require('discord-api-types/v10');
const { BaseChannel } = require('./BaseChannel.js');
const getThreadOnlyChannel = lazy(() => require('./ThreadOnlyChannel.js'));
const { TextBasedChannel } = require('./interfaces/TextBasedChannel.js');
const { DiscordjsRangeError, ErrorCodes } = require('../errors/index.js');
const { GuildMessageManager } = require('../managers/GuildMessageManager.js');
const { ThreadMemberManager } = require('../managers/ThreadMemberManager.js');
const { ChannelFlagsBitField } = require('../util/ChannelFlagsBitField.js');

/**
 * Represents a thread channel on Discord.
 * @extends {BaseChannel}
 * @implements {TextBasedChannel}
 */
class ThreadChannel extends BaseChannel {
  constructor(guild, data, client) {
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
     * The id of the member who created this thread
     * @type {Snowflake}
     */
    this.ownerId = data.owner_id;

    /**
     * A manager of the messages sent to this thread
     * @type {GuildMessageManager}
     */
    this.messages = new GuildMessageManager(this);

    /**
     * A manager of the members that are part of this thread
     * @type {ThreadMemberManager}
     */
    this.members = new ThreadMemberManager(this);
    if (data) this._patch(data);
  }

  _patch(data) {
    super._patch(data);

    if ('message' in data) this.messages._add(data.message);

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
       * Whether members without the {@link PermissionFlagsBits.ManageThreads} permission
       * can invite other members to this thread.
       * <info>This property is always `null` in public threads.</info>
       * @type {?boolean}
       */
      this.invitable = this.type === ChannelType.PrivateThread ? (data.thread_metadata.invitable ?? false) : null;

      /**
       * Whether the thread is archived
       * @type {?boolean}
       */
      this.archived = data.thread_metadata.archived;

      /**
       * The amount of time (in minutes) after which the thread will automatically archive in case of no recent activity
       * @type {?ThreadAutoArchiveDuration}
       */
      this.autoArchiveDuration = data.thread_metadata.auto_archive_duration;

      /**
       * The timestamp when the thread's archive status was last changed
       * <info>If the thread was never archived or unarchived, this is the timestamp at which the thread was
       * created</info>
       * @type {?number}
       */
      this.archiveTimestamp = Date.parse(data.thread_metadata.archive_timestamp);

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

    this._createdTimestamp ??= this.type === ChannelType.PrivateThread ? super.createdTimestamp : null;

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
      this.lastPinTimestamp = data.last_pin_timestamp ? Date.parse(data.last_pin_timestamp) : null;
    } else {
      this.lastPinTimestamp ??= null;
    }

    if ('rate_limit_per_user' in data) {
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
       * The approximate count of messages in this thread
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

    if (data.member && this.client.user) this.members._add({ user_id: this.client.user.id, ...data.member });
    if (data.messages) for (const message of data.messages) this.messages._add(message);

    if ('applied_tags' in data) {
      /**
       * The tags applied to this thread
       * @type {Snowflake[]}
       */
      this.appliedTags = data.applied_tags;
    } else {
      this.appliedTags ??= [];
    }
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
    return this.archiveTimestamp && new Date(this.archiveTimestamp);
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
   * @type {?(AnnouncementChannel|TextChannel|ForumChannel|MediaChannel)}
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
   * @param {UserResolvable|RoleResolvable} memberOrRole The member or role to obtain the overall permissions for
   * @param {boolean} [checkAdmin=true] Whether having the {@link PermissionFlagsBits.Administrator} permission
   * will return all permissions
   * @returns {?Readonly<PermissionsBitField>}
   */
  permissionsFor(memberOrRole, checkAdmin) {
    return this.parent?.permissionsFor(memberOrRole, checkAdmin) ?? null;
  }

  /**
   * Options used to fetch a thread owner.
   * @typedef {BaseFetchOptions} FetchThreadOwnerOptions
   * @property {boolean} [withMember] Whether to also return the guild member associated with this thread member
   */

  /**
   * Fetches the owner of this thread. If the thread member object isn't needed,
   * use {@link ThreadChannel#ownerId} instead.
   * @param {FetchThreadOwnerOptions} [options] Options for fetching the owner
   * @returns {Promise<ThreadMember>}
   */
  async fetchOwner(options) {
    const member = await this.members._fetchSingle({ ...options, member: this.ownerId });
    return member;
  }

  /**
   * Fetches the message that started this thread, if any.
   * <info>The `Promise` will reject if the original message in a forum post is deleted
   * or when the original message in the parent channel is deleted.
   * If you just need the id of that message, use {@link BaseChannel#id} instead.</info>
   * @param {BaseFetchOptions} [options] Additional options for this fetch
   * @returns {Promise<?Message<true>>}
   */
  async fetchStarterMessage(options) {
    const channel = this.parent instanceof getThreadOnlyChannel() ? this : this.parent;
    return channel?.messages.fetch({ message: this.id, ...options }) ?? null;
  }

  /**
   * The options used to edit a thread channel
   * @typedef {Object} ThreadEditOptions
   * @property {string} [name] The new name for the thread
   * @property {boolean} [archived] Whether the thread is archived
   * @property {ThreadAutoArchiveDuration} [autoArchiveDuration] The amount of time after which the thread
   * should automatically archive in case of no recent activity
   * @property {number} [rateLimitPerUser] The rate limit per user (slowmode) for the thread in seconds
   * @property {boolean} [locked] Whether the thread is locked
   * @property {boolean} [invitable] Whether non-moderators can add other non-moderators to a thread
   * <info>Can only be edited on {@link ChannelType.PrivateThread}</info>
   * @property {Snowflake[]} [appliedTags] The tags to apply to the thread
   * @property {ChannelFlagsResolvable} [flags] The flags to set on the channel
   * @property {string} [reason] Reason for editing the thread
   */

  /**
   * Edits this thread.
   * @param {ThreadEditOptions} options The options to provide
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Edit a thread
   * thread.edit({ name: 'new-thread' })
   *   .then(editedThread => console.log(editedThread))
   *   .catch(console.error);
   */
  async edit(options) {
    const newData = await this.client.rest.patch(Routes.channel(this.id), {
      body: {
        name: (options.name ?? this.name).trim(),
        archived: options.archived,
        auto_archive_duration: options.autoArchiveDuration,
        rate_limit_per_user: options.rateLimitPerUser,
        locked: options.locked,
        invitable: this.type === ChannelType.PrivateThread ? options.invitable : undefined,
        applied_tags: options.appliedTags,
        flags: 'flags' in options ? ChannelFlagsBitField.resolve(options.flags) : undefined,
      },
      reason: options.reason,
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
    return this.edit({ archived, reason });
  }

  /**
   * Sets the duration after which the thread will automatically archive in case of no recent activity.
   * @param {ThreadAutoArchiveDuration} autoArchiveDuration The amount of time after which the thread
   * should automatically archive in case of no recent activity
   * @param {string} [reason] Reason for changing the auto archive duration
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Set the thread's auto archive time to 1 hour
   * thread.setAutoArchiveDuration(ThreadAutoArchiveDuration.OneHour)
   *   .then(newThread => {
   *     console.log(`Thread will now archive after ${newThread.autoArchiveDuration} minutes of inactivity`);
   *    });
   *   .catch(console.error);
   */
  setAutoArchiveDuration(autoArchiveDuration, reason) {
    return this.edit({ autoArchiveDuration, reason });
  }

  /**
   * Sets whether members without the {@link PermissionFlagsBits.ManageThreads} permission
   * can invite other members to this thread.
   * @param {boolean} [invitable=true] Whether non-moderators can invite non-moderators to this thread
   * @param {string} [reason] Reason for changing invite
   * @returns {Promise<ThreadChannel>}
   */
  async setInvitable(invitable = true, reason) {
    if (this.type !== ChannelType.PrivateThread) {
      throw new DiscordjsRangeError(ErrorCodes.ThreadInvitableType, this.type);
    }
    return this.edit({ invitable, reason });
  }

  /**
   * Sets whether the thread can be **unarchived** by anyone with the
   * {@link PermissionFlagsBits.SendMessages} permission. When a thread is locked, only members with the
   * {@link PermissionFlagsBits.ManageThreads} permission can unarchive it.
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
    return this.edit({ locked, reason });
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
    return this.edit({ name, reason });
  }

  /**
   * Sets the rate limit per user (slowmode) for this thread.
   * @param {number} rateLimitPerUser The new rate limit in seconds
   * @param {string} [reason] Reason for changing the thread's rate limit
   * @returns {Promise<ThreadChannel>}
   */
  setRateLimitPerUser(rateLimitPerUser, reason) {
    return this.edit({ rateLimitPerUser, reason });
  }

  /**
   * Set the applied tags for this channel (only applicable to forum threads)
   * @param {Snowflake[]} appliedTags The tags to set for this channel
   * @param {string} [reason] Reason for changing the thread's applied tags
   * @returns {Promise<ThreadChannel>}
   */
  setAppliedTags(appliedTags, reason) {
    return this.edit({ appliedTags, reason });
  }

  /**
   * Pins this thread from the forum channel (only applicable to forum threads).
   * @param {string} [reason] Reason for pinning
   * @returns {Promise<ThreadChannel>}
   */
  pin(reason) {
    return this.edit({ flags: this.flags.add(ChannelFlags.Pinned), reason });
  }

  /**
   * Unpins this thread from the forum channel (only applicable to forum threads).
   * @param {string} [reason] Reason for unpinning
   * @returns {Promise<ThreadChannel>}
   */
  unpin(reason) {
    return this.edit({ flags: this.flags.remove(ChannelFlags.Pinned), reason });
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
      (this.ownerId === this.client.user.id && (this.type !== ChannelType.PrivateThread || this.joined)) ||
      this.manageable
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
        this.type === ChannelType.PrivateThread ? PermissionFlagsBits.ManageThreads : PermissionFlagsBits.ViewChannel,
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
    if (permissions.has(PermissionFlagsBits.Administrator, false)) return true;

    return (
      this.guild.members.me.communicationDisabledUntilTimestamp < Date.now() &&
      permissions.has(PermissionFlagsBits.ManageThreads, false)
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
    return permissions.has(PermissionFlagsBits.ViewChannel, false);
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
    if (permissions.has(PermissionFlagsBits.Administrator, false)) return true;

    return (
      !(this.archived && this.locked && !this.manageable) &&
      (this.type !== ChannelType.PrivateThread || this.joined || this.manageable) &&
      permissions.has(PermissionFlagsBits.SendMessagesInThreads, false) &&
      this.guild.members.me.communicationDisabledUntilTimestamp < Date.now()
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

TextBasedChannel.applyToClass(ThreadChannel, ['fetchWebhooks', 'setRateLimitPerUser', 'setNSFW']);

exports.ThreadChannel = ThreadChannel;
