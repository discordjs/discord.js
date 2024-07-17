'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildRoleCreateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildRoleCreateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.GuildRoleCreate.handle(packet.d);
};
