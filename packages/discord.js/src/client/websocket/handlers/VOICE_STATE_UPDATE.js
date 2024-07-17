'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayVoiceStateUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayVoiceStateUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.VoiceStateUpdate.handle(packet.d);
};
