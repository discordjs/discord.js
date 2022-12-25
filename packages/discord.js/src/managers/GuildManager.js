'use strict';

const process = require('node:process');
const { setTimeout, clearTimeout } = require('node:timers');
const { Collection } = require('@discordjs/collection');
const { makeURLSearchParams } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const { Guild } = require('../structures/Guild');
const GuildChannel = require('../structures/GuildChannel');
const GuildEmoji = require('../structures/GuildEmoji');
const { GuildMember } = require('../structures/GuildMember');
const Invite = require('../structures/Invite');
const OAuth2Guild = require('../structures/OAuth2Guild');
const { Role } = require('../structures/Role');
const DataResolver = require('../util/DataResolver');
const Events = require('../util/Events');
const PermissionsBitField = require('../util/PermissionsBitField');
const SystemChannelFlagsBitField = require('../util/SystemChannelFlagsBitField');
const { resolveColor } = require('../util/Util');

let cacheWarningEmitted = false;

/**
 * Manages API methods for Guilds and stores their cache.
 * @extends {CachedManager}
 */
class GuildManager extends CachedManager {
  constructor(client, iterable) {
    super(client, Guild, iterable);
    if (!cacheWarningEmitted && this._cache.constructor.name !== 'Collection') {
      cacheWarningEmitted = true;
      process.emitWarning(
        `Overriding the cache handling for ${this.constructor.name} is unsupported and breaks functionality.`,
        'UnsupportedCacheOverwriteWarning',
      );
    }
  }

  /**
   * The cache of this Manager
   * @type {Collection<Snowflake, Guild>}
   * @name GuildManager#cache
   */

  /**
   * Data that resolves to give a Guild object. This can be:
   * * A Guild object
   * * A GuildChannel object
   * * A GuildEmoji object
   * * A Role object
   * * A Snowflake
   * * An Invite object
   * @typedef {Guild|GuildChannel|GuildMember|GuildEmoji|Role|Snowflake|Invite} GuildResolvable
   */

  /**
   * Partial data for a Role.
   * @typedef {Object} PartialRoleData
   * @property {Snowflake|number} [id] The role's id, used to set channel overrides.
   * This is a placeholder and will be replaced by the API after consumption
   * @property {string} [name] The name of the role
   * @property {ColorResolvable} [color] The color of the role, either a hex string or a base 10 number
   * @property {boolean} [hoist] Whether the role should be hoisted
   * @property {number} [position] The position of the role
   * @property {PermissionResolvable} [permissions] The permissions of the role
   * @property {boolean} [mentionable] Whether the role should be mentionable
   */

  /**
   * Partial overwrite data.
   * @typedef {Object} PartialOverwriteData
   * @property {Snowflake|number} id The id of the {@link Role} or {@link User} this overwrite belongs to
   * @property {OverwriteType} [type] The type of this overwrite
   * @property {PermissionResolvable} [allow] The permissions to allow
   * @property {PermissionResolvable} [deny] The permissions to deny
   */

  /**
   * Partial data for a Channel.
   * @typedef {Object} PartialChannelData
   * @property {Snowflake|number} [id] The channel's id, used to set its parent.
   * This is a placeholder and will be replaced by the API after consumption
   * @property {Snowflake|number} [parentId] The parent id for this channel
   * @property {ChannelType.GuildText|ChannelType.GuildVoice|ChannelType.GuildCategory} [type] The type of the channel
   * @property {string} name The name of the channel
   * @property {?string} [topic] The topic of the text channel
   * @property {boolean} [nsfw] Whether the channel is NSFW
   * @property {number} [bitrate] The bitrate of the voice channel
   * @property {number} [userLimit] The user limit of the channel
   * @property {?string} [rtcRegion] The RTC region of the channel
   * @property {VideoQualityMode} [videoQualityMode] The camera video quality mode of the channel
   * @property {PartialOverwriteData[]} [permissionOverwrites]
   * Overwrites of the channel
   * @property {number} [rateLimitPerUser] The rate limit per user (slowmode) of the channel in seconds
   */

  /**
   * Resolves a GuildResolvable to a Guild object.
   * @method resolve
   * @memberof GuildManager
   * @instance
   * @param {GuildResolvable} guild The guild resolvable to identify
   * @returns {?Guild}
   */
  resolve(guild) {
    if (
      guild instanceof GuildChannel ||
      guild instanceof GuildMember ||
      guild instanceof GuildEmoji ||
      guild instanceof Role ||
      (guild instanceof Invite && guild.guild)
    ) {
      return super.resolve(guild.guild);
    }
    return super.resolve(guild);
  }

  /**
   * Resolves a {@link GuildResolvable} to a {@link Guild} id string.
   * @method resolveId
   * @memberof GuildManager
   * @instance
   * @param {GuildResolvable} guild The guild resolvable to identify
   * @returns {?Snowflake}
   */
  resolveId(guild) {
    if (
      guild instanceof GuildChannel ||
      guild instanceof GuildMember ||
      guild instanceof GuildEmoji ||
      guild instanceof Role ||
      (guild instanceof Invite && guild.guild)
    ) {
      return super.resolveId(guild.guild.id);
    }
    return super.resolveId(guild);
  }

  /**
   * Options used to create a guild.
   * @typedef {Object} GuildCreateOptions
   * @property {string} name The name of the guild
   * @property {?(BufferResolvable|Base64Resolvable)} [icon=null] The icon for the guild
   * @property {GuildVerificationLevel} [verificationLevel] The verification level for the guild
   * @property {GuildDefaultMessageNotifications} [defaultMessageNotifications] The default message notifications
   * for the guild
   * @property {GuildExplicitContentFilter} [explicitContentFilter] The explicit content filter level for the guild
   * @property {PartialRoleData[]} [roles=[]] The roles for this guild,
   * @property {PartialChannelData[]} [channels=[]] The channels for this guild
   * @property {Snowflake|number} [afkChannelId] The AFK channel's id
   * @property {number} [afkTimeout] The AFK timeout in seconds
   * the first element of this array is used to change properties of the guild's everyone role.
   * @property {Snowflake|number} [systemChannelId] The system channel's id
   * @property {SystemChannelFlagsResolvable} [systemChannelFlags] The flags of the system channel
   */
  /* eslint-enable max-len */

  /**
   * Creates a guild.
   * <warn>This is only available to bots in fewer than 10 guilds.</warn>
   * @param {GuildCreateOptions} options Options for creating the guild
   * @returns {Promise<Guild>} The guild that was created
   */
  async create({
    name,
    icon = null,
    verificationLevel,
    defaultMessageNotifications,
    explicitContentFilter,
    roles = [],
    channels = [],
    afkChannelId,
    afkTimeout,
    systemChannelId,
    systemChannelFlags,
  }) {
    const data = await this.client.rest.post(Routes.guilds(), {
      body: {
        name,
        icon: icon && (await DataResolver.resolveImage(icon)),
        verification_level: verificationLevel,
        default_message_notifications: defaultMessageNotifications,
        explicit_content_filter: explicitContentFilter,
        roles: roles.map(({ color, permissions, ...options }) => ({
          ...options,
          color: color && resolveColor(color),
          permissions: permissions && PermissionsBitField.resolve(permissions).toString(),
        })),
        channels: channels.map(
          ({
            parentId,
            userLimit,
            rtcRegion,
            videoQualityMode,
            permissionOverwrites,
            rateLimitPerUser,
            ...options
          }) => ({
            ...options,
            parent_id: parentId,
            user_limit: userLimit,
            rtc_region: rtcRegion,
            video_quality_mode: videoQualityMode,
            permission_overwrites: permissionOverwrites?.map(({ allow, deny, ...options2 }) => ({
              ...options2,
              allow: allow && PermissionsBitField.resolve(allow).toString(),
              deny: deny && PermissionsBitField.resolve(deny).toString(),
            })),
            rate_limit_per_user: rateLimitPerUser,
          }),
        ),
        afk_channel_id: afkChannelId,
        afk_timeout: afkTimeout,
        system_channel_id: systemChannelId,
        system_channel_flags: systemChannelFlags && SystemChannelFlagsBitField.resolve(systemChannelFlags),
      },
    });

    return (
      this.client.guilds.cache.get(data.id) ??
      new Promise(resolve => {
        const handleGuild = guild => {
          if (guild.id === data.id) {
            clearTimeout(timeout);
            this.client.removeListener(Events.GuildCreate, handleGuild);
            this.client.decrementMaxListeners();
            resolve(guild);
          }
        };
        this.client.incrementMaxListeners();
        this.client.on(Events.GuildCreate, handleGuild);

        const timeout = setTimeout(() => {
          this.client.removeListener(Events.GuildCreate, handleGuild);
          this.client.decrementMaxListeners();
          resolve(this.client.guilds._add(data));
        }, 10_000).unref();
      })
    );
  }

  /**
   * Options used to fetch a single guild.
   * @typedef {BaseFetchOptions} FetchGuildOptions
   * @property {GuildResolvable} guild The guild to fetch
   * @property {boolean} [withCounts=true] Whether the approximate member and presence counts should be returned
   */

  /**
   * Options used to fetch multiple guilds.
   * @typedef {Object} FetchGuildsOptions
   * @property {Snowflake} [before] Get guilds before this guild id
   * @property {Snowflake} [after] Get guilds after this guild id
   * @property {number} [limit] Maximum number of guilds to request (1-200)
   */

  /**
   * Obtains one or multiple guilds from Discord, or the guild cache if it's already available.
   * @param {GuildResolvable|FetchGuildOptions|FetchGuildsOptions} [options] The guild's id or options
   * @returns {Promise<Guild|Collection<Snowflake, OAuth2Guild>>}
   */
  async fetch(options = {}) {
    const id = this.resolveId(options) ?? this.resolveId(options.guild);

    if (id) {
      if (!options.force) {
        const existing = this.cache.get(id);
        if (existing) return existing;
      }

      const data = await this.client.rest.get(Routes.guild(id), {
        query: makeURLSearchParams({ with_counts: options.withCounts ?? true }),
      });
      return this._add(data, options.cache);
    }

    const data = await this.client.rest.get(Routes.userGuilds(), { query: makeURLSearchParams(options) });
    return data.reduce((coll, guild) => coll.set(guild.id, new OAuth2Guild(this.client, guild)), new Collection());
  }
}

module.exports = GuildManager;
