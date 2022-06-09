'use strict';

const Base = require('./Base');

/**
 * Represents an AutoMod rule.
 */
class AutoModRule extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The id of this rule.
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The guild id of this rule.
     * @type {Snowflake}
     */
    this.guildId = data.guild_id;

    /**
     * The user that created this rule.
     * @type {Snowflake}
     */
    this.creatorId = data.creator_id;

    /**
     * The trigger type of this rule.
     * @type {number}
     */
    this.triggerType = data.trigger_type;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The name of this rule.
     * @type {string}
     */
    this.name = data.name;

    /**
     * The event type of this rule.
     * @type {number}
     */
    this.eventType = data.event_type;

    /**
     * Additional data used to determine whether an {@link AutoModRule} should be triggered.
     * @typedef {Object} AutoModTriggerMetadata
     * @property {string[]} keywordFilter The substrings that will be searched for in the content
     * @property {number} preset The internally pre-defined wordsets which will be searched for in content
     */

    /**
     * The trigger metadata of the rule.
     * @type {AutoModTriggerMetadata}
     */
    this.triggerMetadata = {
      keywordFilter: data.trigger_metadata.keyword_filter,
      presets: data.trigger_metadata.presets,
    };

    /**
     * An object containing information about an {@link AutoModRule} action.
     * @typedef {Object} AutoModRuleAction
     * @property {number} type The type of this AutoMod rule action
     * @property {Object} metadata Additional metadata needed during execution
     */

    /**
     * The actions of this rule.
     * @type {AutoModRuleAction[]}
     */
    this.actions = data.actions;

    /**
     * Whether this rule is enabled.
     * @type {boolean}
     */
    this.enabled = data.enabled;

    /**
     * A list of roles exempt by this rule.
     * @type {Snowflake[]}
     */
    this.exemptRoles = data.exempt_roles;

    /**
     * A list of channels exempt by this rule.
     * @type {Snowflake[]}
     */
    this.exemptChannels = data.exempt_channels;
  }
}

module.exports = AutoModRule;
