'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildScheduledEventUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildScheduledEventUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.GuildScheduledEventUpdate.handle(packet.d);
};
