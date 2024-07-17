'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayWebhooksUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayWebhooksUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.WebhooksUpdate.handle(packet.d);
};
