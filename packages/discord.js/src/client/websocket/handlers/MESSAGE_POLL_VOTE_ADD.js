'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayMessagePollVoteAddDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayMessagePollVoteAddDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.MessagePollVoteAdd.handle(packet.d);
};
