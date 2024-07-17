'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildStickersUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildStickersUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.GuildStickersUpdate.handle(packet.d);
};
