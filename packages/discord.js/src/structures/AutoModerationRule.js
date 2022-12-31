'use strict';

const { Collection } = require('@discordjs/collection');
const Base = require('./Base');

/**
 * Represents an auto moderation rule.
 * @extends {Base}
 */
class AutoModerationRule extends Base {
  constructor(client, data, guild) {
    super(client);

    /**
     * The id of this auto moderation rule.
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The guild this auto moderation rule is for.
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The user that created this auto moderation rule.
     * @type {Snowflake}
     */
    this.creatorId = data.creator_id;

    /**
     * The trigger type of this auto moderation rule.
     * @type {AutoModerationRuleTriggerType}
     */
    this.triggerType = data.trigger_type;

    this._patch(data);
  }

  _patch(data) {
    if ('name' in data) {
      /**
       * The name of this auto moderation rule.
       * @type {string}
       */
      this.name = data.name;
    }

    if ('event_type' in data) {
      /**
       * The event type of this auto moderation rule.
       * @type {AutoModerationRuleEventType}
       */
      this.eventType = data.event_type;
    }

    if ('trigger_metadata' in data) {
      /**
       * Additional data used to determine whether an auto moderation rule should be triggered.
       * @typedef {Object} AutoModerationTriggerMetadata
       * @property {string[]} keywordFilter The substrings that will be searched for in the content
       * @property {string[]} regexPatterns The regular expression patterns which will be matched against the content
       * <info>Only Rust-flavored regular expressions are supported.</info>
       * @property {AutoModerationRuleKeywordPresetType[]} presets
       * The internally pre-defined wordsets which will be searched for in the content
       * @property {string[]} allowList The substrings that will be exempt from triggering
       * {@link AutoModerationRuleTriggerType.Keyword} and {@link AutoModerationRuleTriggerType.KeywordPreset}
       * @property {?number} mentionTotalLimit The total number of role & user mentions allowed per message
       * @property {boolean} mentionRaidProtectionEnabled Whether mention raid protection is enabled
       */

      /**
       * The trigger metadata of the rule.
       * @type {AutoModerationTriggerMetadata}
       */
      this.triggerMetadata = {
        keywordFilter: data.trigger_metadata.keyword_filter ?? [],
        regexPatterns: data.trigger_metadata.regex_patterns ?? [],
        presets: data.trigger_metadata.presets ?? [],
        allowList: data.trigger_metadata.allow_list ?? [],
        mentionTotalLimit: data.trigger_metadata.mention_total_limit ?? null,
        mentionRaidProtectionEnabled: data.trigger_metadata.mention_raid_protection_enabled ?? false,
      };
    }

    if ('actions' in data) {
      /**
       * An object containing information about an auto moderation rule action.
       * @typedef {Object} AutoModerationAction
       * @property {AutoModerationActionType} type The type of this auto moderation rule action
       * @property {AutoModerationActionMetadata} metadata Additional metadata needed during execution
       */

      /**
       * Additional data used when an auto moderation rule is executed.
       * @typedef {Object} AutoModerationActionMetadata
       * @property {?Snowflake} channelId The id of the channel to which content will be logged
       * @property {?number} durationSeconds The timeout duration in seconds
       */

      /**
       * The actions of this auto moderation rule.
       * @type {AutoModerationAction[]}
       */
      this.actions = data.actions.map(action => ({
        type: action.type,
        metadata: {
          durationSeconds: action.metadata.duration_seconds ?? null,
          channelId: action.metadata.channel_id ?? null,
        },
      }));
    }

    if ('enabled' in data) {
      /**
       * Whether this auto moderation rule is enabled.
       * @type {boolean}
       */
      this.enabled = data.enabled;
    }

    if ('exempt_roles' in data) {
      /**
       * The roles exempt by this auto moderation rule.
       * @type {Collection<Snowflake, Role>}
       */
      this.exemptRoles = new Collection(
        data.exempt_roles.map(exemptRole => [exemptRole, this.guild.roles.cache.get(exemptRole)]),
      );
    }

    if ('exempt_channels' in data) {
      /**
       * The channels exempt by this auto moderation rule.
       * @type {Collection<Snowflake, GuildChannel|ThreadChannel>}
       */
      this.exemptChannels = new Collection(
        data.exempt_channels.map(exemptChannel => [exemptChannel, this.guild.channels.cache.get(exemptChannel)]),
      );
    }
  }

  /**
   * Edits this auto moderation rule.
   * @param {AutoModerationRuleEditOptions} options Options for editing this auto moderation rule
   * @returns {Promise<AutoModerationRule>}
   */
  edit(options) {
    return this.guild.autoModerationRules.edit(this.id, options);
  }

  /**
   * Deletes this auto moderation rule.
   * @param {string} [reason] The reason for deleting this auto moderation rule
   * @returns {Promise<void>}
   */
  delete(reason) {
    return this.guild.autoModerationRules.delete(this.id, reason);
  }

  /**
   * Sets the name for this auto moderation rule.
   * @param {string} name The name of this auto moderation rule
   * @param {string} [reason] The reason for changing the name of this auto moderation rule
   * @returns {Promise<AutoModerationRule>}
   */
  setName(name, reason) {
    return this.edit({ name, reason });
  }

  /**
   * Sets the event type for this auto moderation rule.
   * @param {AutoModerationRuleEventType} eventType The event type of this auto moderation rule
   * @param {string} [reason] The reason for changing the event type of this auto moderation rule
   * @returns {Promise<AutoModerationRule>}
   */
  setEventType(eventType, reason) {
    return this.edit({ eventType, reason });
  }

  /**
   * Sets the keyword filter for this auto moderation rule.
   * @param {string[]} keywordFilter The keyword filter of this auto moderation rule
   * @param {string} [reason] The reason for changing the keyword filter of this auto moderation rule
   * @returns {Promise<AutoModerationRule>}
   */
  setKeywordFilter(keywordFilter, reason) {
    return this.edit({ triggerMetadata: { ...this.triggerMetadata, keywordFilter }, reason });
  }

  /**
   * Sets the regular expression patterns for this auto moderation rule.
   * @param {string[]} regexPatterns The regular expression patterns of this auto moderation rule
   * <info>Only Rust-flavored regular expressions are supported.</info>
   * @param {string} [reason] The reason for changing the regular expression patterns of this auto moderation rule
   * @returns {Promise<AutoModerationRule>}
   */
  setRegexPatterns(regexPatterns, reason) {
    return this.edit({ triggerMetadata: { ...this.triggerMetadata, regexPatterns }, reason });
  }

  /**
   * Sets the presets for this auto moderation rule.
   * @param {AutoModerationRuleKeywordPresetType[]} presets The presets of this auto moderation rule
   * @param {string} [reason] The reason for changing the presets of this auto moderation rule
   * @returns {Promise<AutoModerationRule>}
   */
  setPresets(presets, reason) {
    return this.edit({ triggerMetadata: { ...this.triggerMetadata, presets }, reason });
  }

  /**
   * Sets the allow list for this auto moderation rule.
   * @param {string[]} allowList The allow list of this auto moderation rule
   * @param {string} [reason] The reason for changing the allow list of this auto moderation rule
   * @returns {Promise<AutoModerationRule>}
   */
  setAllowList(allowList, reason) {
    return this.edit({ triggerMetadata: { ...this.triggerMetadata, allowList }, reason });
  }

  /**
   * Sets the mention total limit for this auto moderation rule.
   * @param {number} mentionTotalLimit The mention total limit of this auto moderation rule
   * @param {string} [reason] The reason for changing the mention total limit of this auto moderation rule
   * @returns {Promise<AutoModerationRule>}
   */
  setMentionTotalLimit(mentionTotalLimit, reason) {
    return this.edit({ triggerMetadata: { ...this.triggerMetadata, mentionTotalLimit }, reason });
  }

  /**
   * Sets whether to enable mention raid protection for this auto moderation rule.
   * @param {boolean} mentionRaidProtectionEnabled
   * Whether to enable mention raid protection for this auto moderation rule
   * @param {string} [reason] The reason for changing the mention raid protection of this auto moderation rule
   * @returns {Promise<AutoModerationRule>}
   */
  setMentionRaidProtectionEnabled(mentionRaidProtectionEnabled, reason) {
    return this.edit({ triggerMetadata: { ...this.triggerMetadata, mentionRaidProtectionEnabled }, reason });
  }

  /**
   * Sets the actions for this auto moderation rule.
   * @param {AutoModerationActionOptions[]} actions The actions of this auto moderation rule
   * @param {string} [reason] The reason for changing the actions of this auto moderation rule
   * @returns {Promise<AutoModerationRule>}
   */
  setActions(actions, reason) {
    return this.edit({ actions, reason });
  }

  /**
   * Sets whether this auto moderation rule should be enabled.
   * @param {boolean} [enabled=true] Whether to enable this auto moderation rule
   * @param {string} [reason] The reason for enabling or disabling this auto moderation rule
   * @returns {Promise<AutoModerationRule>}
   */
  setEnabled(enabled = true, reason) {
    return this.edit({ enabled, reason });
  }

  /**
   * Sets the exempt roles for this auto moderation rule.
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} [exemptRoles] The exempt roles of this auto moderation rule
   * @param {string} [reason] The reason for changing the exempt roles of this auto moderation rule
   * @returns {Promise<AutoModerationRule>}
   */
  setExemptRoles(exemptRoles, reason) {
    return this.edit({ exemptRoles, reason });
  }

  /**
   * Sets the exempt channels for this auto moderation rule.
   * @param {Collection<Snowflake, GuildChannel|ThreadChannel>|GuildChannelResolvable[]} [exemptChannels]
   * The exempt channels of this auto moderation rule
   * @param {string} [reason] The reason for changing the exempt channels of this auto moderation rule
   * @returns {Promise<AutoModerationRule>}
   */
  setExemptChannels(exemptChannels, reason) {
    return this.edit({ exemptChannels, reason });
  }
}

module.exports = AutoModerationRule;
