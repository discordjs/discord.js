'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayMessageDeleteBulkDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayMessageDeleteBulkDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.MessageDeleteBulk.handle(packet.d);
};
