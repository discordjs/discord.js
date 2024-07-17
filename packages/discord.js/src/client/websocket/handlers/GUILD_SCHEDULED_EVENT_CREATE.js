'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildScheduledEventCreateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildScheduledEventCreateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.GuildScheduledEventCreate.handle(packet.d);
};
