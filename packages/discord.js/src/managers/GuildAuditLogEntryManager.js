'use strict';

const { Collection } = require('@discordjs/collection');
const { makeURLSearchParams } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const { DiscordjsTypeError, ErrorCodes } = require('../errors');
const ApplicationCommand = require('../structures/ApplicationCommand');
const GuildAuditLogsEntry = require('../structures/GuildAuditLogsEntry');
const Integration = require('../structures/Integration');
const Webhook = require('../structures/Webhook');

/**
 * An extension for guild-specific application commands.
 * @extends {CachedManager}
 */
class GuildAuditLogEntryManager extends CachedManager {
  constructor(guild) {
    super(guild.client, GuildAuditLogsEntry);

    /**
     * The guild that this manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }
  /**
   * The cache of this Manager
   * @type {Collection<Snowflake, GuildAuditLogsEntry>}
   * @name GuildBanManager#cache
   */

  _add(data, cache = true, { id, extras = [] } = {}) {
    const existing = this.cache.get(id ?? data.id);
    if (existing) {
      if (cache) {
        existing._patch(data);
        return existing;
      }
      const clone = existing._clone();
      clone._patch(data);
      return clone;
    }

    const entry = this.holds ? new this.holds(this.guild, data, ...extras) : data;
    if (cache) this.cache.set(id ?? entry.id, entry);
    return entry;
  }

  /**
   * Options used to fetch audit logs.
   * @typedef {Object} GuildAuditLogsFetchOptions
   * @property {Snowflake|GuildAuditLogsEntry} [before] Consider only entries before this entry
   * @property {Snowflake|GuildAuditLogsEntry} [after] Consider only entries after this entry
   * @property {number} [limit] The number of entries to return
   * @property {UserResolvable} [user] Only return entries for actions made by this user
   * @property {?AuditLogEvent} [type] Only return entries for this action type
   */

  /**
   * Fetches audit logs for this guild.
   * @param {GuildAuditLogsFetchOptions} [options={}] Options for fetching audit logs
   * @returns {Promise<Collection<GuildAuditLogsEntry>>}
   * @example
   * // Output audit log entries
   * guild.auditLogEntries.fetch()
   *   .then(audit => console.log(audit.first()))
   *   .catch(console.error);
   */
  async fetch({ before, after, limit, user, type } = {}) {
    const query = makeURLSearchParams({
      before: before?.id ?? before,
      after: after?.id ?? after,
      limit,
      action_type: type,
    });

    if (user) {
      const userId = this.client.users.resolveId(user);
      if (!userId) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'user', 'UserResolvable');
      query.set('user_id', userId);
    }

    const data = await this.client.rest.get(Routes.guildAuditLog(this.id), { query });

    let notCachableObjects = {
      webhooks: data.webhooks.reduce(
        (webhooks, webhook) => webhooks.set(webhook.id, new Webhook(this.client, webhook)),
        new Collection(),
      ),
      integrations: data.integrations.reduce(
        (integrations, integration) =>
          integrations.set(integration.id, new Integration(this.client, integration, this.guild)),
        new Collection(),
      ),
      applicationCommands: data.application_commands.reduce(
        (applicationCommands, command) =>
          applicationCommands.set(command.id, new ApplicationCommand(this.client, command, this.guild)),
        new Collection(),
      ),
    };

    for (const auditLogUser of data.users) this.client.users._add(auditLogUser);
    for (const thread of data.threads) this.client.channels._add(thread, this.guild);
    for (const autoModerationRule in data.auto_moderation_rules) {
      this.guild.autoModerationRules._add(autoModerationRule);
    }
    for (const guildScheduledEvent in data.guild_scheduled_events) {
      this.guild.scheduledEvents._add(guildScheduledEvent);
    }

    return data.audit_log_entries.reduce(
      (col, auditLogEntity) =>
        col.set(auditLogEntity.id, this._add(auditLogEntity, true, { extras: [notCachableObjects] })),
      new Collection(),
    );
  }
}

module.exports = GuildAuditLogEntryManager;
