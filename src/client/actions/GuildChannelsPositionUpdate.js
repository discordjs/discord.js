const Action = require('./Action');

class GuildChannelsPositionUpdate extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      for (const partialChannel of data.channels) {
        this._patch(partialChannel);
        const channel = guild.channels.get(partialChannel.id);
        if (channel) channel.rawPosition = partialChannel.position;
      }
    }

    return { guild };
  }

  _patch(data) {
    data.id = BigInt(data.id);
  }
}

module.exports = GuildChannelsPositionUpdate;
