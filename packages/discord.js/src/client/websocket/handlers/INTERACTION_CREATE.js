'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayInteractionCreateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayInteractionCreateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.InteractionCreate.handle(packet.d);
};
