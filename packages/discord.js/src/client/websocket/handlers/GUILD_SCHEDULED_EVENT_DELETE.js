'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildScheduledEventDeleteDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildScheduledEventDeleteDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.GuildScheduledEventDelete.handle(packet.d);
};
