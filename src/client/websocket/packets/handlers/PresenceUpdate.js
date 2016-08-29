const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');
const cloneObject = require('../../../../util/CloneObject');

class PresenceUpdateHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;
    let user = client.users.get(data.user.id);
    const guild = client.guilds.get(data.guild_id);

    function makeUser(newUser) {
      return client.dataManager.newUser(newUser);
    }

    // step 1
    if (!user) {
      if (data.user.username && (client.options.loadOfflineUsers || data.status !== 'offline')) {
        user = makeUser(data.user);
      } else {
        return;
      }
    } else if (!client.options.loadOfflineUsers && !user._forced && data.status === 'offline') {
      client.dataManager.killUser(user);
    }

    if (guild) {
      const memberInGuild = guild.members.has(user.id);
      if (!memberInGuild) {
        if (client.options.loadOfflineUsers || user._forced || data.status !== 'offline') {
          const member = guild._addMember({
            user,
            roles: data.roles,
            deaf: false,
            mute: false,
          }, true);
          client.emit(Constants.Events.GUILD_MEMBER_AVAILABLE, guild, member);
        }
      } else if (!client.options.loadOfflineUsers && !user._forced && data.status === 'offline') {
        guild._removeMember(guild.members.get(user.id));
      }
    }

    data.user.username = data.user.username || user.username;
    data.user.id = data.user.id || user.id;
    data.user.discriminator = data.user.discriminator || user.discriminator;

    // comment out avatar patching as it causes bugs (see #297)
    // data.user.avatar = data.user.avatar || user.avatar;
    data.user.status = data.status || user.status;
    data.user.game = data.game;

    const same = (
      data.user.username === user.username &&
      data.user.id === user.id &&
      data.user.discriminator === user.discriminator &&
      data.user.avatar === user.avatar &&
      data.user.status === user.status &&
      JSON.stringify(data.user.game) === JSON.stringify(user.game)
    );

    if (!same) {
      const oldUser = cloneObject(user);
      user.setup(data.user);
      client.emit(Constants.Events.PRESENCE_UPDATE, oldUser, user);
    }
  }

}

/**
* Emitted whenever a user changes one of their details or starts/stop playing a game
*
* @event Client#presenceUpdate
* @param {User} oldUser the user before the presence update
* @param {User} newUser the user after the presence update
*/

/**
* Emitted whenever a member becomes available in a large Guild
*
* @event Client#guildMemberAvailable
* @param {Guild} guild The guild that the member became available in
* @param {GuildMember} member the member that became available
*/


module.exports = PresenceUpdateHandler;
