'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayMessageReactionRemoveAllDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayMessageReactionRemoveAllDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.MessageReactionRemoveAll.handle(packet.d);
};
