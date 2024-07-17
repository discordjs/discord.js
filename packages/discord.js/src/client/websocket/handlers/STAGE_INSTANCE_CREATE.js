'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayStageInstanceCreateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayStageInstanceCreateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.StageInstanceCreate.handle(packet.d);
};
