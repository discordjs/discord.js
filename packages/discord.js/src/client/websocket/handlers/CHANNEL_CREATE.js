'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayChannelCreateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayChannelCreateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.ChannelCreate.handle(packet.d);
};
