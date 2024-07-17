'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayChannelDeleteDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayChannelDeleteDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.ChannelDelete.handle(packet.d);
};
