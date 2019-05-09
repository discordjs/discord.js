<<<<<<< HEAD
'use strict';

const Mentions = require('./MessageMentions');
const MessageAttachment = require('./MessageAttachment');
const Embed = require('./MessageEmbed');
const ReactionCollector = require('./ReactionCollector');
const ClientApplication = require('./ClientApplication');
const Util = require('../util/Util');
const Collection = require('../util/Collection');
const ReactionStore = require('../stores/ReactionStore');
const { MessageTypes } = require('../util/Constants');
const Permissions = require('../util/Permissions');
const Base = require('./Base');
const { Error, TypeError } = require('../errors');
const APIMessage = require('./APIMessage');

/**
 * Represents a message on Discord.
 * @extends {Base}
 */
class Message extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the message
   * @param {TextChannel|DMChannel} channel The channel the message was sent in
   */
  constructor(client, data, channel) {
    super(client);

    /**
     * The channel that the message was sent in
     * @type {TextChannel|DMChannel}
=======
const Mentions = require('./MessageMentions');
const Attachment = require('./MessageAttachment');
const Embed = require('./MessageEmbed');
const RichEmbed = require('./RichEmbed');
const MessageReaction = require('./MessageReaction');
const ReactionCollector = require('./ReactionCollector');
const Util = require('../util/Util');
const Collection = require('../util/Collection');
const Constants = require('../util/Constants');
const Permissions = require('../util/Permissions');
let GuildMember;

/**
 * Represents a message on Discord.
 */
class Message {
  constructor(channel, data, client) {
    /**
     * The client that instantiated the Message
     * @name Message#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The channel that the message was sent in
     * @type {TextChannel|DMChannel|GroupDMChannel}
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
     */
    this.channel = channel;

    /**
     * Whether this message has been deleted
     * @type {boolean}
     */
    this.deleted = false;

<<<<<<< HEAD
    if (data) this._patch(data);
  }

  _patch(data) { // eslint-disable-line complexity
=======
    if (data) this.setup(data);
  }

  setup(data) { // eslint-disable-line complexity
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
    /**
     * The ID of the message
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The type of the message
     * @type {MessageType}
     */
<<<<<<< HEAD
    this.type = MessageTypes[data.type];
=======
    this.type = Constants.MessageTypes[data.type];
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a

    /**
     * The content of the message
     * @type {string}
     */
    this.content = data.content;

    /**
     * The author of the message
     * @type {User}
     */
<<<<<<< HEAD
    this.author = data.author ? this.client.users.add(data.author, !data.webhook_id) : null;
=======
    this.author = this.client.dataManager.newUser(data.author, !data.webhook_id);

    /**
     * Represents the author of the message as a guild member
     * Only available if the message comes from a guild where the author is still a member
     * @type {?GuildMember}
     */
    this.member = this.guild ? this.guild.member(this.author) || null : null;
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a

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
     * Whether or not the message is marked as a spoiler
     * @type {boolean}
     */
    this.spoiler = data.spoiler;

    /**
     * A random number or string used for checking message delivery
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
<<<<<<< HEAD
    this.embeds = (data.embeds || []).map(e => new Embed(e));
=======
    this.embeds = data.embeds.map(e => new Embed(this, e));
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a

    /**
     * A collection of attachments in the message - e.g. Pictures - mapped by their ID
     * @type {Collection<Snowflake, MessageAttachment>}
     */
    this.attachments = new Collection();
<<<<<<< HEAD
    if (data.attachments) {
      for (const attachment of data.attachments) {
        this.attachments.set(attachment.id, new MessageAttachment(
          attachment.url, attachment.filename, attachment
        ));
      }
    }
=======
    for (const attachment of data.attachments) this.attachments.set(attachment.id, new Attachment(this, attachment));
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a

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
     * A collection of reactions to this message, mapped by the reaction ID
<<<<<<< HEAD
     * @type {ReactionStore<Snowflake, MessageReaction>}
     */
    this.reactions = new ReactionStore(this);
    if (data.reactions && data.reactions.length > 0) {
      for (const reaction of data.reactions) {
        this.reactions.add(reaction);
=======
     * @type {Collection<Snowflake, MessageReaction>}
     */
    this.reactions = new Collection();
    if (data.reactions && data.reactions.length > 0) {
      for (const reaction of data.reactions) {
        const id = reaction.emoji.id ? `${reaction.emoji.name}:${reaction.emoji.id}` : reaction.emoji.name;
        this.reactions.set(id, new MessageReaction(this, reaction.emoji, reaction.count, reaction.me));
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
      }
    }

    /**
     * All valid mentions that the message contains
     * @type {MessageMentions}
     */
    this.mentions = new Mentions(this, data.mentions, data.mention_roles, data.mention_everyone);

    /**
     * ID of the webhook that sent the message, if applicable
     * @type {?Snowflake}
     */
    this.webhookID = data.webhook_id || null;

    /**
<<<<<<< HEAD
     * Supplemental application information for group activities
     * @type {?ClientApplication}
     */
    this.application = data.application ? new ClientApplication(this.client, data.application) : null;

    /**
     * Group activity
     * @type {?MessageActivity}
     */
    this.activity = data.activity ? {
      partyID: data.activity.party_id,
      type: data.activity.type,
    } : null;
=======
     * Whether this message is a hit in a search
     * @type {?boolean}
     */
    this.hit = typeof data.hit === 'boolean' ? data.hit : null;
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a

    /**
     * The previous versions of the message, sorted with the most recent first
     * @type {Message[]}
     * @private
     */
    this._edits = [];
<<<<<<< HEAD

    if (this.member && data.member) {
      this.member._patch(data.member);
    } else if (data.member && this.guild && this.author) {
      this.guild.members.add(Object.assign(data.member, { user: this.author }));
    }
  }

  /**
   * Whether or not this message is a partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return typeof this.content !== 'string' || !this.author;
=======
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
  }

  /**
   * Updates the message.
   * @param {Object} data Raw Discord message update data
   * @private
   */
  patch(data) {
<<<<<<< HEAD
    const clone = this._clone();
    this._edits.unshift(clone);

    this.editedTimestamp = new Date(data.edited_timestamp).getTime();
    if ('content' in data) this.content = data.content;
    if ('pinned' in data) this.pinned = data.pinned;
    if ('tts' in data) this.tts = data.tts;
    if ('embeds' in data) this.embeds = data.embeds.map(e => new Embed(e));
=======
    const clone = Util.cloneObject(this);
    this._edits.unshift(clone);

    if ('editedTimestamp' in data) this.editedTimestamp = new Date(data.edited_timestamp).getTime();
    if ('content' in data) this.content = data.content;
    if ('pinned' in data) this.pinned = data.pinned;
    if ('tts' in data) this.tts = data.tts;
    if ('embeds' in data) this.embeds = data.embeds.map(e => new Embed(this, e));
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
    else this.embeds = this.embeds.slice();

    if ('attachments' in data) {
      this.attachments = new Collection();
<<<<<<< HEAD
      for (const attachment of data.attachments) {
        this.attachments.set(attachment.id, new MessageAttachment(
          attachment.url, attachment.filename, attachment
        ));
      }
=======
      for (const attachment of data.attachments) this.attachments.set(attachment.id, new Attachment(this, attachment));
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
    } else {
      this.attachments = new Collection(this.attachments);
    }

    this.mentions = new Mentions(
      this,
      'mentions' in data ? data.mentions : this.mentions.users,
      'mentions_roles' in data ? data.mentions_roles : this.mentions.roles,
      'mention_everyone' in data ? data.mention_everyone : this.mentions.everyone
    );
  }

  /**
<<<<<<< HEAD
   * Represents the author of the message as a guild member.
   * Only available if the message comes from a guild where the author is still a member
   * @type {?GuildMember}
   * @readonly
   */
  get member() {
    return this.guild ? this.guild.member(this.author) || null : null;
  }

  /**
   * The time the message was sent at
=======
   * The time the message was sent
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
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
<<<<<<< HEAD
   * The url to jump to this message
=======
   * The url to jump to the message
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
   * @type {string}
   * @readonly
   */
  get url() {
    return `https://discordapp.com/channels/${this.guild ? this.guild.id : '@me'}/${this.channel.id}/${this.id}`;
  }

  /**
   * The message contents with all mentions replaced by the equivalent text.
   * If mentions cannot be resolved to a name, the relevant mention in the message content will not be converted.
   * @type {string}
   * @readonly
   */
  get cleanContent() {
<<<<<<< HEAD
    return Util.cleanContent(this.content, this);
=======
    return this.content
      .replace(/@(everyone|here)/g, '@\u200b$1')
      .replace(/<@!?[0-9]+>/g, input => {
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
      .replace(/<#[0-9]+>/g, input => {
        const channel = this.client.channels.get(input.replace(/<|#|>/g, ''));
        if (channel) return `#${channel.name}`;
        return input;
      })
      .replace(/<@&[0-9]+>/g, input => {
        if (this.channel.type === 'dm' || this.channel.type === 'group') return input;
        const role = this.guild.roles.get(input.replace(/<|@|>|&/g, ''));
        if (role) return `@${role.name}`;
        return input;
      });
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
  }

  /**
   * Creates a reaction collector.
   * @param {CollectorFilter} filter The filter to apply
   * @param {ReactionCollectorOptions} [options={}] Options to send to the collector
   * @returns {ReactionCollector}
   * @example
   * // Create a reaction collector
<<<<<<< HEAD
   * const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === 'someID';
=======
   * const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === 'someID'
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
   * const collector = message.createReactionCollector(filter, { time: 15000 });
   * collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createReactionCollector(filter, options = {}) {
    return new ReactionCollector(this, filter, options);
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   * @typedef {ReactionCollectorOptions} AwaitReactionsOptions
   * @property {string[]} [errors] Stop/end reasons that cause the promise to reject
   */

  /**
<<<<<<< HEAD
   * Similar to createReactionCollector but in promise form.
=======
   * Similar to createMessageCollector but in promise form.
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
   * Resolves with a collection of reactions that pass the specified filter.
   * @param {CollectorFilter} filter The filter function to use
   * @param {AwaitReactionsOptions} [options={}] Optional options to pass to the internal collector
   * @returns {Promise<Collection<string, MessageReaction>>}
   * @example
   * // Create a reaction collector
   * const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === 'someID'
   * message.awaitReactions(filter, { time: 15000 })
   *   .then(collected => console.log(`Collected ${collected.size} reactions`))
   *   .catch(console.error);
   */
  awaitReactions(filter, options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createReactionCollector(filter, options);
      collector.once('end', (reactions, reason) => {
        if (options.errors && options.errors.includes(reason)) reject(reactions);
        else resolve(reactions);
      });
    });
  }

  /**
   * An array of cached versions of the message, including the current version
   * Sorted from latest (first) to oldest (last)
   * @type {Message[]}
   * @readonly
   */
  get edits() {
    const copy = this._edits.slice();
    copy.unshift(this);
    return copy;
  }

  /**
   * Whether the message is editable by the client user
   * @type {boolean}
   * @readonly
   */
  get editable() {
    return this.author.id === this.client.user.id;
  }

  /**
   * Whether the message is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    return !this.deleted && (this.author.id === this.client.user.id || (this.guild &&
<<<<<<< HEAD
      this.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_MESSAGES, false)
=======
      this.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_MESSAGES)
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
    ));
  }

  /**
   * Whether the message is pinnable by the client user
   * @type {boolean}
   * @readonly
   */
  get pinnable() {
    return !this.guild ||
<<<<<<< HEAD
      this.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_MESSAGES, false);
=======
      this.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_MESSAGES);
  }

  /**
   * Whether or not a user, channel or role is mentioned in this message.
   * @param {GuildChannel|User|Role|string} data Either a guild channel, user or a role object, or a string representing
   * the ID of any of these
   * @returns {boolean}
   */
  isMentioned(data) {
    data = data && data.id ? data.id : data;
    return this.mentions.users.has(data) || this.mentions.channels.has(data) || this.mentions.roles.has(data);
  }

  /**
   * Whether or not a guild member is mentioned in this message. Takes into account
   * user mentions, role mentions, and @everyone/@here mentions.
   * @param {GuildMember|User} member The member/user to check for a mention of
   * @returns {boolean}
   */
  isMemberMentioned(member) {
    // Lazy-loading is used here to get around a circular dependency that breaks things
    if (!GuildMember) GuildMember = require('./GuildMember');
    if (this.mentions.everyone) return true;
    if (this.mentions.users.has(member.id)) return true;
    if (member instanceof GuildMember && member.roles.some(r => this.mentions.roles.has(r.id))) return true;
    return false;
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
  }

  /**
   * Options that can be passed into editMessage.
   * @typedef {Object} MessageEditOptions
<<<<<<< HEAD
   * @property {string} [content] Content to be edited
=======
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
   * @property {Object} [embed] An embed to be added/edited
   * @property {string|boolean} [code] Language for optional codeblock formatting to apply
   */

  /**
<<<<<<< HEAD
   * Edits the content of the message.
   * @param {StringResolvable|APIMessage} [content] The new content for the message
   * @param {MessageEditOptions|MessageEmbed} [options] The options to provide
=======
   * Edit the content of the message.
   * @param {StringResolvable} [content] The new content for the message
   * @param {MessageEditOptions|RichEmbed} [options] The options to provide
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
   * @returns {Promise<Message>}
   * @example
   * // Update the content of a message
   * message.edit('This is my new content!')
<<<<<<< HEAD
   *   .then(msg => console.log(`Updated the content of a message to ${msg.content}`))
   *   .catch(console.error);
   */
  edit(content, options) {
    const { data } = content instanceof APIMessage ?
      content.resolveData() :
      APIMessage.create(this, content, options).resolveData();
    return this.client.api.channels[this.channel.id].messages[this.id]
      .patch({ data })
      .then(d => {
        const clone = this._clone();
        clone._patch(d);
        return clone;
      });
=======
   *   .then(msg => console.log(`New message content: ${msg}`))
   *   .catch(console.error);
   */
  edit(content, options) {
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = '';
    } else if (!options) {
      options = {};
    }
    if (options instanceof RichEmbed) options = { embed: options };
    return this.client.rest.methods.updateMessage(this, content, options);
  }

  /**
   * Edit the content of the message, with a code block.
   * @param {string} lang The language for the code block
   * @param {StringResolvable} content The new content for the message
   * @returns {Promise<Message>}
   * @deprecated
   */
  editCode(lang, content) {
    content = Util.escapeMarkdown(this.client.resolver.resolveString(content), true);
    return this.edit(`\`\`\`${lang || ''}\n${content}\n\`\`\``);
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
  }

  /**
   * Pins this message to the channel's pinned messages.
   * @returns {Promise<Message>}
   */
  pin() {
<<<<<<< HEAD
    return this.client.api.channels(this.channel.id).pins(this.id).put()
      .then(() => this);
=======
    return this.client.rest.methods.pinMessage(this);
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
  }

  /**
   * Unpins this message from the channel's pinned messages.
   * @returns {Promise<Message>}
   */
  unpin() {
<<<<<<< HEAD
    return this.client.api.channels(this.channel.id).pins(this.id).delete()
      .then(() => this);
  }

  /**
   * Adds a reaction to the message.
   * @param {EmojiIdentifierResolvable} emoji The emoji to react with
=======
    return this.client.rest.methods.unpinMessage(this);
  }

  /**
   * Add a reaction to the message.
   * @param {string|Emoji|ReactionEmoji} emoji The emoji to react with
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
   * @returns {Promise<MessageReaction>}
   * @example
   * // React to a message with a unicode emoji
   * message.react('🤔')
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // React to a message with a custom emoji
   * message.react(message.guild.emojis.get('123456789012345678'))
   *   .then(console.log)
   *   .catch(console.error);
   */
  react(emoji) {
<<<<<<< HEAD
    emoji = this.client.emojis.resolveIdentifier(emoji);
    if (!emoji) throw new TypeError('EMOJI_TYPE');

    return this.client.api.channels(this.channel.id).messages(this.id).reactions(emoji, '@me')
      .put()
      .then(() => this.client.actions.MessageReactionAdd.handle({
        user: this.client.user,
        channel: this.channel,
        message: this,
        emoji: Util.parseEmoji(emoji),
      }).reaction);
=======
    emoji = this.client.resolver.resolveEmojiIdentifier(emoji);
    if (!emoji) throw new TypeError('Emoji must be a string or Emoji/ReactionEmoji');

    return this.client.rest.methods.addMessageReaction(this, emoji);
  }

  /**
   * Remove all reactions from a message.
   * @returns {Promise<Message>}
   */
  clearReactions() {
    return this.client.rest.methods.removeMessageReactions(this);
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
  }

  /**
   * Deletes the message.
<<<<<<< HEAD
   * @param {Object} [options] Options
   * @param {number} [options.timeout=0] How long to wait to delete the message in milliseconds
   * @param {string} [options.reason] Reason for deleting this message, if it does not belong to the client user
=======
   * @param {number} [timeout=0] How long to wait to delete the message in milliseconds
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
   * @returns {Promise<Message>}
   * @example
   * // Delete a message
   * message.delete()
   *   .then(msg => console.log(`Deleted message from ${msg.author.username}`))
   *   .catch(console.error);
   */
<<<<<<< HEAD
  delete({ timeout = 0, reason } = {}) {
    if (timeout <= 0) {
      return this.channel.messages.remove(this.id, reason).then(() =>
        this.client.actions.MessageDelete.handle({
          id: this.id,
          channel_id: this.channel.id,
        }).message);
    } else {
      return new Promise(resolve => {
        this.client.setTimeout(() => {
          resolve(this.delete({ reason }));
=======
  delete(timeout = 0) {
    if (timeout <= 0) {
      return this.client.rest.methods.deleteMessage(this);
    } else {
      return new Promise(resolve => {
        this.client.setTimeout(() => {
          resolve(this.delete());
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
        }, timeout);
      });
    }
  }

  /**
<<<<<<< HEAD
   * Replies to the message.
   * @param {StringResolvable|APIMessage} [content=''] The content for the message
   * @param {MessageOptions|MessageAdditions} [options={}] The options to provide
=======
   * Reply to the message.
   * @param {StringResolvable} [content] The content for the message
   * @param {MessageOptions} [options] The options to provide
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
   * @returns {Promise<Message|Message[]>}
   * @example
   * // Reply to a message
   * message.reply('Hey, I\'m a reply!')
<<<<<<< HEAD
   *   .then(() => console.log(`Sent a reply to ${message.author.username}`))
   *   .catch(console.error);
   */
  reply(content, options) {
    return this.channel.send(content instanceof APIMessage ?
      content :
      APIMessage.transformOptions(content, options, { reply: this.member || this.author })
    );
  }

  /**
   * Fetch this message.
   * @returns {Promise<Message>}
   */
  fetch() {
    return this.channel.messages.fetch(this.id, true);
=======
   *   .then(sent => console.log(`Sent a reply to ${sent.author.username}`))
   *   .catch(console.error);
   */
  reply(content, options) {
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = '';
    } else if (!options) {
      options = {};
    }
    return this.channel.send(content, Object.assign(options, { reply: this.member || this.author }));
  }

  /**
   * Marks the message as read.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<Message>}
   */
  acknowledge() {
    return this.client.rest.methods.ackMessage(this);
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
  }

  /**
   * Fetches the webhook used to create this message.
   * @returns {Promise<?Webhook>}
   */
  fetchWebhook() {
<<<<<<< HEAD
    if (!this.webhookID) return Promise.reject(new Error('WEBHOOK_MESSAGE'));
=======
    if (!this.webhookID) return Promise.reject(new Error('The message was not sent by a webhook.'));
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
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
   * // Logs: Message: This is a message!
   * console.log(`Message: ${message}`);
   */
  toString() {
    return this.content;
  }

<<<<<<< HEAD
  toJSON() {
    return super.toJSON({
      channel: 'channelID',
      author: 'authorID',
      application: 'applicationID',
      guild: 'guildID',
      cleanContent: true,
      member: false,
      reactions: false,
    });
=======
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
    }
    return reaction;
  }

  _removeReaction(emoji, user) {
    const emojiID = emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name;
    if (this.reactions.has(emojiID)) {
      const reaction = this.reactions.get(emojiID);
      if (reaction.users.has(user.id)) {
        reaction.users.delete(user.id);
        reaction.count--;
        if (user.id === this.client.user.id) reaction.me = false;
        if (reaction.count <= 0) this.reactions.delete(emojiID);
        return reaction;
      }
    }
    return null;
  }

  _clearReactions() {
    this.reactions.clear();
>>>>>>> 794d8a59902501c9ac86d1a2197b6a134254d90a
  }
}

module.exports = Message;
