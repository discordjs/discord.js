'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayTypingStartDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayTypingStartDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.TypingStart.handle(packet.d);
};
