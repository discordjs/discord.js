'use strict';

const { Collection } = require('@discordjs/collection');
const GuildAuditLogsEntry = require('./GuildAuditLogsEntry');
const Integration = require('./Integration');
const User = require('./User');
const Webhook = require('./Webhook');
const Util = require('../util/Util');

/**
 * The target type of an entry. Here are the available types:
 * * Guild
 * * Channel
 * * User
 * * Role
 * * Invite
 * * Webhook
 * * Emoji
 * * Message
 * * Integration
 * * StageInstance
 * * Sticker
 * * Thread
 * * GuildScheduledEvent
 * @typedef {string} AuditLogTargetType
 */

/**
 * Audit logs entries are held in this class.
 */
class GuildAuditLogs {
  constructor(guild, data) {
    this.users = new Collection();
    if (data.users) {
      for (const user of data.users) {
        this.users.set(user.id, new User(guild.client, user));
      }
    }
    if (data.threads) for (const thread of data.threads) guild.client.channels._add(thread, guild);
    /**
     * Cached webhooks
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
     * @type {Collection<Snowflake, GuildScheduledEvent>}
     * @private
     */
    this.guildScheduledEvents = data.guild_scheduled_events.reduce(
      (guildScheduledEvents, guildScheduledEvent) =>
        guildScheduledEvents.set(guildScheduledEvent.id, guild.scheduledEvents._add(guildScheduledEvent)),
      new Collection(),
    );

    /**
     * The entries for this guild's audit logs
     * @type {Collection<Snowflake, GuildAuditLogsEntry>}
     */
    this.entries = new Collection();
    for (const item of data.audit_log_entries) {
      const entry = new GuildAuditLogsEntry(this, guild, item);
      this.entries.set(entry.id, entry);
    }
  }

  toJSON() {
    return Util.flatten(this);
  }
}

module.exports = GuildAuditLogs;
