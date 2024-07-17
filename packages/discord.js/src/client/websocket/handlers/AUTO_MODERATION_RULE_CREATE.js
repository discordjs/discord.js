'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayAutoModerationRuleCreateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayAutoModerationRuleCreateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.AutoModerationRuleCreate.handle(packet.d);
};
