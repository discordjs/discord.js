'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayEntitlementDeleteDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayEntitlementDeleteDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.EntitlementDelete.handle(packet.d);
};
