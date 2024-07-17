'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayVoiceServerUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayVoiceServerUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.emit('debug', `[VOICE] received voice server: ${JSON.stringify(packet)}`);
  client.voice.onVoiceServer(packet.d);
};
