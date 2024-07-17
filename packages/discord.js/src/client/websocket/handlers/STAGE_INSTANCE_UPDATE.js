'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayStageInstanceUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayStageInstanceUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.StageInstanceUpdate.handle(packet.d);
};
