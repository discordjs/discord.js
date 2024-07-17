'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.GuildUpdate.handle(packet.d);
};
