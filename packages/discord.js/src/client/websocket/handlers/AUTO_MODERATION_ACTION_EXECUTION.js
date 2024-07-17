'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayAutoModerationActionExecutionDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayAutoModerationActionExecutionDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  client.actions.AutoModerationActionExecution.handle(packet.d);
};
