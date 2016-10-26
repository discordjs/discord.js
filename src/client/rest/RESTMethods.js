const Constants = require('../../util/Constants');
const Collection = require('../../util/Collection');
const splitMessage = require('../../util/SplitMessage');

const requireStructure = name => require(`../../structures/${name}`);
const User = requireStructure('User');
const GuildMember = requireStructure('GuildMember');
const Role = requireStructure('Role');
const Invite = requireStructure('Invite');
const Webhook = requireStructure('Webhook');
const UserProfile = requireStructure('UserProfile');

class RESTMethods {
  constructor(restManager) {
    this.rest = restManager;
  }

  loginToken(token = this.rest.client.token) {
    token = token.replace(/^Bot\s*/i, '');
    return new Promise((resolve, reject) => {
      this.rest.client.manager.connectToWebSocket(token, resolve, reject);
    });
  }

  loginEmailPassword(email, password) {
    return new Promise((resolve, reject) => {
      this.rest.client.emit('warn', 'Client launched using email and password - should use token instead');
      this.rest.client.email = email;
      this.rest.client.password = password;
      this.rest.makeRequest('post', Constants.Endpoints.login, false, { email, password })
        .then(data => {
          resolve(this.loginToken(data.token));
        })
        .catch(reject);
    });
  }

  logout() {
    return this.rest.makeRequest('post', Constants.Endpoints.logout, true, {});
  }

  getGateway() {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('get', Constants.Endpoints.gateway, true)
        .then(res => {
          this.rest.client.ws.gateway = `${res.url}/?encoding=json&v=${Constants.PROTOCOL_VERSION}`;
          resolve(this.rest.client.ws.gateway);
        })
        .catch(reject);
    });
  }

  getBotGateway() {
    return this.rest.makeRequest('get', Constants.Endpoints.botGateway, true);
  }

  sendMessage(channel, content, { tts, nonce, disableEveryone, split } = {}, file = null) {
    return new Promise((resolve, reject) => {
      if (typeof content !== 'undefined') content = this.rest.client.resolver.resolveString(content);

      if (content) {
        if (disableEveryone || (typeof disableEveryone === 'undefined' && this.rest.client.options.disableEveryone)) {
          content = content.replace(/@(everyone|here)/g, '@\u200b$1');
        }

        if (split) content = splitMessage(content, typeof split === 'object' ? split : {});
      }

      if (channel instanceof User || channel instanceof GuildMember) {
        this.createDM(channel).then(chan => {
          this._sendMessageRequest(chan, content, file, tts, nonce, resolve, reject);
        }).catch(reject);
      } else {
        this._sendMessageRequest(channel, content, file, tts, nonce, resolve, reject);
      }
    });
  }

  _sendMessageRequest(channel, content, file, tts, nonce, resolve, reject) {
    if (content instanceof Array) {
      const datas = [];
      let promise = this.rest.makeRequest('post', Constants.Endpoints.channelMessages(channel.id), true, {
        content: content[0], tts, nonce,
      }, file).catch(reject);

      for (let i = 1; i <= content.length; i++) {
        if (i < content.length) {
          const i2 = i;
          promise = promise.then(data => {
            datas.push(data);
            return this.rest.makeRequest('post', Constants.Endpoints.channelMessages(channel.id), true, {
              content: content[i2], tts, nonce,
            }, file);
          }).catch(reject);
        } else {
          promise.then(data => {
            datas.push(data);
            resolve(this.rest.client.actions.MessageCreate.handle(datas).messages);
          }).catch(reject);
        }
      }
    } else {
      this.rest.makeRequest('post', Constants.Endpoints.channelMessages(channel.id), true, {
        content, tts, nonce,
      }, file)
        .then(data => resolve(this.rest.client.actions.MessageCreate.handle(data).message))
        .catch(reject);
    }
  }

  deleteMessage(message) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('del', Constants.Endpoints.channelMessage(message.channel.id, message.id), true)
        .then(() => {
          resolve(this.rest.client.actions.MessageDelete.handle({
            id: message.id,
            channel_id: message.channel.id,
          }).message);
        })
        .catch(reject);
    });
  }

  bulkDeleteMessages(channel, messages) {
    return new Promise((resolve, reject) => {
      const options = { messages };
      this.rest.makeRequest('post', `${Constants.Endpoints.channelMessages(channel.id)}/bulk_delete`, true, options)
        .then(() => {
          resolve(this.rest.client.actions.MessageDeleteBulk.handle({
            channel_id: channel.id,
            ids: messages,
          }).messages);
        })
        .catch(reject);
    });
  }

  updateMessage(message, content) {
    return new Promise((resolve, reject) => {
      content = this.rest.client.resolver.resolveString(content);

      this.rest.makeRequest('patch', Constants.Endpoints.channelMessage(message.channel.id, message.id), true, {
        content,
      }).then(data => {
        resolve(this.rest.client.actions.MessageUpdate.handle(data).updated);
      }).catch(reject);
    });
  }

  createChannel(guild, channelName, channelType) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('post', Constants.Endpoints.guildChannels(guild.id), true, {
        name: channelName,
        type: channelType,
      }).then(data => {
        resolve(this.rest.client.actions.ChannelCreate.handle(data).channel);
      }).catch(reject);
    });
  }

  getExistingDM(recipient) {
    return this.rest.client.channels.filter(channel =>
      channel.recipient && channel.recipient.id === recipient.id
    ).first();
  }

  createDM(recipient) {
    return new Promise((resolve, reject) => {
      const dmChannel = this.getExistingDM(recipient);
      if (dmChannel) return resolve(dmChannel);
      return this.rest.makeRequest('post', Constants.Endpoints.userChannels(this.rest.client.user.id), true, {
        recipient_id: recipient.id,
      }).then(data => resolve(this.rest.client.actions.ChannelCreate.handle(data).channel)).catch(reject);
    });
  }

  deleteChannel(channel) {
    return new Promise((resolve, reject) => {
      if (channel instanceof User || channel instanceof GuildMember) channel = this.getExistingDM(channel);
      this.rest.makeRequest('del', Constants.Endpoints.channel(channel.id), true).then(data => {
        data.id = channel.id;
        resolve(this.rest.client.actions.ChannelDelete.handle(data).channel);
      }).catch(reject);
    });
  }

  updateChannel(channel, data) {
    return new Promise((resolve, reject) => {
      data.name = (data.name || channel.name).trim();
      data.topic = data.topic || channel.topic;
      data.position = data.position || channel.position;
      data.bitrate = data.bitrate || channel.bitrate;

      this.rest.makeRequest('patch', Constants.Endpoints.channel(channel.id), true, data).then(newData => {
        resolve(this.rest.client.actions.ChannelUpdate.handle(newData).updated);
      }).catch(reject);
    });
  }

  leaveGuild(guild) {
    if (guild.ownerID === this.rest.client.user.id) return this.deleteGuild(guild);
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('del', Constants.Endpoints.meGuild(guild.id), true).then(() => {
        resolve(this.rest.client.actions.GuildDelete.handle({ id: guild.id }).guild);
      }).catch(reject);
    });
  }

  createGuild(options) {
    options.icon = this.rest.client.resolver.resolveBase64(options.icon) || null;
    options.region = options.region || 'us-central';
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('post', Constants.Endpoints.guilds, true, options)
      .then(data => {
        if (this.rest.client.guilds.has(data.id)) resolve(this.rest.client.guilds.get(data.id));
        const handleGuild = guild => {
          if (guild.id === data.id) resolve(guild);
          this.rest.client.removeListener('guildCreate', handleGuild);
        };
        this.rest.client.on('guildCreate', handleGuild);
        this.rest.client.setTimeout(() => {
          this.rest.client.removeListener('guildCreate', handleGuild);
          reject(new Error('Took too long to receive guild data'));
        }, 10000);
      }).catch(reject);
    });
  }

  // untested but probably will work
  deleteGuild(guild) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('del', Constants.Endpoints.guild(guild.id), true).then(() => {
        resolve(this.rest.client.actions.GuildDelete.handle({ id: guild.id }).guild);
      }).catch(reject);
    });
  }

  getUser(userID) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('get', Constants.Endpoints.user(userID), true).then((data) => {
        resolve(this.rest.client.actions.UserGet.handle(data).user);
      }).catch(reject);
    });
  }

  updateCurrentUser(_data) {
    return new Promise((resolve, reject) => {
      const user = this.rest.client.user;

      const data = {};
      data.username = _data.username || user.username;
      data.avatar = this.rest.client.resolver.resolveBase64(_data.avatar) || user.avatar;
      if (!user.bot) {
        data.email = _data.email || user.email;
        data.password = this.rest.client.password;
        if (_data.new_password) data.new_password = _data.newPassword;
      }

      this.rest.makeRequest('patch', Constants.Endpoints.me, true, data)
        .then(newData => resolve(this.rest.client.actions.UserUpdate.handle(newData).updated))
        .catch(reject);
    });
  }

  updateGuild(guild, _data) {
    return new Promise((resolve, reject) => {
      const data = {};
      if (_data.name) data.name = _data.name;
      if (_data.region) data.region = _data.region;
      if (_data.verificationLevel) data.verification_level = Number(_data.verificationLevel);
      if (_data.afkChannel) data.afk_channel_id = this.rest.client.resolver.resolveChannel(_data.afkChannel).id;
      if (_data.afkTimeout) data.afk_timeout = Number(_data.afkTimeout);
      if (_data.icon) data.icon = this.rest.client.resolver.resolveBase64(_data.icon);
      if (_data.owner) data.owner_id = this.rest.client.resolver.resolveUser(_data.owner).id;
      if (_data.splash) data.splash = this.rest.client.resolver.resolveBase64(_data.splash);

      this.rest.makeRequest('patch', Constants.Endpoints.guild(guild.id), true, data)
        .then(newData => resolve(this.rest.client.actions.GuildUpdate.handle(newData).updated))
        .catch(reject);
    });
  }

  kickGuildMember(guild, member) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('del', Constants.Endpoints.guildMember(guild.id, member.id), true).then(() => {
        resolve(this.rest.client.actions.GuildMemberRemove.handle({
          guild_id: guild.id,
          user: member.user,
        }).member);
      }).catch(reject);
    });
  }

  createGuildRole(guild) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('post', Constants.Endpoints.guildRoles(guild.id), true).then(role => {
        resolve(this.rest.client.actions.GuildRoleCreate.handle({
          guild_id: guild.id,
          role,
        }).role);
      }).catch(reject);
    });
  }

  deleteGuildRole(role) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('del', Constants.Endpoints.guildRole(role.guild.id, role.id), true).then(() => {
        resolve(this.rest.client.actions.GuildRoleDelete.handle({
          guild_id: role.guild.id,
          role_id: role.id,
        }).role);
      }).catch(reject);
    });
  }

  setChannelOverwrite(channel, payload) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('put', `${Constants.Endpoints.channelPermissions(channel.id)}/${payload.id}`, true, payload)
        .then(resolve)
        .catch(reject);
    });
  }

  deletePermissionOverwrites(overwrite) {
    return new Promise((resolve, reject) => {
      const endpoint = `${Constants.Endpoints.channelPermissions(overwrite.channel.id)}/${overwrite.id}`;
      this.rest.makeRequest('del', endpoint, true)
        .then(() => resolve(overwrite))
        .catch(reject);
    });
  }

  getChannelMessages(channel, payload = {}) {
    return new Promise((resolve, reject) => {
      const params = [];
      if (payload.limit) params.push(`limit=${payload.limit}`);
      if (payload.around) params.push(`around=${payload.around}`);
      else if (payload.before) params.push(`before=${payload.before}`);
      else if (payload.after) params.push(`after=${payload.after}`);

      let endpoint = Constants.Endpoints.channelMessages(channel.id);
      if (params.length > 0) endpoint += `?${params.join('&')}`;
      this.rest.makeRequest('get', endpoint, true)
        .then(resolve)
        .catch(reject);
    });
  }

  getChannelMessage(channel, messageID) {
    return new Promise((resolve, reject) => {
      const msg = channel.messages.get(messageID);
      if (msg) return resolve(msg);

      const endpoint = Constants.Endpoints.channelMessage(channel.id, messageID);
      return this.rest.makeRequest('get', endpoint, true)
        .then(resolve)
        .catch(reject);
    });
  }

  getGuildMember(guild, user) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('get', Constants.Endpoints.guildMember(guild.id, user.id), true).then((data) => {
        resolve(this.rest.client.actions.GuildMemberGet.handle(guild, data).member);
      }).catch(reject);
    });
  }

  updateGuildMember(member, data) {
    return new Promise((resolve, reject) => {
      if (data.channel) data.channel_id = this.rest.client.resolver.resolveChannel(data.channel).id;
      if (data.roles) data.roles = data.roles.map(role => role instanceof Role ? role.id : role);

      let endpoint = Constants.Endpoints.guildMember(member.guild.id, member.id);
      // fix your endpoints, discord ;-;
      if (member.id === this.rest.client.user.id) {
        if (Object.keys(data).length === 1 && Object.keys(data)[0] === 'nick') {
          endpoint = Constants.Endpoints.stupidInconsistentGuildEndpoint(member.guild.id);
        }
      }

      this.rest.makeRequest('patch', endpoint, true, data)
        .then(resData => resolve(member.guild._updateMember(member, resData).mem))
        .catch(reject);
    });
  }

  sendTyping(channelID) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('post', `${Constants.Endpoints.channel(channelID)}/typing`, true)
        .then(resolve)
        .catch(reject);
    });
  }

  banGuildMember(guild, member, deleteDays = 0) {
    return new Promise((resolve, reject) => {
      const id = this.rest.client.resolver.resolveUserID(member);
      if (!id) throw new Error('Couldn\'t resolve the user ID to ban.');

      this.rest.makeRequest('put',
        `${Constants.Endpoints.guildBans(guild.id)}/${id}?delete-message-days=${deleteDays}`, true, {
          'delete-message-days': deleteDays,
        }).then(() => {
          if (member instanceof GuildMember) {
            resolve(member);
            return;
          }
          const user = this.rest.client.resolver.resolveUser(id);
          if (user) {
            member = this.rest.client.resolver.resolveGuildMember(guild, user);
            resolve(member || user);
            return;
          }
          resolve(id);
        }).catch(reject);
    });
  }

  unbanGuildMember(guild, member) {
    return new Promise((resolve, reject) => {
      const id = this.rest.client.resolver.resolveUserID(member);
      if (!id) throw new Error('Couldn\'t resolve the user ID to ban.');

      const listener = (eGuild, eUser) => {
        if (eGuild.id === guild.id && eUser.id === id) {
          this.rest.client.removeListener(Constants.Events.GUILD_BAN_REMOVE, listener);
          resolve(eUser);
        }
      };
      this.rest.client.on(Constants.Events.GUILD_BAN_REMOVE, listener);
      this.rest.makeRequest('del', `${Constants.Endpoints.guildBans(guild.id)}/${id}`, true).catch(reject);
    });
  }

  getGuildBans(guild) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('get', Constants.Endpoints.guildBans(guild.id), true).then(banItems => {
        const bannedUsers = new Collection();
        for (const banItem of banItems) {
          const user = this.rest.client.dataManager.newUser(banItem.user);
          bannedUsers.set(user.id, user);
        }
        resolve(bannedUsers);
      }).catch(reject);
    });
  }

  updateGuildRole(role, _data) {
    return new Promise((resolve, reject) => {
      const data = {};
      data.name = _data.name || role.name;
      data.position = typeof _data.position !== 'undefined' ? _data.position : role.position;
      data.color = _data.color || role.color;
      if (typeof data.color === 'string' && data.color.startsWith('#')) {
        data.color = parseInt(data.color.replace('#', ''), 16);
      }
      data.hoist = typeof _data.hoist !== 'undefined' ? _data.hoist : role.hoist;
      data.mentionable = typeof _data.mentionable !== 'undefined' ? _data.mentionable : role.mentionable;

      if (_data.permissions) {
        let perms = 0;
        for (let perm of _data.permissions) {
          if (typeof perm === 'string') perm = Constants.PermissionFlags[perm];
          perms |= perm;
        }
        data.permissions = perms;
      } else {
        data.permissions = role.permissions;
      }

      this.rest.makeRequest('patch', Constants.Endpoints.guildRole(role.guild.id, role.id), true, data).then(_role => {
        resolve(this.rest.client.actions.GuildRoleUpdate.handle({
          role: _role,
          guild_id: role.guild.id,
        }).updated);
      }).catch(reject);
    });
  }

  pinMessage(message) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('put', `${Constants.Endpoints.channel(message.channel.id)}/pins/${message.id}`, true)
        .then(() => resolve(message))
        .catch(reject);
    });
  }

  unpinMessage(message) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('del', `${Constants.Endpoints.channel(message.channel.id)}/pins/${message.id}`, true)
        .then(() => resolve(message))
        .catch(reject);
    });
  }

  getChannelPinnedMessages(channel) {
    return this.rest.makeRequest('get', `${Constants.Endpoints.channel(channel.id)}/pins`, true);
  }

  createChannelInvite(channel, options) {
    return new Promise((resolve, reject) => {
      const payload = {};
      payload.temporary = options.temporary;
      payload.max_age = options.maxAge;
      payload.max_uses = options.maxUses;

      this.rest.makeRequest('post', `${Constants.Endpoints.channelInvites(channel.id)}`, true, payload)
        .then(invite => resolve(new Invite(this.rest.client, invite)))
        .catch(reject);
    });
  }

  deleteInvite(invite) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('del', Constants.Endpoints.invite(invite.code), true)
        .then(() => resolve(invite))
        .catch(reject);
    });
  }

  getInvite(code) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('get', Constants.Endpoints.invite(code), true)
        .then(invite => resolve(new Invite(this.rest.client, invite)))
        .catch(reject);
    });
  }

  getGuildInvites(guild) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('get', Constants.Endpoints.guildInvites(guild.id), true).then(inviteItems => {
        const invites = new Collection();
        for (const inviteItem of inviteItems) {
          const invite = new Invite(this.rest.client, inviteItem);
          invites.set(invite.code, invite);
        }
        resolve(invites);
      }).catch(reject);
    });
  }

  pruneGuildMembers(guild, days, dry) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest(dry ? 'get' : 'post', `${Constants.Endpoints.guildPrune(guild.id)}?days=${days}`, true)
      .then(data => {
        resolve(data.pruned);
      }).catch(reject);
    });
  }

  createEmoji(guild, image, name) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('post', `${Constants.Endpoints.guildEmojis(guild.id)}`, true, { name: name, image: image })
      .then(data => {
        resolve(this.rest.client.actions.EmojiCreate.handle(data, guild).emoji);
      }).catch(reject);
    });
  }

  deleteEmoji(emoji) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('delete', `${Constants.Endpoints.guildEmojis(emoji.guild.id)}/${emoji.id}`, true)
      .then(() => {
        resolve(this.rest.client.actions.EmojiDelete.handle(emoji).data);
      }).catch(reject);
    });
  }

  getWebhook(id, token) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('get', Constants.Endpoints.webhook(id, token), require('util').isUndefined(token))
      .then(data => {
        resolve(new Webhook(this.rest.client, data));
      }).catch(reject);
    });
  }

  getGuildWebhooks(guild) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('get', Constants.Endpoints.guildWebhooks(guild.id), true)
      .then(data => {
        const hooks = new Collection();
        for (const hook of data) {
          hooks.set(hook.id, new Webhook(this.rest.client, hook));
        }
        resolve(hooks);
      }).catch(reject);
    });
  }

  getChannelWebhooks(channel) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('get', Constants.Endpoints.channelWebhooks(channel.id), true)
      .then(data => {
        const hooks = new Collection();
        for (const hook of data) {
          hooks.set(hook.id, new Webhook(this.rest.client, hook));
        }
        resolve(hooks);
      }).catch(reject);
    });
  }

  createWebhook(channel, name, avatar) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('post', Constants.Endpoints.channelWebhooks(channel.id), true, {
        name,
        avatar,
      })
      .then(data => {
        resolve(new Webhook(this.rest.client, data));
      }).catch(reject);
    });
  }

  editWebhook(webhook, name, avatar) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('patch', Constants.Endpoints.webhook(webhook.id, webhook.token), false, {
        name,
        avatar,
      }).then(data => {
        webhook.name = data.name;
        webhook.avatar = data.avatar;
        resolve(webhook);
      }).catch(reject);
    });
  }

  deleteWebhook(webhook) {
    return this.rest.makeRequest('delete', Constants.Endpoints.webhook(webhook.id, webhook.token), false);
  }

  sendWebhookMessage(webhook, content, { avatarURL, tts, disableEveryone, embeds } = {}, file = null) {
    return new Promise((resolve, reject) => {
      if (typeof content !== 'undefined') content = this.rest.client.resolver.resolveString(content);

      if (disableEveryone || (typeof disableEveryone === 'undefined' && this.rest.client.options.disableEveryone)) {
        content = content.replace('@everyone', '@\u200beveryone').replace('@here', '@\u200bhere');
      }

      this.rest.makeRequest('post', `${Constants.Endpoints.webhook(webhook.id, webhook.token)}?wait=true`, false, {
        content: content, username: webhook.name, avatar_url: avatarURL, tts: tts, file: file, embeds: embeds,
      })
      .then(data => {
        resolve(data);
      }).catch(reject);
    });
  }

  sendSlackWebhookMessage(webhook, body) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest(
        'post',
        `${Constants.Endpoints.webhook(webhook.id, webhook.token)}/slack?wait=true`,
        false,
        body
      ).then(data => {
        resolve(data);
      }).catch(reject);
    });
  }

  addFriend(user) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('post', Constants.Endpoints.relationships('@me'), true, {
        discriminator: user.discriminator,
        username: user.username,
      }).then(() => {
        resolve(user);
      }).catch(reject);
    });
  }

  removeFriend(user) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('delete', `${Constants.Endpoints.relationships('@me')}/${user.id}`, true)
      .then(() => {
        resolve(user);
      }).catch(reject);
    });
  }

  fetchUserProfile(user) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('get', Constants.Endpoints.userProfile(user.id), true)
       .then(data => {
         resolve(new UserProfile(user, data));
       }).catch(reject);
    });
  }

  blockUser(user) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('put', `${Constants.Endpoints.relationships('@me')}/${user.id}`, true, { type: 2 })
      .then(() => {
        resolve(user);
      }).catch(reject);
    });
  }

  unblockUser(user) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('delete', `${Constants.Endpoints.relationships('@me')}/${user.id}`, true)
      .then(() => {
        resolve(user);
      }).catch(reject);
    });
  }

  setRolePositions(guildID, roles) {
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('patch', Constants.Endpoints.guildRoles(guildID), true, roles)
        .then(() => {
          resolve(this.rest.client.actions.GuildRolesPositionUpdate.handle({
            guild_id: guildID,
            roles,
          }).guild);
        })
        .catch(reject);
    });
  }
}

module.exports = RESTMethods;
