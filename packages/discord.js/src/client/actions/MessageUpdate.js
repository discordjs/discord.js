'use strict';

const { Action } = require('./Action.js');

class MessageUpdateAction extends Action {
  handle(data) {
    const channel = this.getChannel({ id: data.channel_id, ...('guild_id' in data && { guild_id: data.guild_id }) });
    if (channel) {
      if (!channel.isTextBased()) {
        return {};
      }

      const { id, channel_id, guild_id, author, timestamp, type } = data;
      const message = this.getMessage({ id, channel_id, guild_id, author, timestamp, type }, channel);
      if (message) {
        const old = message._update(data);
        return {
          old,
          updated: message,
        };
      }
    }

    return {};
  }
}

exports.MessageUpdateAction = MessageUpdateAction;
