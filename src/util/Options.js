'use strict';

/**
 * Rate limit data
 * @typedef {Object} RateLimitData
 * @property {number} timeout Time until this rate limit ends, in ms
 * @property {number} limit The maximum amount of requests of this endpoint
 * @property {string} method The http method of this request
 * @property {string} path The path of the request relative to the HTTP endpoint
 * @property {string} route The route of the request relative to the HTTP endpoint
 * @property {boolean} global Whether this is a global rate limit
 */

/**
 * Whether this rate limit should throw an Error
 * @typedef {Function} RateLimitQueueFilter
 * @param {RateLimitData} rateLimitData The data of this rate limit
 * @returns {boolean|Promise<boolean>}
 */

/**
 * @typedef {Function} CacheFactory
 * @param {Function} manager The manager class the cache is being requested from.
 * @param {Function} holds The class that the cache will hold.
 * @returns {Collection} A Collection used to store the cache of the manager.
 */

/**
 * Options for a client.
 * @typedef {Object} ClientOptions
 * @property {number|number[]|string} [shards] The shard's id to run, or an array of shard ids. If not specified,
 * the client will spawn {@link ClientOptions#shardCount} shards. If set to `auto`, it will fetch the
 * recommended amount of shards from Discord and spawn that amount
 * @property {number} [shardCount=1] The total amount of shards used by all processes of this bot
 * (e.g. recommended shard count, shard count of the ShardingManager)
 * @property {CacheFactory} [makeCache] Function to create a cache.
 * You can use your own function, or the {@link Options} class to customize the Collection used for the cache.
 * <warn>Overriding the cache used in `GuildManager`, `ChannelManager`, `GuildChannelManager`, `RoleManager`,
 * and `PermissionOverwriteManager` is unsupported and **will** break functionality</warn>
 * @property {number} [messageCacheLifetime=0] DEPRECATED: Use `makeCache` with a `LimitedCollection` instead.
 * How long a message should stay in the cache until it is considered sweepable (in seconds, 0 for forever)
 * @property {number} [messageSweepInterval=0] DEPRECATED: Use `makeCache` with a `LimitedCollection` instead.
 * How frequently to remove messages from the cache that are older than the message cache lifetime
 * (in seconds, 0 for never)
 * @property {MessageMentionOptions} [allowedMentions] Default value for {@link MessageOptions#allowedMentions}
 * @property {number} [invalidRequestWarningInterval=0] The number of invalid REST requests (those that return
 * 401, 403, or 429) in a 10 minute window between emitted warnings (0 for no warnings). That is, if set to 500,
 * warnings will be emitted at invalid request number 500, 1000, 1500, and so on.
 * @property {PartialType[]} [partials] Structures allowed to be partial. This means events can be emitted even when
 * they're missing all the data for a particular structure. See the "Partial Structures" topic on the
 * [guide](https://discordjs.guide/popular-topics/partials.html) for some
 * important usage information, as partials require you to put checks in place when handling data.
 * @property {number} [restWsBridgeTimeout=5000] Maximum time permitted between REST responses and their
 * corresponding websocket events
 * @property {number} [restTimeOffset=500] Extra time in milliseconds to wait before continuing to make REST
 * requests (higher values will reduce rate-limiting errors on bad connections)
 * @property {number} [restRequestTimeout=15000] Time to wait before cancelling a REST request, in milliseconds
 * @property {number} [restSweepInterval=60] How frequently to delete inactive request buckets, in seconds
 * (or 0 for never)
 * @property {number} [restGlobalRateLimit=0] How many requests to allow sending per second (0 for unlimited, 50 for
 * the standard global limit used by Discord)
 * @property {string[]|RateLimitQueueFilter} [rejectOnRateLimit] Decides how rate limits and pre-emptive throttles
 * should be handled. If this option is an array containing the prefix of the request route (e.g. /channels to match any
 * route starting with /channels, such as /channels/222197033908436994/messages) or a function returning true, a
 * {@link RateLimitError} will be thrown. Otherwise the request will be queued for later
 * @property {number} [retryLimit=1] How many times to retry on 5XX errors (Infinity for indefinite amount of retries)
 * @property {boolean} [failIfNotExists=true] Default value for {@link ReplyMessageOptions#failIfNotExists}
 * @property {string[]} [userAgentSuffix] An array of additional bot info to be appended to the end of the required
 * [User Agent](https://discord.com/developers/docs/reference#user-agent) header
 * @property {PresenceData} [presence={}] Presence data to use upon login
 * @property {IntentsResolvable} intents Intents to enable for this connection
 * @property {WebsocketOptions} [ws] Options for the WebSocket
 * @property {HTTPOptions} [http] HTTP options
 */

/**
 * WebSocket options (these are left as snake_case to match the API)
 * @typedef {Object} WebsocketOptions
 * @property {number} [large_threshold=50] Number of members in a guild after which offline users will no longer be
 * sent in the initial guild member list, must be between 50 and 250
 */

/**
 * HTTP options
 * @typedef {Object} HTTPOptions
 * @property {number} [version=9] API version to use
 * @property {string} [api='https://discord.com/api'] Base url of the API
 * @property {string} [cdn='https://cdn.discordapp.com'] Base url of the CDN
 * @property {string} [invite='https://discord.gg'] Base url of invites
 * @property {string} [template='https://discord.new'] Base url of templates
 * @property {Object} [headers] Additional headers to send for all API requests
 */

/**
 * Contains various utilities for client options.
 */
class Options extends null {
  /**
   * The default client options.
   * @returns {ClientOptions}
   */
  static createDefault() {
    return {
      shardCount: 1,
      makeCache: this.cacheWithLimits({
        MessageManager: 200,
        ChannelManager: {
          sweepInterval: 3600,
          sweepFilter: require('./Util').archivedThreadSweepFilter(),
        },
        GuildChannelManager: {
          sweepInterval: 3600,
          sweepFilter: require('./Util').archivedThreadSweepFilter(),
        },
        ThreadManager: {
          sweepInterval: 3600,
          sweepFilter: require('./Util').archivedThreadSweepFilter(),
        },
      }),
      messageCacheLifetime: 0,
      messageSweepInterval: 0,
      invalidRequestWarningInterval: 0,
      partials: [],
      restWsBridgeTimeout: 5000,
      restRequestTimeout: 15000,
      restGlobalRateLimit: 0,
      retryLimit: 1,
      restTimeOffset: 500,
      restSweepInterval: 60,
      failIfNotExists: true,
      userAgentSuffix: [],
      presence: {},
      ws: {
        large_threshold: 50,
        compress: false,
        properties: {
          $os: process.platform,
          $browser: 'discord.js',
          $device: 'discord.js',
        },
        version: 9,
      },
      http: {
        version: 9,
        api: 'https://discord.com/api',
        cdn: 'https://cdn.discordapp.com',
        invite: 'https://discord.gg',
        template: 'https://discord.new',
      },
    };
  }

  /**
   * Create a cache factory using predefined settings to sweep or limit.
   * @param {Object<string, LimitedCollectionOptions|number>} [settings={}] Settings passed to the relevant constructor.
   * If no setting is provided for a manager, it uses Collection.
   * If a number is provided for a manager, it uses that number as the max size for a LimitedCollection.
   * If LimitedCollectionOptions are provided for a manager, it uses those settings to form a LimitedCollection.
   * @returns {CacheFactory}
   * @example
   * // Store up to 200 messages per channel and discard archived threads if they were archived more than 4 hours ago.
   * // Note archived threads will remain in the guild and client caches with these settings
   * Options.cacheWithLimits({
   *    MessageManager: 200,
   *    ThreadManager: {
   *      sweepInterval: 3600,
   *      sweepFilter: LimitedCollection.filterByLifetime({
   *        getComparisonTimestamp: e => e.archiveTimestamp,
   *        excludeFromSweep: e => !e.archived,
   *      }),
   *    },
   *  });
   * @example
   * // Sweep messages every 5 minutes, removing messages that have not been edited or created in the last 30 minutes
   * Options.cacheWithLimits({
   *   MessageManager: {
   *     sweepInterval: 300,
   *     sweepFilter: LimitedCollection.filterByLifetime({
   *       lifetime: 1800,
   *       getComparisonTimestamp: e => e.editedTimestamp ?? e.createdTimestamp,
   *     })
   *   }
   * });
   */
  static cacheWithLimits(settings = {}) {
    const { Collection } = require('@discordjs/collection');
    const LimitedCollection = require('./LimitedCollection');

    return manager => {
      const setting = settings[manager.name];
      /* eslint-disable-next-line eqeqeq */
      if (setting == null) {
        return new Collection();
      }
      if (typeof setting === 'number') {
        if (setting === Infinity) {
          return new Collection();
        }
        return new LimitedCollection({ maxSize: setting });
      }
      /* eslint-disable eqeqeq */
      const noSweeping =
        setting.sweepFilter == null ||
        setting.sweepInterval == null ||
        setting.sweepInterval <= 0 ||
        setting.sweepInterval === Infinity;
      const noLimit = setting.maxSize == null || setting.maxSize === Infinity;
      /* eslint-enable eqeqeq */
      if (noSweeping && noLimit) {
        return new Collection();
      }
      return new LimitedCollection(setting);
    };
  }

  /**
   * Create a cache factory that always caches everything.
   * @returns {CacheFactory}
   */
  static cacheEverything() {
    const { Collection } = require('@discordjs/collection');
    return () => new Collection();
  }
}

module.exports = Options;
