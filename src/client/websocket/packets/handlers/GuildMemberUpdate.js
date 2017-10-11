// ##untested handler##

const AbstractHandler = require('./AbstractHandler');
const { Events, Status } = require('../../../../util/Constants');

class GuildMemberUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const member = guild.members.get(data.user.id);
      if (member) {
        const old = member._update(data);
        if (client.ws.connection.status === Status.READY) {
          /**
           * Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
           * @event Client#guildMemberUpdate
           * @param {GuildMember} oldMember The member before the update
           * @param {GuildMember} newMember The member after the update
           */
          client.emit(Events.GUILD_MEMBER_UPDATE, old, member);
        }
      }
    }
  }
}

module.exports = GuildMemberUpdateHandler;
