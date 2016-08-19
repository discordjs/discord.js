// ##untested handler##

const AbstractHandler = require('./AbstractHandler');

const Constants = require('../../../../util/Constants');

class GuildBanRemoveHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    const guild = client.guilds.get(data.guild_id);
    const user = client.users.get(data.user.id);

    if (guild && user) {
      client.emit(Constants.Events.GUILD_BAN_REMOVE, guild, user);
    }
  }

}

/**
* Emitted whenever a member is unbanned from a guild.
*
* @event Client#guildBanRemove
* @param {Guild} guild The guild that the unban occurred in
* @param {User} user The user that was unbanned
*/

module.exports = GuildBanRemoveHandler;
