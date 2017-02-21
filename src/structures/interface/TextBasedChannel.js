const path = require('path');
const Message = require('../Message');
const MessageCollector = require('../MessageCollector');
const Collection = require('../../util/Collection');

/**
 * Interface for classes that have text-channel-like features
 * @interface
 */
class TextBasedChannel {
  constructor() {
    /**
     * A collection containing the messages sent to this channel.
     * @type {Collection<Snowflake, Message>}
     */
    this.messages = new Collection();

    /**
     * The ID of the last message in the channel, if one was sent.
     * @type {?Snowflake}
     */
    this.lastMessageID = null;

    /**
     * The Message object of the last message in the channel, if one was sent.
     * @type {?Message}
     */
    this.lastMessage = null;
  }

  /**
   * Options provided when sending or editing a message
   * @typedef {Object} MessageOptions
   * @property {boolean} [tts=false] Whether or not the message should be spoken aloud
   * @property {string} [nonce=''] The nonce for the message
   * @property {RichEmbed|Object} [embed] An embed for the message
   * (see [here](https://discordapp.com/developers/docs/resources/channel#embed-object) for more details)
   * @property {boolean} [disableEveryone=this.client.options.disableEveryone] Whether or not @everyone and @here
   * should be replaced with plain-text
   * @property {FileOptions|string} [file] A file to send with the message
   * @property {string|boolean} [code] Language for optional codeblock formatting to apply
   * @property {boolean|SplitOptions} [split=false] Whether or not the message should be split into multiple messages if
   * it exceeds the character limit. If an object is provided, these are the options for splitting the message.
   * @property {UserResolvable} [reply] User to reply to (prefixes the message with a mention, except in DMs)
   */

  /**
   * @typedef {Object} FileOptions
   * @property {BufferResolvable} attachment File to attach
   * @property {string} [name='file.jpg'] Filename of the attachment
   */

  /**
   * Options for splitting a message
   * @typedef {Object} SplitOptions
   * @property {number} [maxLength=1950] Maximum character length per message piece
   * @property {string} [char='\n'] Character to split the message with
   * @property {string} [prepend=''] Text to prepend to every piece except the first
   * @property {string} [append=''] Text to append to every piece except the last
   */

  /**
   * Send a message to this channel
   * @param {StringResolvable} [content] Text for the message
   * @param {MessageOptions} [options={}] Options for the message
   * @returns {Promise<Message|Message[]>}
   * @example
   * // send a message
   * channel.send('hello!')
   *  .then(message => console.log(`Sent message: ${message.content}`))
   *  .catch(console.error);
   */
  send(content, options) {
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = '';
    } else if (!options) {
      options = {};
    }

    if (options.embed && options.embed.file) options.file = options.embed.file;

    if (options.file) {
      if (typeof options.file === 'string') options.file = { attachment: options.file };
      if (!options.file.name) {
        if (typeof options.file.attachment === 'string') {
          options.file.name = path.basename(options.file.attachment);
        } else if (options.file.attachment && options.file.attachment.path) {
          options.file.name = path.basename(options.file.attachment.path);
        } else {
          options.file.name = 'file.jpg';
        }
      }

      return this.client.resolver.resolveBuffer(options.file.attachment).then(file =>
        this.client.rest.methods.sendMessage(this, content, options, {
          file,
          name: options.file.name,
        })
      );
    }

    return this.client.rest.methods.sendMessage(this, content, options);
  }

  /**
   * Send a message to this channel
   * @param {StringResolvable} [content] Text for the message
   * @param {MessageOptions} [options={}] Options for the message
   * @returns {Promise<Message|Message[]>}
   * @example
   * // send a message
   * channel.sendMessage('hello!')
   *  .then(message => console.log(`Sent message: ${message.content}`))
   *  .catch(console.error);
   */
  sendMessage(content, options) {
    return this.send(content, options);
  }

  /**
   * Send an embed to this channel
   * @param {RichEmbed|Object} embed Embed for the message
   * @param {string} [content] Text for the message
   * @param {MessageOptions} [options] Options for the message
   * @returns {Promise<Message>}
   */
  sendEmbed(embed, content, options) {
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = '';
    } else if (!options) {
      options = {};
    }
    return this.send(content, Object.assign(options, { embed }));
  }

  /**
   * Send a file to this channel
   * @param {BufferResolvable} attachment File to send
   * @param {string} [name='file.jpg'] Name and extension of the file
   * @param {StringResolvable} [content] Text for the message
   * @param {MessageOptions} [options] Options for the message
   * @returns {Promise<Message>}
   */
  sendFile(attachment, name, content, options = {}) {
    return this.send(content, Object.assign(options, { file: { attachment, name } }));
  }

  /**
   * Send a code block to this channel
   * @param {string} lang Language for the code block
   * @param {StringResolvable} content Content of the code block
   * @param {MessageOptions} [options] Options for the message
   * @returns {Promise<Message|Message[]>}
   */
  sendCode(lang, content, options = {}) {
    return this.send(content, Object.assign(options, { code: lang }));
  }

  /**
   * Gets a single message from this channel, regardless of it being cached or not.
   * <warn>This is only available when using a bot account.</warn>
   * @param {string} messageID ID of the message to get
   * @returns {Promise<Message>}
   * @example
   * // get message
   * channel.fetchMessage('99539446449315840')
   *   .then(message => console.log(message.content))
   *   .catch(console.error);
   */
  fetchMessage(messageID) {
    return this.client.rest.methods.getChannelMessage(this, messageID).then(data => {
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
   * @property {string} [before] ID of a message to get the messages that were posted before it
   * @property {string} [after] ID of a message to get the messages that were posted after it
   * @property {string} [around] ID of a message to get the messages that were posted around it
   */

  /**
   * Gets the past messages sent in this channel. Resolves with a collection mapping message ID's to Message objects.
   * @param {ChannelLogsQueryOptions} [options={}] Query parameters to pass in
   * @returns {Promise<Collection<Snowflake, Message>>}
   * @example
   * // get messages
   * channel.fetchMessages({limit: 10})
   *  .then(messages => console.log(`Received ${messages.size} messages`))
   *  .catch(console.error);
   */
  fetchMessages(options = {}) {
    return this.client.rest.methods.getChannelMessages(this, options).then(data => {
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
    return this.client.rest.methods.getChannelPinnedMessages(this).then(data => {
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
   * @typedef {Object} MessageSearchOptions
   * @property {string} [content] Message content
   * @property {string} [maxID] Maximum ID for the filter
   * @property {string} [minID] Minimum ID for the filter
   * @property {string} [has] One of `link`, `embed`, `file`, `video`, `image`, or `sound`,
   * or add `-` to negate (e.g. `-file`)
   * @property {ChannelResolvable} [channel] Channel to limit search to (only for guild search endpoint)
   * @property {UserResolvable} [author] Author to limit search
   * @property {string} [authorType] One of `user`, `bot`, `webhook`, or add `-` to negate (e.g. `-webhook`)
   * @property {string} [sortBy='recent'] `recent` or `relevant`
   * @property {string} [sortOrder='desc'] `asc` or `desc`
   * @property {number} [contextSize=2] How many messages to get around the matched message (0 to 2)
   * @property {number} [limit=25] Maximum number of results to get (1 to 25)
   * @property {number} [offset=0] Offset the "pages" of results (since you can only see 25 at a time)
   * @property {UserResolvable} [mentions] Mentioned user filter
   * @property {boolean} [mentionsEveryone] If everyone is mentioned
   * @property {string} [linkHostname] Filter links by hostname
   * @property {string} [embedProvider] The name of an embed provider
   * @property {string} [embedType] one of `image`, `video`, `url`, `rich`
   * @property {string} [attachmentFilename] The name of an attachment
   * @property {string} [attachmentExtension] The extension of an attachment
   * @property {Date} [before] Date to find messages before
   * @property {Date} [after] Date to find messages before
   * @property {Date} [during] Date to find messages during (range of date to date + 24 hours)
   */

  /**
   * Performs a search within the channel.
   * @param {MessageSearchOptions} [options={}] Options to pass to the search
   * @returns {Promise<Array<Message[]>>}
   * An array containing arrays of messages. Each inner array is a search context cluster.
   * The message which has triggered the result will have the `hit` property set to `true`.
   * @example
   * channel.search({
   *   content: 'discord.js',
   *   before: '2016-11-17'
   * }).then(res => {
   *   const hit = res.messages[0].find(m => m.hit).content;
   *   console.log(`I found: **${hit}**, total results: ${res.totalResults}`);
   * }).catch(console.error);
   */
  search(options) {
    return this.client.rest.methods.search(this, options);
  }

  /**
   * Starts a typing indicator in the channel.
   * @param {number} [count] The number of times startTyping should be considered to have been called
   * @example
   * // start typing in a channel
   * channel.startTyping();
   */
  startTyping(count) {
    if (typeof count !== 'undefined' && count < 1) throw new RangeError('Count must be at least 1.');
    if (!this.client.user._typing.has(this.id)) {
      this.client.user._typing.set(this.id, {
        count: count || 1,
        interval: this.client.setInterval(() => {
          this.client.rest.methods.sendTyping(this.id);
        }, 9000),
      });
      this.client.rest.methods.sendTyping(this.id);
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
   * // stop typing in a channel
   * channel.stopTyping();
   * @example
   * // force typing to fully stop in a channel
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
   * Whether or not the typing indicator is being shown in the channel.
   * @type {boolean}
   * @readonly
   */
  get typing() {
    return this.client.user._typing.has(this.id);
  }

  /**
   * Number of times `startTyping` has been called.
   * @type {number}
   * @readonly
   */
  get typingCount() {
    if (this.client.user._typing.has(this.id)) return this.client.user._typing.get(this.id).count;
    return 0;
  }

  /**
   * Creates a Message Collector
   * @param {CollectorFilterFunction} filter The filter to create the collector with
   * @param {CollectorOptions} [options={}] The options to pass to the collector
   * @returns {MessageCollector}
   * @example
   * // create a message collector
   * const collector = channel.createCollector(
   *  m => m.content.includes('discord'),
   *  { time: 15000 }
   * );
   * collector.on('message', m => console.log(`Collected ${m.content}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createCollector(filter, options = {}) {
    return new MessageCollector(this, filter, options);
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   * @typedef {CollectorOptions} AwaitMessagesOptions
   * @property {string[]} [errors] Stop/end reasons that cause the promise to reject
   */

  /**
   * Similar to createCollector but in promise form. Resolves with a collection of messages that pass the specified
   * filter.
   * @param {CollectorFilterFunction} filter The filter function to use
   * @param {AwaitMessagesOptions} [options={}] Optional options to pass to the internal collector
   * @returns {Promise<Collection<Snowflake, Message>>}
   * @example
   * // await !vote messages
   * const filter = m => m.content.startsWith('!vote');
   * // errors: ['time'] treats ending because of the time limit as an error
   * channel.awaitMessages(filter, { max: 4, time: 60000, errors: ['time'] })
   *  .then(collected => console.log(collected.size))
   *  .catch(collected => console.log(`After a minute, only ${collected.size} out of 4 voted.`));
   */
  awaitMessages(filter, options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createCollector(filter, options);
      collector.on('end', (collection, reason) => {
        if (options.errors && options.errors.includes(reason)) {
          reject(collection);
        } else {
          resolve(collection);
        }
      });
    });
  }

  /**
   * Bulk delete given messages that are newer than two weeks
   * <warn>This is only available when using a bot account.</warn>
   * @param {Collection<Snowflake, Message>|Message[]|number} messages Messages or number of messages to delete
   * @param {boolean} [filterOld=false] Filter messages to remove those which are older than two weeks automatically
   * @returns {Promise<Collection<Snowflake, Message>>} Deleted messages
   */
  bulkDelete(messages, filterOld = false) {
    if (!isNaN(messages)) return this.fetchMessages({ limit: messages }).then(msgs => this.bulkDelete(msgs));
    if (messages instanceof Array || messages instanceof Collection) {
      const messageIDs = messages instanceof Collection ? messages.keyArray() : messages.map(m => m.id);
      return this.client.rest.methods.bulkDeleteMessages(this, messageIDs, filterOld);
    }
    throw new TypeError('The messages must be an Array, Collection, or number.');
  }

  _cacheMessage(message) {
    const maxSize = this.client.options.messageCacheMaxSize;
    if (maxSize === 0) return null;
    if (this.messages.size >= maxSize && maxSize > 0) this.messages.delete(this.messages.firstKey());
    this.messages.set(message.id, message);
    return message;
  }
}

exports.applyToClass = (structure, full = false) => {
  const props = ['send', 'sendMessage', 'sendEmbed', 'sendFile', 'sendCode'];
  if (full) {
    props.push(
      '_cacheMessage',
      'fetchMessages',
      'fetchMessage',
      'search',
      'bulkDelete',
      'startTyping',
      'stopTyping',
      'typing',
      'typingCount',
      'fetchPinnedMessages',
      'createCollector',
      'awaitMessages'
    );
  }
  for (const prop of props) {
    Object.defineProperty(structure.prototype, prop, Object.getOwnPropertyDescriptor(TextBasedChannel.prototype, prop));
  }
};
