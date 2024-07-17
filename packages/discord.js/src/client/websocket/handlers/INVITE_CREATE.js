'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayInviteCreateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayInviteCreateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.InviteCreate.handle(packet.d);
};
