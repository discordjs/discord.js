'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayThreadDeleteDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayThreadDeleteDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.ThreadDelete.handle(packet.d);
};
