const Constants = require('../../util/Constants');
const Collection = require('../../util/Collection');
const splitMessage = require('../../util/SplitMessage');
const parseEmoji = require('../../util/ParseEmoji');

const User = require('../../structures/User');
const GuildMember = require('../../structures/GuildMember');
const Role = require('../../structures/Role');
const Invite = require('../../structures/Invite');
const Webhook = require('../../structures/Webhook');
const UserProfile = require('../../structures/UserProfile');
const ClientOAuth2Application = require('../../structures/ClientOAuth2Application');

class RESTMethods {
  constructor(restManager) {
    this.rest = restManager;
  }

  loginToken(token = this.rest.client.token) {
    return new Promise((resolve, reject) => {
      token = token.replace(/^Bot\s*/i, '');
      this.rest.client.manager.connectToWebSocket(token, resolve, reject);
    });
  }

  loginEmailPassword(email, password) {
    this.rest.client.emit('warn', 'Client launched using email and password - should use token instead');
    this.rest.client.email = email;
    this.rest.client.password = password;
    return this.rest.makeRequest('post', Constants.Endpoints.login, false, { email, password }).then(data =>
      this.loginToken(data.token)
    );
  }

  logout() {
    return this.rest.makeRequest('post', Constants.Endpoints.logout, true, {});
  }

  getGateway() {
    return this.rest.makeRequest('get', Constants.Endpoints.gateway, true).then(res => {
      this.rest.client.ws.gateway = `${res.url}/?encoding=json&v=${Constants.PROTOCOL_VERSION}`;
      return this.rest.client.ws.gateway;
    });
  }

  getBotGateway() {
    return this.rest.makeRequest('get', Constants.Endpoints.botGateway, true);
  }

  sendMessage(channel, content, { tts, nonce, embed, disableEveryone, split } = {}, file = null) {
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
          this._sendMessageRequest(chan, content, file, tts, nonce, embed, resolve, reject);
        }, reject);
      } else {
        this._sendMessageRequest(channel, content, file, tts, nonce, embed, resolve, reject);
      }
    });
  }

  _sendMessageRequest(channel, content, file, tts, nonce, embed, resolve, reject) {
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
              content: content[i2], tts, nonce, embed,
            }, file);
          }, reject);
        } else {
          promise.then(data => {
            datas.push(data);
            resolve(this.rest.client.actions.MessageCreate.handle(datas).messages);
          }, reject);
        }
      }
    } else {
      this.rest.makeRequest('post', Constants.Endpoints.channelMessages(channel.id), true, {
        content, tts, nonce, embed,
      }, file)
        .then(data => resolve(this.rest.client.actions.MessageCreate.handle(data).message), reject);
    }
  }

  deleteMessage(message) {
    return this.rest.makeRequest('del', Constants.Endpoints.channelMessage(message.channel.id, message.id), true)
      .then(() =>
        this.rest.client.actions.MessageDelete.handle({
          id: message.id,
          channel_id: message.channel.id,
        }).message
      );
  }

  bulkDeleteMessages(channel, messages) {
    return this.rest.makeRequest('post', `${Constants.Endpoints.channelMessages(channel.id)}/bulk_delete`, true, {
      messages,
    }).then(() =>
      this.rest.client.actions.MessageDeleteBulk.handle({
        channel_id: channel.id,
        ids: messages,
      }).messages
    );
  }

  updateMessage(message, content, { embed } = {}) {
    content = this.rest.client.resolver.resolveString(content);
    return this.rest.makeRequest('patch', Constants.Endpoints.channelMessage(message.channel.id, message.id), true, {
      content, embed,
    }).then(data => this.rest.client.actions.MessageUpdate.handle(data).updated);
  }

  createChannel(guild, channelName, channelType) {
    return this.rest.makeRequest('post', Constants.Endpoints.guildChannels(guild.id), true, {
      name: channelName,
      type: channelType,
    }).then(data => this.rest.client.actions.ChannelCreate.handle(data).channel);
  }

  createDM(recipient) {
    const dmChannel = this.getExistingDM(recipient);
    if (dmChannel) return Promise.resolve(dmChannel);
    return this.rest.makeRequest('post', Constants.Endpoints.userChannels(this.rest.client.user.id), true, {
      recipient_id: recipient.id,
    }).then(data => this.rest.client.actions.ChannelCreate.handle(data).channel);
  }

  getExistingDM(recipient) {
    return this.rest.client.channels.find(channel =>
      channel.recipient && channel.recipient.id === recipient.id
    );
  }

  deleteChannel(channel) {
    if (channel instanceof User || channel instanceof GuildMember) channel = this.getExistingDM(channel);
    if (!channel) return Promise.reject(new Error('No channel to delete.'));
    return this.rest.makeRequest('del', Constants.Endpoints.channel(channel.id), true).then(data => {
      data.id = channel.id;
      return this.rest.client.actions.ChannelDelete.handle(data).channel;
    });
  }

  updateChannel(channel, _data) {
    const data = {};
    data.name = (_data.name || channel.name).trim();
    data.topic = _data.topic || channel.topic;
    data.position = _data.position || channel.position;
    data.bitrate = _data.bitrate || channel.bitrate;
    data.user_limit = _data.userLimit || channel.userLimit;
    return this.rest.makeRequest('patch', Constants.Endpoints.channel(channel.id), true, data).then(newData =>
      this.rest.client.actions.ChannelUpdate.handle(newData).updated
    );
  }

  leaveGuild(guild) {
    if (guild.ownerID === this.rest.client.user.id) return Promise.reject(new Error('Guild is owned by the client.'));
    return this.rest.makeRequest('del', Constants.Endpoints.meGuild(guild.id), true).then(() =>
      this.rest.client.actions.GuildDelete.handle({ id: guild.id }).guild
    );
  }

  createGuild(options) {
    options.icon = this.rest.client.resolver.resolveBase64(options.icon) || null;
    options.region = options.region || 'us-central';
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('post', Constants.Endpoints.guilds, true, options).then(data => {
        if (this.rest.client.guilds.has(data.id)) {
          resolve(this.rest.client.guilds.get(data.id));
          return;
        }

        const handleGuild = guild => {
          if (guild.id === data.id) {
            this.rest.client.removeListener('guildCreate', handleGuild);
            this.rest.client.clearTimeout(timeout);
            resolve(guild);
          }
        };
        this.rest.client.on('guildCreate', handleGuild);

        const timeout = this.rest.client.setTimeout(() => {
          this.rest.client.removeListener('guildCreate', handleGuild);
          reject(new Error('Took too long to receive guild data.'));
        }, 10000);
      }, reject);
    });
  }

  // untested but probably will work
  deleteGuild(guild) {
    return this.rest.makeRequest('del', Constants.Endpoints.guild(guild.id), true).then(() =>
      this.rest.client.actions.GuildDelete.handle({ id: guild.id }).guild
    );
  }

  getUser(userID) {
    return this.rest.makeRequest('get', Constants.Endpoints.user(userID), true).then(data =>
      this.rest.client.actions.UserGet.handle(data).user
    );
  }

  updateCurrentUser(_data) {
    const user = this.rest.client.user;
    const data = {};
    data.username = _data.username || user.username;
    data.avatar = this.rest.client.resolver.resolveBase64(_data.avatar) || user.avatar;
    if (!user.bot) {
      data.email = _data.email || user.email;
      data.password = this.rest.client.password;
      if (_data.new_password) data.new_password = _data.newPassword;
    }
    return this.rest.makeRequest('patch', Constants.Endpoints.me, true, data).then(newData =>
      this.rest.client.actions.UserUpdate.handle(newData).updated
    );
  }

  updateGuild(guild, _data) {
    const data = {};
    if (_data.name) data.name = _data.name;
    if (_data.region) data.region = _data.region;
    if (_data.verificationLevel) data.verification_level = Number(_data.verificationLevel);
    if (_data.afkChannel) data.afk_channel_id = this.rest.client.resolver.resolveChannel(_data.afkChannel).id;
    if (_data.afkTimeout) data.afk_timeout = Number(_data.afkTimeout);
    if (_data.icon) data.icon = this.rest.client.resolver.resolveBase64(_data.icon);
    if (_data.owner) data.owner_id = this.rest.client.resolver.resolveUser(_data.owner).id;
    if (_data.splash) data.splash = this.rest.client.resolver.resolveBase64(_data.splash);
    return this.rest.makeRequest('patch', Constants.Endpoints.guild(guild.id), true, data).then(newData =>
      this.rest.client.actions.GuildUpdate.handle(newData).updated
    );
  }

  kickGuildMember(guild, member) {
    return this.rest.makeRequest('del', Constants.Endpoints.guildMember(guild.id, member.id), true).then(() =>
      this.rest.client.actions.GuildMemberRemove.handle({
        guild_id: guild.id,
        user: member.user,
      }).member
    );
  }

  createGuildRole(guild) {
    return this.rest.makeRequest('post', Constants.Endpoints.guildRoles(guild.id), true).then(role =>
      this.rest.client.actions.GuildRoleCreate.handle({
        guild_id: guild.id,
        role,
      }).role
    );
  }

  deleteGuildRole(role) {
    return this.rest.makeRequest('del', Constants.Endpoints.guildRole(role.guild.id, role.id), true).then(() =>
      this.rest.client.actions.GuildRoleDelete.handle({
        guild_id: role.guild.id,
        role_id: role.id,
      }).role
    );
  }

  setChannelOverwrite(channel, payload) {
    return this.rest.makeRequest(
      'put', `${Constants.Endpoints.channelPermissions(channel.id)}/${payload.id}`, true, payload
    );
  }

  deletePermissionOverwrites(overwrite) {
    return this.rest.makeRequest(
      'del', `${Constants.Endpoints.channelPermissions(overwrite.channel.id)}/${overwrite.id}`, true
    ).then(() => overwrite);
  }

  getChannelMessages(channel, payload = {}) {
    const params = [];
    if (payload.limit) params.push(`limit=${payload.limit}`);
    if (payload.around) params.push(`around=${payload.around}`);
    else if (payload.before) params.push(`before=${payload.before}`);
    else if (payload.after) params.push(`after=${payload.after}`);

    let endpoint = Constants.Endpoints.channelMessages(channel.id);
    if (params.length > 0) endpoint += `?${params.join('&')}`;
    return this.rest.makeRequest('get', endpoint, true);
  }

  getChannelMessage(channel, messageID) {
    const msg = channel.messages.get(messageID);
    if (msg) return Promise.resolve(msg);
    return this.rest.makeRequest('get', Constants.Endpoints.channelMessage(channel.id, messageID), true);
  }

  getGuildMember(guild, user) {
    return this.rest.makeRequest('get', Constants.Endpoints.guildMember(guild.id, user.id), true).then(data =>
      this.rest.client.actions.GuildMemberGet.handle(guild, data).member
    );
  }

  updateGuildMember(member, data) {
    if (data.channel) data.channel_id = this.rest.client.resolver.resolveChannel(data.channel).id;
    if (data.roles) data.roles = data.roles.map(role => role instanceof Role ? role.id : role);

    let endpoint = Constants.Endpoints.guildMember(member.guild.id, member.id);
    // fix your endpoints, discord ;-;
    if (member.id === this.rest.client.user.id) {
      const keys = Object.keys(data);
      if (keys.length === 1 && keys[0] === 'nick') {
        endpoint = Constants.Endpoints.stupidInconsistentGuildEndpoint(member.guild.id);
      }
    }

    return this.rest.makeRequest('patch', endpoint, true, data).then(newData =>
      member.guild._updateMember(member, newData).mem
    );
  }

  sendTyping(channelID) {
    return this.rest.makeRequest('post', `${Constants.Endpoints.channel(channelID)}/typing`, true);
  }

  banGuildMember(guild, member, deleteDays = 0) {
    const id = this.rest.client.resolver.resolveUserID(member);
    if (!id) return Promise.reject(new Error('Couldn\'t resolve the user ID to ban.'));
    return this.rest.makeRequest(
      'put', `${Constants.Endpoints.guildBans(guild.id)}/${id}?delete-message-days=${deleteDays}`, true, {
        'delete-message-days': deleteDays,
      }
    ).then(() => {
      if (member instanceof GuildMember) return member;
      const user = this.rest.client.resolver.resolveUser(id);
      if (user) {
        member = this.rest.client.resolver.resolveGuildMember(guild, user);
        return member || user;
      }
      return id;
    });
  }

  unbanGuildMember(guild, member) {
    return new Promise((resolve, reject) => {
      const id = this.rest.client.resolver.resolveUserID(member);
      if (!id) throw new Error('Couldn\'t resolve the user ID to unban.');

      const listener = (eGuild, eUser) => {
        if (eGuild.id === guild.id && eUser.id === id) {
          this.rest.client.removeListener(Constants.Events.GUILD_BAN_REMOVE, listener);
          this.rest.client.clearTimeout(timeout);
          resolve(eUser);
        }
      };
      this.rest.client.on(Constants.Events.GUILD_BAN_REMOVE, listener);

      const timeout = this.rest.client.setTimeout(() => {
        this.rest.client.removeListener(Constants.Events.GUILD_BAN_REMOVE, listener);
        reject(new Error('Took too long to receive the ban remove event.'));
      }, 10000);

      this.rest.makeRequest('del', `${Constants.Endpoints.guildBans(guild.id)}/${id}`, true).catch(err => {
        this.rest.client.removeListener(Constants.Events.GUILD_BAN_REMOVE, listener);
        this.rest.client.clearTimeout(timeout);
        reject(err);
      });
    });
  }

  getGuildBans(guild) {
    return this.rest.makeRequest('get', Constants.Endpoints.guildBans(guild.id), true).then(banItems => {
      const bannedUsers = new Collection();
      for (const banItem of banItems) {
        const user = this.rest.client.dataManager.newUser(banItem.user);
        bannedUsers.set(user.id, user);
      }
      return bannedUsers;
    });
  }

  updateGuildRole(role, _data) {
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

    return this.rest.makeRequest(
      'patch', Constants.Endpoints.guildRole(role.guild.id, role.id), true, data
    ).then(_role =>
      this.rest.client.actions.GuildRoleUpdate.handle({
        role: _role,
        guild_id: role.guild.id,
      }).updated
    );
  }

  pinMessage(message) {
    return this.rest.makeRequest('put', `${Constants.Endpoints.channel(message.channel.id)}/pins/${message.id}`, true)
      .then(() => message);
  }

  unpinMessage(message) {
    return this.rest.makeRequest('del', `${Constants.Endpoints.channel(message.channel.id)}/pins/${message.id}`, true)
      .then(() => message);
  }

  getChannelPinnedMessages(channel) {
    return this.rest.makeRequest('get', `${Constants.Endpoints.channel(channel.id)}/pins`, true);
  }

  createChannelInvite(channel, options) {
    const payload = {};
    payload.temporary = options.temporary;
    payload.max_age = options.maxAge;
    payload.max_uses = options.maxUses;
    return this.rest.makeRequest('post', `${Constants.Endpoints.channelInvites(channel.id)}`, true, payload)
      .then(invite => new Invite(this.rest.client, invite));
  }

  deleteInvite(invite) {
    return this.rest.makeRequest('del', Constants.Endpoints.invite(invite.code), true).then(() => invite);
  }

  getInvite(code) {
    return this.rest.makeRequest('get', Constants.Endpoints.invite(code), true).then(invite =>
      new Invite(this.rest.client, invite)
    );
  }

  getGuildInvites(guild) {
    return this.rest.makeRequest('get', Constants.Endpoints.guildInvites(guild.id), true).then(inviteItems => {
      const invites = new Collection();
      for (const inviteItem of inviteItems) {
        const invite = new Invite(this.rest.client, inviteItem);
        invites.set(invite.code, invite);
      }
      return invites;
    });
  }

  pruneGuildMembers(guild, days, dry) {
    return this.rest.makeRequest(dry ? 'get' : 'post', `${Constants.Endpoints.guildPrune(guild.id)}?days=${days}`, true)
      .then(data => data.pruned);
  }

  createEmoji(guild, image, name) {
    return this.rest.makeRequest('post', `${Constants.Endpoints.guildEmojis(guild.id)}`, true, { name, image })
      .then(data => this.rest.client.actions.EmojiCreate.handle(data, guild).emoji);
  }

  deleteEmoji(emoji) {
    return this.rest.makeRequest('delete', `${Constants.Endpoints.guildEmojis(emoji.guild.id)}/${emoji.id}`, true)
      .then(() => this.rest.client.actions.EmojiDelete.handle(emoji).data);
  }

  getWebhook(id, token) {
    return this.rest.makeRequest('get', Constants.Endpoints.webhook(id, token), !token).then(data =>
      new Webhook(this.rest.client, data)
    );
  }

  getGuildWebhooks(guild) {
    return this.rest.makeRequest('get', Constants.Endpoints.guildWebhooks(guild.id), true).then(data => {
      const hooks = new Collection();
      for (const hook of data) hooks.set(hook.id, new Webhook(this.rest.client, hook));
      return hooks;
    });
  }

  getChannelWebhooks(channel) {
    return this.rest.makeRequest('get', Constants.Endpoints.channelWebhooks(channel.id), true).then(data => {
      const hooks = new Collection();
      for (const hook of data) hooks.set(hook.id, new Webhook(this.rest.client, hook));
      return hooks;
    });
  }

  createWebhook(channel, name, avatar) {
    return this.rest.makeRequest('post', Constants.Endpoints.channelWebhooks(channel.id), true, { name, avatar })
      .then(data => new Webhook(this.rest.client, data));
  }

  editWebhook(webhook, name, avatar) {
    return this.rest.makeRequest('patch', Constants.Endpoints.webhook(webhook.id, webhook.token), false, {
      name,
      avatar,
    }).then(data => {
      webhook.name = data.name;
      webhook.avatar = data.avatar;
      return webhook;
    });
  }

  deleteWebhook(webhook) {
    return this.rest.makeRequest('delete', Constants.Endpoints.webhook(webhook.id, webhook.token), false);
  }

  sendWebhookMessage(webhook, content, { avatarURL, tts, disableEveryone, embeds } = {}, file = null) {
    if (typeof content !== 'undefined') content = this.rest.client.resolver.resolveString(content);
    if (content) {
      if (disableEveryone || (typeof disableEveryone === 'undefined' && this.rest.client.options.disableEveryone)) {
        content = content.replace(/@(everyone|here)/g, '@\u200b$1');
      }
    }
    return this.rest.makeRequest('post', `${Constants.Endpoints.webhook(webhook.id, webhook.token)}?wait=true`, false, {
      username: webhook.name,
      avatar_url: avatarURL,
      content,
      tts,
      file,
      embeds,
    });
  }

  sendSlackWebhookMessage(webhook, body) {
    return this.rest.makeRequest(
      'post', `${Constants.Endpoints.webhook(webhook.id, webhook.token)}/slack?wait=true`, false, body
    );
  }

  fetchUserProfile(user) {
    return this.rest.makeRequest('get', Constants.Endpoints.userProfile(user.id), true).then(data =>
      new UserProfile(user, data)
    );
  }

  addFriend(user) {
    return this.rest.makeRequest('post', Constants.Endpoints.relationships('@me'), true, {
      username: user.username,
      discriminator: user.discriminator,
    }).then(() => user);
  }

  removeFriend(user) {
    return this.rest.makeRequest('delete', `${Constants.Endpoints.relationships('@me')}/${user.id}`, true)
      .then(() => user);
  }

  blockUser(user) {
    return this.rest.makeRequest('put', `${Constants.Endpoints.relationships('@me')}/${user.id}`, true, { type: 2 })
      .then(() => user);
  }

  unblockUser(user) {
    return this.rest.makeRequest('delete', `${Constants.Endpoints.relationships('@me')}/${user.id}`, true)
      .then(() => user);
  }

  setRolePositions(guildID, roles) {
    return this.rest.makeRequest('patch', Constants.Endpoints.guildRoles(guildID), true, roles).then(() =>
      this.rest.client.actions.GuildRolesPositionUpdate.handle({
        guild_id: guildID,
        roles,
      }).guild
    );
  }

  addMessageReaction(message, emoji) {
    return this.rest.makeRequest(
      'put', Constants.Endpoints.selfMessageReaction(message.channel.id, message.id, emoji), true
    ).then(() =>
      this.rest.client.actions.MessageReactionAdd.handle({
        user_id: this.rest.client.user.id,
        message_id: message.id,
        emoji: parseEmoji(emoji),
        channel_id: message.channel.id,
      }).reaction
    );
  }

  removeMessageReaction(message, emoji, user) {
    let endpoint = Constants.Endpoints.selfMessageReaction(message.channel.id, message.id, emoji);
    if (user.id !== this.rest.client.user.id) {
      endpoint = Constants.Endpoints.userMessageReaction(message.channel.id, message.id, emoji, null, user.id);
    }
    return this.rest.makeRequest('delete', endpoint, true).then(() =>
      this.rest.client.actions.MessageReactionRemove.handle({
        user_id: user.id,
        message_id: message.id,
        emoji: parseEmoji(emoji),
        channel_id: message.channel.id,
      }).reaction
    );
  }

  removeMessageReactions(message) {
    this.rest.makeRequest('delete', Constants.Endpoints.messageReactions(message.channel.id, message.id), true)
      .then(() => message);
  }

  getMessageReactionUsers(message, emoji, limit = 100) {
    return this.rest.makeRequest(
      'get', Constants.Endpoints.messageReaction(message.channel.id, message.id, emoji, limit), true
    );
  }

  getMyApplication() {
    return this.rest.makeRequest('get', Constants.Endpoints.myApplication, true).then(app =>
      new ClientOAuth2Application(this.rest.client, app)
    );
  }

  setNote(user, note) {
    return this.rest.makeRequest('put', Constants.Endpoints.note(user.id), true, { note }).then(() => user);
  }
}

module.exports = RESTMethods;
