'use strict';

const { Events, ThreadChannelTypes, SweeperKeys } = require('./Constants');
const { TypeError } = require('../errors/DJSError.js');

/**
 * @typedef {Function} GlobalSweepFilter
 * @returns {Function|null} Return `null` to skip sweeping, otherwise a function passed to `sweep()`,
 * See {@link [Collection#sweep](https://discord.js.org/#/docs/collection/main/class/Collection?scrollTo=sweep)}
 * for the definition of this function.
 */

/**
 * A container for all cache sweeping intervals and their associated sweep methods.
 */
class Sweepers {
  constructor(client, options) {
    /**
     * The client that instantiated this
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The options the sweepers were instantiated with
     * @type {SweeperOptions}
     */
    this.options = options;

    /**
     * The interval timeout that is used to sweep the indicated items, or null if not being swept
     * @name Sweepers#*Interval
     * @type {?Timeout}
     */

    for (const key of SweeperKeys) {
      this[`${key.slice(0, -1)}Interval]`] = null;
      if (key in options) {
        this._validateProperties(key);

        const clonedOptions = { ...this.options[key] };

        // Handle cases that have a "lifetime"
        if (!('filter' in clonedOptions)) {
          switch (key) {
            case 'invites':
              clonedOptions.filter = this.constructor.filterByLifetime({
                lifetime: clonedOptions.lifetime,
                getComparisonTimestamp: i => i.expiresTimestamp,
              });
              break;
            case 'messages':
              clonedOptions.filter = this.constructor.filterByLifetime({
                lifetime: clonedOptions.lifetime,
                getComparisonTimestamp: m => m.editedTimestamp ?? m.createdTimestamp,
              });
              break;
            case 'threads':
              clonedOptions.filter = this.constructor.filterByLifetime({
                lifetime: clonedOptions.lifetime,
                getComparisonTimestamp: t => t.archivedTimestamp,
                excludeFromSweep: t => !t.archived,
              });
          }
        }

        this._initInterval(`${key.slice(0, -1)}Interval`, `sweep${key[0].toUpperCase()}${key.slice(1)}`, clonedOptions);
      }
    }
  }

  /**
   * Sweeps all guild and global application commands and removes the ones which are indicated by the filter.
   * @param {Function} filter The function used to determine which commands will be removed from the caches.
   * @returns {number} Amount of commands that were removed from the caches
   */
  sweepApplicationCommands(filter) {
    const { guilds, items: guildCommands } = this._sweepGuildDirectProp('commands', filter, { emit: false });

    const globalCommands = this.client.application?.commands.cache.sweep(filter) ?? 0;

    this.client.emit(
      Events.CACHE_SWEEP,
      `Swept ${globalCommands} global application commands and ${guildCommands} guild commands in ${guilds} guilds.`,
    );
    return guildCommands + globalCommands;
  }

  /**
   * Sweeps all guild bans and removes the ones which are indicated by the filter.
   * @param {Function} filter The function used to determine which bans will be removed from the caches.
   * @returns {number} Amount of bans that were removed from the caches
   */
  sweepBans(filter) {
    return this._sweepGuildDirectProp('bans', filter).items;
  }

  /**
   * Sweeps all guild emojis and removes the ones which are indicated by the filter.
   * @param {Function} filter The function used to determine which emojis will be removed from the caches.
   * @returns {number} Amount of emojis that were removed from the caches
   */
  sweepEmojis(filter) {
    return this._sweepGuildDirectProp('emojis', filter).items;
  }

  /**
   * Sweeps all guild invites and removes the ones which are indicated by the filter.
   * @param {Function} filter The function used to determine which invites will be removed from the caches.
   * @returns {number} Amount of invites that were removed from the caches
   */
  sweepInvites(filter) {
    return this._sweepGuildDirectProp('invites', filter).items;
  }

  /**
   * Sweeps all guild members and removes the ones which are indicated by the filter.
   * <info>It is highly recommended to keep the client guild member cached</info>
   * @param {Function} filter The function used to determine which guild members will be removed from the caches.
   * @returns {number} Amount of guild members that were removed from the caches
   */
  sweepGuildMembers(filter) {
    return this._sweepGuildDirectProp('members', filter, { outputName: 'guild members' }).items;
  }

  /**
   * Sweeps all text-based channels' messages and removes the ones which are indicated by the filter.
   * @param {Function} filter The function used to determine which messages will be removed from the caches.
   * @returns {number} Amount of messages that were removed from the caches
   * @example
   * // Remove all messages older than 1800 seconds from the messages cache
   * const amount = sweepers.sweepMessages(
   *   Sweepers.filterByLifetime({
   *     lifetime: 1800,
   *     getComparisonTimestamp: m => m.editedTimestamp ?? m.createdTimestamp,
   *   })(),
   * );
   * console.log(`Successfully removed ${amount} messages from the cache.`);
   */
  sweepMessages(filter) {
    if (typeof filter !== 'function') {
      throw new TypeError('INVALID_TYPE', 'filter', 'function');
    }
    let channels = 0;
    let messages = 0;

    for (const channel of this.client.channels.cache.values()) {
      if (!channel.messsages || channel.messages.cache.size === 0) continue;
      channels++;

      messages += channel.messages.cache.sweep(filter);
    }
    this.client.emit(Events.CACHE_SWEEP, `Swept ${messages} messages in ${channels} text-based channels.`);
    return messages;
  }

  /**
   * Sweeps all presences and removes the ones which are indicated by the filter.
   * @param {Function} filter The function used to determine which presences will be removed from the caches.
   * @returns {number} Amount of presences that were removed from the caches
   */
  sweepPresences(filter) {
    return this._sweepGuildDirectProp('presences', filter).items;
  }

  /**
   * Sweeps all message reactions and removes the ones which are indicated by the filter.
   * @param {Function} filter The function used to determine which reactions will be removed from the caches.
   * @returns {number} Amount of reactions that were removed from the caches
   */
  sweepReactions(filter) {
    if (typeof filter !== 'function') {
      throw new TypeError('INVALID_TYPE', 'filter', 'function');
    }
    let channels = 0;
    let messages = 0;
    let reactions = 0;

    for (const channel of this.client.channels.cache.values()) {
      if (!channel.messsages || channel.messages.cache.size === 0) continue;
      channels++;

      for (const message of channel.messages.cache.values()) {
        if (message.reactions.cache.size === 0) continue;
        messages++;

        reactions += message.reactions.cache.sweep(filter);
      }
    }
    this.client.emit(
      Events.CACHE_SWEEP,
      `Swept ${reactions} reactions on ${messages} messages in ${channels} text-based channels.`,
    );
    return reactions;
  }

  /**
   * Sweeps all guild stage instances and removes the ones which are indicated by the filter.
   * @param {Function} filter The function used to determine which stage instances will be removed from the caches.
   * @returns {number} Amount of stage instances that were removed from the caches
   */
  sweepStageInstances(filter) {
    return this._sweepGuildDirectProp('stageInstances', filter, { outputName: 'stage instances' }).items;
  }

  /**
   * Sweeps all thread members and removes the ones which are indicated by the filter.
   * <info>It is highly recommended to keep the client thread member cached</info>
   * @param {Function} filter The function used to determine which thread members will be removed from the caches.
   * @returns {number} Amount of thread members that were removed from the caches
   */
  sweepThreadMembers(filter) {
    if (typeof filter !== 'function') {
      throw new TypeError('INVALID_TYPE', 'filter', 'function');
    }

    let threads = 0;
    let members = 0;
    for (const channel of this.client.channels.cache.values()) {
      if (!ThreadChannelTypes.includes(channel.type) || channel.members.cache.size === 0) continue;
      threads++;
      members += channel.members.cache.sweep(filter);
    }
    this.client.emit(Events.CACHE_SWEEP, `Swept ${members} thread members in ${threads} threads.`);
    return members;
  }

  /**
   * Sweeps all threads and removes the ones which are indicated by the filter.
   * @param {Function} filter The function used to determine which threads will be removed from the caches.
   * @returns {number} filter Amount of threads that were removed from the caches
   * @example
   * // Remove all threads archived greater than 1 day ago from all the channel caches
   * const amount = sweepers.sweepThreads(
   *   Sweepers.filterByLifetime({
   *     getComparisonTimestamp: t => t.archivedTimestamp,
   *     excludeFromSweep: t => !t.archived,
   *   })(),
   * );
   * console.log(`Successfully removed ${amount} threads from the cache.`);
   */
  sweepThreads(filter) {
    if (typeof filter !== 'function') {
      throw new TypeError('INVALID_TYPE', 'filter', 'function');
    }

    let threads = 0;
    for (const [key, val] of this.client.channels.cache.entries()) {
      if (!ThreadChannelTypes.includes(val.type)) continue;
      if (filter(val, key, this.client.channels.cache)) {
        threads++;
        this.client.channels._remove(key);
      }
    }
    this.client.emit(Events.CACHE_SWEEP, `Swept ${threads} threads.`);
    return threads;
  }

  /**
   * Sweeps all users and removes the ones which are indicated by the filter.
   * @param {Function} filter The function used to determine which users will be removed from the caches.
   * @returns {number} Amount of users that were removed from the caches
   */
  sweepUsers(filter) {
    if (typeof filter !== 'function') {
      throw new TypeError('INVALID_TYPE', 'filter', 'function');
    }

    const users = this.client.users.cache.sweep(filter);

    this.client.emit(Events.CACHE_SWEEP, `Swept ${users} users.`);

    return users;
  }

  /**
   * Sweeps all guild voice states and removes the ones which are indicated by the filter.
   * @param {Function} filter The function used to determine which voice states will be removed from the caches.
   * @returns {number} Amount of voice states that were removed from the caches
   */
  sweepVoiceStates(filter) {
    return this._sweepGuildDirectProp('voiceStates', filter, { outputName: 'voice states' }).items;
  }

  /**
   * Cancels all sweeping intervals
   * @returns {void}
   */
  destroy() {
    const propKeys = SweeperKeys.map(k => `${k.slice(0, -1)}Interval`);
    for (const key of propKeys) {
      if (this[key]) clearInterval(this[key]);
    }
  }

  /**
   * Options for generating a filter function based on lifetime
   * @typedef {Object} LifetimeFilterOptions
   * @property {number} [lifetime=14400] How long, in seconds, an entry should stay in the collection
   * before it is considered sweepable.
   * @property {Function} [getComparisonTimestamp=e => e?.createdTimestamp] A function that takes an entry, key,
   * and the collection and returns a timestamp to compare against in order to determine the lifetime of the entry.
   * @property {Function} [excludeFromSweep=() => false] A function that takes an entry, key, and the collection
   * and returns a boolean, `true` when the entry should not be checked for sweepability.
   */

  /**
   * Create a sweepFilter function that uses a lifetime to determine sweepability.
   * @param {LifetimeFilterOptions} [options={}] The options used to generate the filter function
   * @returns {GlobalSweepFilter}
   */
  static filterByLifetime({
    lifetime = 14400,
    getComparisonTimestamp = e => e?.createdTimestamp,
    excludeFromSweep = () => false,
  } = {}) {
    if (typeof lifetime !== 'number') {
      throw new TypeError('INVALID_TYPE', 'lifetime', 'number');
    }
    if (typeof getComparisonTimestamp !== 'function') {
      throw new TypeError('INVALID_TYPE', 'getComparisonTimestamp', 'function');
    }
    if (typeof excludeFromSweep !== 'function') {
      throw new TypeError('INVALID_TYPE', 'excludeFromSweep', 'function');
    }
    return () => {
      if (lifetime <= 0) return null;
      const lifetimeMs = lifetime * 1_000;
      const now = Date.now();
      return (entry, key, coll) => {
        if (excludeFromSweep(entry, key, coll)) {
          return false;
        }
        const comparisonTimestamp = getComparisonTimestamp(entry, key, coll);
        if (!comparisonTimestamp || typeof comparisonTimestamp !== 'number') return false;
        return now - comparisonTimestamp > lifetimeMs;
      };
    };
  }

  /**
   * Configuration options for emitting the cache sweep client event
   * @typedef {Object} SweepEventOptions
   * @property {boolean} [emit=true] Whether to emit the client event in this method
   * @property {string} [outputName] A name to output in the client event if it should differ from the key
   * @private
   */

  /**
   * Sweep a direct sub property of all guilds
   * @param {string} key The name of the property
   * @param {Function} filter Filter function passed to sweep
   * @param {SweepEventOptions} [eventOptions] Options for the Client event emitted here
   * @returns {Object} Object containing the number of guilds swept and the number of items swept
   * @private
   */
  _sweepGuildDirectProp(key, filter, { emit = true, outputName }) {
    if (typeof filter !== 'function') {
      throw new TypeError('INVALID_TYPE', 'filter', 'function');
    }

    let guilds = 0;
    let items = 0;

    for (const guild of this.client.guilds.cache.values()) {
      if (guild[key].cache.size === 0) continue;
      guilds++;

      items += guild[key].cache.sweep(filter);
    }

    if (emit) {
      this.client.emit(Events.CACHE_SWEEP, `Swept ${items} ${outputName ?? key} in ${guilds} guilds.`);
    }

    return { guilds, items };
  }

  /**
   * Validates a set of properties
   * @param {string} key Key of the options object to check
   * @private
   */
  _validateProperties(key) {
    const props = this.options[key];
    if (typeof props !== 'object') {
      throw new TypeError('INVALID_TYPE', `sweepers.${key}`, 'object', true);
    }
    if (typeof props.interval !== 'number') {
      throw new TypeError('INVALID_TYPE', `sweepers.${key}.interval`, 'number');
    }
    if (
      ['invites', 'messages', 'threads'].includes(key) &&
      !('filter' in props) &&
      typeof props.lifetime !== 'number'
    ) {
      throw new TypeError('INVALID_TYPE', `sweepers.${key}.lifetime`, 'number');
    } else if (typeof props.filter !== 'function') {
      throw new TypeError('INVALID_TYPE', `sweepers.${key}.filter`, 'function');
    }
  }

  /**
   * Initialize an interval for sweeping
   * @param {string} intervalKey The name of the property that stores the interval for this sweeper
   * @param {string} sweepKey The name of the function that sweeps the desired caches
   * @param {Object} opts Validated options for a sweep
   * @private
   */
  _initInterval(intervalKey, sweepKey, opts) {
    if (opts.interval > 0 && opts.interval !== Infinity) {
      this[intervalKey] = setInterval(() => {
        const sweepFn = opts.filter();
        if (sweepFn === null) return;
        if (typeof sweepFn !== 'function') throw new TypeError('SWEEP_FILTER_RETURN');
        this[sweepKey](sweepFn);
      }, opts.interval * 1_000).unref();
    }
  }
}

module.exports = Sweepers;
