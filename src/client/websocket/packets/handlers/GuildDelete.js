const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class GuildDeleteHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const response = client.actions.GuildDelete.handle(data);
    if (response.guild) client.emit(Constants.Events.GUILD_DELETE, response.guild);
  }
}

/**
 * Emitted whenever a Guild is deleted/left.
 * @event Client#guildDelete
 * @param {Guild} guild The guild that was deleted
 */

module.exports = GuildDeleteHandler;
