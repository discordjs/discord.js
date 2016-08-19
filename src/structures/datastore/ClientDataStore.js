const AbstractDataStore = require('./AbstractDataStore');
const Constants = require('../../util/Constants');
const cloneObject = require('../../util/CloneObject');
const Guild = require('../Guild');
const User = require('../User');
const DMChannel = require('../DMChannel');
const TextChannel = require('../TextChannel');
const VoiceChannel = require('../VoiceChannel');
const GuildChannel = require('../GuildChannel');

class ClientDataStore extends AbstractDataStore {
  constructor(client) {
    super();

    this.client = client;
    this.token = null;
    this.session = null;
    this.user = null;
    this.email = null;
    this.password = null;
  }

  get pastReady() {
    return this.client.ws.status === Constants.Status.READY;
  }

  newGuild(data) {
    const already = this.client.guilds.get(data.id);
    const guild = new Guild(this.client, data);
    this.client.guilds.set(guild.id, guild);
    if (this.pastReady && !already) {
      this.client.emit(Constants.Events.GUILD_CREATE, guild);
    }

    return guild;
  }

  newUser(data) {
    const user = new User(this.client, data);
    this.client.users.set(user.id, user);
    return user;
  }

  newChannel(data, $guild) {
    let guild = $guild;
    const already = this.client.channels.get(data.id);
    let channel;
    if (data.type === Constants.ChannelTypes.DM) {
      channel = new DMChannel(this.client, data);
    } else {
      guild = guild || this.get('guilds', data.guild_id);
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
      if (this.pastReady && !already) {
        this.client.emit(Constants.Events.CHANNEL_CREATE, channel);
      }

      return this.client.channels.set(channel.id, channel);
    }
    return null;
  }

  killGuild(guild) {
    const already = this.client.guilds.get(guild.id);
    this.client.guilds.delete(guild.id);
    if (already && this.pastReady) {
      this.client.emit(Constants.Events.GUILD_DELETE, guild);
    }
  }

  killUser(user) {
    this.users.delete(user.id);
  }

  killChannel(channel) {
    this.client.channels.delete(channel.id);
    if (channel instanceof GuildChannel) {
      channel.guild.channels.delete(channel.id);
    }
  }

  updateGuild(currentGuild, newData) {
    const oldGuild = cloneObject(currentGuild);
    currentGuild.setup(newData);
    if (this.pastReady) {
      this.client.emit(Constants.Events.GUILD_UPDATE, oldGuild, currentGuild);
    }
  }

  updateChannel(currentChannel, newData) {
    currentChannel.setup(newData);
  }
}

module.exports = ClientDataStore;
