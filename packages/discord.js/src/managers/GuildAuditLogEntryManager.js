'use strict';

const CachedManager = require('./CachedManager');
const GuildAuditLogsEntry = require('../structures/GuildAuditLogsEntry');

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
}

module.exports = GuildAuditLogEntryManager;
