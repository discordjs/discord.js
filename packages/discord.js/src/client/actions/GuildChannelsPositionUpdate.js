'use strict';

const { Action } = require('./Action.js');

class GuildChannelsPositionUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.cache.get(data.guild_id);
    if (guild) {
      for (const partialChannel of data.channels) {
        const channel = guild.channels.cache.get(partialChannel.id);
        if (channel) {
          channel.rawPosition = partialChannel.position;
        }
      }
    }

    return { guild };
  }
}

exports.GuildChannelsPositionUpdateAction = GuildChannelsPositionUpdateAction;
