'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildDeleteDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildDeleteDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.GuildDelete.handle(packet.d);
};
