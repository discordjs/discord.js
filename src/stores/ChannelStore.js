const DataStore = require('./DataStore');
const DMChannel = require('../structures/DMChannel');
const GroupDMChannel = require('../structures/GroupDMChannel');
const Constants = require('../util/Constants');

class ChannelStore extends DataStore {
  create(data, guild, cache = true) {
    const existing = this.get(data.id);
    if (existing) return existing;

    let channel;
    switch (data.type) {
      case Constants.ChannelTypes.DM:
        channel = new DMChannel(this.client, data);
        break;
      case Constants.ChannelTypes.GROUP:
        channel = new GroupDMChannel(this.client, data);
        break;
      default: // eslint-disable-line no-case-declarations
        guild = guild || this.client.guilds.get(data.guild_id);
        if (!guild) {
          this.client.emit(Constants.Events.DEBUG, `Failed to find guild for channel ${data.id} ${data.type}`);
          return null;
        }
        channel = guild.channels.create(data, cache);
        break;
    }

    if (cache) this.set(channel.id, channel);

    return channel;
  }

  remove(id) {
    const channel = this.get(id);
    if (channel.guild) channel.guild.channels.remove(id);
    this.delete(id);
  }
}

module.exports = ChannelStore;
