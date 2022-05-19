'use strict';

const Base = require('./Base');

/**
 * Represents an AutoMod rule.
 */
class AutoModRule extends Base {
  constructor(client, data) {
    super(client);

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
     * The trigger type of this rule.
     * @type {number}
     */
    this.triggerType = data.trigger_type;

    /**
     * The trigger metadata of the rule.
     * @type {Object}
     */
    this.triggerMetadata = data.trigger_metadata;

    /**
     * An object containing information about an AutoMod rule action.
     * @typedef {Object} AutoModRuleAction
     * @property {number} type The type of this AutoMod rule action
     * @property {Object} metadata dunno fam
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

    /**
     * The position of this rule.
     * @type {number}
     */
    this.position = data.position;
  }
}

module.exports = AutoModRule;
