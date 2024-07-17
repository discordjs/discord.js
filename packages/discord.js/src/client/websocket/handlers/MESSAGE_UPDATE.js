'use strict';

const Events = require('../../../util/Events');

/**
 * @import Client from '../../Client';
 * @import { GatewayMessageUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayMessageUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  const { old, updated } = client.actions.MessageUpdate.handle(packet.d);
  if (old && updated) {
    /**
     * Emitted whenever a message is updated - e.g. embed or content change.
     * @event Client#messageUpdate
     * @param {Message} oldMessage The message before the update
     * @param {Message} newMessage The message after the update
     */
    client.emit(Events.MessageUpdate, old, updated);
  }
};
