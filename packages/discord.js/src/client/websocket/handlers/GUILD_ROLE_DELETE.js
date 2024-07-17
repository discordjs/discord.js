'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildRoleDeleteDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildRoleDeleteDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.GuildRoleDelete.handle(packet.d);
};
