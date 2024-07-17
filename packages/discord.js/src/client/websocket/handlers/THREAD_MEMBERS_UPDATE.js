'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayThreadMembersUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayThreadMembersUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.ThreadMembersUpdate.handle(packet.d);
};
