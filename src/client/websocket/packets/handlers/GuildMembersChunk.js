// ##untested##

const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class GuildMembersChunkHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    if (!guild) return;

    const members = data.members.map(member => guild._addMember(member, false));

    guild._checkChunks();
    client.emit(Constants.Events.GUILD_MEMBERS_CHUNK, members);

    client.ws.lastHeartbeatAck = true;
  }
}

/**
 * Emitted whenever a chunk of guild members is received (all members come from the same guild)
 * @event Client#guildMembersChunk
 * @param {GuildMember[]} members The members in the chunk
 */

module.exports = GuildMembersChunkHandler;
