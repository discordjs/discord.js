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
    if ('name' in data) {
      /**
       * The name of this rule.
       * @type {string}
       */
      this.name = data.name;
    }

    if ('event_type' in data) {
      /**
       * The event type of this rule.
       * @type {number}
       */
      this.eventType = data.event_type;
    }

    if ('trigger_metadata' in data) {
      /**
       * Additional data used to determine whether an auto moderation rule should be triggered.
       * @typedef {Object} AutoModTriggerMetadata
       * @property {string[]} keywordFilter The substrings that will be searched for in the content
       * @property {number[]} preset The internally pre-defined wordsets which will be searched for in the content
       */

      /**
       * The trigger metadata of the rule.
       * @type {AutoModTriggerMetadata}
       */
      this.triggerMetadata = {
        keywordFilter: data.trigger_metadata.keyword_filter ?? [],
        presets: data.trigger_metadata.presets ?? [],
      };
    }

    if ('actions' in data) {
      /**
       * An object containing information about an auto moderation rule action.
       * @typedef {Object} AutoModRuleAction
       * @property {number} type The type of this auto moderation rule action
       * @property {AutoModActionMetadata} metadata Additional metadata needed during execution
       */

      /**
       * Additional data used when an auto moderation rule is executed.
       * @typedef {Object} AutoModActionMetadata
       * @property {?Snowflake} channelId The id of the channel to which content will be logged
       * @property {?number} durationSeconds The timeout duration in seconds
       */

      /**
       * The actions of this rule.
       * @type {AutoModRuleAction[]}
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
       * Whether this rule is enabled.
       * @type {boolean}
       */
      this.enabled = data.enabled;
    }

    if ('exempt_roles' in data) {
      /**
       * An array of roles exempt by this rule.
       * @type {Snowflake[]}
       */
      this.exemptRoles = data.exempt_roles;
    }

    if ('exempt_channels' in data) {
      /**
       * A array of channels exempt by this rule.
       * @type {Snowflake[]}
       */
      this.exemptChannels = data.exempt_channels;
    }
  }
}

module.exports = AutoModRule;
