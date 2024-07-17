'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayEntitlementCreateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayEntitlementCreateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.EntitlementCreate.handle(packet.d);
};
