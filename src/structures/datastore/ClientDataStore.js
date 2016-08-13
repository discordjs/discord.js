const AbstractDataStore = require('./AbstractDataStore');
const Constants = require('../../util/Constants');
const cloneObject = require('../../util/CloneObject');
const Guild = require('../Guild');
const User = require('../User');
const DMChannel = require('../DMChannel');
const TextChannel = require('../TextChannel');
const VoiceChannel = require('../VoiceChannel');
const ServerChannel = require('../ServerChannel');

class ClientDataStore extends AbstractDataStore {
  constructor(client) {
    super();

    this.client = client;
    this.token = null;
    this.session = null;
    this.user = null;
    this.email = null;
    this.password = null;

    this.register('users');
    this.register('guilds');
    this.register('channels');
  }

  get pastReady() {
    return this.client.ws.status === Constants.Status.READY;
  }

  newGuild(data) {
    const already = this.get('guilds', data.id);
    const guild = this.add('guilds', new Guild(this.client, data));
    if (this.pastReady && !already) {
      this.client.emit(Constants.Events.GUILD_CREATE, guild);
    }

    return guild;
  }

  newUser(data) {
    return this.add('users', new User(this.client, data));
  }

  newChannel(data, $guild) {
    let guild = $guild;
    const already = this.get('channels', data.id);
    let channel;
    if (data.type === Constants.ChannelTypes.DM) {
      channel = new DMChannel(this.client, data);
    } else {
      guild = guild || this.get('guilds', data.guild_id);
      if (guild) {
        if (data.type === Constants.ChannelTypes.text) {
          channel = new TextChannel(guild, data);
          guild.store.add('channels', channel);
        } else if (data.type === Constants.ChannelTypes.voice) {
          channel = new VoiceChannel(guild, data);
          guild.store.add('channels', channel);
        }
      }
    }

    if (channel) {
      if (this.pastReady && !already) {
        this.client.emit(Constants.Events.CHANNEL_CREATE, channel);
      }

      return this.add('channels', channel);
    }
    return null;
  }

  killGuild(guild) {
    const already = this.get('guilds', guild.id);
    this.remove('guilds', guild);
    if (already && this.pastReady) {
      this.client.emit(Constants.Events.GUILD_DELETE, guild);
    }
  }

  killUser(user) {
    this.remove('users', user);
  }

  killChannel(channel) {
    this.remove('channels', channel);
    if (channel instanceof ServerChannel) {
      channel.guild.store.remove('channels', channel);
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
