'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayPresenceUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayPresenceUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.PresenceUpdate.handle(packet.d);
};
