'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayStageInstanceDeleteDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayStageInstanceDeleteDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.StageInstanceDelete.handle(packet.d);
};
