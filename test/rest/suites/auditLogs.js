'use strict';

async function auditLogs(client) {
  for (let i = 0; i < 50; i++) {
    await client.api.guilds('387339871057870848')['audit-logs'].get();
  }
}

module.exports = auditLogs;
