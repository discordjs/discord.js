'use strict';

const Action = require('./Action');
const GuildAuditLogsEntry = require('../../structures/GuildAuditLogsEntry');
const Events = require('../../util/Events');

class GuildAuditLogEntryCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    let auditLogEntry;

    if (guild) {
      auditLogEntry = new GuildAuditLogsEntry(guild, data);

      /**
       * Emitted whenever a guild audit log entry is created.
       * @event Client#guildAuditLogEntryCreate
       * @param {GuildAuditLogsEntry} auditLogEntry The entry that was created
       * @param {Guild} guild The guild where the entry was created
       */
      client.emit(Events.GuildAuditLogEntryCreate, auditLogEntry, guild);
    }

    return { auditLogEntry };
  }
}

module.exports = GuildAuditLogEntryCreateAction;
