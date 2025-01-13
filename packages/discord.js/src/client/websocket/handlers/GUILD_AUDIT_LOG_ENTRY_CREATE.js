'use strict';

const GuildAuditLogsEntry = require('../../../structures/GuildAuditLogsEntry.js');
const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) return;

  const auditLogEntry = new GuildAuditLogsEntry(guild, data);

  /**
   * Emitted whenever a guild audit log entry is created.
   * @event Client#guildAuditLogEntryCreate
   * @param {GuildAuditLogsEntry} auditLogEntry The entry that was created
   * @param {Guild} guild The guild where the entry was created
   */
  client.emit(Events.GuildAuditLogEntryCreate, auditLogEntry, guild);
};
