const Constants = require('../util/Constants');
const cloneObject = require('../util/CloneObject');
const Guild = require('../structures/Guild');
const User = require('../structures/User');
const DMChannel = require('../structures/DMChannel');
const TextChannel = require('../structures/TextChannel');
const VoiceChannel = require('../structures/VoiceChannel');
const GuildChannel = require('../structures/GuildChannel');
const GroupDMChannel = require('../structures/GroupDMChannel');

class ClientDataManager {
  constructor(client) {
    this.client = client;
  }

  get pastReady() {
    return this.client.ws.status === Constants.Status.READY;
  }

  newGuild(data) {
    const already = this.client.guilds.has(data.id);
    const guild = new Guild(this.client, data);
    this.client.guilds.set(guild.id, guild);
    if (this.pastReady && !already) {
      /**
       * Emitted whenever the client joins a Guild.
       * @event Client#guildCreate
       * @param {Guild} guild The created guild
       */
      this.client.emit(Constants.Events.GUILD_CREATE, guild);
    }

    return guild;
  }

  newUser(data) {
    if (this.client.users.has(data.id)) return this.client.users.get(data.id);
    const user = new User(this.client, data);
    this.client.users.set(user.id, user);
    return user;
  }

  newChannel(data, guild) {
    const already = this.client.channels.has(data.id);
    let channel;
    if (data.type === Constants.ChannelTypes.DM) {
      channel = new DMChannel(this.client, data);
    } else if (data.type === Constants.ChannelTypes.groupDM) {
      channel = new GroupDMChannel(this.client, data);
    } else {
      guild = guild || this.client.guilds.get(data.guild_id);
      if (guild) {
        if (data.type === Constants.ChannelTypes.text) {
          channel = new TextChannel(guild, data);
          guild.channels.set(channel.id, channel);
        } else if (data.type === Constants.ChannelTypes.voice) {
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

    return null;
  }

  killGuild(guild) {
    const already = this.client.guilds.has(guild.id);
    this.client.guilds.delete(guild.id);
    if (already && this.pastReady) this.client.emit(Constants.Events.GUILD_DELETE, guild);
  }

  killUser(user) {
    this.client.users.delete(user.id);
  }

  killChannel(channel) {
    this.client.channels.delete(channel.id);
    if (channel instanceof GuildChannel) channel.guild.channels.delete(channel.id);
  }

  updateGuild(currentGuild, newData) {
    const oldGuild = cloneObject(currentGuild);
    currentGuild.setup(newData);
    if (this.pastReady) this.client.emit(Constants.Events.GUILD_UPDATE, oldGuild, currentGuild);
  }

  updateChannel(currentChannel, newData) {
    currentChannel.setup(newData);
  }
}

module.exports = ClientDataManager;
