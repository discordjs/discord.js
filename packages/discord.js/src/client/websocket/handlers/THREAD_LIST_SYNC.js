'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayThreadListSyncDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayThreadListSyncDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.ThreadListSync.handle(packet.d);
};
