'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayInviteDeleteDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayInviteDeleteDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.InviteDelete.handle(packet.d);
};
