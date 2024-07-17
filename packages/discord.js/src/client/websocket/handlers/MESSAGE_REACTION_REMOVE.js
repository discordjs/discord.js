'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayMessageReactionRemoveDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayMessageReactionRemoveDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.MessageReactionRemove.handle(packet.d);
};
