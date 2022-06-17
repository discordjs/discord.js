'use strict';

/**
 * Represents the structure of an executed action when a {@link AutoModerationRule} is triggered.
 */
class AutoModerationActionExecution {
  constructor(data) {
    /**
     * The guild id where this action was executed from.
     * @type {Snowflake}
     */
    this.guildId = data.guild_id;

    /**
     * The action that was executed.
     * @type {AutoModerationAction}
     */
    this.action = data.action;

    /**
     * The id of the {@link AutoModerationRule} this action belongs to.
     * @type {Snowflake}
     */
    this.ruleId = data.rule_id;

    // TODO: discord-api-types enum
    /**
     * The trigger type of the {@link AutoModerationRule} which was triggered.
     * @type {number}
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
     * @type {?Snowflake}
     * <info>This will not be present if the message was blocked or the content was not part of any message</info>
     */
    this.messageId = data.message_id ?? null;

    /**
     * The id of any system auto moderation messages posted as a result of this action.
     * @type {?Snowflake}
     */
    this.alertSystemMessageId = data.alert_system_message_id ?? null;

    /**
     * The content that triggered this action.
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
}

module.exports = AutoModerationActionExecution;
