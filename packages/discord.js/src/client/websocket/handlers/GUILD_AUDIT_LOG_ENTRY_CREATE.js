'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildAuditLogEntryCreateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildAuditLogEntryCreateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.GuildAuditLogEntryCreate.handle(packet.d);
};
