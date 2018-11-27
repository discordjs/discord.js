const Action = require('./Action');
const { Events } = require('../../util/Constants');

class PresenceUpdateAction extends Action {
  handle(data) {
    let cached = this.client.users.get(data.user.id);
    if (!cached && data.user.username) cached = this.client.users.add(data.user);
    if (!cached) return;

    if (data.user && data.user.username) {
      if (!cached.equals(data.user)) this.client.actions.UserUpdate.handle(data.user);
    }

    const guild = this.client.guilds.get(data.guild_id);
    if (!guild) return;

    let member = guild.members.get(cached.id);
    if (!member && data.status !== 'offline') {
      member = guild.members.add({ user: cached, roles: data.roles, deaf: false, mute: false });
      this.client.emit(Events.GUILD_MEMBER_AVAILABLE, member);
    }

    if (member) {
      if (this.client.listenerCount(Events.PRESENCE_UPDATE) === 0) {
        guild.presences.add(data);
        return;
      }
      const old = member._clone();
      if (member.presence) old.frozenPresence = member.presence._clone();
      guild.presences.add(data);
      /**
       * Emitted whenever a guild member's presence changes, or they change one of their details.
       * @event Client#presenceUpdate
       * @param {GuildMember} oldMember The member before the presence update
       * @param {GuildMember} newMember The member after the presence update
       */
      this.client.emit(Events.PRESENCE_UPDATE, old, member);
    } else {
      guild.presences.add(data);
    }
  }
}

module.exports = PresenceUpdateAction;
