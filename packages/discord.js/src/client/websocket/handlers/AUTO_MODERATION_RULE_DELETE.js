'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayAutoModerationRuleDeleteDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayAutoModerationRuleDeleteDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.AutoModerationRuleDelete.handle(packet.d);
};
