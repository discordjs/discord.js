const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');
const Collection = require('../../../../util/Collection');

class GuildMembersChunkHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    if (!guild) return;

    const members = new Collection(data.members.map(member => [member.user.id, guild._addMember(member, false)]));

    client.emit(Constants.Events.GUILD_MEMBERS_CHUNK, members, guild);

    client.ws.lastHeartbeatAck = true;
  }
}

/**
 * Emitted whenever a chunk of guild members is received (all members come from the same guild)
 * @event Client#guildMembersChunk
 * @param {Collection<GuildMember>} members The members in the chunk
 * @param {Guild} guild The guild the members belong to
 */

module.exports = GuildMembersChunkHandler;
