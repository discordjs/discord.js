'use strict';

const { createLogger } = require('../utils');
const { guildID } = require('../config.json');


async function auditLogs(client) {
  createLogger('audit logs')('get', '/guilds/{guild.id}/audit-logs');
  for (let i = 0; i < 50; i++) {
    await client.api.guilds(guildID)['audit-logs'].get();
  }
}

module.exports = auditLogs;
