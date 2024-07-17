'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildScheduledEventUserRemoveDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildScheduledEventUserRemoveDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.GuildScheduledEventUserRemove.handle(packet.d);
};
