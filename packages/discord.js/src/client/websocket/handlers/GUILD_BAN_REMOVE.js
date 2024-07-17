'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildBanRemoveDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildBanRemoveDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.GuildBanRemove.handle(packet.d);
};
