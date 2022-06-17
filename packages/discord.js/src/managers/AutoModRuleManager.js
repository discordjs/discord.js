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
   * Options used to set the trigger metadata of an auto moderation rule.
   * @typedef {Object} AutoModTriggerMetadataOptions
   * @property {string[]} [keywordFilter] The substrings that will be searched for in the content
   * @property {number[]} [preset] The internally pre-defined wordsets which will be searched for in the content
   */

  /**
   * Options used to set the actions of an auto moderation rule.
   * @typedef {Object} AutoModActionOptions
   * @property {number} type The type of this auto moderation rule action
   * @property {AutoModActionMetadataOptions} [metadata] Additional metadata needed during execution
   * <info>This property is required if using a `type` of 2 or 3.</info>
   */

  /**
   * Options used to set the metadata of an auto moderation rule action.
   * @typedef {Object} AutoModActionMetadataOptions
   * @property {Snowflake} [channelId] The id of the channel to which content will be logged
   * @property {number} [durationSeconds] The timeout duration in seconds
   */

  /**
   * Options used to create an auto moderation rule.
   * @typedef {Object} AutoModRuleCreateOptions
   * @property {string} name The name of the auto moderation rule
   * @property {number} eventType The event type of the auto moderation rule
   * @property {number} triggerType The trigger type of the auto moderation rule
   * @property {AutoModTriggerMetadataOptions} [triggerMetadata] The trigger metadata of the auto moderation rule
   * <info>This property is required if using a `triggerType` of 1 or 4.</info>
   * @property {AutoModActionOptions[]} [actions]
   * The actions that will execute when the auto moderation rule is triggered
   * @property {boolean} [enabled] Whether the auto moderation rule should be enabled
   * @property {Snowflake[]} [exemptRoles] An array of roles
   * that should not be affected by the auto moderation rule
   * @property {Snowflake[]} [exemptChannels] An array of channels
   * that should not be affected by the auto moderation rule
   */

  /**
   * Creates a new auto moderation rule.
   * @param {AutoModRuleCreateOptions} options Options for creating the auto moderation rule
   * @returns {Promise<AutoModRule>}
   */
  async create({
    name,
    eventType,
    triggerType,
    triggerMetadata,
    actions,
    enabled,
    exemptRoles,
    exemptChannels,
    reason,
  }) {
    // TODO: discord-api-types route
    const data = await this.client.rest.patch(`/guilds/${this.guild.id}/auto-moderation/rules/987167451311661066`, {
      body: {
        name,
        event_type: eventType,
        trigger_type: triggerType,
        trigger_metadata: { keyword_filter: triggerMetadata.keywordFilter, presets: triggerMetadata.presets },
        actions: actions.map(action => ({
          type: action.type,
          metadata: {
            duration_seconds: action.metadata.durationSeconds,
            channel_id: action.metadata.channelId,
          },
        })),
        enabled,
        exempt_roles: exemptRoles,
        exempt_channels: exemptChannels,
      },
      reason,
    });

    return this._add(data);
  }

  /**
   * Data that can be resolved to give an AutoModRule object. This can be:
   * * An AutoModRule
   * * A Snowflake
   * @typedef {AutoModRule|Snowflake} AutoModRuleResolvable
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
