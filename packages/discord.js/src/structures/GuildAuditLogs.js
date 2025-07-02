'use strict';

const { Collection } = require('@discordjs/collection');
const { flatten } = require('../util/Util.js');
const { ApplicationCommand } = require('./ApplicationCommand.js');
const { GuildAuditLogsEntry } = require('./GuildAuditLogsEntry.js');
const { Integration } = require('./Integration.js');
const { Webhook } = require('./Webhook.js');

/**
 * Audit logs entries are held in this class.
 */
class GuildAuditLogs {
  constructor(guild, data) {
    if (data.users) for (const user of data.users) guild.client.users._add(user);
    if (data.threads) for (const thread of data.threads) guild.client.channels._add(thread, guild);
    /**
     * Cached webhooks
     *
     * @type {Collection<Snowflake, Webhook>}
     * @private
     */
    this.webhooks = new Collection();
    if (data.webhooks) {
      for (const hook of data.webhooks) {
        this.webhooks.set(hook.id, new Webhook(guild.client, hook));
      }
    }

    /**
     * Cached integrations
     *
     * @type {Collection<Snowflake|string, Integration>}
     * @private
     */
    this.integrations = new Collection();
    if (data.integrations) {
      for (const integration of data.integrations) {
        this.integrations.set(integration.id, new Integration(guild.client, integration, guild));
      }
    }

    /**
     * Cached {@link GuildScheduledEvent}s.
     *
     * @type {Collection<Snowflake, GuildScheduledEvent>}
     * @private
     */
    this.guildScheduledEvents = data.guild_scheduled_events.reduce(
      (guildScheduledEvents, guildScheduledEvent) =>
        guildScheduledEvents.set(guildScheduledEvent.id, guild.scheduledEvents._add(guildScheduledEvent)),
      new Collection(),
    );

    /**
     * Cached application commands, includes application commands from other applications
     *
     * @type {Collection<Snowflake, ApplicationCommand>}
     * @private
     */
    this.applicationCommands = new Collection();
    if (data.application_commands) {
      for (const command of data.application_commands) {
        this.applicationCommands.set(command.id, new ApplicationCommand(guild.client, command, guild));
      }
    }

    /**
     * Cached auto moderation rules.
     *
     * @type {Collection<Snowflake, AutoModerationRule>}
     * @private
     */
    this.autoModerationRules = data.auto_moderation_rules.reduce(
      (autoModerationRules, autoModerationRule) =>
        autoModerationRules.set(autoModerationRule.id, guild.autoModerationRules._add(autoModerationRule)),
      new Collection(),
    );

    /**
     * The entries for this guild's audit logs
     *
     * @type {Collection<Snowflake, GuildAuditLogsEntry>}
     */
    this.entries = new Collection();
    for (const item of data.audit_log_entries) {
      const entry = new GuildAuditLogsEntry(guild, item, this);
      this.entries.set(entry.id, entry);
    }
  }

  toJSON() {
    return flatten(this);
  }
}

exports.GuildAuditLogs = GuildAuditLogs;
