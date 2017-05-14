const querystring = require('querystring');
const Permissions = require('../../util/Permissions');
const Constants = require('../../util/Constants');
const Endpoints = Constants.Endpoints;
const Collection = require('../../util/Collection');
const Util = require('../../util/Util');

const User = require('../../structures/User');
const GuildMember = require('../../structures/GuildMember');
const Webhook = require('../../structures/Webhook');
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
      this.client.manager.connectToWebSocket(token, resolve, reject);
    });
  }

  logout() {
    return this.rest.request('post', Endpoints.logout, true, {});
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
          this.rest.request('post', Endpoints.Channel(chan).messages, {
            data: { content, tts, nonce, embed },
            files,
          }).then(data => resolve(this.client.actions.MessageCreate.handle(data).message), reject);
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

  addUserToGroupDM(channel, options) {
    const data = this.client.user.bot ?
      { nick: options.nick, access_token: options.accessToken } :
      { recipient: options.id };
    return this.rest.request('put', Endpoints.Channel(channel).Recipient(options.id), true, data)
      .then(() => channel);
  }

  deleteChannel(channel) {
    if (channel instanceof User || channel instanceof GuildMember) channel = channel.dmChannel;
    if (!channel) return Promise.reject(new Error('No channel to delete.'));
    return this.rest.request('delete', Endpoints.Channel(channel), true).then(data => {
      data.id = channel.id;
      return this.client.actions.ChannelDelete.handle(data).channel;
    });
  }

  createGuild(options) {
    options.icon = this.client.resolver.resolveBase64(options.icon) || null;
    options.region = options.region || 'us-central';
    return new Promise((resolve, reject) => {
      this.rest.request('post', Endpoints.guilds, true, options).then(data => {
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

  getUser(userID, cache) {
    return this.rest.request('get', Endpoints.User(userID), true).then(data => {
      if (cache) return this.client.actions.UserGet.handle(data).user;
      else return new User(this.client, data);
    });
  }

  deleteGuildRole(role) {
    return this.rest.request('delete', Endpoints.Guild(role.guild).Role(role.id), true).then(() =>
      this.client.actions.GuildRoleDelete.handle({
        guild_id: role.guild.id,
        role_id: role.id,
      }).role
    );
  }

  getChannelMessages(channel, payload = {}) {
    const params = [];
    if (payload.limit) params.push(`limit=${payload.limit}`);
    if (payload.around) params.push(`around=${payload.around}`);
    else if (payload.before) params.push(`before=${payload.before}`);
    else if (payload.after) params.push(`after=${payload.after}`);

    let endpoint = Endpoints.Channel(channel).messages;
    if (params.length > 0) endpoint += `?${params.join('&')}`;
    return this.rest.request('get', endpoint, true);
  }

  getChannelMessage(channel, messageID) {
    const msg = channel.messages.get(messageID);
    if (msg) return Promise.resolve(msg);
    return this.rest.request('get', Endpoints.Channel(channel).Message(messageID), true);
  }

  getGuildMember(guild, user, cache) {
    return this.rest.request('get', Endpoints.Guild(guild).Member(user.id), true).then(data => {
      if (cache) return this.client.actions.GuildMemberGet.handle(guild, data).member;
      else return new GuildMember(guild, data);
    });
  }

  sendTyping(channelID) {
    return this.rest.request('post', Endpoints.Channel(channelID).typing, true);
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

    return this.rest.request('patch', Endpoints.Guild(role.guild).Role(role.id), true, data).then(_role =>
      this.client.actions.GuildRoleUpdate.handle({
        role: _role,
        guild_id: role.guild.id,
      }).updated
    );
  }

  getChannelPinnedMessages(channel) {
    return this.rest.request('get', Endpoints.Channel(channel).pins, true);
  }

  deleteInvite(invite) {
    return this.rest.request('delete', Endpoints.Invite(invite.code), true).then(() => invite);
  }

  updateEmoji(emoji, _data) {
    const data = {};
    if (_data.name) data.name = _data.name;
    if (_data.roles) data.roles = _data.roles.map(r => r.id ? r.id : r);
    return this.rest.request('patch', Endpoints.Guild(emoji.guild).Emoji(emoji.id), true, data)
      .then(newEmoji => this.client.actions.GuildEmojiUpdate.handle(emoji, newEmoji).emoji);
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

    return this.rest.request('get', `${Endpoints.Guild(guild).auditLogs}?${queryString}`, true)
      .then(data => GuildAuditLogs.build(guild, data));
  }

  getWebhook(id, token) {
    return this.rest.request('get', Endpoints.Webhook(id, token), !token).then(data =>
      new Webhook(this.client, data)
    );
  }

  getGuildWebhooks(guild) {
    return this.rest.request('get', Endpoints.Guild(guild).webhooks, true).then(data => {
      const hooks = new Collection();
      for (const hook of data) hooks.set(hook.id, new Webhook(this.client, hook));
      return hooks;
    });
  }

  editWebhook(webhook, name, avatar) {
    return this.rest.request('patch', Endpoints.Webhook(webhook.id, webhook.token), false, {
      name,
      avatar,
    }).then(data => {
      webhook.name = data.name;
      webhook.avatar = data.avatar;
      return webhook;
    });
  }

  deleteWebhook(webhook) {
    return this.rest.request('delete', Endpoints.Webhook(webhook.id, webhook.token), false);
  }

  sendWebhookMessage(webhook, content, { avatarURL, tts, disableEveryone, embeds, username } = {}, file = null) {
    username = username || webhook.name;
    if (typeof content !== 'undefined') content = this.client.resolver.resolveString(content);
    if (content) {
      if (disableEveryone || (typeof disableEveryone === 'undefined' && this.client.options.disableEveryone)) {
        content = content.replace(/@(everyone|here)/g, '@\u200b$1');
      }
    }
    return this.rest.request('post', `${Endpoints.Webhook(webhook.id, webhook.token)}?wait=true`, false, {
      username,
      avatar_url: avatarURL,
      content,
      tts,
      embeds,
    }, file);
  }

  sendSlackWebhookMessage(webhook, body) {
    return this.rest.request(
      'post', `${Endpoints.Webhook(webhook.id, webhook.token)}/slack?wait=true`, false, body
    );
  }
}

module.exports = RESTMethods;
