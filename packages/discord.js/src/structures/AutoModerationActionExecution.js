'use strict';

/**
 * Represents the structure of an executed action when an {@link AutoModerationRule} is triggered.
 */
class AutoModerationActionExecution {
  constructor(data, guild) {
    /**
     * The guild where this action was executed from.
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The action that was executed.
     * @type {AutoModerationAction}
     */
    this.action = data.action;

    /**
     * The id of the auto moderation rule this action belongs to.
     * @type {Snowflake}
     */
    this.ruleId = data.rule_id;

    /**
     * The trigger type of the auto moderation rule which was triggered.
     * @type {AutoModerationRuleTriggerType}
     */
    this.ruleTriggerType = data.rule_trigger_type;

    /**
     * The id of the user that triggered this action.
     * @type {Snowflake}
     */
    this.userId = data.user_id;

    /**
     * The id of the channel where this action was triggered from.
     * @type {?Snowflake}
     */
    this.channelId = data.channel_id ?? null;

    /**
     * The id of the message that triggered this action.
     * <info>This will not be present if the message was blocked or the content was not part of any message.</info>
     * @type {?Snowflake}
     */
    this.messageId = data.message_id ?? null;

    /**
     * The id of any system auto moderation messages posted as a result of this action.
     * @type {?Snowflake}
     */
    this.alertSystemMessageId = data.alert_system_message_id ?? null;

    /**
     * The content that triggered this action.
     * <info>This property requires the {@link GatewayIntentBits.MessageContent} privileged gateway intent.</info>
     * @type {string}
     */
    this.content = data.content;

    /**
     * The word or phrase configured in the rule that triggered this action.
     * @type {?string}
     */
    this.matchedKeyword = data.matched_keyword ?? null;

    /**
     * The substring in content that triggered this action.
     * @type {?string}
     */
    this.matchedContent = data.matched_content ?? null;
  }

  /**
   * The auto moderation rule this action belongs to.
   * @type {?AutoModerationRule}
   * @readonly
   */
  get autoModerationRule() {
    return this.guild.autoModerationRules.cache.get(this.ruleId) ?? null;
  }
}

module.exports = AutoModerationActionExecution;
