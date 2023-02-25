'use strict';

const { Collection } = require('@discordjs/collection');
const { Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const AutoModerationRule = require('../structures/AutoModerationRule');

/**
 * Manages API methods for auto moderation rules and stores their cache.
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

  /**
   * The cache of this manager
   * @type {Collection<Snowflake, AutoModerationRule>}
   * @name AutoModerationRuleManager#cache
   */

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

  _add(data, cache) {
    return super._add(data, cache, { extras: [this.guild] });
  }

  /**
   * Options used to set the trigger metadata of an auto moderation rule.
   * @typedef {Object} AutoModerationTriggerMetadataOptions
   * @property {string[]} [keywordFilter] The substrings that will be searched for in the content
   * @property {string[]} [regexPatterns] The regular expression patterns which will be matched against the content
   * <info>Only Rust-flavored regular expressions are supported.</info>
   * @property {AutoModerationRuleKeywordPresetType[]} [presets]
   * The internally pre-defined wordsets which will be searched for in the content
   * @property {string[]} [allowList] The substrings that will be exempt from triggering
   * {@link AutoModerationRuleTriggerType.Keyword} and {@link AutoModerationRuleTriggerType.KeywordPreset}
   * @property {?number} [mentionTotalLimit] The total number of role & user mentions allowed per message
   */

  /**
   * Options used to set the actions of an auto moderation rule.
   * @typedef {Object} AutoModerationActionOptions
   * @property {AutoModerationActionType} type The type of this auto moderation rule action
   * @property {AutoModerationActionMetadataOptions} [metadata] Additional metadata needed during execution
   * <info>This property is required if using a `type` of
   * {@link AutoModerationActionType.SendAlertMessage} or {@link AutoModerationActionType.Timeout}.</info>
   */

  /**
   * Options used to set the metadata of an auto moderation rule action.
   * @typedef {Object} AutoModerationActionMetadataOptions
   * @property {GuildTextChannelResolvable|ThreadChannel} [channel] The channel to which content will be logged
   * @property {number} [durationSeconds] The timeout duration in seconds
   * @property {string} [customMessage] The custom message that is shown whenever a message is blocked
   */

  /**
   * Options used to create an auto moderation rule.
   * @typedef {Object} AutoModerationRuleCreateOptions
   * @property {string} name The name of the auto moderation rule
   * @property {AutoModerationRuleEventType} eventType The event type of the auto moderation rule
   * @property {AutoModerationRuleTriggerType} triggerType The trigger type of the auto moderation rule
   * @property {AutoModerationTriggerMetadataOptions} [triggerMetadata] The trigger metadata of the auto moderation rule
   * <info>This property is required if using a `triggerType` of
   * {@link AutoModerationRuleTriggerType.Keyword}, {@link AutoModerationRuleTriggerType.KeywordPreset},
   * or {@link AutoModerationRuleTriggerType.MentionSpam}.</info>
   * @property {AutoModerationActionOptions[]} actions
   * The actions that will execute when the auto moderation rule is triggered
   * @property {boolean} [enabled] Whether the auto moderation rule should be enabled
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [exemptRoles]
   * The roles that should not be affected by the auto moderation rule
   * @property {Collection<Snowflake, GuildChannel|ThreadChannel>|GuildChannelResolvable[]} [exemptChannels]
   * The channels that should not be affected by the auto moderation rule
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
    const data = await this.client.rest.post(Routes.guildAutoModerationRules(this.guild.id), {
      body: {
        name,
        event_type: eventType,
        trigger_type: triggerType,
        trigger_metadata: triggerMetadata && {
          keyword_filter: triggerMetadata.keywordFilter,
          regex_patterns: triggerMetadata.regexPatterns,
          presets: triggerMetadata.presets,
          allow_list: triggerMetadata.allowList,
          mention_total_limit: triggerMetadata.mentionTotalLimit,
        },
        actions: actions.map(action => ({
          type: action.type,
          metadata: {
            duration_seconds: action.metadata?.durationSeconds,
            channel_id: action.metadata?.channel && this.guild.channels.resolveId(action.metadata.channel),
            custom_message: action.metadata?.customMessage,
          },
        })),
        enabled,
        exempt_roles: exemptRoles?.map(exemptRole => this.guild.roles.resolveId(exemptRole)),
        exempt_channels: exemptChannels?.map(exemptChannel => this.guild.channels.resolveId(exemptChannel)),
      },
      reason,
    });

    return this._add(data);
  }

  /**
   * Options used to edit an auto moderation rule.
   * @typedef {Object} AutoModerationRuleEditOptions
   * @property {string} [name] The name of the auto moderation rule
   * @property {AutoModerationRuleEventType} [eventType] The event type of the auto moderation rule
   * @property {AutoModerationTriggerMetadataOptions} [triggerMetadata] The trigger metadata of the auto moderation rule
   * @property {AutoModerationActionOptions[]} [actions]
   * The actions that will execute when the auto moderation rule is triggered
   * @property {boolean} [enabled] Whether the auto moderation rule should be enabled
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [exemptRoles]
   * The roles that should not be affected by the auto moderation rule
   * @property {Collection<Snowflake, GuildChannel|ThreadChannel>|GuildChannelResolvable[]} [exemptChannels]
   * The channels that should not be affected by the auto moderation rule
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

    const data = await this.client.rest.patch(Routes.guildAutoModerationRule(this.guild.id, autoModerationRuleId), {
      body: {
        name,
        event_type: eventType,
        trigger_metadata: triggerMetadata && {
          keyword_filter: triggerMetadata.keywordFilter,
          regex_patterns: triggerMetadata.regexPatterns,
          presets: triggerMetadata.presets,
          allow_list: triggerMetadata.allowList,
          mention_total_limit: triggerMetadata.mentionTotalLimit,
        },
        actions: actions?.map(action => ({
          type: action.type,
          metadata: {
            duration_seconds: action.metadata?.durationSeconds,
            channel_id: action.metadata?.channel && this.guild.channels.resolveId(action.metadata.channel),
            custom_message: action.metadata?.customMessage,
          },
        })),
        enabled,
        exempt_roles: exemptRoles?.map(exemptRole => this.guild.roles.resolveId(exemptRole)),
        exempt_channels: exemptChannels?.map(exemptChannel => this.guild.channels.resolveId(exemptChannel)),
      },
      reason,
    });

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
   * @param {AutoModerationRuleResolvable|FetchAutoModerationRuleOptions|FetchAutoModerationRulesOptions} [options]
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
   * guild.autoModerationRules.fetch({ autoModerationRule: '979083472868098119', cache: false, force: true })
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

    const data = await this.client.rest.get(Routes.guildAutoModerationRule(this.guild.id, autoModerationRule));
    return this._add(data, cache);
  }

  async _fetchMany(options = {}) {
    const data = await this.client.rest.get(Routes.guildAutoModerationRules(this.guild.id));

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
    await this.client.rest.delete(Routes.guildAutoModerationRule(this.guild.id, autoModerationRuleId), { reason });
  }
}

module.exports = AutoModerationRuleManager;
