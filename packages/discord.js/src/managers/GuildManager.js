'use strict';

const process = require('node:process');
const { setTimeout, clearTimeout } = require('node:timers');
const { Collection } = require('@discordjs/collection');
const { makeURLSearchParams } = require('@discordjs/rest');
const { GatewayOpcodes, Routes, RouteBases } = require('discord-api-types/v10');
const { DiscordjsError, ErrorCodes } = require('../errors/index.js');
const { ShardClientUtil } = require('../sharding/ShardClientUtil.js');
const { Guild } = require('../structures/Guild.js');
const { GuildChannel } = require('../structures/GuildChannel.js');
const { GuildEmoji } = require('../structures/GuildEmoji.js');
const { GuildInvite } = require('../structures/GuildInvite.js');
const { GuildMember } = require('../structures/GuildMember.js');
const { OAuth2Guild } = require('../structures/OAuth2Guild.js');
const { Role } = require('../structures/Role.js');
const { Events } = require('../util/Events.js');
const { _transformAPIIncidentsData } = require('../util/Transformers.js');
const { CachedManager } = require('./CachedManager.js');

let cacheWarningEmitted = false;

/**
 * Manages API methods for Guilds and stores their cache.
 *
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
   *
   * @type {Collection<Snowflake, Guild>}
   * @name GuildManager#cache
   */

  /**
   * Data that resolves to give a Guild object. This can be:
   * - A Guild object
   * - A GuildChannel object
   * - A GuildEmoji object
   * - A Role object
   * - A Snowflake
   * - An Invite object
   *
   * @typedef {Guild|GuildChannel|GuildMember|GuildEmoji|Role|Snowflake|Invite} GuildResolvable
   */

  /**
   * Resolves a {@link GuildResolvable} to a {@link Guild} object.
   *
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
      (guild instanceof GuildInvite && guild.guild)
    ) {
      return super.resolve(guild.guild);
    }

    return super.resolve(guild);
  }

  /**
   * Resolves a {@link GuildResolvable} to a {@link Guild} id string.
   *
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
      (guild instanceof GuildInvite && guild.guild)
    ) {
      return super.resolveId(guild.guild.id);
    }

    return super.resolveId(guild);
  }

  /**
   * Options used to fetch a single guild.
   *
   * @typedef {BaseFetchOptions} FetchGuildOptions
   * @property {GuildResolvable} guild The guild to fetch
   * @property {boolean} [withCounts=true] Whether the approximate member and presence counts should be returned
   */

  /**
   * Options used to fetch multiple guilds.
   *
   * @typedef {Object} FetchGuildsOptions
   * @property {Snowflake} [before] Get guilds before this guild id
   * @property {Snowflake} [after] Get guilds after this guild id
   * @property {number} [limit] Maximum number of guilds to request (1-200)
   */

  /**
   * Obtains one or multiple guilds from Discord, or the guild cache if it's already available.
   *
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

      const innerData = await this.client.rest.get(Routes.guild(id), {
        query: makeURLSearchParams({ with_counts: options.withCounts ?? true }),
      });
      innerData.shardId = ShardClientUtil.shardIdForGuildId(id, await this.client.ws.fetchShardCount());
      return this._add(innerData, options.cache);
    }

    const data = await this.client.rest.get(Routes.userGuilds(), { query: makeURLSearchParams(options) });
    return data.reduce((coll, guild) => coll.set(guild.id, new OAuth2Guild(this.client, guild)), new Collection());
  }

  /**
   * @typedef {Object} FetchSoundboardSoundsOptions
   * @property {Snowflake[]} guildIds The ids of the guilds to fetch soundboard sounds for
   * @property {number} [time=10_000] The timeout for receipt of the soundboard sounds
   */

  /**
   * Fetches soundboard sounds for the specified guilds.
   *
   * @param {FetchSoundboardSoundsOptions} options The options for fetching soundboard sounds
   * @returns {Promise<Collection<Snowflake, Collection<Snowflake, SoundboardSound>>>}
   * @example
   * // Fetch soundboard sounds for multiple guilds
   * const soundboardSounds = await client.guilds.fetchSoundboardSounds({
   *  guildIds: ['123456789012345678', '987654321098765432'],
   * })
   *
   * console.log(soundboardSounds.get('123456789012345678'));
   */
  async fetchSoundboardSounds({ guildIds, time = 10_000 }) {
    const shardCount = await this.client.ws.getShardCount();
    const shardIds = Map.groupBy(guildIds, guildId => ShardClientUtil.shardIdForGuildId(guildId, shardCount));

    for (const [shardId, shardGuildIds] of shardIds) {
      this.client.ws.send(shardId, {
        op: GatewayOpcodes.RequestSoundboardSounds,
        // eslint-disable-next-line id-length
        d: {
          guild_ids: shardGuildIds,
        },
      });
    }

    return new Promise((resolve, reject) => {
      const remainingGuildIds = new Set(guildIds);

      const fetchedSoundboardSounds = new Collection();

      const handler = (soundboardSounds, guild) => {
        // eslint-disable-next-line no-use-before-define
        timeout.refresh();

        if (!remainingGuildIds.has(guild.id)) return;

        fetchedSoundboardSounds.set(guild.id, soundboardSounds);

        remainingGuildIds.delete(guild.id);

        if (remainingGuildIds.size === 0) {
          // eslint-disable-next-line no-use-before-define
          clearTimeout(timeout);
          this.client.removeListener(Events.SoundboardSounds, handler);
          this.client.decrementMaxListeners();

          resolve(fetchedSoundboardSounds);
        }
      };

      const timeout = setTimeout(() => {
        this.client.removeListener(Events.SoundboardSounds, handler);
        this.client.decrementMaxListeners();
        reject(new DiscordjsError(ErrorCodes.GuildSoundboardSoundsTimeout));
      }, time).unref();

      this.client.incrementMaxListeners();
      this.client.on(Events.SoundboardSounds, handler);
    });
  }

  /**
   * Options used to set incident actions. Supplying `null` to any option will disable the action.
   *
   * @typedef {Object} IncidentActionsEditOptions
   * @property {?DateResolvable} [invitesDisabledUntil] When invites should be enabled again
   * @property {?DateResolvable} [dmsDisabledUntil] When direct messages should be enabled again
   */

  /**
   * Sets the incident actions for a guild.
   *
   * @param {GuildResolvable} guild The guild
   * @param {IncidentActionsEditOptions} incidentActions The incident actions to set
   * @returns {Promise<IncidentActions>}
   */
  async setIncidentActions(guild, { invitesDisabledUntil, dmsDisabledUntil }) {
    const guildId = this.resolveId(guild);

    const data = await this.client.rest.put(Routes.guildIncidentActions(guildId), {
      body: {
        invites_disabled_until: invitesDisabledUntil && new Date(invitesDisabledUntil).toISOString(),
        dms_disabled_until: dmsDisabledUntil && new Date(dmsDisabledUntil).toISOString(),
      },
    });

    const parsedData = _transformAPIIncidentsData(data);
    const resolvedGuild = this.resolve(guild);

    if (resolvedGuild) {
      resolvedGuild.incidentsData = parsedData;
    }

    return parsedData;
  }

  /**
   * Returns a URL for the PNG widget of a guild.
   *
   * @param {GuildResolvable} guild The guild of the widget image
   * @param {GuildWidgetStyle} [style] The style for the widget image
   * @returns {string}
   */
  widgetImageURL(guild, style) {
    const urlSearchParams = String(makeURLSearchParams({ style }));

    return `${RouteBases.api}${Routes.guildWidgetImage(this.resolveId(guild))}${
      urlSearchParams ? `?${urlSearchParams}` : ''
    }`;
  }
}

exports.GuildManager = GuildManager;
