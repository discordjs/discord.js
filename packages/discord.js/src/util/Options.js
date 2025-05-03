'use strict';

const { DefaultRestOptions, DefaultUserAgentAppendix } = require('@discordjs/rest');
const { DefaultWebSocketManagerOptions } = require('@discordjs/ws');
const { version } = require('../../package.json');
const { toSnakeCase } = require('./Transformers.js');

// TODO(ckohen): switch order of params so full manager is first and "type" is optional
/**
 * @typedef {Function} CacheFactory
 * @param {Function} managerType The base manager class the cache is being requested from.
 * @param {Function} holds The class that the cache will hold.
 * @param {Function} manager The fully extended manager class the cache is being requested from.
 * @returns {Collection} A Collection used to store the cache of the manager.
 */

/**
 * Options for a client.
 *
 * @typedef {Object} ClientOptions
 * @property {number} [closeTimeout=5_000] The amount of time in milliseconds to wait for the close frame to be received
 * from the WebSocket. Don't have this too high/low. It's best to have it between 2_000-6_000 ms.
 * @property {CacheFactory} [makeCache] Function to create a cache.
 * You can use your own function, or the {@link Options} class to customize the Collection used for the cache.
 * <warn>Overriding the cache used in `GuildManager`, `ChannelManager`, `GuildChannelManager`, `RoleManager`,
 * and `PermissionOverwriteManager` is unsupported and **will** break functionality</warn>
 * @property {MessageMentionOptions} [allowedMentions] The default value for {@link BaseMessageOptions#allowedMentions}
 * @property {Partials[]} [partials] Structures allowed to be partial. This means events can be emitted even when
 * they're missing all the data for a particular structure. See the "Partial Structures" topic on the
 * {@link https://discordjs.guide/popular-topics/partials.html guide} for some
 * important usage information, as partials require you to put checks in place when handling data.
 * @property {boolean} [failIfNotExists=true] The default value for {@link MessageReplyOptions#failIfNotExists}
 * @property {PresenceData} [presence] Presence data to use upon login
 * @property {IntentsResolvable} intents Intents to enable for this connection
 * @property {number} [waitGuildTimeout=15_000] Time in milliseconds that clients with the
 * {@link GatewayIntentBits.Guilds} gateway intent should wait for missing guilds to be received before being ready.
 * @property {SweeperOptions} [sweepers=this.DefaultSweeperSettings] Options for cache sweeping
 * @property {WebSocketManagerOptions} [ws] Options for the WebSocketManager
 * @property {RESTOptions} [rest] Options for the REST manager
 * @property {Function} [jsonTransformer] A function used to transform outgoing json data
 * @property {boolean} [enforceNonce=false] The default value for {@link MessageCreateOptions#enforceNonce}
 */

/**
 * Options for {@link Sweepers} defining the behavior of cache sweeping
 *
 * @typedef {Object<SweeperKey, SweepOptions>} SweeperOptions
 */

/**
 * Options for sweeping a single type of item from cache
 *
 * @typedef {Object} SweepOptions
 * @property {number} interval The interval (in seconds) at which to perform sweeping of the item
 * @property {number} [lifetime] How long an item should stay in cache until it is considered sweepable.
 * <warn>This property is only valid for the `invites`, `messages`, and `threads` keys. The `filter` property
 * is mutually exclusive to this property and takes priority</warn>
 * @property {GlobalSweepFilter} filter The function used to determine the function passed to the sweep method
 * <info>This property is optional when the key is `invites`, `messages`, or `threads` and `lifetime` is set</info>
 */

/**
 * Contains various utilities for client options.
 */
class Options extends null {
  /**
   * The default user agent appendix.
   *
   * @type {string}
   * @memberof Options
   * @private
   */
  static userAgentAppendix = `discord.js/${version} ${DefaultUserAgentAppendix}`.trimEnd();

  /**
   * The default client options.
   *
   * @returns {ClientOptions}
   */
  static createDefault() {
    return {
      closeTimeout: 5_000,
      waitGuildTimeout: 15_000,
      makeCache: this.cacheWithLimits(this.DefaultMakeCacheSettings),
      partials: [],
      failIfNotExists: true,
      enforceNonce: false,
      sweepers: this.DefaultSweeperSettings,
      ws: {
        ...DefaultWebSocketManagerOptions,
        largeThreshold: 50,
        version: 10,
      },
      rest: {
        ...DefaultRestOptions,
        userAgentAppendix: this.userAgentAppendix,
      },
      jsonTransformer: toSnakeCase,
    };
  }

  /**
   * Create a cache factory using predefined settings to sweep or limit.
   *
   * @param {Object<string, LimitedCollectionOptions|number>} [settings={}] Settings passed to the relevant constructor.
   * If no setting is provided for a manager, it uses Collection.
   * If a number is provided for a manager, it uses that number as the max size for a LimitedCollection.
   * If LimitedCollectionOptions are provided for a manager, it uses those settings to form a LimitedCollection.
   * @returns {CacheFactory}
   * @example
   * // Store up to 200 messages per channel and 200 members per guild, always keeping the client member.
   * Options.cacheWithLimits({
   *    MessageManager: 200,
   *    GuildMemberManager: {
   *      maxSize: 200,
   *      keepOverLimit: (member) => member.id === client.user.id,
   *    },
   *  });
   */
  static cacheWithLimits(settings = {}) {
    const { Collection } = require('@discordjs/collection');
    const { LimitedCollection } = require('./LimitedCollection.js');

    return (managerType, _, manager) => {
      const setting = settings[manager.name] ?? settings[managerType.name];
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

      /* eslint-disable-next-line eqeqeq */
      const noLimit = setting.maxSize == null || setting.maxSize === Infinity;
      if (noLimit) {
        return new Collection();
      }

      return new LimitedCollection(setting);
    };
  }

  /**
   * Create a cache factory that always caches everything.
   *
   * @returns {CacheFactory}
   */
  static cacheEverything() {
    const { Collection } = require('@discordjs/collection');
    return () => new Collection();
  }

  /**
   * The default settings passed to {@link ClientOptions.makeCache}.
   * The caches that this changes are:
   * - `MessageManager` - Limit to 200 messages
   * <info>If you want to keep default behavior and add on top of it you can use this object and add on to it, e.g.
   * `makeCache: Options.cacheWithLimits({ ...Options.DefaultMakeCacheSettings, ReactionManager: 0 })`</info>
   *
   * @type {Object<string, LimitedCollectionOptions|number>}
   */
  static get DefaultMakeCacheSettings() {
    return {
      MessageManager: 200,
    };
  }

  /**
   * The default settings passed to {@link ClientOptions.sweepers}.
   * The sweepers that this changes are:
   * - `threads` - Sweep archived threads every hour, removing those archived more than 4 hours ago
   * <info>If you want to keep default behavior and add on top of it you can use this object and add on to it, e.g.
   * `sweepers: { ...Options.DefaultSweeperSettings, messages: { interval: 300, lifetime: 600 } }`</info>
   *
   * @type {SweeperOptions}
   */
  static get DefaultSweeperSettings() {
    return {
      threads: {
        interval: 3_600,
        lifetime: 14_400,
      },
    };
  }
}

exports.Options = Options;

/**
 * @external RESTOptions
 * @see {@link https://discord.js.org/docs/packages/rest/stable/RESTOptions:Interface}
 */

/**
 * @external WebSocketManager
 * @see {@link https://discord.js.org/docs/packages/ws/stable/WebSocketManager:Class}
 */

/**
 * @external IShardingStrategy
 * @see {@link https://discord.js.org/docs/packages/ws/stable/IShardingStrategy:Interface}
 */

/**
 * @external IIdentifyThrottler
 * @see {@link https://discord.js.org/docs/packages/ws/stable/IIdentifyThrottler:Interface}
 */
