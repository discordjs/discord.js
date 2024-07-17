'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildMemberRemoveDispatch } from 'discord-api-types/v10';
 * @import WebSocketShard from '../WebSocketShard';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildMemberRemoveDispatch} packet The received packet
 * @param {WebSocketShard} shard The shard that the event was received on
 */
module.exports = (client, packet, shard) => {
  client.actions.GuildMemberRemove.handle(packet.d, shard);
};
