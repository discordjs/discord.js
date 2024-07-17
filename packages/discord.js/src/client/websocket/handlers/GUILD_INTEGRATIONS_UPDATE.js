'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayGuildIntegrationsUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayGuildIntegrationsUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.GuildIntegrationsUpdate.handle(packet.d);
};
