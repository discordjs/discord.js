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

  getChannel(data) {
    const id = data.channel_id || data.id;
    return data.channel || (this.client.options.partials.includes(PartialTypes.CHANNEL) ?
      this.client.channels.add({
        id,
        guild_id: data.guild_id,
      }) :
      this.client.channels.get(id));
  }

  getMessage(data, channel) {
    const id = data.message_id || data.id;
    return data.message || (this.client.options.partials.includes(PartialTypes.MESSAGE) ?
      channel.messages.add({
        id,
        channel_id: channel.id,
        guild_id: data.guild_id || (channel.guild ? channel.guild.id : null),
      }) :
      channel.messages.get(id));
  }
}

module.exports = GenericAction;
