'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayMessagePollVoteRemoveDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayMessagePollVoteRemoveDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.MessagePollVoteRemove.handle(packet.d);
};
