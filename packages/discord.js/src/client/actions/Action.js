'use strict';

const Partials = require('../../util/Partials');

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
    const id = data.channel_id ?? data.id;
    return (
      data[this.client.actions.injectedChannel] ??
      this.getPayload(
        {
          id,
          guild_id: data.guild_id,
          recipients: [data.author ?? data.user ?? { id: data.user_id }],
        },
        this.client.channels,
        id,
        Partials.Channel,
      )
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
        Partials.Message,
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
      Partials.Reaction,
    );
  }

  getMember(data, guild) {
    return this.getPayload(data, guild.members, data.user.id, Partials.GuildMember);
  }

  getUser(data) {
    const id = data.user_id;
    return data[this.client.actions.injectedUser] ?? this.getPayload({ id }, this.client.users, id, Partials.User);
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
      Partials.GuildScheduledEvent,
    );
  }

  getThreadMember(id, manager) {
    return this.getPayload({ user_id: id }, manager, id, Partials.ThreadMember, false);
  }
}

module.exports = GenericAction;
