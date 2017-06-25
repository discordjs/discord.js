const DataStore = require('./DataStore');
const DMChannel = require('../structures/DMChannel');
const GroupDMChannel = require('../structures/GroupDMChannel');
const TextChannel = require('../structures/TextChannel');
const VoiceChannel = require('../structures/VoiceChannel');
const Constants = require('../util/Constants');

class UserStore extends DataStore {
  create(data, emitEvent = true) {
    super.create();
		/* A
    const already = this.client.channels.has(data.id);
    let channel;
    if (data.type === Constants.ChannelTypes.DM) {
      channel = new DMChannel(this.client, data);
    } else if (data.type === Constants.ChannelTypes.GROUP_DM) {
      channel = new GroupDMChannel(this.client, data);
    } else {
      guild = guild || this.client.guilds.get(data.guild_id);
      if (guild) {
        if (data.type === Constants.ChannelTypes.TEXT) {
          channel = new TextChannel(guild, data);
          guild.channels.set(channel.id, channel);
        } else if (data.type === Constants.ChannelTypes.VOICE) {
          channel = new VoiceChannel(guild, data);
          guild.channels.set(channel.id, channel);
        }
      }
    }

    if (channel) {
      if (this.pastReady && !already) this.client.emit(Constants.Events.CHANNEL_CREATE, channel);
      this.client.channels.set(channel.id, channel);
      return channel;
    }
		*/

    if (this.has(data.id)) return this.get(data.id);
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
        const guild = this.client.guilds.get(data.guild_id);
        channel = new ChannelModel(guild, data);
        guild.channels.set(channel.id, guild);
        break;
    }

    this.set(channel.id, channel);

    if (channel && emitEvent) {
      this.client.emit(Constants.Events.CHANNEL_CREATE, channel);
    }

    return channel;
  }

  remove(id) {
    const channel = this.get(id);
    if (channel.guild) {
      channel.guild.channels.delete(id);
    }
    this.delete(id);
  }
}

module.exports = UserStore;
