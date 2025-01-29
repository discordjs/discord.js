'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');
const Partials = require('../../util/Partials');

class PresenceUpdateAction extends Action {
  handle(data) {
    let user = this.client.users.cache.get(data.user.id);
    if (!user && ('username' in data.user || this.client.options.partials.includes(Partials.User))) {
      user = this.client.users._add(data.user);
    }
    if (!user) return;

    if (data.user.username) {
      if (!user._equals(data.user)) this.client.actions.UserUpdate.handle(data.user);
    }

    const guild = this.client.guilds.cache.get(data.guild_id);
    if (!guild) return;

    const oldPresence = guild.presences.cache.get(user.id)?._clone() ?? null;
    let member = guild.members.cache.get(user.id);
    if (!member && data.status !== 'offline') {
      member = guild.members._add({
        user,
        deaf: false,
        mute: false,
      });
      this.client.emit(Events.GuildMemberAvailable, member);
    }
    const newPresence = guild.presences._add(Object.assign(data, { guild }));
    if (this.client.listenerCount(Events.PresenceUpdate) && !newPresence.equals(oldPresence)) {
      /**
       * Emitted whenever a guild member's presence (e.g. status, activity) is changed.
       * @event Client#presenceUpdate
       * @param {?Presence} oldPresence The presence before the update, if one at all
       * @param {Presence} newPresence The presence after the update
       */
      this.client.emit(Events.PresenceUpdate, oldPresence, newPresence);
    }
  }
}

module.exports = PresenceUpdateAction;
