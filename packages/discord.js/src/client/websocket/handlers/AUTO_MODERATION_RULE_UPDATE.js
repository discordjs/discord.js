'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayAutoModerationRuleUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayAutoModerationRuleUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.AutoModerationRuleUpdate.handle(packet.d);
};
