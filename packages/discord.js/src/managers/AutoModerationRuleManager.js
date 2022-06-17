'use strict';

const { Collection } = require('@discordjs/collection');
const CachedManager = require('./CachedManager');
const AutoModerationRule = require('../structures/AutoModerationRule');

/**
 * Manages API methods for {@link AutoModerationRule}s and stores their cache.
 * @extends {CachedManager}
 */
class AutoModerationRuleManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, AutoModerationRule, iterable);

    /**
     * The guild this manager belongs to.
     * @type {Guild}
     */
    this.guild = guild;
  }

  // TODO: discord-api-types enum
  /**
   * Options used to set the trigger metadata of an auto moderation rule.
   * @typedef {Object} AutoModerationTriggerMetadataOptions
   * @property {string[]} [keywordFilter] The substrings that will be searched for in the content
   * @property {number[]} [presets] The internally pre-defined wordsets which will be searched for in the content
   */

  // TODO: discord-api-types enum
  /**
   * Options used to set the actions of an auto moderation rule.
   * @typedef {Object} AutoModerationActionOptions
   * @property {number} type The type of this auto moderation rule action
   * @property {AutoModerationActionMetadataOptions} [metadata] Additional metadata needed during execution
   * <info>This property is required if using a `type` of 2 or 3.</info>
   */

  /**
   * Options used to set the metadata of an auto moderation rule action.
   * @typedef {Object} AutoModerationActionMetadataOptions
   * @property {Snowflake} [channelId] The id of the channel to which content will be logged
   * @property {number} [durationSeconds] The timeout duration in seconds
   */

  // TODO: discord-api-types enum
  /**
   * Options used to create an auto moderation rule.
   * @typedef {Object} AutoModerationRuleCreateOptions
   * @property {string} name The name of the auto moderation rule
   * @property {number} eventType The event type of the auto moderation rule
   * @property {number} triggerType The trigger type of the auto moderation rule
   * @property {AutoModerationTriggerMetadataOptions} [triggerMetadata] The trigger metadata of the auto moderation rule
   * <info>This property is required if using a `triggerType` of 1 or 4.</info>
   * @property {AutoModerationActionOptions[]} actions
   * The actions that will execute when the auto moderation rule is triggered
   * @property {boolean} [enabled] Whether the auto moderation rule should be enabled
   * @property {Snowflake[]} [exemptRoles] An array of roles
   * that should not be affected by the auto moderation rule
   * @property {Snowflake[]} [exemptChannels] An array of channels
   * that should not be affected by the auto moderation rule
   * @property {string} [reason] The reason for creating the auto moderation rule
   */

  /**
   * Creates a new auto moderation rule.
   * @param {AutoModerationRuleCreateOptions} options Options for creating the auto moderation rule
   * @returns {Promise<AutoModerationRule>}
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
    const data = await this.client.rest.post(`/guilds/${this.guild.id}/auto-moderation/rules`, {
      body: {
        name,
        event_type: eventType,
        trigger_type: triggerType,
        trigger_metadata:
          typeof triggerMetadata === 'undefined'
            ? undefined
            : { keyword_filter: triggerMetadata.keywordFilter, presets: triggerMetadata.presets },
        actions: actions.map(action => ({
          type: action.type,
          metadata: {
            duration_seconds: action.metadata?.durationSeconds,
            channel_id: action.metadata?.channelId,
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

  // TODO: discord-api-types enum
  /**
   * Options used to edit an auto moderation rule.
   * @typedef {Object} AutoModerationRuleEditOptions
   * @property {string} name The name of the auto moderation rule
   * @property {number} [eventType] The event type of the auto moderation rule
   * @property {AutoModerationTriggerMetadataOptions} [triggerMetadata] The trigger metadata of the auto moderation rule
   * @property {AutoModerationActionOptions[]} [actions]
   * The actions that will execute when the auto moderation rule is triggered
   * @property {boolean} [enabled] Whether the auto moderation rule should be enabled
   * @property {Snowflake[]} [exemptRoles] An array of roles
   * that should not be affected by the auto moderation rule
   * @property {Snowflake[]} [exemptChannels] An array of channels
   * that should not be affected by the auto moderation rule
   * @property {string} [reason] The reason for creating the auto moderation rule
   */

  /**
   * Edits an auto moderation rule.
   * @param {AutoModerationRuleResolvable} autoModerationRule The auto moderation rule to edit
   * @param {AutoModerationRuleEditOptions} options Options for editing the auto moderation rule
   * @returns {Promise<AutoModerationRule>}
   */
  async edit(
    autoModerationRule,
    { name, eventType, triggerMetadata, actions, enabled, exemptRoles, exemptChannels, reason },
  ) {
    const autoModerationRuleId = this.resolveId(autoModerationRule);

    const data = await this.client.rest.patch(
      // TODO: discord-api-types route
      `/guilds/${this.guild.id}/auto-moderation/rules/${autoModerationRuleId}`,
      {
        body: {
          name,
          event_type: eventType,
          trigger_metadata:
            typeof triggerMetadata === 'undefined'
              ? undefined
              : { keyword_filter: triggerMetadata.keywordFilter, presets: triggerMetadata.presets },
          actions: actions?.map(action => ({
            type: action.type,
            metadata: {
              duration_seconds: action.metadata?.durationSeconds,
              channel_id: action.metadata?.channelId,
            },
          })),
          enabled,
          exempt_roles: exemptRoles,
          exempt_channels: exemptChannels,
        },
        reason,
      },
    );

    return this._add(data);
  }

  /**
   * Data that can be resolved to give an AutoModerationRule object. This can be:
   * * An AutoModerationRule
   * * A Snowflake
   * @typedef {AutoModerationRule|Snowflake} AutoModerationRuleResolvable
   */

  /**
   * Options used to fetch a single auto moderation rule from a guild.
   * @typedef {BaseFetchOptions} FetchAutoModerationRuleOptions
   * @property {AutoModerationRuleResolvable} autoModerationRule The auto moderation rule to fetch
   */

  /**
   * Options used to fetch all auto moderation rules from a guild.
   * @typedef {Object} FetchAutoModerationRulesOptions
   * @property {boolean} [cache] Whether to cache the fetched auto moderation rules
   */

  /**
   * Fetches auto moderation rules from Discord.
   * @param {AutoModerationRuleResolvable|FetchAutoModerationRuleOptions|FetchAutoModerationRulesOptions} options
   * Options for fetching auto moderation rule(s)
   * @returns {Promise<AutoModerationRule|Collection<Snowflake, AutoModerationRule>>}
   * @example
   * // Fetch all auto moderation rules from a guild without caching
   * guild.autoModerationRules.fetch({ cache: false })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single auto moderation rule
   * guild.autoModerationRules.fetch('979083472868098119')
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single auto moderation rule without checking cache and without caching
   * guild.autoModerationRules.fetch({ '979083472868098119', cache: false, force: true })
   *   .then(console.log)
   *   .catch(console.error)
   */
  fetch(options) {
    if (!options) return this._fetchMany();
    const { autoModerationRule, cache, force } = options;
    const resolvedAutoModerationRule = this.resolveId(autoModerationRule ?? options);
    if (resolvedAutoModerationRule) {
      return this._fetchSingle({ autoModerationRule: resolvedAutoModerationRule, cache, force });
    }
    return this._fetchMany(options);
  }

  async _fetchSingle({ autoModerationRule, cache, force = false }) {
    if (!force) {
      const existing = this.cache.get(autoModerationRule);
      if (existing) return existing;
    }

    // TODO: discord-api-types route
    const data = await this.client.rest.get(`/guilds/${this.guild.id}/auto-moderation/rules/${autoModerationRule}`);
    return this._add(data, cache);
  }

  async _fetchMany(options = {}) {
    // TODO: discord-api-types route
    const data = await this.client.rest.get(`/guilds/${this.guild.id}/auto-moderation/rules`);

    return data.reduce(
      (col, autoModerationRule) => col.set(autoModerationRule.id, this._add(autoModerationRule, options.cache)),
      new Collection(),
    );
  }

  /**
   * Deletes an auto moderation rule.
   * @param {AutoModerationRuleResolvable} autoModerationRule The auto moderation rule to delete
   * @param {string} [reason] The reason for deleting the auto moderation rule
   * @returns {Promise<void>}
   */
  async delete(autoModerationRule, reason) {
    const autoModerationRuleId = this.resolveId(autoModerationRule);
    // TODO: discord-api-types route
    await this.client.rest.delete(`/guilds/${this.guild.id}/auto-moderation/rules/${autoModerationRuleId}`, { reason });
  }

  /**
   * Resolves an {@link AutoModerationRuleResolvable} to an {@link AutoModerationRule} object.
   * @method resolve
   * @memberof AutoModerationRuleManager
   * @instance
   * @param {AutoModerationRuleResolvable} autoModerationRule The AutoModerationRule resolvable to resolve
   * @returns {?AutoModerationRule}
   */

  /**
   * Resolves an {@link AutoModerationRuleResolvable} to a {@link AutoModerationRule} id.
   * @method resolveId
   * @memberof AutoModerationRuleManager
   * @instance
   * @param {AutoModerationRuleResolvable} autoModerationRule The AutoModerationRule resolvable to resolve
   * @returns {?Snowflake}
   */
}

module.exports = AutoModerationRuleManager;
