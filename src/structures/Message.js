const Attachment = require('./MessageAttachment');
const Embed = require('./MessageEmbed');
const MessageReaction = require('./MessageReaction');
const Collection = require('../util/Collection');
const Constants = require('../util/Constants');
const escapeMarkdown = require('../util/EscapeMarkdown');

// Done purely for GuildMember, which would cause a bad circular dependency
const Discord = require('..');

/**
 * Represents a message on Discord
 */
class Message {
  constructor(channel, data, client) {
    /**
     * The Client that instantiated the Message
     * @name Message#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The channel that the message was sent in
     * @type {TextChannel|DMChannel|GroupDMChannel}
     */
    this.channel = channel;

    if (data) this.setup(data);
  }

  setup(data) { // eslint-disable-line complexity
    /**
     * The ID of the message (unique in the channel it was sent)
     * @type {string}
     */
    this.id = data.id;

    /**
     * The type of the message
     * @type {string}
     */
    this.type = Constants.MessageTypes[data.type];

    /**
     * The content of the message
     * @type {string}
     */
    this.content = data.content;

    /**
     * The author of the message
     * @type {User}
     */
    this.author = this.client.dataManager.newUser(data.author);

    /**
     * Represents the author of the message as a guild member. Only available if the message comes from a guild
     * where the author is still a member.
     * @type {GuildMember}
     */
    this.member = this.guild ? this.guild.member(this.author) || null : null;

    /**
     * Whether or not this message is pinned
     * @type {boolean}
     */
    this.pinned = data.pinned;

    /**
     * Whether or not the message was Text-To-Speech
     * @type {boolean}
     */
    this.tts = data.tts;

    /**
     * A random number used for checking message delivery
     * @type {string}
     */
    this.nonce = data.nonce;

    /**
     * Whether or not this message was sent by Discord, not actually a user (e.g. pin notifications)
     * @type {boolean}
     */
    this.system = data.type === 6;

    /**
     * A list of embeds in the message - e.g. YouTube Player
     * @type {MessageEmbed[]}
     */
    this.embeds = data.embeds.map(e => new Embed(this, e));

    /**
     * A collection of attachments in the message - e.g. Pictures - mapped by their ID.
     * @type {Collection<string, MessageAttachment>}
     */
    this.attachments = new Collection();
    for (const attachment of data.attachments) this.attachments.set(attachment.id, new Attachment(this, attachment));

    /**
     * The timestamp the message was sent at
     * @type {number}
     */
    this.createdTimestamp = new Date(data.timestamp).getTime();

    /**
     * The timestamp the message was last edited at (if applicable)
     * @type {?number}
     */
    this.editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp).getTime() : null;

    /**
     * An object containing a further users, roles or channels collections
     * @type {Object}
     * @property {Collection<string, User>} mentions.users Mentioned users, maps their ID to the user object.
     * @property {Collection<string, Role>} mentions.roles Mentioned roles, maps their ID to the role object.
     * @property {Collection<string, GuildChannel>} mentions.channels Mentioned channels,
     * maps their ID to the channel object.
     * @property {boolean} mentions.everyone Whether or not @everyone was mentioned.
     */
    this.mentions = {
      users: new Collection(),
      roles: new Collection(),
      channels: new Collection(),
      everyone: data.mention_everyone,
    };

    for (const mention of data.mentions) {
      let user = this.client.users.get(mention.id);
      if (user) {
        this.mentions.users.set(user.id, user);
      } else {
        user = this.client.dataManager.newUser(mention);
        this.mentions.users.set(user.id, user);
      }
    }

    if (data.mention_roles) {
      for (const mention of data.mention_roles) {
        const role = this.channel.guild.roles.get(mention);
        if (role) this.mentions.roles.set(role.id, role);
      }
    }

    if (this.channel.guild) {
      const channMentionsRaw = data.content.match(/<#([0-9]{14,20})>/g) || [];
      for (const raw of channMentionsRaw) {
        const chan = this.channel.guild.channels.get(raw.match(/([0-9]{14,20})/g)[0]);
        if (chan) this.mentions.channels.set(chan.id, chan);
      }
    }

    this._edits = [];

    /**
     * A collection of reactions to this message, mapped by the reaction "id".
     * @type {Collection<string, MessageReaction>}
     */
    this.reactions = new Collection();

    if (data.reactions && data.reactions.length > 0) {
      for (const reaction of data.reactions) {
        const id = reaction.emoji.id ? `${reaction.emoji.name}:${reaction.emoji.id}` : reaction.emoji.name;
        this.reactions.set(id, new MessageReaction(this, reaction.emoji, reaction.count, reaction.me));
      }
    }

    /**
     * ID of the webhook that sent the message, if applicable
     * @type {?string}
     */
    this.webhookID = data.webhook_id || null;
  }

  patch(data) { // eslint-disable-line complexity
    if (data.author) {
      this.author = this.client.users.get(data.author.id);
      if (this.guild) this.member = this.guild.member(this.author);
    }
    if (data.content) this.content = data.content;
    if (data.timestamp) this.createdTimestamp = new Date(data.timestamp).getTime();
    if (data.edited_timestamp) {
      this.editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp).getTime() : null;
    }
    if ('tts' in data) this.tts = data.tts;
    if ('mention_everyone' in data) this.mentions.everyone = data.mention_everyone;
    if (data.nonce) this.nonce = data.nonce;
    if (data.embeds) this.embeds = data.embeds.map(e => new Embed(this, e));
    if (data.type > -1) {
      this.system = false;
      if (data.type === 6) this.system = true;
    }
    if (data.attachments) {
      this.attachments = new Collection();
      for (const attachment of data.attachments) {
        this.attachments.set(attachment.id, new Attachment(this, attachment));
      }
    }
    if (data.mentions) {
      for (const mention of data.mentions) {
        let user = this.client.users.get(mention.id);
        if (user) {
          this.mentions.users.set(user.id, user);
        } else {
          user = this.client.dataManager.newUser(mention);
          this.mentions.users.set(user.id, user);
        }
      }
    }
    if (data.mention_roles) {
      for (const mention of data.mention_roles) {
        const role = this.channel.guild.roles.get(mention);
        if (role) this.mentions.roles.set(role.id, role);
      }
    }
    if (data.id) this.id = data.id;
    if (this.channel.guild && data.content) {
      const channMentionsRaw = data.content.match(/<#([0-9]{14,20})>/g) || [];
      for (const raw of channMentionsRaw) {
        const chan = this.channel.guild.channels.get(raw.match(/([0-9]{14,20})/g)[0]);
        if (chan) this.mentions.channels.set(chan.id, chan);
      }
    }
    if (data.reactions) {
      this.reactions = new Collection();
      if (data.reactions.length > 0) {
        for (const reaction of data.reactions) {
          const id = reaction.emoji.id ? `${reaction.emoji.name}:${reaction.emoji.id}` : reaction.emoji.name;
          this.reactions.set(id, new MessageReaction(this, data.emoji, data.count, data.me));
        }
      }
    }
  }

  /**
   * The time the message was sent
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The time the message was last edited at (if applicable)
   * @type {?Date}
   * @readonly
   */
  get editedAt() {
    return this.editedTimestamp ? new Date(this.editedTimestamp) : null;
  }

  /**
   * The guild the message was sent in (if in a guild channel)
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.channel.guild || null;
  }

  /**
   * The message contents with all mentions replaced by the equivalent text. If mentions cannot be resolved to a name,
   * the relevant mention in the message content will not be converted.
   * @type {string}
   * @readonly
   */
  get cleanContent() {
    return this.content
      .replace(/@(everyone|here)/g, '@\u200b$1')
      .replace(/<@!?[0-9]+>/g, (input) => {
        const id = input.replace(/<|!|>|@/g, '');
        if (this.channel.type === 'dm' || this.channel.type === 'group') {
          return this.client.users.has(id) ? `@${this.client.users.get(id).username}` : input;
        }

        const member = this.channel.guild.members.get(id);
        if (member) {
          if (member.nickname) return `@${member.nickname}`;
          return `@${member.user.username}`;
        } else {
          const user = this.client.users.get(id);
          if (user) return `@${user.username}`;
          return input;
        }
      })
      .replace(/<#[0-9]+>/g, (input) => {
        const channel = this.client.channels.get(input.replace(/<|#|>/g, ''));
        if (channel) return `#${channel.name}`;
        return input;
      })
      .replace(/<@&[0-9]+>/g, (input) => {
        if (this.channel.type === 'dm' || this.channel.type === 'group') return input;
        const role = this.guild.roles.get(input.replace(/<|@|>|&/g, ''));
        if (role) return `@${role.name}`;
        return input;
      });
  }

  /**
   * An array of cached versions of the message, including the current version.
   * Sorted from latest (first) to oldest (last).
   * @type {Message[]}
   * @readonly
   */
  get edits() {
    const copy = this._edits.slice();
    copy.unshift(this);
    return copy;
  }

  /**
   * Whether the message is editable by the client user.
   * @type {boolean}
   * @readonly
   */
  get editable() {
    return this.author.id === this.client.user.id;
  }

  /**
   * Whether the message is deletable by the client user.
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    return this.author.id === this.client.user.id || (this.guild &&
      this.channel.permissionsFor(this.client.user).hasPermission(Constants.PermissionFlags.MANAGE_MESSAGES)
    );
  }

  /**
   * Whether the message is pinnable by the client user.
   * @type {boolean}
   * @readonly
   */
  get pinnable() {
    return !this.guild ||
      this.channel.permissionsFor(this.client.user).hasPermission(Constants.PermissionFlags.MANAGE_MESSAGES);
  }

  /**
   * Whether or not a user, channel or role is mentioned in this message.
   * @param {GuildChannel|User|Role|string} data either a guild channel, user or a role object, or a string representing
   * the ID of any of these.
   * @returns {boolean}
   */
  isMentioned(data) {
    data = data && data.id ? data.id : data;
    return this.mentions.users.has(data) || this.mentions.channels.has(data) || this.mentions.roles.has(data);
  }

  /**
   * Whether or not a guild member is mentioned in this message. Takes into account
   * user mentions, role mentions, and @everyone/@here mentions.
   * @param {GuildMember|User} member Member/user to check for a mention of
   * @returns {boolean}
   */
  isMemberMentioned(member) {
    if (this.mentions.everyone) return true;
    if (this.mentions.users.has(member.id)) return true;
    if (member instanceof Discord.GuildMember && member.roles.some(r => this.mentions.roles.has(r.id))) return true;
    return false;
  }

  /**
   * Options that can be passed into editMessage
   * @typedef {Object} MessageEditOptions
   * @property {Object} [embed] An embed to be added/edited
   * @property {string|boolean} [code] Language for optional codeblock formatting to apply
   */

  /**
   * Edit the content of the message
   * @param {StringResolvable} [content] The new content for the message
   * @param {MessageEditOptions} [options] The options to provide
   * @returns {Promise<Message>}
   * @example
   * // update the content of a message
   * message.edit('This is my new content!')
   *  .then(msg => console.log(`Updated the content of a message from ${msg.author}`))
   *  .catch(console.error);
   */
  edit(content, options) {
    if (!options && typeof content === 'object') {
      options = content;
      content = '';
    } else if (!options) {
      options = {};
    }
    return this.client.rest.methods.updateMessage(this, content, options);
  }

  /**
   * Edit the content of the message, with a code block
   * @param {string} lang Language for the code block
   * @param {StringResolvable} content The new content for the message
   * @returns {Promise<Message>}
   */
  editCode(lang, content) {
    content = escapeMarkdown(this.client.resolver.resolveString(content), true);
    return this.edit(`\`\`\`${lang || ''}\n${content}\n\`\`\``);
  }

  /**
   * Pins this message to the channel's pinned messages
   * @returns {Promise<Message>}
   */
  pin() {
    return this.client.rest.methods.pinMessage(this);
  }

  /**
   * Unpins this message from the channel's pinned messages
   * @returns {Promise<Message>}
   */
  unpin() {
    return this.client.rest.methods.unpinMessage(this);
  }

  /**
   * Add a reaction to the message
   * @param {string|Emoji|ReactionEmoji} emoji Emoji to react with
   * @returns {Promise<MessageReaction>}
   */
  react(emoji) {
    emoji = this.client.resolver.resolveEmojiIdentifier(emoji);
    if (!emoji) throw new TypeError('Emoji must be a string or Emoji/ReactionEmoji');

    return this.client.rest.methods.addMessageReaction(this, emoji);
  }

  /**
   * Remove all reactions from a message
   * @returns {Promise<Message>}
   */
  clearReactions() {
    return this.client.rest.methods.removeMessageReactions(this);
  }

  /**
   * Deletes the message
   * @param {number} [timeout=0] How long to wait to delete the message in milliseconds
   * @returns {Promise<Message>}
   * @example
   * // delete a message
   * message.delete()
   *  .then(msg => console.log(`Deleted message from ${msg.author}`))
   *  .catch(console.error);
   */
  delete(timeout = 0) {
    if (timeout <= 0) {
      return this.client.rest.methods.deleteMessage(this);
    } else {
      return new Promise(resolve => {
        this.client.setTimeout(() => {
          resolve(this.delete());
        }, timeout);
      });
    }
  }

  /**
   * Reply to the message
   * @param {StringResolvable} content The content for the message
   * @param {MessageOptions} [options = {}] The options to provide
   * @returns {Promise<Message|Message[]>}
   * @example
   * // reply to a message
   * message.reply('Hey, I\'m a reply!')
   *  .then(msg => console.log(`Sent a reply to ${msg.author}`))
   *  .catch(console.error);
   */
  reply(content, options = {}) {
    content = `${this.guild || this.channel.type === 'group' ? `${this.author}, ` : ''}${content}`;
    return this.channel.send(content, options);
  }

  /**
   * Fetches the webhook used to create this message.
   * @returns {Promise<?Webhook>}
   */
  fetchWebhook() {
    if (!this.webhookID) return Promise.reject(new Error('The message was not sent by a webhook.'));
    return this.client.fetchWebhook(this.webhookID);
  }

  /**
   * Used mainly internally. Whether two messages are identical in properties. If you want to compare messages
   * without checking all the properties, use `message.id === message2.id`, which is much more efficient. This
   * method allows you to see if there are differences in content, embeds, attachments, nonce and tts properties.
   * @param {Message} message The message to compare it to
   * @param {Object} rawData Raw data passed through the WebSocket about this message
   * @returns {boolean}
   */
  equals(message, rawData) {
    if (!message) return false;
    const embedUpdate = !message.author && !message.attachments;
    if (embedUpdate) return this.id === message.id && this.embeds.length === message.embeds.length;

    let equal = this.id === message.id &&
        this.author.id === message.author.id &&
        this.content === message.content &&
        this.tts === message.tts &&
        this.nonce === message.nonce &&
        this.embeds.length === message.embeds.length &&
        this.attachments.length === message.attachments.length;

    if (equal && rawData) {
      equal = this.mentions.everyone === message.mentions.everyone &&
        this.createdTimestamp === new Date(rawData.timestamp).getTime() &&
        this.editedTimestamp === new Date(rawData.edited_timestamp).getTime();
    }

    return equal;
  }

  /**
   * When concatenated with a string, this automatically concatenates the message's content instead of the object.
   * @returns {string}
   * @example
   * // logs: Message: This is a message!
   * console.log(`Message: ${message}`);
   */
  toString() {
    return this.content;
  }

  _addReaction(emoji, user) {
    const emojiID = emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name;
    let reaction;
    if (this.reactions.has(emojiID)) {
      reaction = this.reactions.get(emojiID);
      if (!reaction.me) reaction.me = user.id === this.client.user.id;
    } else {
      reaction = new MessageReaction(this, emoji, 0, user.id === this.client.user.id);
      this.reactions.set(emojiID, reaction);
    }
    if (!reaction.users.has(user.id)) {
      reaction.users.set(user.id, user);
      reaction.count++;
      return reaction;
    }
    return null;
  }

  _removeReaction(emoji, user) {
    const emojiID = emoji.id || emoji;
    if (this.reactions.has(emojiID)) {
      const reaction = this.reactions.get(emojiID);
      if (reaction.users.has(user.id)) {
        reaction.users.delete(user.id);
        reaction.count--;
        if (user.id === this.client.user.id) reaction.me = false;
        return reaction;
      }
    }
    return null;
  }

  _clearReactions() {
    this.reactions.clear();
  }
}

module.exports = Message;
