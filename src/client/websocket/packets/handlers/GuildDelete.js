const AbstractHandler = require('./AbstractHandler');

class GuildDeleteHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    client.actions.GuildDelete.handle(packet.d);
  }
}

/**
 * Emitted whenever a guild kicks the client or the guild is deleted/left.
 * @event Client#guildDelete
 * @param {Guild} guild The guild that was deleted
 */

module.exports = GuildDeleteHandler;
