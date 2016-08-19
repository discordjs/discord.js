const Constants = require('../../util/Constants');

const getStructure = name => require(`../../structures/${name}`);
const User = getStructure('User');
const GuildMember = getStructure('GuildMember');

class RESTMethods {
  constructor(restManager) {
    this.rest = restManager;
  }

  loginEmailPassword(email, password) {
    return new Promise((resolve, reject) => {
      this.rest.client.store.email = email;
      this.rest.client.store.password = password;
      this.rest.makeRequest('post', Constants.Endpoints.login, false, { email, password })
        .then(data => {
          this.rest.client.manager.connectToWebSocket(data.token, resolve, reject);
        })
        .catch(reject);
    });
  }

  loginToken(token) {
    return new Promise((resolve, reject) => {
      this.rest.client.manager.connectToWebSocket(token, resolve, reject);
    });
  }

  getGateway() {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('get', Constants.Endpoints.gateway, true)
        .then(res => {
          this.rest.client.store.gateway = `${res.url}/?encoding=json&v=${this.rest.client.options.protocol_version}`;
          resolve(this.rest.client.store.gateway);
        })
        .catch(reject);
    });
  }

  sendMessage($channel, content, tts, nonce) {
    return new Promise((resolve, reject) => {
      const $this = this;
      let channel = $channel;

      function req() {
        $this.rest.makeRequest('post', Constants.Endpoints.channelMessages(channel.id), true, {
          content, tts, nonce,
        })
        .then(data => resolve($this.rest.client.actions.MessageCreate.handle(data).m))
        .catch(reject);
      }

      if (channel instanceof User || channel instanceof GuildMember) {
        this.createDM(channel).then(chan => {
          channel = chan;
          req();
        })
        .catch(reject);
      } else {
        req();
      }
    });
  }

  deleteMessage(message) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('del', Constants.Endpoints.channelMessage(message.channel.id, message.id), true)
        .then(() => {
          resolve(this.rest.client.actions.MessageDelete.handle({
            id: message.id,
            channel_id: message.channel.id,
          }).m);
        })
        .catch(reject);
    });
  }

  updateMessage(message, content) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('patch', Constants.Endpoints.channelMessage(message.channel.id, message.id), true, {
        content,
      })
      .then(data => {
        resolve(this.rest.client.actions.MessageUpdate.handle(data).updated);
      })
      .catch(reject);
    });
  }

  createChannel(guild, channelName, channelType) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('post', Constants.Endpoints.guildChannels(guild.id), true, {
        name: channelName,
        type: channelType,
      })
        .then(data => {
          resolve(this.rest.client.actions.ChannelCreate.handle(data).channel);
        })
        .catch(reject);
    });
  }

  getExistingDM(recipient) {
    const dmChannel = Array.from(this.rest.client.channels.values())
      .filter(channel => channel.recipient)
      .filter(channel => channel.recipient.id === recipient.id);

    return dmChannel[0];
  }

  createDM(recipient) {
    return new Promise((resolve, reject) => {
      const dmChannel = this.getExistingDM(recipient);

      if (dmChannel) {
        return resolve(dmChannel);
      }

      return this.rest.makeRequest('post', Constants.Endpoints.userChannels(this.rest.client.store.user.id), true, {
        recipient_id: recipient.id,
      })
      .then(data => resolve(this.rest.client.actions.ChannelCreate.handle(data).channel))
      .catch(reject);
    });
  }

  deleteChannel($channel) {
    let channel = $channel;
    return new Promise((resolve, reject) => {
      if (channel instanceof User || channel instanceof GuildMember) {
        channel = this.getExistingDM(channel);
      }

      this.rest.makeRequest('del', Constants.Endpoints.channel(channel.id), true)
        .then($data => {
          const data = $data;
          data.id = channel.id;
          resolve(this.rest.client.actions.ChannelDelete.handle(data).channel);
        })
        .catch(reject);
    });
  }

  updateChannel(channel, $data) {
    const data = $data;
    return new Promise((resolve, reject) => {
      data.name = (data.name || channel.name).trim();
      data.topic = data.topic || channel.topic;
      data.position = data.position || channel.position;
      data.bitrate = data.bitrate || channel.bitrate;

      this.rest.makeRequest('patch', Constants.Endpoints.channel(channel.id), true, data)
        .then(newData => {
          resolve(this.rest.client.actions.ChannelUpdate.handle(newData).updated);
        })
        .catch(reject);
    });
  }

  leaveGuild(guild) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('del', Constants.Endpoints.meGuild(guild.id), true)
        .then(() => {
          resolve(this.rest.client.actions.GuildDelete.handle({ id: guild.id }).guild);
        })
        .catch(reject);
    });
  }

  // untested but probably will work
  deleteGuild(guild) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('del', Constants.Endpoints.guild(guild.id), true)
        .then(() => {
          resolve(this.rest.client.actions.GuildDelete.handle({ id: guild.id }).guild);
        })
        .catch(reject);
    });
  }

  updateCurrentUser(_data) {
    return new Promise((resolve, reject) => {
      const user = this.rest.client.store.user;
      const data = {};

      data.username = _data.username || user.username;
      data.avatar = this.rest.client.resolver.resolveBase64(_data.avatar) || user.avatar;
      if (!user.bot) {
        data.password = this.rest.client.store.password;
        data.email = _data.email || this.rest.client.store.email;
        data.new_password = _data.newPassword;
      }

      this.rest.makeRequest('patch', Constants.Endpoints.me, true, data)
        .then(newData => resolve(this.rest.client.actions.UserUpdate.handle(newData).updated))
        .catch(reject);
    });
  }

  updateGuild(guild, _data) {
    return new Promise((resolve, reject) => {
      /*
      	can contain:
      	name, region, verificationLevel, afkChannel, afkTimeout, icon, owner, splash
       */

      const data = {};

      if (_data.name) {
        data.name = _data.name;
      }

      if (_data.region) {
        data.region = _data.region;
      }

      if (_data.verificationLevel) {
        data.verification_level = Number(_data.verificationLevel);
      }

      if (_data.afkChannel) {
        data.afk_channel_id = this.rest.client.resolver.resolveChannel(_data.afkChannel).id;
      }

      if (_data.afkTimeout) {
        data.afk_timeout = Number(_data.afkTimeout);
      }

      if (_data.icon) {
        data.icon = this.rest.client.resolver.resolveBase64(_data.icon);
      }

      if (_data.owner) {
        data.owner_id = this.rest.client.resolver.resolveUser(_data.owner).id;
      }

      if (_data.splash) {
        data.splash = this.rest.client.resolver.resolveBase64(_data.splash);
      }

      this.rest.makeRequest('patch', Constants.Endpoints.guild(guild.id), true, data)
        .then(newData => resolve(this.rest.client.actions.GuildUpdate.handle(newData).updated))
        .catch(reject);
    });
  }

  kickGuildMember(guild, member) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('del', Constants.Endpoints.guildMember(guild.id, member.id), true)
        .then(() => {
          resolve(this.rest.client.actions.GuildMemberRemove.handle({
            guild_id: guild.id,
            user: member.user,
          }).m);
        })
        .catch(reject);
    });
  }

  createGuildRole(guild) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('post', Constants.Endpoints.guildRoles(guild.id), true)
        .then(role => {
          resolve(this.rest.client.actions.GuildRoleCreate.handle({
            guild_id: guild.id,
            role,
          }).role);
        })
        .catch(reject);
    });
  }

  deleteGuildRole(role) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('del', Constants.Endpoints.guildRole(role.guild.id, role.id), true)
        .then(() => {
          resolve(this.rest.client.actions.GuildRoleDelete.handle({
            guild_id: role.guild.id,
            role_id: role.id,
          }).role);
        })
        .catch(reject);
    });
  }

  updateGuildRole(role, _data) {
    return new Promise((resolve, reject) => {
      /*
      	can contain:
      	name, position, permissions, color, hoist
       */

      const data = {};

      data.name = _data.name || role.name;
      data.position = _data.position || role.position;
      data.color = _data.color || role.color;

      if (typeof _data.hoist !== 'undefined') {
        data.hoist = _data.hoist;
      } else {
        data.hoist = role.hoist;
      }

      if (_data.permissions) {
        let perms = 0;
        for (let perm of _data.permissions) {
          if (perm instanceof String || typeof perm === 'string') {
            perm = Constants.PermissionFlags[perm];
          }
          perms |= perm;
        }
        data.permissions = perms;
      } else {
        data.permissions = role.permissions;
      }

      this.rest.makeRequest('patch', Constants.Endpoints.guildRole(role.guild.id, role.id), true, data)
        .then(_role => {
          resolve(this.rest.client.actions.GuildRoleUpdate.handle({
            role: _role,
            guild_id: role.guild.id,
          }).updated);
        })
        .catch(reject);
    });
  }
}

module.exports = RESTMethods;
