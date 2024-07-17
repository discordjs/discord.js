'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildScheduledEventUserAddDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildScheduledEventUserAddDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.GuildScheduledEventUserAdd.handle(packet.d);
};
