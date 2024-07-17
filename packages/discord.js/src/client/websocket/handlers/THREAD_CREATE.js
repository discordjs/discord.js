'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayThreadCreateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayThreadCreateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.ThreadCreate.handle(packet.d);
};
