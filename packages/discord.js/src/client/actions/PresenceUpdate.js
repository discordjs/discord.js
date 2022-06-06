'use strict';

const Action = require('./Action');
const User = require('../../structures/User');
const Events = require('../../util/Events');

class PresenceUpdateAction extends Action {
  handle(data) {
    const guild = this.client.guilds.cache.get(data.guild_id);
    if (!guild) return;

    let user = guild.members.cache.get(data.user.id)?.user;
    if (!user && data.user.username) user = new User(this.client, data.user);

    let member = guild.members.cache.get(user.id);
    if (!member && !user) return;

    const oldPresence = guild.presences.cache.get(user.id)?._clone() ?? null;
    if (!member && data.status !== 'offline') {
      member = guild.members._add({
        user,
        deaf: false,
        mute: false,
      });
      this.client.emit(Events.GuildMemberAvailable, member);
    }
    const newPresence = guild.presences._add(Object.assign(data, { guild }));
    /**
     * Emitted whenever a guild member's presence (e.g. status, activity) is changed.
     * @event Client#presenceUpdate
     * @param {?Presence} oldPresence The presence before the update, if one at all
     * @param {Presence} newPresence The presence after the update
     */
    this.client.emit(Events.PresenceUpdate, oldPresence, newPresence);
  }
}

module.exports = PresenceUpdateAction;
