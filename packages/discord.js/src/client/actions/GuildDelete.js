'use strict';

const { Action } = require('./Action.js');

class GuildDeleteAction extends Action {
  handle(guild) {
    const { client } = this;

    for (const channel of guild.channels.cache.values()) client.channels._remove(channel.id);
    client.voice.adapters.get(guild.id)?.destroy();

    client.guilds.cache.delete(guild.id);
  }
}

exports.GuildDeleteAction = GuildDeleteAction;
