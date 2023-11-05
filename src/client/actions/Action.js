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

  getPayload(data, manager, id, partialType, cache) {
    const existing = manager.cache.get(id);
    if (!existing && this.client.options.partials.includes(partialType)) {
      return manager._add(data, cache);
    }
    return existing;
  }

  getChannel(data) {
    const payloadData = {};
    const id = data.channel_id ?? data.id;

    if ('recipients' in data) {
      payloadData.recipients = data.recipients;
    } else {
      // Try to resolve the recipient, but do not add the client user.
      const recipient = data.author ?? data.user ?? { id: data.user_id };
      if (recipient.id !== this.client.user.id) payloadData.recipients = [recipient];
    }

    if (id !== undefined) payloadData.id = id;
    if ('guild_id' in data) payloadData.guild_id = data.guild_id;
    if ('last_message_id' in data) payloadData.last_message_id = data.last_message_id;

    return (
      data[this.client.actions.injectedChannel] ??
      this.getPayload(payloadData, this.client.channels, id, PartialTypes.CHANNEL)
    );
  }

  getMessage(data, channel, cache) {
    const id = data.message_id ?? data.id;
    return (
      data[this.client.actions.injectedMessage] ??
      this.getPayload(
        {
          id,
          channel_id: channel.id,
          guild_id: data.guild_id ?? channel.guild?.id,
        },
        channel.messages,
        id,
        PartialTypes.MESSAGE,
        cache,
      )
    );
  }

  getReaction(data, message, user) {
    const id = data.emoji.id ?? decodeURIComponent(data.emoji.name);
    return this.getPayload(
      {
        emoji: data.emoji,
        count: message.partial ? null : 0,
        me: user?.id === this.client.user.id,
      },
      message.reactions,
      id,
      PartialTypes.REACTION,
    );
  }

  getMember(data, guild) {
    return this.getPayload(data, guild.members, data.user.id, PartialTypes.GUILD_MEMBER);
  }

  getUser(data) {
    const id = data.user_id;
    return data[this.client.actions.injectedUser] ?? this.getPayload({ id }, this.client.users, id, PartialTypes.USER);
  }

  getUserFromMember(data) {
    if (data.guild_id && data.member?.user) {
      const guild = this.client.guilds.cache.get(data.guild_id);
      if (guild) {
        return guild.members._add(data.member).user;
      } else {
        return this.client.users._add(data.member.user);
      }
    }
    return this.getUser(data);
  }

  getScheduledEvent(data, guild) {
    const id = data.guild_scheduled_event_id ?? data.id;
    return this.getPayload(
      { id, guild_id: data.guild_id ?? guild.id },
      guild.scheduledEvents,
      id,
      PartialTypes.GUILD_SCHEDULED_EVENT,
    );
  }
}

module.exports = GenericAction;
