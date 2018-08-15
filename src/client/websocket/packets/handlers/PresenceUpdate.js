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
        user = client.users.add(data.user);
      } else {
        return;
      }
    }

    const oldUser = user._update(data.user);
    if (!user.equals(oldUser)) {
      client.emit(Events.USER_UPDATE, oldUser, user);
    }

    if (guild) {
      let oldPresence = guild.presences.get(user.id);
      if (oldPresence) oldPresence = oldPresence._clone();
      let member = guild.members.get(user.id);
      if (!member && data.status !== 'offline') {
        member = guild.members.add({
          user,
          roles: data.roles,
          deaf: false,
          mute: false,
        });
        client.emit(Events.GUILD_MEMBER_AVAILABLE, member);
      }
      guild.presences.add(Object.assign(data, { guild }));
      if (member && client.listenerCount(Events.PRESENCE_UPDATE)) {
        client.emit(Events.PRESENCE_UPDATE, oldPresence, member.presence);
      }
    }
  }
}

/**
 * Emitted whenever a guild member's presence (e.g. status, activity) is changed.
 * @event Client#presenceUpdate
 * @param {?Presence} oldPresence The presence before the update, if one at all
 * @param {Presence} newPresence The presence after the update
 */

/**
 * Emitted whenever a user's details (e.g. username, avatar) are changed.
 * <info>Disabling {@link Client#presenceUpdate} will cause this event to only fire
 * on {@link ClientUser} update.</info>
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
