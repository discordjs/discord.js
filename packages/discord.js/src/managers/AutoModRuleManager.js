'use strict';

const { Collection } = require('@discordjs/collection');
const CachedManager = require('./CachedManager');
const AutoModRule = require('../structures/AutoModRule');

/**
 * Manages API methods for {@link AutoModRule}s and stores their cache.
 * @extends {CachedManager}
 */
class AutoModRuleManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, AutoModRule, iterable);

    /**
     * The guild this manager belongs to.
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * Data that can be resolved to give an AutoModRule object. This can be:
   * * An AutoModRule
   * * A Snowflake
   * @typedef {string} AutoModRuleResolvable
   */

  /**
   * Options used to fetch a single auto moderation rule from a guild.
   * @typedef {BaseFetchOptions} FetchAutoModRuleOptions
   * @property {AutoModRuleResolvable} autoModRule The auto moderation rule to fetch
   */

  /**
   * Options used to fetch all auto moderation rules from a guild.
   * @typedef {Object} FetchAutoModRulesOptions
   * @property {boolean} [cache] Whether to cache the fetched bans
   */

  /**
   * Fetches auto moderation rules from Discord.
   * @param {AutoModRuleResolvable|FetchAutoModRuleOptions|FetchAutoModRulesOptions} options
   * Options for fetching auto moderation rule(s)
   * @returns {Promise<AutoModRule|Collection<Snowflake, AutoModRule>>}
   * @example
   * // Fetch all auto moderation rules from a guild without caching
   * guild.autoModRules.fetch({ cache: false })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single auto moderation rule
   * guild.autoModRules.fetch('979083472868098119')
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single auto moderation rule without checking cache and without caching
   * guild.bans.fetch({ autoModRule, cache: false, force: true })
   *   .then(console.log)
   *   .catch(console.error)
   */
  fetch(options) {
    if (!options) return this._fetchMany();
    const { autoModRule, cache, force } = options;
    const resolvedAutoModRule = this.resolveId(autoModRule ?? options);
    if (resolvedAutoModRule) return this._fetchSingle({ autoModRule: resolvedAutoModRule, cache, force });
    return this._fetchMany(options);
  }

  async _fetchSingle({ autoModRule, cache, force = false }) {
    if (!force) {
      const existing = this.cache.get(autoModRule);
      if (existing) return existing;
    }

    // TODO: discord-api-types route
    const data = await this.client.rest.get(`/guilds/${this.guild.id}/auto-moderation/rules/${autoModRule}`);
    return this._add(data, cache);
  }

  async _fetchMany(options = {}) {
    // TODO: discord-api-types route
    const data = await this.client.rest.get(`/guilds/${this.guild.id}/auto-moderation/rules`);

    return data.reduce(
      (col, autoModRule) => col.set(autoModRule.id, this._add(autoModRule, options.cache)),
      new Collection(),
    );
  }

  /**
   * Resolves an {@link AutoModRuleResolvable} to an {@link AutoModRule} object.
   * @method resolve
   * @memberof AutoModRuleManager
   * @instance
   * @param {AutoModRuleResolvable} autoModRule The AutoModRule resolvable to resolve
   * @returns {?AutoModRule}
   */

  /**
   * Resolves an {@link AutoModRuleResolvable} to a {@link AutoModRule} id.
   * @method resolveId
   * @memberof AutoModRuleManager
   * @instance
   * @param {AutoModRuleResolvable} autoModRule The AutoModRule resolvable to resolve
   * @returns {?Snowflake}
   */
}

module.exports = AutoModRuleManager;
