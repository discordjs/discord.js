'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildEmojisUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildEmojisUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.GuildEmojisUpdate.handle(packet.d);
};
