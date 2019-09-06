'use strict';

const { PartialTypes } = require('../../util/Constants');

/*

ABOUT ACTIONS

Actions are similar to WebSocket Packet Handlers, but since introducing
the REST API methods, in order to prevent rewriting code to handle data,
"actions" have been introduced. They're basically what Packet Handlers
used to be but they're strictly for manipulating data and making sure
that WebSocket events don't clash with REST methods.

*/

class GenericAction {
  constructor(client) {
    this.client = client;
  }

  handle(data) {
    return data;
  }

  getPayload(data, store, id, partialType, cache) {
    const existing = store.get(id);
    if (!existing && this.client.options.partials.includes(partialType)) {
      return store.add(data, cache);
    }
    return existing;
  }

  getChannel(data) {
    const id = data.channel_id || data.id;
    return data.channel || this.getPayload({
      id,
      guild_id: data.guild_id,
    }, this.client.channels, id, PartialTypes.CHANNEL);
  }

  getMessage(data, channel, cache) {
    const id = data.message_id || data.id;
    return data.message || this.getPayload({
      id,
      channel_id: channel.id,
      guild_id: data.guild_id || (channel.guild ? channel.guild.id : null),
    }, channel.messages, id, PartialTypes.MESSAGE, cache);
  }

  getReaction(data, message, user) {
    const id = data.emoji.id || decodeURIComponent(data.emoji.name);
    return this.getPayload({
      emoji: data.emoji,
      count: 0,
      me: user.id === this.client.user.id,
    }, message.reactions, id, PartialTypes.MESSAGE);
  }

  getMember(data, guild) {
    const id = data.user.id;
    return this.getPayload({
      user: {
        id,
      },
    }, guild.members, id, PartialTypes.GUILD_MEMBER);
  }

  getUser(data) {
    const id = data.user_id;
    return data.user || this.getPayload({ id }, this.client.users, id, PartialTypes.USER);
  }
}

module.exports = GenericAction;
