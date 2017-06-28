const DataStore = require('./DataStore');
const DMChannel = require('../structures/DMChannel');
const GroupDMChannel = require('../structures/GroupDMChannel');
const TextChannel = require('../structures/TextChannel');
const VoiceChannel = require('../structures/VoiceChannel');
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
      case Constants.ChannelTypes.GROUP_DM:
        channel = new GroupDMChannel(this.client, data);
        break;
      default: // eslint-disable-line no-case-declarations
        const ChannelModel = data.type === Constants.ChannelTypes.TEXT ? TextChannel : VoiceChannel;
        guild = guild || this.client.guilds.get(data.guild_id);
        if (!guild) {
          this.client.emit('debug', `Failed to find guild for channel ${data.id}`);
          return null;
        }
        channel = new ChannelModel(guild, data);
        guild.channels.set(channel.id, channel);
        break;
    }

    this.set(channel.id, channel);

    if (channel && emitEvent) this.client.emit(Constants.Events.CHANNEL_CREATE, channel);

    return channel;
  }

  remove(id) {
    super.remove();
    const channel = this.get(id);
    if (channel.guild) {
      channel.guild.channels.delete(id);
    }
    this.delete(id);
  }
}

module.exports = ChannelStore;
