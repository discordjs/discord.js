const AbstractHandler = require('./AbstractHandler');
const { Events } = require('../../../../util/Constants');

class PresenceUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    let user = client.users.get(data.user.id);
    const guild = client.guilds.get(data.guild_id);

    // Step 1
    if (!user) {
      if (data.user.username) {
        user = client.users.create(data.user);
      } else {
        return;
      }
    }

    const oldUser = user._update(data.user);
    if (!user.equals(oldUser)) {
      client.emit(Events.USER_UPDATE, oldUser, user);
    }

    if (guild) {
      let member = guild.members.get(user.id);
      if (!member && data.status !== 'offline') {
        member = guild.members.create({
          user,
          roles: data.roles,
          deaf: false,
          mute: false,
        });
        client.emit(Events.GUILD_MEMBER_AVAILABLE, member);
      }
      if (member) {
        if (client.listenerCount(Events.PRESENCE_UPDATE) === 0) {
          guild.presences.create(data);
          return;
        }
        const oldMember = member._clone();
        if (member.presence) {
          oldMember.frozenPresence = member.presence._clone();
        }
        guild.presences.create(data);
        client.emit(Events.PRESENCE_UPDATE, oldMember, member);
      } else {
        guild.presences.create(data);
      }
    }
  }
}

/**
 * Emitted whenever a guild member's presence changes, or they change one of their details.
 * @event Client#presenceUpdate
 * @param {GuildMember} oldMember The member before the presence update
 * @param {GuildMember} newMember The member after the presence update
 */

/**
 * Emitted whenever a user's details (e.g. username) are changed.
 * @event Client#userUpdate
 * @param {User} oldUser The user before the update
 * @param {User} newUser The user after the update
 */

/**
 * Emitted whenever a member becomes available in a large guild.
 * @event Client#guildMemberAvailable
 * @param {GuildMember} member The member that became available
 */

module.exports = PresenceUpdateHandler;
