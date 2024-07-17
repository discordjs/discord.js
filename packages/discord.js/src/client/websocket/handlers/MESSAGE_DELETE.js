'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayMessageDeleteDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayMessageDeleteDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.MessageDelete.handle(packet.d);
};
