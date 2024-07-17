'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayMessageReactionRemoveEmojiDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayMessageReactionRemoveEmojiDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.MessageReactionRemoveEmoji.handle(packet.d);
};
