'use strict';

/**
 * @import { BaseChannel } from '../../structures/BaseChannel';
 */

const Action = require('./Action');
const Events = require('../../util/Events');

/**
 * @extends {Action<[import('discord-api-types/v10').GatewayChannelCreateDispatchData], { channel?: BaseChannel | null }>}
 * @private
 * @internal
 */
class ChannelCreateAction extends Action {
  /**
   * @override
   * @param {import('discord-api-types/v10').GatewayChannelCreateDispatchData} data
   */
  handle(data) {
    const client = this.client;
    const existing = client.channels.cache.has(data.id);
    const channel = client.channels._add(data);

    if (!existing && channel) {
      /**
       * Emitted whenever a guild channel is created.
       * @event Client#channelCreate
       * @param {GuildChannel} channel The channel that was created
       */
      client.emit(Events.ChannelCreate, channel);
    }

    return { channel };
  }
}

module.exports = ChannelCreateAction;
