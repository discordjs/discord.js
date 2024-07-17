'use strict';

/**
 * @import Client from '../../Client';
 * @import { GatewayChannelUpdateDispatch } from 'discord-api-types/v10';
 */

const Events = require('../../../util/Events');

/**
 * @param {Client} client The client
 * @param {GatewayChannelUpdateDispatch} packet The received packet
 */
module.exports = (client, packet) => {
  const { old, updated } = client.actions.ChannelUpdate.handle(packet.d);

  if (old && updated) {
    /**
     * Emitted whenever a channel is updated - e.g. name change, topic change, channel type change.
     * @event Client#channelUpdate
     * @param {DMChannel|GuildChannel} oldChannel The channel before the update
     * @param {DMChannel|GuildChannel} newChannel The channel after the update
     */
    client.emit(Events.ChannelUpdate, old, updated);
  }
};
