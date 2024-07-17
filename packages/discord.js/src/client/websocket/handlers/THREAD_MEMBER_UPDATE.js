'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayThreadMemberUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayThreadMemberUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.ThreadMemberUpdate.handle(packet.d);
};
