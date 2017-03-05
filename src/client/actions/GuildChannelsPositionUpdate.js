const Action = require('./Action');

class GuildChannelsPositionUpdate extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      for (const partialChannel of data.channels) {
        const channel = guild.roles.get(partialChannel.id);
        if (channel) channel.position = partialChannel.position;
      }
    }

    return {
      guild,
    };
  }
}

module.exports = GuildChannelsPositionUpdate;
