'use strict';

const process = require('node:process');
const { Collection } = require('@discordjs/collection');
const { ChannelType, Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const GuildTextThreadManager = require('./GuildTextThreadManager');
const { DiscordjsError, DiscordjsTypeError, ErrorCodes } = require('../errors');
const GuildChannel = require('../structures/GuildChannel');
const PermissionOverwrites = require('../structures/PermissionOverwrites');
const ThreadChannel = require('../structures/ThreadChannel');
const Webhook = require('../structures/Webhook');
const ChannelFlagsBitField = require('../util/ChannelFlagsBitField');
const { transformGuildForumTag, transformGuildDefaultReaction } = require('../util/Channels');
const { ThreadChannelTypes } = require('../util/Constants');
const DataResolver = require('../util/DataResolver');
const { setPosition } = require('../util/Util');

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
      return ++acc;
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
    if (channel instanceof ThreadChannel) return super.resolve(channel.id);
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
   * Adds the target channel to channel's followers.
   * @param {TextChannelResolvable} channel The channel the follower should be added to
   * @param {TextChannelResolvable} targetChannel The channel where the webhook should be created
   * @param {string} [reason] Reason for creating the webhook
   * @returns {Promise<Snowflake>} Returns created target webhook id.
   */
  async addFollower(channel, targetChannel, reason) {
    const channelId = this.client.channels.resolveId(channel);
    const targetChannelId = this.client.channels.resolveId(targetChannel);
    if (!channelId || !targetChannelId) throw new Error(ErrorCodes.GuildChannelResolve);
    const { webhook_id } = await this.client.rest.post(Routes.channelFollowers(channelId), {
      body: { webhook_channel_id: targetChannelId },
      reason,
    });
    return webhook_id;
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
    availableTags,
    defaultReactionEmoji,
    defaultAutoArchiveDuration,
    defaultSortOrder,
    reason,
  }) {
    parent &&= this.client.channels.resolveId(parent);
    permissionOverwrites &&= permissionOverwrites.map(o => PermissionOverwrites.resolve(o, this.guild));

    const data = await this.client.rest.post(Routes.guildChannels(this.guild.id), {
      body: {
        name,
        topic,
        type,
        nsfw,
        bitrate,
        user_limit: userLimit,
        parent_id: parent,
        position,
        permission_overwrites: permissionOverwrites,
        rate_limit_per_user: rateLimitPerUser,
        rtc_region: rtcRegion,
        video_quality_mode: videoQualityMode,
        available_tags: availableTags?.map(availableTag => transformGuildForumTag(availableTag)),
        default_reaction_emoji: defaultReactionEmoji && transformGuildDefaultReaction(defaultReactionEmoji),
        default_auto_archive_duration: defaultAutoArchiveDuration,
        default_sort_order: defaultSortOrder,
      },
      reason,
    });
    return this.client.actions.ChannelCreate.handle(data).channel;
  }

  /**
   * @typedef {ChannelWebhookCreateOptions} WebhookCreateOptions
   * @property {TextChannel|NewsChannel|VoiceChannel|ForumChannel|Snowflake} channel
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
    const id = this.resolveId(channel);
    if (!id) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'channel', 'GuildChannelResolvable');
    if (typeof avatar === 'string' && !avatar.startsWith('data:')) {
      avatar = await DataResolver.resolveImage(avatar);
    }
    const data = await this.client.rest.post(Routes.channelWebhooks(id), {
      body: {
        name,
        avatar,
      },
      reason,
    });
    return new Webhook(this.client, data);
  }

  /**
   * Options used to edit a guild channel.
   * @typedef {Object} GuildChannelEditOptions
   * @property {string} [name] The name of the channel
   * @property {ChannelType} [type] The type of the channel (only conversion between text and news is supported)
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
   * @property {string} [reason] Reason for editing this channel
   */

  /**
   * Edits the channel.
   * @param {GuildChannelResolvable} channel The channel to edit
   * @param {GuildChannelEditOptions} data Options for editing the channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Edit a channel
   * guild.channels.edit('222197033908436994', { name: 'new-channel' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async edit(channel, data) {
    channel = this.resolve(channel);
    if (!channel) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'channel', 'GuildChannelResolvable');

    const parent = data.parent && this.client.channels.resolveId(data.parent);

    if (typeof data.position !== 'undefined') {
      await this.setPosition(channel, data.position, { position: data.position, reason: data.reason });
    }

    let permission_overwrites = data.permissionOverwrites?.map(o => PermissionOverwrites.resolve(o, this.guild));

    if (data.lockPermissions) {
      if (parent) {
        const newParent = this.guild.channels.resolve(parent);
        if (newParent?.type === ChannelType.GuildCategory) {
          permission_overwrites = newParent.permissionOverwrites.cache.map(o =>
            PermissionOverwrites.resolve(o, this.guild),
          );
        }
      } else if (channel.parent) {
        permission_overwrites = channel.parent.permissionOverwrites.cache.map(o =>
          PermissionOverwrites.resolve(o, this.guild),
        );
      }
    }

    const newData = await this.client.rest.patch(Routes.channel(channel.id), {
      body: {
        name: (data.name ?? channel.name).trim(),
        type: data.type,
        topic: data.topic,
        nsfw: data.nsfw,
        bitrate: data.bitrate ?? channel.bitrate,
        user_limit: data.userLimit ?? channel.userLimit,
        rtc_region: 'rtcRegion' in data ? data.rtcRegion : channel.rtcRegion,
        video_quality_mode: data.videoQualityMode,
        parent_id: parent,
        lock_permissions: data.lockPermissions,
        rate_limit_per_user: data.rateLimitPerUser,
        default_auto_archive_duration: data.defaultAutoArchiveDuration,
        permission_overwrites,
        available_tags: data.availableTags?.map(availableTag => transformGuildForumTag(availableTag)),
        default_reaction_emoji: data.defaultReactionEmoji && transformGuildDefaultReaction(data.defaultReactionEmoji),
        default_thread_rate_limit_per_user: data.defaultThreadRateLimitPerUser,
        flags: 'flags' in data ? ChannelFlagsBitField.resolve(data.flags) : undefined,
        default_sort_order: data.defaultSortOrder,
      },
      reason: data.reason,
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
    channel = this.resolve(channel);
    if (!channel) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'channel', 'GuildChannelResolvable');
    const updatedChannels = await setPosition(
      channel,
      position,
      relative,
      this.guild._sortedChannels(channel),
      this.client,
      Routes.guildChannels(this.guild.id),
      reason,
    );

    this.client.actions.GuildChannelsPositionUpdate.handle({
      guild_id: this.guild.id,
      channels: updatedChannels,
    });
    return channel;
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
    channelPositions = channelPositions.map(r => ({
      id: this.client.channels.resolveId(r.channel),
      position: r.position,
      lock_permissions: r.lockPermissions,
      parent_id: typeof r.parent !== 'undefined' ? this.resolveId(r.parent) : undefined,
    }));

    await this.client.rest.patch(Routes.guildChannels(this.guild.id), { body: channelPositions });
    return this.client.actions.GuildChannelsPositionUpdate.handle({
      guild_id: this.guild.id,
      channels: channelPositions,
    }).guild;
  }

  /**
   * Obtains all active thread channels in the guild from Discord
   * @param {boolean} [cache=true] Whether to cache the fetched data
   * @returns {Promise<FetchedThreads>}
   * @example
   * // Fetch all threads from the guild
   * message.guild.channels.fetchActiveThreads()
   *   .then(fetched => console.log(`There are ${fetched.threads.size} threads.`))
   *   .catch(console.error);
   */
  async fetchActiveThreads(cache = true) {
    const raw = await this.client.rest.get(Routes.guildActiveThreads(this.guild.id));
    return GuildTextThreadManager._mapThreads(raw, this.client, { guild: this.guild, cache });
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

module.exports = GuildChannelManager;
