'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayEntitlementUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayEntitlementUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.EntitlementUpdate.handle(packet.d);
};
