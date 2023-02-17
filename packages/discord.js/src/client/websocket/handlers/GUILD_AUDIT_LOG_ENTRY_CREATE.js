'use strict';

module.exports = (client, packet) => {
  client.actions.GuildAuditLogEntryCreate.handle(packet.d);
};
