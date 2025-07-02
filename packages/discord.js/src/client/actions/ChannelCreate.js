'use strict';

const { Events } = require('../../util/Events.js');
const { Action } = require('./Action.js');

class ChannelCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const existing = client.channels.cache.has(data.id);
    const channel = client.channels._add(data);
    if (!existing && channel) {
      /**
       * Emitted whenever a guild channel is created.
       *
       * @event Client#channelCreate
       * @param {GuildChannel} channel The channel that was created
       */
      client.emit(Events.ChannelCreate, channel);
    }

    return { channel };
  }
}

exports.ChannelCreateAction = ChannelCreateAction;
