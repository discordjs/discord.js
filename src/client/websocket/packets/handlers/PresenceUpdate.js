const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');
const cloneObject = require('../../../../util/CloneObject');

class PresenceUpdateHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;
    let user = client.store.get('users', data.user.id);
    const guild = client.store.get('guilds', data.guild_id);

    function makeUser(newUser) {
      return client.store.newUser(newUser);
    }

    // step 1
    if (!user) {
      if (data.user.username) {
        user = makeUser(data.user);
      } else {
        return;
      }
    }

    if (guild) {
      const memberInGuild = guild.store.get('members', user.id);
      if (!memberInGuild) {
        const member = guild._addMember({
          user,
          roles: data.roles,
          deaf: false,
          mute: false,
        }, true);
        client.emit(Constants.Events.GUILD_MEMBER_AVAILABLE, guild, member);
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

module.exports = PresenceUpdateHandler;
