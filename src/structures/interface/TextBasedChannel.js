const Collection = require('../../util/Collection');
const Message = require('../Message');
const path = require('path');

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
   * Bulk delete a given Collection or Array of messages in one go. Returns the deleted messages after.
   * @param {Map<String, Message>|Array<Message>} messages the messages to delete
   * @returns {Collection<String, Message>}
   */
  bulkDelete(messages) {
    if (messages instanceof Map) {
      messages = messages.array();
    }
    if (!(messages instanceof Array)) {
      return Promise.reject('pass an array or map');
    }
    const messageIDs = messages.map(m => m.id);
    return this.client.rest.methods.bulkDeleteMessages(this, messageIDs);
  }
  /**
   * Options that can be passed into sendMessage or sendTTSMessage:
   * ```js
   * {
   *   tts: false,
   *   nonce: '',
   * };
   * ```
   * @typedef {Object} MessageOptions
   */
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
    return this.client.rest.methods.sendMessage(this, content, options.tts, options.nonce);
  }
  /**
   * Send a text-to-speech message to this channel
   * @param {String} content the content to send
   * @param {MessageOptions} [options={}] the options to provide
   * @returns {Promise<Message>}
   * @example
   * // send a TTS message
   * channel.sendTTSMessage('hello!')
   *  .then(message => console.log(`Sent tts message: ${message.content}`))
   *  .catch(console.log);
   */
  sendTTSMessage(content, options = {}) {
    return this.client.rest.methods.sendMessage(this, content, true, options.nonce);
  }
  /**
   * Send a file to this channel
   * @param {FileResolvable} attachment The file to send
   * @param {String} [fileName="file.jpg"] The name and extension of the file
   * @returns {Promise<Message>}
   */
  sendFile(attachment, fileName) {
    if (!fileName) {
      if (attachment instanceof String || typeof attachment === 'string') {
        fileName = path.basename(attachment);
      } else if (attachment && attachment.path) {
        fileName = path.basename(attachment.path);
      } else {
        fileName = 'file.jpg';
      }
    }
    return new Promise((resolve, reject) => {
      this.client.resolver.resolveFile(attachment)
      .then(file => {
        this.client.rest.methods.sendMessage(this, undefined, false, undefined, {
          file,
          name: fileName,
        }).then(resolve).catch(reject);
      })
      .catch(reject);
    });
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
            const msg = new Message(this, message, this.client);
            messages.set(message.id, msg);
            this._cacheMessage(msg);
          }
          resolve(messages);
        })
        .catch(reject);
    });
  }

  /**
   * Starts or stops a typing indicator in the channel.
   * <info>It can take a few seconds for the Client User to stop typing.</info>
   * @param {Boolean} typing whether or not the client user should be typing
   * @returns {null}
   * @example
   * // start typing in a channel
   * channel.setTyping(true);
   * @example
   * // stop typing in a channel
   * channel.setTyping(false);
   */
  setTyping(typing) {
    clearInterval(this.client.user._typing.get(this.id));
    if (typing) {
      this.client.user._typing.set(this.id, this.client.setInterval(() => {
        this.client.rest.methods.sendTyping(this.id);
      }, 4000));
      this.client.rest.methods.sendTyping(this.id);
    }
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

  /**
   * Fetches the pinned messages of this Channel and returns a Collection of them.
   * @returns {Promise<Collection<String, Message>, Error>}
   */
  fetchPinnedMessages() {
    return new Promise((resolve, reject) => {
      this.client.rest.methods.getChannelPinnedMessages(this)
        .then(data => {
          const messages = new Collection();
          for (const message of data) {
            const msg = new Message(this, message, this.client);
            messages.set(message.id, msg);
            this._cacheMessage(msg);
          }
          resolve(messages);
        })
        .catch(reject);
    });
  }
}

function applyProp(structure, prop) {
  structure.prototype[prop] = TextBasedChannel.prototype[prop];
}

exports.applyToClass = (structure, full = false) => {
  const props = ['sendMessage', 'sendTTSMessage', 'sendFile'];
  if (full) {
    props.push('_cacheMessage');
    props.push('getMessages');
    props.push('bulkDelete');
    props.push('setTyping');
    props.push('fetchPinnedMessages');
  }
  for (const prop of props) {
    applyProp(structure, prop);
  }
};
