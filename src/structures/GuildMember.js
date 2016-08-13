const TextBasedChannel = require('./interface/TextBasedChannel');

class GuildMember {
  constructor(guild, data) {
    this.client = guild.client;
    this.guild = guild;
    this.user = {};
    this._roles = [];
    if (data) {
      this.setup(data);
    }
  }

  setup(data) {
    this.user = data.user;
    this.serverDeaf = data.deaf;
    this.serverMute = data.mute;
    this.selfMute = data.self_mute;
    this.selfDeaf = data.self_deaf;
    this.voiceSessionID = data.session_id;
    this.voiceChannelID = data.channel_id;
    this.joinDate = new Date(data.joined_at);
    this._roles = data.roles;
  }

  get roles() {
    const list = [];
    const everyoneRole = this.guild.store.get('roles', this.guild.id);

    if (everyoneRole) {
      list.push(everyoneRole);
    }

    for (const roleID of this._roles) {
      const role = this.guild.store.get('roles', roleID);
      if (role) {
        list.push(role);
      }
    }

    return list;
  }

  get mute() {
    return this.selfMute || this.serverMute;
  }

  get deaf() {
    return this.selfDeaf || this.serverDeaf;
  }

  get voiceChannel() {
    return this.guild.store.get('channels', this.voiceChannelID);
  }

  get id() {
    return this.user.id;
  }

  deleteDM() {
    return this.client.rest.methods.deleteChannel(this);
  }

  kick() {
    return this.client.rest.methods.kickGuildMember(this.guild, this);
  }
}

TextBasedChannel.applyToClass(GuildMember);

module.exports = GuildMember;
