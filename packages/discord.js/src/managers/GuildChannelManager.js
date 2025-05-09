'use strict';

const process = require('node:process');
const { Collection } = require('@discordjs/collection');
const { ChannelType, Routes } = require('discord-api-types/v10');
const { CachedManager } = require('./CachedManager.js');
const { GuildTextThreadManager } = require('./GuildTextThreadManager.js');
const { DiscordjsError, DiscordjsTypeError, ErrorCodes } = require('../errors/index.js');
const { GuildChannel } = require('../structures/GuildChannel.js');
const { PermissionOverwrites } = require('../structures/PermissionOverwrites.js');
const { ThreadChannel } = require('../structures/ThreadChannel.js');
const { Webhook } = require('../structures/Webhook.js');
const { ChannelFlagsBitField } = require('../util/ChannelFlagsBitField.js');
const { transformGuildForumTag, transformGuildDefaultReaction } = require('../util/Channels.js');
const { ThreadChannelTypes } = require('../util/Constants.js');
const { resolveImage } = require('../util/DataResolver.js');
const { setPosition } = require('../util/Util.js');

let cacheWarningEmitted = false;

/**
 * Manages API methods for GuildChannels and stores their cache.
 * @extends {CachedManager}
 */
class GuildChannelManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, GuildChannel, iterable);
    const defaultCaching =
      this._cache.constructor.name === 'Collection' ||
      this._cache.maxSize === undefined ||
      this._cache.maxSize === Infinity;
    if (!cacheWarningEmitted && !defaultCaching) {
      cacheWarningEmitted = true;
      process.emitWarning(
        `Overriding the cache handling for ${this.constructor.name} is unsupported and breaks functionality.`,
        'UnsupportedCacheOverwriteWarning',
      );
    }

    /**
     * The guild this Manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The number of channels in this managers cache excluding thread channels
   * that do not count towards a guild's maximum channels restriction.
   * @type {number}
   * @readonly
   */
  get channelCountWithoutThreads() {
    return this.cache.reduce((acc, channel) => {
      if (ThreadChannelTypes.includes(channel.type)) return acc;
      return acc + 1;
    }, 0);
  }

  /**
   * The cache of this Manager
   * @type {Collection<Snowflake, GuildChannel|ThreadChannel>}
   * @name GuildChannelManager#cache
   */

  _add(channel) {
    const existing = this.cache.get(channel.id);
    if (existing) return existing;
    this.cache.set(channel.id, channel);
    return channel;
  }

  /**
   * Data that can be resolved to give a Guild Channel object. This can be:
   * * A GuildChannel object
   * * A ThreadChannel object
   * * A Snowflake
   * @typedef {GuildChannel|ThreadChannel|Snowflake} GuildChannelResolvable
   */

  /**
   * Resolves a GuildChannelResolvable to a Channel object.
   * @param {GuildChannelResolvable} channel The GuildChannel resolvable to resolve
   * @returns {?(GuildChannel|ThreadChannel)}
   */
  resolve(channel) {
    if (channel instanceof ThreadChannel) return super.cache.get(channel.id) ?? null;
    return super.resolve(channel);
  }

  /**
   * Resolves a GuildChannelResolvable to a channel id.
   * @param {GuildChannelResolvable} channel The GuildChannel resolvable to resolve
   * @returns {?Snowflake}
   */
  resolveId(channel) {
    if (channel instanceof ThreadChannel) return super.resolveId(channel.id);
    return super.resolveId(channel);
  }

  /**
   * Data that can be resolved to an Announcement Channel object. This can be:
   * * An Announcement Channel object
   * * A Snowflake
   * @typedef {AnnouncementChannel|Snowflake} AnnouncementChannelResolvable
   */

  /**
   * Represents the followed channel data.
   * @typedef {Object} FollowedChannelData
   * @property {Snowflake} channelId Source channel id
   * @property {Snowflake} webhookId Created webhook id in the target channel
   */

  /**
   * Adds the target channel to a channel's followers.
   * @param {AnnouncementChannelResolvable} channel The channel to follow
   * @param {TextChannelResolvable} targetChannel The channel where published announcements will be posted at
   * @param {string} [reason] Reason for creating the webhook
   * @returns {Promise<FollowedChannelData>} Returns the data for the followed channel
   */
  async addFollower(channel, targetChannel, reason) {
    const channelId = this.resolveId(channel);
    if (!channelId) {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'channel', 'AnnouncementChannelResolvable');
    }
    const targetChannelId = this.resolveId(targetChannel);
    if (!targetChannelId) {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'targetChannel', 'TextChannelResolvable');
    }
    const data = await this.client.rest.post(Routes.channelFollowers(channelId), {
      body: { webhook_channel_id: targetChannelId },
      reason,
    });
    return { channelId: data.channel_id, webhookId: data.webhook_id };
  }

  /**
   * Options used to create a new channel in a guild.
   * @typedef {CategoryCreateChannelOptions} GuildChannelCreateOptions
   * @property {?CategoryChannelResolvable} [parent] Parent of the new channel
   */

  /**
   * Creates a new channel in the guild.
   * @param {GuildChannelCreateOptions} options Options for creating the new channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Create a new text channel
   * guild.channels.create({ name: 'new-general', reason: 'Needed a cool new channel' })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Create a new channel with permission overwrites
   * guild.channels.create({
   *   name: 'new-general',
   *   type: ChannelType.GuildVoice,
   *   permissionOverwrites: [
   *      {
   *        id: message.author.id,
   *        deny: [PermissionFlagsBits.ViewChannel],
   *     },
   *   ],
   * })
   */
  async create({
    name,
    type,
    topic,
    nsfw,
    bitrate,
    userLimit,
    parent,
    permissionOverwrites,
    position,
    rateLimitPerUser,
    rtcRegion,
    videoQualityMode,
    defaultThreadRateLimitPerUser,
    availableTags,
    defaultReactionEmoji,
    defaultAutoArchiveDuration,
    defaultSortOrder,
    defaultForumLayout,
    reason,
  }) {
    const data = await this.client.rest.post(Routes.guildChannels(this.guild.id), {
      body: {
        name,
        topic,
        type,
        nsfw,
        bitrate,
        user_limit: userLimit,
        parent_id: parent && this.client.channels.resolveId(parent),
        position,
        permission_overwrites: permissionOverwrites?.map(overwrite =>
          PermissionOverwrites.resolve(overwrite, this.guild),
        ),
        rate_limit_per_user: rateLimitPerUser,
        rtc_region: rtcRegion,
        video_quality_mode: videoQualityMode,
        default_thread_rate_limit_per_user: defaultThreadRateLimitPerUser,
        available_tags: availableTags?.map(availableTag => transformGuildForumTag(availableTag)),
        default_reaction_emoji: defaultReactionEmoji && transformGuildDefaultReaction(defaultReactionEmoji),
        default_auto_archive_duration: defaultAutoArchiveDuration,
        default_sort_order: defaultSortOrder,
        default_forum_layout: defaultForumLayout,
      },
      reason,
    });
    return this.client.actions.ChannelCreate.handle(data).channel;
  }

  /**
   * @typedef {ChannelWebhookCreateOptions} WebhookCreateOptions
   * @property {TextChannel|AnnouncementChannel|VoiceChannel|StageChannel|ForumChannel|MediaChannel|Snowflake} channel
   * The channel to create the webhook for
   */

  /**
   * Creates a webhook for the channel.
   * @param {WebhookCreateOptions} options Options for creating the webhook
   * @returns {Promise<Webhook>} Returns the created Webhook
   * @example
   * // Create a webhook for the current channel
   * guild.channels.createWebhook({
   *   channel: '222197033908436994',
   *   name: 'Snek',
   *   avatar: 'https://i.imgur.com/mI8XcpG.jpg',
   *   reason: 'Needed a cool new Webhook'
   * })
   *   .then(console.log)
   *   .catch(console.error)
   */
  async createWebhook({ channel, name, avatar, reason }) {
    const channelId = this.resolveId(channel);
    if (!channelId) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'channel', 'GuildChannelResolvable');

    const resolvedAvatar = await resolveImage(avatar);

    const data = await this.client.rest.post(Routes.channelWebhooks(channelId), {
      body: {
        name,
        avatar: resolvedAvatar,
      },
      reason,
    });

    return new Webhook(this.client, data);
  }

  /**
   * Options used to edit a guild channel.
   * @typedef {Object} GuildChannelEditOptions
   * @property {string} [name] The name of the channel
   * @property {ChannelType} [type] The type of the channel (only conversion between text and announcement is supported)
   * @property {number} [position] The position of the channel
   * @property {?string} [topic] The topic of the text channel
   * @property {boolean} [nsfw] Whether the channel is NSFW
   * @property {number} [bitrate] The bitrate of the voice channel
   * @property {number} [userLimit] The user limit of the voice channel
   * @property {?CategoryChannelResolvable} [parent] The parent of the channel
   * @property {boolean} [lockPermissions]
   * Lock the permissions of the channel to what the parent's permissions are
   * @property {OverwriteResolvable[]|Collection<Snowflake, OverwriteResolvable>} [permissionOverwrites]
   * Permission overwrites for the channel
   * @property {number} [rateLimitPerUser] The rate limit per user (slowmode) for the channel in seconds
   * @property {ThreadAutoArchiveDuration} [defaultAutoArchiveDuration]
   * The default auto archive duration for all new threads in this channel
   * @property {?string} [rtcRegion] The RTC region of the channel
   * @property {?VideoQualityMode} [videoQualityMode] The camera video quality mode of the channel
   * @property {GuildForumTagData[]} [availableTags] The tags to set as available in a forum channel
   * @property {?DefaultReactionEmoji} [defaultReactionEmoji] The emoji to set as the default reaction emoji
   * @property {number} [defaultThreadRateLimitPerUser] The rate limit per user (slowmode) to set on forum posts
   * @property {ChannelFlagsResolvable} [flags] The flags to set on the channel
   * @property {?SortOrderType} [defaultSortOrder] The default sort order mode to set on the channel
   * @property {ForumLayoutType} [defaultForumLayout] The default forum layout to set on the channel
   * @property {string} [reason] Reason for editing this channel
   */

  /**
   * Edits the channel.
   * @param {GuildChannelResolvable} channel The channel to edit
   * @param {GuildChannelEditOptions} options Options for editing the channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Edit a channel
   * guild.channels.edit('222197033908436994', { name: 'new-channel' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async edit(channel, options) {
    const resolvedChannel = this.resolve(channel);
    if (!resolvedChannel) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'channel', 'GuildChannelResolvable');

    const parentId = options.parent && this.client.channels.resolveId(options.parent);

    if (options.position !== undefined) {
      await this.setPosition(resolvedChannel, options.position, { position: options.position, reason: options.reason });
    }

    let permission_overwrites = options.permissionOverwrites?.map(overwrite =>
      PermissionOverwrites.resolve(overwrite, this.guild),
    );

    if (options.lockPermissions) {
      if (parentId) {
        const newParent = this.cache.get(parentId);
        if (newParent?.type === ChannelType.GuildCategory) {
          permission_overwrites = newParent.permissionOverwrites.cache.map(overwrite =>
            PermissionOverwrites.resolve(overwrite, this.guild),
          );
        }
      } else if (resolvedChannel.parent) {
        permission_overwrites = resolvedChannel.parent.permissionOverwrites.cache.map(overwrite =>
          PermissionOverwrites.resolve(overwrite, this.guild),
        );
      }
    }

    const newData = await this.client.rest.patch(Routes.channel(resolvedChannel.id), {
      body: {
        name: options.name,
        type: options.type,
        topic: options.topic,
        nsfw: options.nsfw,
        bitrate: options.bitrate,
        user_limit: options.userLimit,
        rtc_region: options.rtcRegion,
        video_quality_mode: options.videoQualityMode,
        parent_id: parentId,
        lock_permissions: options.lockPermissions,
        rate_limit_per_user: options.rateLimitPerUser,
        default_auto_archive_duration: options.defaultAutoArchiveDuration,
        permission_overwrites,
        available_tags: options.availableTags?.map(availableTag => transformGuildForumTag(availableTag)),
        default_reaction_emoji:
          options.defaultReactionEmoji && transformGuildDefaultReaction(options.defaultReactionEmoji),
        default_thread_rate_limit_per_user: options.defaultThreadRateLimitPerUser,
        flags: 'flags' in options ? ChannelFlagsBitField.resolve(options.flags) : undefined,
        default_sort_order: options.defaultSortOrder,
        default_forum_layout: options.defaultForumLayout,
      },
      reason: options.reason,
    });

    return this.client.actions.ChannelUpdate.handle(newData).updated;
  }

  /**
   * Sets a new position for the guild channel.
   * @param {GuildChannelResolvable} channel The channel to set the position for
   * @param {number} position The new position for the guild channel
   * @param {SetChannelPositionOptions} options Options for setting position
   * @returns {Promise<GuildChannel>}
   * @example
   * // Set a new channel position
   * guild.channels.setPosition('222078374472843266', 2)
   *   .then(newChannel => console.log(`Channel's new position is ${newChannel.position}`))
   *   .catch(console.error);
   */
  async setPosition(channel, position, { relative, reason } = {}) {
    const resolvedChannel = this.resolve(channel);
    if (!resolvedChannel) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'channel', 'GuildChannelResolvable');

    const updatedChannels = await setPosition(
      resolvedChannel,
      position,
      relative,
      this.guild._sortedChannels(resolvedChannel),
      this.client,
      Routes.guildChannels(this.guild.id),
      reason,
    );

    this.client.actions.GuildChannelsPositionUpdate.handle({
      guild_id: this.guild.id,
      channels: updatedChannels,
    });

    return resolvedChannel;
  }

  /**
   * Obtains one or more guild channels from Discord, or the channel cache if they're already available.
   * @param {Snowflake} [id] The channel's id
   * @param {BaseFetchOptions} [options] Additional options for this fetch
   * @returns {Promise<?GuildChannel|ThreadChannel|Collection<Snowflake, ?GuildChannel>>}
   * @example
   * // Fetch all channels from the guild (excluding threads)
   * message.guild.channels.fetch()
   *   .then(channels => console.log(`There are ${channels.size} channels.`))
   *   .catch(console.error);
   * @example
   * // Fetch a single channel
   * message.guild.channels.fetch('222197033908436994')
   *   .then(channel => console.log(`The channel name is: ${channel.name}`))
   *   .catch(console.error);
   */
  async fetch(id, { cache = true, force = false } = {}) {
    if (id && !force) {
      const existing = this.cache.get(id);
      if (existing) return existing;
    }

    if (id) {
      const data = await this.client.rest.get(Routes.channel(id));
      // Since this is the guild manager, throw if on a different guild
      if (this.guild.id !== data.guild_id) throw new DiscordjsError(ErrorCodes.GuildChannelUnowned);
      return this.client.channels._add(data, this.guild, { cache });
    }

    const data = await this.client.rest.get(Routes.guildChannels(this.guild.id));
    const channels = new Collection();
    for (const channel of data) channels.set(channel.id, this.client.channels._add(channel, this.guild, { cache }));
    return channels;
  }

  /**
   * Fetches all webhooks for the channel.
   * @param {GuildChannelResolvable} channel The channel to fetch webhooks for
   * @returns {Promise<Collection<Snowflake, Webhook>>}
   * @example
   * // Fetch webhooks
   * guild.channels.fetchWebhooks('769862166131245066')
   *   .then(hooks => console.log(`This channel has ${hooks.size} hooks`))
   *   .catch(console.error);
   */
  async fetchWebhooks(channel) {
    const id = this.resolveId(channel);
    if (!id) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'channel', 'GuildChannelResolvable');
    const data = await this.client.rest.get(Routes.channelWebhooks(id));
    return data.reduce((hooks, hook) => hooks.set(hook.id, new Webhook(this.client, hook)), new Collection());
  }

  /**
   * Data that can be resolved to give a Category Channel object. This can be:
   * * A CategoryChannel object
   * * A Snowflake
   * @typedef {CategoryChannel|Snowflake} CategoryChannelResolvable
   */

  /**
   * The data needed for updating a channel's position.
   * @typedef {Object} ChannelPosition
   * @property {GuildChannel|Snowflake} channel Channel to update
   * @property {number} [position] New position for the channel
   * @property {CategoryChannelResolvable} [parent] Parent channel for this channel
   * @property {boolean} [lockPermissions] If the overwrites should be locked to the parents overwrites
   */

  /**
   * Batch-updates the guild's channels' positions.
   * <info>Only one channel's parent can be changed at a time</info>
   * @param {ChannelPosition[]} channelPositions Channel positions to update
   * @returns {Promise<Guild>}
   * @example
   * guild.channels.setPositions([{ channel: channelId, position: newChannelIndex }])
   *   .then(guild => console.log(`Updated channel positions for ${guild}`))
   *   .catch(console.error);
   */
  async setPositions(channelPositions) {
    const resolvedChannelPositions = channelPositions.map(channelPosition => ({
      id: this.client.channels.resolveId(channelPosition.channel),
      position: channelPosition.position,
      lock_permissions: channelPosition.lockPermissions,
      parent_id: channelPosition.parent !== undefined ? this.resolveId(channelPosition.parent) : undefined,
    }));

    await this.client.rest.patch(Routes.guildChannels(this.guild.id), { body: resolvedChannelPositions });

    return this.client.actions.GuildChannelsPositionUpdate.handle({
      guild_id: this.guild.id,
      channels: resolvedChannelPositions,
    }).guild;
  }

  /**
   * Data returned from fetching threads.
   * @typedef {Object} FetchedThreads
   * @property {Collection<Snowflake, ThreadChannel>} threads The threads that were fetched
   * @property {Collection<Snowflake, ThreadMember>} members The thread members in the received threads
   */

  /**
   * Obtains all active thread channels in the guild.
   * @param {boolean} [cache=true] Whether to cache the fetched data
   * @returns {Promise<FetchedThreads>}
   * @example
   * // Fetch all threads from the guild
   * message.guild.channels.fetchActiveThreads()
   *   .then(fetched => console.log(`There are ${fetched.threads.size} threads.`))
   *   .catch(console.error);
   */
  async fetchActiveThreads(cache = true) {
    const data = await this.rawFetchGuildActiveThreads();
    return GuildTextThreadManager._mapThreads(data, this.client, { guild: this.guild, cache });
  }

  /**
   * `GET /guilds/{guild.id}/threads/active`
   * @private
   * @returns {Promise<RESTGetAPIGuildThreadsResult>}
   */
  rawFetchGuildActiveThreads() {
    return this.client.rest.get(Routes.guildActiveThreads(this.guild.id));
  }

  /**
   * Deletes the channel.
   * @param {GuildChannelResolvable} channel The channel to delete
   * @param {string} [reason] Reason for deleting this channel
   * @returns {Promise<void>}
   * @example
   * // Delete the channel
   * guild.channels.delete('858850993013260338', 'making room for new channels')
   *   .then(console.log)
   *   .catch(console.error);
   */
  async delete(channel, reason) {
    const id = this.resolveId(channel);
    if (!id) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'channel', 'GuildChannelResolvable');
    await this.client.rest.delete(Routes.channel(id), { reason });
    this.client.actions.ChannelDelete.handle({ id });
  }
}

exports.GuildChannelManager = GuildChannelManager;
