'use strict';

const { makeURLSearchParams } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const { DiscordjsTypeError, ErrorCodes } = require('../errors');
const GuildAuditLogs = require('../structures/GuildAuditLogs');
const GuildAuditLogsEntry = require('../structures/GuildAuditLogsEntry');

/**
 * An extension for guild-specific application commands.
 * @extends {CachedManager}
 */
class GuildAuditLogManager extends CachedManager {
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
   * @returns {Promise<GuildAuditLogs>}
   * @example
   * // Output audit log entries
   * guild.auditLogs.fetch()
   *   .then(audit => console.log(audit.entries.first()))
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
    return new GuildAuditLogs(this, data);
  }
}

module.exports = GuildAuditLogManager;
