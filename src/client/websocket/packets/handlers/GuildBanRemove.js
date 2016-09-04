// ##untested handler##

const AbstractHandler = require('./AbstractHandler');

class GuildBanRemoveHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildBanRemove.handle(data);
  }
}

/**
 * Emitted whenever a member is unbanned from a guild.
 * @event Client#guildBanRemove
 * @param {Guild} guild The guild that the unban occurred in
 * @param {User} user The user that was unbanned
 */

module.exports = GuildBanRemoveHandler;
