'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayMessageReactionAddDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayMessageReactionAddDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.MessageReactionAdd.handle(packet.d);
};
