// ##untested##

const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class GuildMembersChunkHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;
    const guild = client.guilds.get(data.guild_id);

    const members = [];
    if (guild) {
      for (const member of guild.members) {
        members.push(guild._addMember(member, true));
      }
    }

    client.emit(Constants.Events.GUILD_MEMBERS_CHUNK, guild, members);
  }

}

module.exports = GuildMembersChunkHandler;
