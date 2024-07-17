'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayApplicationCommandPermissionsUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayApplicationCommandPermissionsUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.ApplicationCommandPermissionsUpdate.handle(packet.d);
};
