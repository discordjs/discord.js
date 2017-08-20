const DataStore = require('./DataStore');
const DMChannel = require('../structures/DMChannel');
const GroupDMChannel = require('../structures/GroupDMChannel');
const Constants = require('../util/Constants');

class ChannelStore extends DataStore {
  create(data, guild, emitEvent = true) {
    super.create();

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
          this.client.emit('debug', `Failed to find guild for channel ${data.id} ${data.type}`);
          return null;
        }
        channel = guild.channels.create(data);
        break;
    }

    this.set(channel.id, channel);

    if (channel && emitEvent) this.client.emit(Constants.Events.CHANNEL_CREATE, channel);

    return channel;
  }

  remove(id) {
    super.remove();
    const channel = this.get(id);
    if (channel.guild) channel.guild.channels.remove(id);
    this.delete(id);
  }
}

module.exports = ChannelStore;
