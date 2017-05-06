const querystring = require('querystring');
const long = require('long');
const Permissions = require('../../util/Permissions');
const Constants = require('../../util/Constants');
const Endpoints = Constants.Endpoints;
const Collection = require('../../util/Collection');
const Snowflake = require('../../util/Snowflake');
const Util = require('../../util/Util');

const User = require('../../structures/User');
const GuildMember = require('../../structures/GuildMember');
const Message = require('../../structures/Message');
const Role = require('../../structures/Role');
const Invite = require('../../structures/Invite');
const Webhook = require('../../structures/Webhook');
const UserProfile = require('../../structures/UserProfile');
const OAuth2Application = require('../../structures/OAuth2Application');
const Channel = require('../../structures/Channel');
const GroupDMChannel = require('../../structures/GroupDMChannel');
const Guild = require('../../structures/Guild');
const VoiceRegion = require('../../structures/VoiceRegion');
const GuildAuditLogs = require('../../structures/GuildAuditLogs');

class RESTMethods {
  constructor(restManager) {
    this.rest = restManager;
    this.client = restManager.client;
    this._ackToken = null;
  }

  login(token = this.client.token) {
    return new Promise((resolve, reject) => {
      if (typeof token !== 'string') throw new Error(Constants.Errors.INVALID_TOKEN);
      token = token.replace(/^Bot\s*/i, '');
      this.manager.connectToWebSocket(token, resolve, reject);
    });
  }

  logout() {
    return this.rest.request('post', Endpoints.logout, true, {});
  }

  getGateway(bot = false) {
    return this.rest.request('get', bot ? Endpoints.gateway.bot : Endpoints.gateway);
  }

  fetchVoiceRegions(guildID) {
    let endpoint;
    if (guildID) endpoint = Endpoints.Guild(guildID).voiceRegions;
    else endpoint = Endpoints.voiceRegions;
    return this.rest.request('get', endpoint, true).then(res => {
      const regions = new Collection();
      for (const region of res) regions.set(region.id, new VoiceRegion(region));
      return regions;
    });
  }

  sendMessage(channel, content, { tts, nonce, embed, disableEveryone, split, code, reply } = {}, files = null) {
    return new Promise((resolve, reject) => { // eslint-disable-line complexity
      if (typeof content !== 'undefined') content = this.client.resolver.resolveString(content);

      // The nonce has to be a uint64 :<
      if (typeof nonce !== 'undefined') {
        nonce = parseInt(nonce);
        if (isNaN(nonce) || nonce < 0) throw new RangeError('Message nonce must fit in an unsigned 64-bit integer.');
      }

      if (content) {
        if (split && typeof split !== 'object') split = {};

        // Wrap everything in a code block
        if (typeof code !== 'undefined' && (typeof code !== 'boolean' || code === true)) {
          content = Util.escapeMarkdown(this.client.resolver.resolveString(content), true);
          content = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n${content}\n\`\`\``;
          if (split) {
            split.prepend = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n`;
            split.append = '\n```';
          }
        }

        // Add zero-width spaces to @everyone/@here
        if (disableEveryone || (typeof disableEveryone === 'undefined' && this.client.options.disableEveryone)) {
          content = content.replace(/@(everyone|here)/g, '@\u200b$1');
        }

        // Add the reply prefix
        if (reply && !(channel instanceof User || channel instanceof GuildMember) && channel.type !== 'dm') {
          const id = this.client.resolver.resolveUserID(reply);
          const mention = `<@${reply instanceof GuildMember && reply.nickname ? '!' : ''}${id}>`;
          content = `${mention}${content ? `, ${content}` : ''}`;
          if (split) split.prepend = `${mention}, ${split.prepend || ''}`;
        }

        // Split the content
        if (split) content = Util.splitMessage(content, split);
      } else if (reply && !(channel instanceof User || channel instanceof GuildMember) && channel.type !== 'dm') {
        const id = this.client.resolver.resolveUserID(reply);
        content = `<@${reply instanceof GuildMember && reply.nickname ? '!' : ''}${id}>`;
      }

      const send = chan => {
        if (content instanceof Array) {
          const messages = [];
          (function sendChunk(list, index) {
            const options = index === list.length ? { tts, embed } : { tts };
            chan.send(list[index], options, index === list.length ? files : null).then(message => {
              messages.push(message);
              if (index >= list.length - 1) return resolve(messages);
              return sendChunk(list, ++index);
            });
          }(content, 0));
        } else {
          this.rest.request('post', Endpoints.Channel(chan).messages, true, {
            content, tts, nonce, embed,
          }, files).then(data => resolve(this.client.actions.MessageCreate.handle(data).message), reject);
        }
      };

      if (channel instanceof User || channel instanceof GuildMember) this.createDM(channel).then(send, reject);
      else send(channel);
    });
  }

  updateMessage(message, content, { embed, code, reply } = {}) {
    if (typeof content !== 'undefined') content = this.client.resolver.resolveString(content);

    // Wrap everything in a code block
    if (typeof code !== 'undefined' && (typeof code !== 'boolean' || code === true)) {
      content = Util.escapeMarkdown(this.client.resolver.resolveString(content), true);
      content = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n${content}\n\`\`\``;
    }

    // Add the reply prefix
    if (reply && message.channel.type !== 'dm') {
      const id = this.client.resolver.resolveUserID(reply);
      const mention = `<@${reply instanceof GuildMember && reply.nickname ? '!' : ''}${id}>`;
      content = `${mention}${content ? `, ${content}` : ''}`;
    }

    return this.rest.request('patch', Endpoints.Message(message), true, {
      content, embed,
    }).then(data => this.client.actions.MessageUpdate.handle(data).updated);
  }

  deleteMessage(message) {
    return this.rest.request('delete', Endpoints.Message(message), true)
      .then(() =>
        this.client.actions.MessageDelete.handle({
          id: message.id,
          channel_id: message.channel.id,
        }).message
      );
  }

  ackMessage(message) {
    return this.rest.request('post', Endpoints.Message(message).ack, {
      data: { token: this._ackToken },
    }).then(res => {
      if (res.token) this._ackToken = res.token;
      return message;
    });
  }

  ackTextChannel(channel) {
    return this.rest.request('post', Endpoints.Channel(channel).Message(channel.lastMessageID).ack, {
      data: { token: this._ackToken },
    }).then(res => {
      if (res.token) this._ackToken = res.token;
      return channel;
    });
  }

  ackGuild(guild) {
    return this.rest.request('post', Endpoints.Guild(guild).ack).then(() => guild);
  }

  bulkDeleteMessages(channel, messages, filterOld) {
    if (filterOld) {
      messages = messages.filter(id =>
        Date.now() - Snowflake.deconstruct(id).date.getTime() < 1209600000
      );
    }
    return this.rest.request('post', Endpoints.Channel(channel).messages.bulkDelete, {
      data: { messages },
    }).then(() =>
      this.client.actions.MessageDeleteBulk.handle({
        channel_id: channel.id,
        ids: messages,
      }).messages
    );
  }

  search(target, options) {
    if (typeof options === 'string') options = { content: options };
    if (options.before) {
      if (!(options.before instanceof Date)) options.before = new Date(options.before);
      options.maxID = long.fromNumber(options.before.getTime() - 14200704e5).shiftLeft(22).toString();
    }
    if (options.after) {
      if (!(options.after instanceof Date)) options.after = new Date(options.after);
      options.minID = long.fromNumber(options.after.getTime() - 14200704e5).shiftLeft(22).toString();
    }
    if (options.during) {
      if (!(options.during instanceof Date)) options.during = new Date(options.during);
      const t = options.during.getTime() - 14200704e5;
      options.minID = long.fromNumber(t).shiftLeft(22).toString();
      options.maxID = long.fromNumber(t + 86400000).shiftLeft(22).toString();
    }
    if (options.channel) options.channel = this.client.resolver.resolveChannelID(options.channel);
    if (options.author) options.author = this.client.resolver.resolveUserID(options.author);
    if (options.mentions) options.mentions = this.client.resolver.resolveUserID(options.options.mentions);
    options = {
      content: options.content,
      max_id: options.maxID,
      min_id: options.minID,
      has: options.has,
      channel_id: options.channel,
      author_id: options.author,
      author_type: options.authorType,
      context_size: options.contextSize,
      sort_by: options.sortBy,
      sort_order: options.sortOrder,
      limit: options.limit,
      offset: options.offset,
      mentions: options.mentions,
      mentions_everyone: options.mentionsEveryone,
      link_hostname: options.linkHostname,
      embed_provider: options.embedProvider,
      embed_type: options.embedType,
      attachment_filename: options.attachmentFilename,
      attachment_extension: options.attachmentExtension,
    };

    for (const key in options) if (options[key] === undefined) delete options[key];
    const queryString = (querystring.stringify(options).match(/[^=&?]+=[^=&?]+/g) || []).join('&');

    let endpoint;
    if (target instanceof Channel) {
      endpoint = Endpoints.Channel(target).search;
    } else if (target instanceof Guild) {
      endpoint = Endpoints.Guild(target).search;
    } else {
      throw new TypeError('Target must be a TextChannel, DMChannel, GroupDMChannel, or Guild.');
    }
    return this.rest.request('get', `${endpoint}?${queryString}`).then(body => {
      const messages = body.messages.map(x =>
        x.map(m => new Message(this.client.channels.get(m.channel_id), m, this.client))
      );
      return {
        totalResults: body.total_results,
        messages,
      };
    });
  }

  createChannel(guild, channelName, channelType, { overwrites, reason }) {
    if (overwrites instanceof Collection) overwrites = overwrites.array();
    return this.rest.request('post', Endpoints.Guild(guild).channels, {
      data: {
        name: channelName,
        type: channelType,
        permission_overwrites: overwrites,
      },
      reason,
    }).then(data => this.client.actions.ChannelCreate.handle(data).channel);
  }

  createDM(recipient) {
    const dmChannel = this.getExistingDM(recipient);
    if (dmChannel) return Promise.resolve(dmChannel);
    return this.rest.request('post', Endpoints.User(this.client.user).channels, {
      data: { recipient_id: recipient.id },
    }).then(data => this.client.actions.ChannelCreate.handle(data).channel);
  }

  createGroupDM(options) {
    const data = this.client.user.bot ?
      { access_tokens: options.accessTokens, nicks: options.nicks } :
      { recipients: options.recipients };
    return this.rest.request('post', Endpoints.User('@me').channels, { data })
      .then(res => new GroupDMChannel(this.client, res));
  }

  addUserToGroupDM(channel, options) {
    const data = this.client.user.bot ?
      { nick: options.nick, access_token: options.accessToken } :
      { recipient: options.id };
    return this.rest.request('put', Endpoints.Channel(channel).Recipient(options.id), { data })
      .then(() => channel);
  }

  getExistingDM(recipient) {
    return this.client.channels.find(channel =>
      channel.recipient && channel.recipient.id === recipient.id
    );
  }

  deleteChannel(channel, reason) {
    if (channel instanceof User || channel instanceof GuildMember) channel = this.getExistingDM(channel);
    if (!channel) return Promise.reject(new Error('No channel to delete.'));
    return this.rest.request('delete', Endpoints.Channel(channel), { reason }).then(data => {
      data.id = channel.id;
      return this.client.actions.ChannelDelete.handle(data).channel;
    });
  }

  updateChannel(channel, _data, reason) {
    const data = {};
    data.name = (_data.name || channel.name).trim();
    data.topic = _data.topic || channel.topic;
    data.position = _data.position || channel.position;
    data.bitrate = _data.bitrate || channel.bitrate;
    data.user_limit = _data.userLimit || channel.userLimit;
    return this.rest.request('patch', Endpoints.Channel(channel), { data, reason }).then(newData =>
      this.client.actions.ChannelUpdate.handle(newData).updated
    );
  }

  leaveGuild(guild) {
    if (guild.ownerID === this.client.user.id) return Promise.reject(new Error('Guild is owned by the client.'));
    return this.rest.request('delete', Endpoints.User('@me').Guild(guild.id)).then(() =>
      this.client.actions.GuildDelete.handle({ id: guild.id }).guild
    );
  }

  createGuild(options) {
    options.icon = this.client.resolver.resolveBase64(options.icon) || null;
    options.region = options.region || 'us-central';
    return new Promise((resolve, reject) => {
      this.rest.request('post', Endpoints.guilds, { data: options }).then(data => {
        if (this.client.guilds.has(data.id)) return resolve(this.client.guilds.get(data.id));

        const handleGuild = guild => {
          if (guild.id === data.id) {
            this.client.removeListener(Constants.Events.GUILD_CREATE, handleGuild);
            this.client.clearTimeout(timeout);
            resolve(guild);
          }
        };
        this.client.on(Constants.Events.GUILD_CREATE, handleGuild);

        const timeout = this.client.setTimeout(() => {
          this.client.removeListener(Constants.Events.GUILD_CREATE, handleGuild);
          reject(new Error('Took too long to receive guild data.'));
        }, 10000);
        return undefined;
      }, reject);
    });
  }

  // Untested but probably will work
  deleteGuild(guild) {
    return this.rest.request('delete', Endpoints.Guild(guild)).then(() =>
      this.client.actions.GuildDelete.handle({ id: guild.id }).guild
    );
  }

  getUser(userID, cache) {
    return this.rest.request('get', Endpoints.User(userID)).then(data => {
      if (cache) return this.client.actions.UserGet.handle(data).user;
      else return new User(this.client, data);
    });
  }

  updateCurrentUser(_data, password) {
    const user = this.client.user;
    const data = {};
    data.username = _data.username || user.username;
    data.avatar = this.client.resolver.resolveBase64(_data.avatar) || user.avatar;
    if (!user.bot) {
      data.email = _data.email || user.email;
      data.password = password;
      if (_data.new_password) data.new_password = _data.newPassword;
    }
    return this.rest.request('patch', Endpoints.User('@me'), { data }).then(newData =>
      this.client.actions.UserUpdate.handle(newData).updated
    );
  }

  updateGuild(guild, _data, reason) {
    const data = {};
    if (_data.name) data.name = _data.name;
    if (_data.region) data.region = _data.region;
    if (_data.verificationLevel) data.verification_level = Number(_data.verificationLevel);
    if (_data.afkChannel) data.afk_channel_id = this.client.resolver.resolveChannel(_data.afkChannel).id;
    if (_data.afkTimeout) data.afk_timeout = Number(_data.afkTimeout);
    if (_data.icon) data.icon = this.client.resolver.resolveBase64(_data.icon);
    if (_data.owner) data.owner_id = this.client.resolver.resolveUser(_data.owner).id;
    if (_data.splash) data.splash = this.client.resolver.resolveBase64(_data.splash);
    return this.rest.request('patch', Endpoints.Guild(guild), { data, reason }).then(newData =>
      this.client.actions.GuildUpdate.handle(newData).updated
    );
  }

  kickGuildMember(guild, member, reason) {
    const url = `${Endpoints.Guild(guild).Member(member)}?reason=${reason}`;
    return this.rest.request('delete', url).then(() =>
      this.client.actions.GuildMemberRemove.handle({
        guild_id: guild.id,
        user: member.user,
      }).member
    );
  }

  createGuildRole(guild, data) {
    if (data.color) data.color = this.client.resolver.resolveColor(data.color);
    if (data.permissions) data.permissions = Permissions.resolve(data.permissions);
    return this.rest.request('post', Endpoints.Guild(guild).roles, { data }).then(role =>
      this.client.actions.GuildRoleCreate.handle({
        guild_id: guild.id,
        role,
      }).role
    );
  }

  deleteGuildRole(role) {
    return this.rest.request('delete', Endpoints.Guild(role.guild).Role(role.id)).then(() =>
      this.client.actions.GuildRoleDelete.handle({
        guild_id: role.guild.id,
        role_id: role.id,
      }).role
    );
  }

  setChannelOverwrite(channel, payload, reason) {
    return this.rest.request('put', `${Endpoints.Channel(channel).permissions}/${payload.id}`,
      { data: payload, reason });
  }

  deletePermissionOverwrites(overwrite) {
    return this.rest.request(
      'delete', `${Endpoints.Channel(overwrite.channel).permissions}/${overwrite.id}`
    ).then(() => overwrite);
  }

  getChannelMessages(channel, payload = {}) {
    const params = [];
    if (payload.limit) params.push(`limit=${payload.limit}`);
    if (payload.around) params.push(`around=${payload.around}`);
    else if (payload.before) params.push(`before=${payload.before}`);
    else if (payload.after) params.push(`after=${payload.after}`);

    let endpoint = Endpoints.Channel(channel).messages;
    if (params.length > 0) endpoint += `?${params.join('&')}`;
    return this.rest.request('get', endpoint);
  }

  getChannelMessage(channel, messageID) {
    const msg = channel.messages.get(messageID);
    if (msg) return Promise.resolve(msg);
    return this.rest.request('get', Endpoints.Channel(channel).Message(messageID));
  }

  putGuildMember(guild, user, options) {
    options.access_token = options.accessToken;
    if (options.roles) {
      const roles = options.roles;
      if (roles instanceof Collection || (roles instanceof Array && roles[0] instanceof Role)) {
        options.roles = roles.map(role => role.id);
      }
    }
    return this.rest.request('put', Endpoints.Guild(guild).Member(user.id), { data: options })
      .then(data => this.client.actions.GuildMemberGet.handle(guild, data).member);
  }

  getGuildMember(guild, user, cache) {
    return this.rest.request('get', Endpoints.Guild(guild).Member(user.id)).then(data => {
      if (cache) return this.client.actions.GuildMemberGet.handle(guild, data).member;
      else return new GuildMember(guild, data);
    });
  }

  updateGuildMember(member, data, reason) {
    if (data.channel) data.channel_id = this.client.resolver.resolveChannel(data.channel).id;
    if (data.roles) data.roles = data.roles.map(role => role instanceof Role ? role.id : role);

    let endpoint = Endpoints.Member(member);
    // Fix your endpoints, discord ;-;
    if (member.id === this.client.user.id) {
      const keys = Object.keys(data);
      if (keys.length === 1 && keys[0] === 'nick') {
        endpoint = Endpoints.Member(member).nickname;
      }
    }

    return this.rest.request('patch', endpoint, { data, reason }).then(newData =>
      member.guild._updateMember(member, newData).mem
    );
  }

  addMemberRole(member, role, reason) {
    return new Promise((resolve, reject) => {
      if (member._roles.includes(role.id)) return resolve(member);

      const listener = (oldMember, newMember) => {
        if (!oldMember._roles.includes(role.id) && newMember._roles.includes(role.id)) {
          this.client.removeListener(Constants.Events.GUILD_MEMBER_UPDATE, listener);
          resolve(newMember);
        }
      };

      this.client.on(Constants.Events.GUILD_MEMBER_UPDATE, listener);
      const timeout = this.client.setTimeout(() =>
        this.client.removeListener(Constants.Events.GUILD_MEMBER_UPDATE, listener), 10e3);

      return this.rest.request('put', Endpoints.Member(member).Role(role.id), { reason }).catch(err => {
        this.client.removeListener(Constants.Events.GUILD_BAN_REMOVE, listener);
        this.client.clearTimeout(timeout);
        reject(err);
      });
    });
  }

  removeMemberRole(member, role, reason) {
    return new Promise((resolve, reject) => {
      if (!member._roles.includes(role.id)) return resolve(member);

      const listener = (oldMember, newMember) => {
        if (oldMember._roles.includes(role.id) && !newMember._roles.includes(role.id)) {
          this.client.removeListener(Constants.Events.GUILD_MEMBER_UPDATE, listener);
          resolve(newMember);
        }
      };

      this.client.on(Constants.Events.GUILD_MEMBER_UPDATE, listener);
      const timeout = this.client.setTimeout(() =>
        this.client.removeListener(Constants.Events.GUILD_MEMBER_UPDATE, listener), 10e3);

      return this.rest.request('delete', Endpoints.Member(member).Role(role.id), { reason }).catch(err => {
        this.client.removeListener(Constants.Events.GUILD_BAN_REMOVE, listener);
        this.client.clearTimeout(timeout);
        reject(err);
      });
    });
  }

  sendTyping(channelID) {
    return this.rest.request('post', Endpoints.Channel(channelID).typing);
  }

  banGuildMember(guild, member, options) {
    const id = this.client.resolver.resolveUserID(member);
    if (!id) return Promise.reject(new Error('Couldn\'t resolve the user ID to ban.'));

    const url = `${Endpoints.Guild(guild).bans}/${id}?${querystring.stringify(options)}`;
    return this.rest.request('put', url).then(() => {
      if (member instanceof GuildMember) return member;
      const user = this.client.resolver.resolveUser(id);
      if (user) {
        member = this.client.resolver.resolveGuildMember(guild, user);
        return member || user;
      }
      return id;
    });
  }

  unbanGuildMember(guild, member) {
    return new Promise((resolve, reject) => {
      const id = this.client.resolver.resolveUserID(member);
      if (!id) throw new Error('Couldn\'t resolve the user ID to unban.');

      const listener = (eGuild, eUser) => {
        if (eGuild.id === guild.id && eUser.id === id) {
          this.client.removeListener(Constants.Events.GUILD_BAN_REMOVE, listener);
          this.client.clearTimeout(timeout);
          resolve(eUser);
        }
      };
      this.client.on(Constants.Events.GUILD_BAN_REMOVE, listener);

      const timeout = this.client.setTimeout(() => {
        this.client.removeListener(Constants.Events.GUILD_BAN_REMOVE, listener);
        reject(new Error('Took too long to receive the ban remove event.'));
      }, 10000);

      this.rest.request('delete', `${Endpoints.Guild(guild).bans}/${id}`).catch(err => {
        this.client.removeListener(Constants.Events.GUILD_BAN_REMOVE, listener);
        this.client.clearTimeout(timeout);
        reject(err);
      });
    });
  }

  getGuildBans(guild) {
    return this.rest.request('get', Endpoints.Guild(guild).bans).then(bans =>
      bans.reduce((collection, ban) => {
        collection.set(ban.user.id, {
          reason: ban.reason,
          user: this.client.dataManager.newUser(ban.user),
        });
        return collection;
      }, new Collection())
    );
  }

  updateGuildRole(role, _data) {
    const data = {};
    data.name = _data.name || role.name;
    data.position = typeof _data.position !== 'undefined' ? _data.position : role.position;
    data.color = this.client.resolver.resolveColor(_data.color || role.color);
    data.hoist = typeof _data.hoist !== 'undefined' ? _data.hoist : role.hoist;
    data.mentionable = typeof _data.mentionable !== 'undefined' ? _data.mentionable : role.mentionable;

    if (_data.permissions) data.permissions = Permissions.resolve(_data.permissions);
    else data.permissions = role.permissions;

    return this.rest.request('patch', Endpoints.Guild(role.guild).Role(role.id), { data }).then(_role =>
      this.client.actions.GuildRoleUpdate.handle({
        role: _role,
        guild_id: role.guild.id,
      }).updated
    );
  }

  pinMessage(message) {
    return this.rest.request('put', Endpoints.Channel(message.channel).Pin(message.id))
      .then(() => message);
  }

  unpinMessage(message) {
    return this.rest.request('delete', Endpoints.Channel(message.channel).Pin(message.id))
      .then(() => message);
  }

  getChannelPinnedMessages(channel) {
    return this.rest.request('get', Endpoints.Channel(channel).pins);
  }

  createChannelInvite(channel, options) {
    const payload = {};
    payload.temporary = options.temporary;
    payload.max_age = options.maxAge;
    payload.max_uses = options.maxUses;
    return this.rest.request('post', Endpoints.Channel(channel).invites, { data: payload })
      .then(invite => new Invite(this.client, invite));
  }

  deleteInvite(invite) {
    return this.rest.request('delete', Endpoints.Invite(invite.code)).then(() => invite);
  }

  getInvite(code) {
    return this.rest.request('get', Endpoints.Invite(code)).then(invite =>
      new Invite(this.client, invite)
    );
  }

  getGuildInvites(guild) {
    return this.rest.request('get', Endpoints.Guild(guild).invites).then(inviteItems => {
      const invites = new Collection();
      for (const inviteItem of inviteItems) {
        const invite = new Invite(this.client, inviteItem);
        invites.set(invite.code, invite);
      }
      return invites;
    });
  }

  pruneGuildMembers(guild, days, dry) {
    return this.rest.request(dry ? 'get' : 'post', `${Endpoints.Guild(guild).prune}?days=${days}`)
      .then(data => data.pruned);
  }

  createEmoji(guild, image, name, roles) {
    const data = { image, name };
    if (roles) data.roles = roles.map(r => r.id ? r.id : r);
    return this.rest.request('post', Endpoints.Guild(guild).emojis, { data })
      .then(emoji => this.client.actions.GuildEmojiCreate.handle(guild, emoji).emoji);
  }

  updateEmoji(emoji, _data) {
    const data = {};
    if (_data.name) data.name = _data.name;
    if (_data.roles) data.roles = _data.roles.map(r => r.id ? r.id : r);
    return this.rest.request('patch', Endpoints.Guild(emoji.guild).Emoji(emoji.id), { data })
      .then(newEmoji => this.client.actions.GuildEmojiUpdate.handle(emoji, newEmoji).emoji);
  }

  deleteEmoji(emoji) {
    return this.rest.request('delete', Endpoints.Guild(emoji.guild).Emoji(emoji.id))
      .then(() => this.client.actions.GuildEmojiDelete.handle(emoji).data);
  }

  getGuildAuditLogs(guild, options = {}) {
    if (options.before && options.before instanceof GuildAuditLogs.Entry) options.before = options.before.id;
    if (options.after && options.after instanceof GuildAuditLogs.Entry) options.after = options.after.id;
    if (typeof options.type === 'string') options.type = GuildAuditLogs.Actions[options.type];

    const queryString = (querystring.stringify({
      before: options.before,
      after: options.after,
      limit: options.limit,
      user_id: this.client.resolver.resolveUserID(options.user),
      action_type: options.type,
    }).match(/[^=&?]+=[^=&?]+/g) || []).join('&');

    return this.rest.request('get', `${Endpoints.Guild(guild).auditLogs}?${queryString}`)
      .then(data => GuildAuditLogs.build(guild, data));
  }

  getWebhook(id, token) {
    return this.rest.request('get', Endpoints.Webhook(id, token), !token).then(data =>
      new Webhook(this.client, data)
    );
  }

  getGuildWebhooks(guild) {
    return this.rest.request('get', Endpoints.Guild(guild).webhooks).then(data => {
      const hooks = new Collection();
      for (const hook of data) hooks.set(hook.id, new Webhook(this.client, hook));
      return hooks;
    });
  }

  getChannelWebhooks(channel) {
    return this.rest.request('get', Endpoints.Channel(channel).webhooks).then(data => {
      const hooks = new Collection();
      for (const hook of data) hooks.set(hook.id, new Webhook(this.client, hook));
      return hooks;
    });
  }

  createWebhook(channel, name, avatar) {
    return this.rest.request('post', Endpoints.Channel(channel).webhooks, { data: { name, avatar } })
      .then(data => new Webhook(this.client, data));
  }

  editWebhook(webhook, name, avatar) {
    return this.rest.request('patch', Endpoints.Webhook(webhook.id, webhook.token), {
      auth: false,
      data: {
        name,
        avatar,
      },
    }).then(data => {
      webhook.name = data.name;
      webhook.avatar = data.avatar;
      return webhook;
    });
  }

  deleteWebhook(webhook) {
    return this.rest.request('delete', Endpoints.Webhook(webhook.id, webhook.token), { auth: false });
  }

  sendWebhookMessage(webhook, content, { avatarURL, tts, disableEveryone, embeds, username } = {}, file = null) {
    username = username || webhook.name;
    if (typeof content !== 'undefined') content = this.client.resolver.resolveString(content);
    if (content) {
      if (disableEveryone || (typeof disableEveryone === 'undefined' && this.client.options.disableEveryone)) {
        content = content.replace(/@(everyone|here)/g, '@\u200b$1');
      }
    }
    return this.rest.request('post', `${Endpoints.Webhook(webhook.id, webhook.token)}?wait=true`, {
      auth: false,
      data: {
        username,
        avatar_url: avatarURL,
        content,
        tts,
        embeds,
      },
      file,
    });
  }

  sendSlackWebhookMessage(webhook, body) {
    return this.rest.request(
      'post', `${Endpoints.Webhook(webhook.id, webhook.token)}/slack?wait=true`, { data: body }
    );
  }

  fetchUserProfile(user) {
    return this.rest.request('get', Endpoints.User(user).profile).then(data =>
      new UserProfile(user, data)
    );
  }

  fetchMentions(options) {
    if (options.guild instanceof Guild) options.guild = options.guild.id;
    Util.mergeDefault({ limit: 25, roles: true, everyone: true, guild: null }, options);

    return this.rest.request(
      'get', Endpoints.User('@me').Mentions(options.limit, options.roles, options.everyone, options.guild)
    ).then(data => data.map(m => new Message(this.client.channels.get(m.channel_id), m, this.client)));
  }

  updateChannelPositions(guildID, channels) {
    const data = new Array(channels.length);
    for (let i = 0; i < channels.length; i++) {
      data[i] = {
        id: this.client.resolver.resolveChannelID(channels[i].channel),
        position: channels[i].position,
      };
    }

    return this.rest.request('patch', Endpoints.Guild(guildID).channels, { data }).then(() =>
      this.client.actions.GuildChannelsPositionUpdate.handle({
        guild_id: guildID,
        channels,
      }).guild
    );
  }

  setRolePositions(guildID, roles) {
    return this.rest.request('patch', Endpoints.Guild(guildID).roles, { data: roles }).then(() =>
      this.client.actions.GuildRolesPositionUpdate.handle({
        guild_id: guildID,
        roles,
      }).guild
    );
  }

  setChannelPositions(guildID, channels) {
    return this.rest.request('patch', Endpoints.Guild(guildID).channels, { data: channels }).then(() =>
      this.client.actions.GuildChannelsPositionUpdate.handle({
        guild_id: guildID,
        channels,
      }).guild
    );
  }

  addMessageReaction(message, emoji) {
    return this.rest.request(
      'put', Endpoints.Message(message).Reaction(emoji).User('@me'), true
    ).then(() =>
      message._addReaction(Util.parseEmoji(emoji), message.client.user)
      );
  }

  removeMessageReaction(message, emoji, userID) {
    const endpoint = Endpoints.Message(message).Reaction(emoji).User(userID === this.client.user.id ? '@me' : userID);
    return this.rest.request('delete', endpoint).then(() =>
      this.client.actions.MessageReactionRemove.handle({
        user_id: userID,
        message_id: message.id,
        emoji: Util.parseEmoji(emoji),
        channel_id: message.channel.id,
      }).reaction
    );
  }

  removeMessageReactions(message) {
    return this.rest.request('delete', Endpoints.Message(message).reactions)
      .then(() => message);
  }

  getMessageReactionUsers(message, emoji, limit = 100) {
    return this.rest.request('get', Endpoints.Message(message).Reaction(emoji, limit));
  }

  getApplication(id) {
    return this.rest.request('get', Endpoints.OAUTH2.Application(id)).then(app =>
      new OAuth2Application(this.client, app)
    );
  }

  resetApplication(id) {
    return this.rest.request('post', Endpoints.OAUTH2.Application(id).reset)
      .then(app => new OAuth2Application(this.client, app));
  }

  setNote(user, note) {
    return this.rest.request('put', Endpoints.User(user).note, { data: { note } }).then(() => user);
  }

  acceptInvite(code) {
    if (code.id) code = code.id;
    return new Promise((resolve, reject) =>
      this.rest.request('post', Endpoints.Invite(code)).then(res => {
        const handler = guild => {
          if (guild.id === res.id) {
            resolve(guild);
            this.client.removeListener(Constants.Events.GUILD_CREATE, handler);
          }
        };
        this.client.on(Constants.Events.GUILD_CREATE, handler);
        this.client.setTimeout(() => {
          this.client.removeListener(Constants.Events.GUILD_CREATE, handler);
          reject(new Error('Accepting invite timed out'));
        }, 120e3);
      })
    );
  }

  patchUserSettings(data) {
    return this.rest.request('patch', Constants.Endpoints.User('@me').settings, { data });
  }
}

module.exports = RESTMethods;
