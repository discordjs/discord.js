'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayUserUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayUserUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.UserUpdate.handle(packet.d);
};
