const Collection = require('../../util/Collection');
const Message = require('../Message');

/**
 * Interface for classes that have text-channel-like features
 * @interface
 */
class TextBasedChannel {

  constructor() {
    /**
     * A Collection containing the messages sent to this channel.
     * @type {Collection<String, Message>}
     */
    this.messages = new Collection();
  }
  /**
   * Send a message to this channel
   * @param {String} content the content to send
   * @param {MessageOptions} [options={}] the options to provide
   * @returns {Promise<Message>}
   * @example
   * // send a message
   * channel.sendMessage('hello!')
   *  .then(message => console.log(`Sent message: ${message.content}`))
   *  .catch(console.log);
   */
  sendMessage(content, options = {}) {
    return this.client.rest.methods.sendMessage(this, content, options.tts);
  }
  /**
   * Send a text-to-speech message to this channel
   * @param {String} content the content to send
   * @returns {Promise<Message>}
   * @example
   * // send a TTS message
   * channel.sendTTSMessage('hello!')
   *  .then(message => console.log(`Sent tts message: ${message.content}`))
   *  .catch(console.log);
   */
  sendTTSMessage(content) {
    return this.client.rest.methods.sendMessage(this, content, true);
  }

  /**
   * The parameters to pass in when requesting previous messages from a channel. `around`, `before` and
   * `after` are mutually exclusive. All the parameters are optional.
   * ```js
   * {
   *  limit: 30, // the message limit, defaults to 50
   *  before: '123', // gets messages before the given message ID
   *  after: '123', // gets messages after the given message ID
   *  around: '123', // gets messages around the given message ID
   * }
   * ```
   * @typedef {Object} ChannelLogsQueryOptions
   */

  /**
   * Gets the past messages sent in this channel. Resolves with a Collection mapping message ID's to Message objects.
   * @param {ChannelLogsQueryOptions} [options={}] the query parameters to pass in
   * @returns {Promise<Collection<String, Message>, Error>}
   * @example
   * // get messages
   * channel.getMessages({limit: 10})
   *  .then(messages => console.log(`Received ${messages.size} messages`))
   *  .catch(console.log);
   */
  getMessages(options = {}) {
    return new Promise((resolve, reject) => {
      this.client.rest.methods.getChannelMessages(this, options)
        .then(data => {
          const messages = new Collection();
          for (const message of data) {
            messages.set(message.id, new Message(this, message, this.client));
          }
          resolve(messages);
        })
        .catch(reject);
    });
  }

  /**
   * The parameters to pass in when awaiting a response. All the parameters are optional.
   * ```js
   * {
   *  timeout: '5000', // time in milliseconds before timing out
   * }
   * ```
   * @typedef {Object} ChannelAwaitOptions
   */

    /**
    * Await a message
    * @param {User} user the user to wait for a message from
    * @param {ChannelAwaitOptions} [options = {}] the options to provide
    * @returns {Promise<Message, Error>}
    * @example
    * // await a message
    * message.channel.sendMessage('Hello, what is your name?')
    *  .then(msg => {
    *    message.channel.awaitMessage(message.author, {"timeout": 5000})
    *      .then(respone => {
    *        message.reply(response, `Your name is \`${response.content}\`.`)
    *      })
    *    }
   */
  awaitMessage(user, options = {}) {
    return new Promise((resolve, reject) => {
      const awaitID = `${this.id}/${user.id}`;
      var timeout = null;
      if (!this.client._awaitingResponse[awaitID]) {
        this.client._awaitingResponse[awaitID] = response => {
          resolve(response);
          if (timeout) clearTimeout(timeout);
        };
        if (options.timeout) timeout = setTimeout(reject, options.timeout, 'Request timed out');
      }
    });
  }

  _cacheMessage(message) {
    const maxSize = this.client.options.max_message_cache;
    if (maxSize === 0) {
      // saves on performance
      return null;
    }

    if (this.messages.size >= maxSize) {
      this.messages.delete(Array.from(this.messages.keys())[0]);
    }

    this.messages.set(message.id, message);

    return message;
  }
}

function applyProp(structure, prop) {
  structure.prototype[prop] = TextBasedChannel.prototype[prop];
}

exports.applyToClass = (structure, full = false) => {
  const props = ['sendMessage', 'sendTTSMessage'];
  if (full) {
    props.push('_cacheMessage');
    props.push('getMessages');
    props.push('awaitMessage');
  }
  for (const prop of props) {
    applyProp(structure, prop);
  }
};
