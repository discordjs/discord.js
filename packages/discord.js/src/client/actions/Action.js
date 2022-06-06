'use strict';

const User = require('../../structures/User');
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
      data.channel ??
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
      data.message ??
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

  getUser(data, guild) {
    const id = data.user_id;
    if (data.user) return data.user;
    if (guild) {
      const user = guild.members.cache.get(id)?.user;
      if (user) return user;
    }
    if (this.client.options.partials.includes(Partials.User)) return new User(this.client, { id });
    return null;
  }

  getUserFromMember(data) {
    const guild = this.client.guilds.cache.get(data.guild_id);
    if (data.member?.user) {
      if (guild) {
        return guild.members._add(data.member).user;
      } else {
        return new User(this.client, data.member.user);
      }
    }
    return this.getUser(data, guild);
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
