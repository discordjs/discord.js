'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayMessageCreateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayMessageCreateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.MessageCreate.handle(packet.d);
};
