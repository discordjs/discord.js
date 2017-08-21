const path = require('path');
const MessageCollector = require('../MessageCollector');
const Shared = require('../shared');
const Collection = require('../../util/Collection');
const Snowflake = require('../../util/Snowflake');
const Attachment = require('../../structures/Attachment');
const MessageEmbed = require('../../structures/MessageEmbed');
const { Error, RangeError, TypeError } = require('../../errors');

/**
 * Interface for classes that have text-channel-like features.
 * @interface
 */
class TextBasedChannel {
  constructor() {
    /**
     * A collection containing the messages sent to this channel
     * @type {Collection<Snowflake, Message>}
     */
    this.messages = new Collection();

    /**
     * The ID of the last message in the channel, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageID = null;

    /**
     * The Message object of the last message in the channel, if one was sent
     * @type {?Message}
     */
    this.lastMessage = null;
  }

  /**
   * Options provided when sending or editing a message.
   * @typedef {Object} MessageOptions
   * @property {boolean} [tts=false] Whether or not the message should be spoken aloud
   * @property {string} [nonce=''] The nonce for the message
   * @property {MessageEmbed|Object} [embed] An embed for the message
   * (see [here](https://discordapp.com/developers/docs/resources/channel#embed-object) for more details)
   * @property {boolean} [disableEveryone=this.client.options.disableEveryone] Whether or not @everyone and @here
   * should be replaced with plain-text
   * @property {FileOptions[]|BufferResolvable[]} [files] Files to send with the message
   * @property {string|boolean} [code] Language for optional codeblock formatting to apply
   * @property {boolean|SplitOptions} [split=false] Whether or not the message should be split into multiple messages if
   * it exceeds the character limit. If an object is provided, these are the options for splitting the message
   * @property {UserResolvable} [reply] User to reply to (prefixes the message with a mention, except in DMs)
   */

  /**
   * @typedef {Object} FileOptions
   * @property {BufferResolvable} attachment File to attach
   * @property {string} [name='file.jpg'] Filename of the attachment
   */

  /**
   * Options for splitting a message.
   * @typedef {Object} SplitOptions
   * @property {number} [maxLength=1950] Maximum character length per message piece
   * @property {string} [char='\n'] Character to split the message with
   * @property {string} [prepend=''] Text to prepend to every piece except the first
   * @property {string} [append=''] Text to append to every piece except the last
   */

  /**
   * Send a message to this channel.
   * @param {StringResolvable} [content] Text for the message
   * @param {MessageOptions|MessageEmbed|Attachment|Attachment[]} [options={}] Options for the message
   * @returns {Promise<Message|Message[]>}
   * @example
   * // Send a message
   * channel.send('hello!')
   *   .then(message => console.log(`Sent message: ${message.content}`))
   *   .catch(console.error);
   */
  send(content, options) { // eslint-disable-line complexity
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = '';
    } else if (!options) {
      options = {};
    }

    if (options instanceof MessageEmbed) options = { embed: options };
    if (options instanceof Attachment) options = { files: [options.file] };

    if (content instanceof Array || options instanceof Array) {
      const which = content instanceof Array ? content : options;
      const attachments = which.filter(item => item instanceof Attachment);
      if (attachments.length) {
        options = { files: attachments };
        if (content instanceof Array) content = '';
      }
    }

    if (!options.content) options.content = content;

    if (options.embed && options.embed.files) {
      if (options.files) options.files = options.files.concat(options.embed.files);
      else options.files = options.embed.files;
    }

    if (options.files) {
      for (let i = 0; i < options.files.length; i++) {
        let file = options.files[i];
        if (typeof file === 'string' || Buffer.isBuffer(file)) file = { attachment: file };
        if (!file.name) {
          if (typeof file.attachment === 'string') {
            file.name = path.basename(file.attachment);
          } else if (file.attachment && file.attachment.path) {
            file.name = path.basename(file.attachment.path);
          } else if (file instanceof Attachment) {
            file = { attachment: file.file, name: path.basename(file.file) || 'file.jpg' };
          } else {
            file.name = 'file.jpg';
          }
        } else if (file instanceof Attachment) {
          file = file.file;
        }
        options.files[i] = file;
      }

      return Promise.all(options.files.map(file =>
        this.client.resolver.resolveFile(file.attachment).then(resource => {
          file.file = resource;
          return file;
        })
      )).then(files => {
        options.files = files;
        return Shared.sendMessage(this, options);
      });
    }

    return Shared.sendMessage(this, options);
  }

  /**
   * Gets a single message from this channel, regardless of it being cached or not. Since the single message fetching
   * endpoint is reserved for bot accounts, this abstracts the `fetchMessages` method to obtain the single message when
   * using a user account.
   * @param {Snowflake} messageID ID of the message to get
   * @returns {Promise<Message>}
   * @example
   * // Get message
   * channel.fetchMessage('99539446449315840')
   *   .then(message => console.log(message.content))
   *   .catch(console.error);
   */
  fetchMessage(messageID) {
    const Message = require('../Message');
    if (!this.client.user.bot) {
      return this.fetchMessages({ limit: 1, around: messageID })
        .then(messages => {
          const msg = messages.get(messageID);
          if (!msg) throw new Error('MESSAGE_MISSING');
          return msg;
        });
    }
    return this.client.api.channels[this.id].messages[messageID].get()
      .then(data => {
        const msg = data instanceof Message ? data : new Message(this, data, this.client);
        this._cacheMessage(msg);
        return msg;
      });
  }

  /**
   * The parameters to pass in when requesting previous messages from a channel. `around`, `before` and
   * `after` are mutually exclusive. All the parameters are optional.
   * @typedef {Object} ChannelLogsQueryOptions
   * @property {number} [limit=50] Number of messages to acquire
   * @property {Snowflake} [before] ID of a message to get the messages that were posted before it
   * @property {Snowflake} [after] ID of a message to get the messages that were posted after it
   * @property {Snowflake} [around] ID of a message to get the messages that were posted around it
   */

  /**
   * Gets the past messages sent in this channel. Resolves with a collection mapping message ID's to Message objects.
   * @param {ChannelLogsQueryOptions} [options={}] Query parameters to pass in
   * @returns {Promise<Collection<Snowflake, Message>>}
   * @example
   * // Get messages
   * channel.fetchMessages({limit: 10})
   *   .then(messages => console.log(`Received ${messages.size} messages`))
   *   .catch(console.error);
   */
  fetchMessages(options = {}) {
    const Message = require('../Message');
    return this.client.api.channels[this.id].messages.get({ query: options })
      .then(data => {
        const messages = new Collection();
        for (const message of data) {
          const msg = new Message(this, message, this.client);
          messages.set(message.id, msg);
          this._cacheMessage(msg);
        }
        return messages;
      });
  }

  /**
   * Fetches the pinned messages of this channel and returns a collection of them.
   * @returns {Promise<Collection<Snowflake, Message>>}
   */
  fetchPinnedMessages() {
    const Message = require('../Message');
    return this.client.api.channels[this.id].pins.get().then(data => {
      const messages = new Collection();
      for (const message of data) {
        const msg = new Message(this, message, this.client);
        messages.set(message.id, msg);
        this._cacheMessage(msg);
      }
      return messages;
    });
  }

  /**
   * Performs a search within the channel.
   * <warn>This is only available when using a user account.</warn>
   * @param {MessageSearchOptions} [options={}] Options to pass to the search
   * @returns {Promise<MessageSearchResult>}
   * @example
   * channel.search({
   *   content: 'discord.js',
   *   before: '2016-11-17'
   * }).then(res => {
   *   const hit = res.results[0].find(m => m.hit).content;
   *   console.log(`I found: **${hit}**, total results: ${res.total}`);
   * }).catch(console.error);
   */
  search(options = {}) {
    return Shared.search(this, options);
  }

  /**
   * Starts a typing indicator in the channel.
   * @param {number} [count] The number of times startTyping should be considered to have been called
   * @example
   * // Start typing in a channel
   * channel.startTyping();
   */
  startTyping(count) {
    if (typeof count !== 'undefined' && count < 1) throw new RangeError('TYPING_COUNT');
    if (!this.client.user._typing.has(this.id)) {
      const endpoint = this.client.api.channels[this.id].typing;
      this.client.user._typing.set(this.id, {
        count: count || 1,
        interval: this.client.setInterval(() => {
          endpoint.post();
        }, 9000),
      });
      endpoint.post();
    } else {
      const entry = this.client.user._typing.get(this.id);
      entry.count = count || entry.count + 1;
    }
  }

  /**
   * Stops the typing indicator in the channel.
   * The indicator will only stop if this is called as many times as startTyping().
   * <info>It can take a few seconds for the client user to stop typing.</info>
   * @param {boolean} [force=false] Whether or not to reset the call count and force the indicator to stop
   * @example
   * // Stop typing in a channel
   * channel.stopTyping();
   * @example
   * // Force typing to fully stop in a channel
   * channel.stopTyping(true);
   */
  stopTyping(force = false) {
    if (this.client.user._typing.has(this.id)) {
      const entry = this.client.user._typing.get(this.id);
      entry.count--;
      if (entry.count <= 0 || force) {
        this.client.clearInterval(entry.interval);
        this.client.user._typing.delete(this.id);
      }
    }
  }

  /**
   * Whether or not the typing indicator is being shown in the channel
   * @type {boolean}
   * @readonly
   */
  get typing() {
    return this.client.user._typing.has(this.id);
  }

  /**
   * Number of times `startTyping` has been called
   * @type {number}
   * @readonly
   */
  get typingCount() {
    if (this.client.user._typing.has(this.id)) return this.client.user._typing.get(this.id).count;
    return 0;
  }

  /**
   * Creates a Message Collector.
   * @param {CollectorFilter} filter The filter to create the collector with
   * @param {MessageCollectorOptions} [options={}] The options to pass to the collector
   * @returns {MessageCollector}
   * @example
   * // Create a message collector
   * const collector = channel.createMessageCollector(
   *   m => m.content.includes('discord'),
   *   { time: 15000 }
   * );
   * collector.on('collect', m => console.log(`Collected ${m.content}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createMessageCollector(filter, options = {}) {
    return new MessageCollector(this, filter, options);
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   * @typedef {MessageCollectorOptions} AwaitMessagesOptions
   * @property {string[]} [errors] Stop/end reasons that cause the promise to reject
   */

  /**
   * Similar to createCollector but in promise form. Resolves with a collection of messages that pass the specified
   * filter.
   * @param {CollectorFilter} filter The filter function to use
   * @param {AwaitMessagesOptions} [options={}] Optional options to pass to the internal collector
   * @returns {Promise<Collection<Snowflake, Message>>}
   * @example
   * // Await !vote messages
   * const filter = m => m.content.startsWith('!vote');
   * // Errors: ['time'] treats ending because of the time limit as an error
   * channel.awaitMessages(filter, { max: 4, time: 60000, errors: ['time'] })
   *   .then(collected => console.log(collected.size))
   *   .catch(collected => console.log(`After a minute, only ${collected.size} out of 4 voted.`));
   */
  awaitMessages(filter, options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createMessageCollector(filter, options);
      collector.once('end', (collection, reason) => {
        if (options.errors && options.errors.includes(reason)) {
          reject(collection);
        } else {
          resolve(collection);
        }
      });
    });
  }

  /**
   * Bulk delete given messages that are newer than two weeks.
   * <warn>This is only available when using a bot account.</warn>
   * @param {Collection<Snowflake, Message>|Message[]|number} messages Messages or number of messages to delete
   * @param {boolean} [filterOld=false] Filter messages to remove those which are older than two weeks automatically
   * @returns {Promise<Collection<Snowflake, Message>>} Deleted messages
   */
  bulkDelete(messages, filterOld = false) {
    if (!isNaN(messages)) return this.fetchMessages({ limit: messages }).then(msgs => this.bulkDelete(msgs, filterOld));
    if (messages instanceof Array || messages instanceof Collection) {
      let messageIDs = messages instanceof Collection ? messages.keyArray() : messages.map(m => m.id);
      if (filterOld) {
        messageIDs = messageIDs.filter(id =>
          Date.now() - Snowflake.deconstruct(id).date.getTime() < 1209600000
        );
      }
      return this.client.api.channels[this.id].messages['bulk-delete']
        .post({ data: { messages: messageIDs } })
        .then(() =>
          this.client.actions.MessageDeleteBulk.handle({
            channel_id: this.id,
            ids: messageIDs,
          }).messages
        );
    }
    throw new TypeError('MESSAGE_BULK_DELETE_TYPE');
  }

  /**
   * Marks all messages in this channel as read.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<TextChannel|GroupDMChannel|DMChannel>}
   */
  acknowledge() {
    if (!this.lastMessageID) return Promise.resolve(this);
    return this.client.api.channels[this.id].messages[this.lastMessageID].ack
      .post({ data: { token: this.client.rest._ackToken } })
      .then(res => {
        if (res.token) this.client.rest._ackToken = res.token;
        return this;
      });
  }

  _cacheMessage(message) {
    const maxSize = this.client.options.messageCacheMaxSize;
    if (maxSize === 0) return null;
    if (this.messages.size >= maxSize && maxSize > 0) this.messages.delete(this.messages.firstKey());
    this.messages.set(message.id, message);
    return message;
  }

  static applyToClass(structure, full = false, ignore = []) {
    const props = ['send'];
    if (full) {
      props.push(
        '_cacheMessage',
        'acknowledge',
        'fetchMessages',
        'fetchMessage',
        'search',
        'bulkDelete',
        'startTyping',
        'stopTyping',
        'typing',
        'typingCount',
        'fetchPinnedMessages',
        'createMessageCollector',
        'awaitMessages'
      );
    }
    for (const prop of props) {
      if (ignore.includes(prop)) continue;
      Object.defineProperty(structure.prototype, prop,
        Object.getOwnPropertyDescriptor(TextBasedChannel.prototype, prop));
    }
  }
}

module.exports = TextBasedChannel;
