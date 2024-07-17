'use strict';

const Events = require('../../../util/Events');

/**
 * @import Client from '../../Client';
 * @import { GatewayThreadUpdateDispatch } from 'discord-api-types/v10';
 */

/**
 * @param {Client} client The client
 * @param {GatewayThreadUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  const { old, updated } = client.actions.ChannelUpdate.handle(packet.d);
  if (old && updated) {
    /**
     * Emitted whenever a thread is updated - e.g. name change, archive state change, locked state change.
     * @event Client#threadUpdate
     * @param {ThreadChannel} oldThread The thread before the update
     * @param {ThreadChannel} newThread The thread after the update
     */
    client.emit(Events.ThreadUpdate, old, updated);
  }
};
