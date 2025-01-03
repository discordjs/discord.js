'use strict';

const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  let user = client.users.cache.get(data.user.id);
  if (!user && data.user.username) user = client.users._add(data.user);
  if (!user) return;

  if (data.user.username) {
    if (!user._equals(data.user)) client.actions.UserUpdate.handle(data.user);
  }

  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) return;

  const oldPresence = guild.presences.cache.get(user.id)?._clone() ?? null;

  let member = guild.members.cache.get(user.id);
  if (!member && data.status !== 'offline') {
    member = guild.members._add({
      user,
      deaf: false,
      mute: false,
    });

    client.emit(Events.GuildMemberAvailable, member);
  }

  const newPresence = guild.presences._add(Object.assign(data, { guild }));
  if (client.listenerCount(Events.PresenceUpdate) > 0 && !newPresence.equals(oldPresence)) {
    /**
     * Emitted whenever a guild member's presence (e.g. status, activity) is changed.
     * @event Client#presenceUpdate
     * @param {?Presence} oldPresence The presence before the update, if one at all
     * @param {Presence} newPresence The presence after the update
     */
    client.emit(Events.PresenceUpdate, oldPresence, newPresence);
  }
};
