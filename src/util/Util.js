const long = require('long');
const snekfetch = require('snekfetch');
const Constants = require('./Constants');
const ConstantsHttp = Constants.DefaultOptions.http;

/**
 * Contains various general-purpose utility methods. These functions are also available on the base `Discord` object.
 */
class Util {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Splits a string into multiple chunks at a designated character that do not exceed a specific length.
   * @param {string} text Content to split
   * @param {SplitOptions} [options] Options controlling the behaviour of the split
   * @returns {string|string[]}
   */
  static splitMessage(text, { maxLength = 1950, char = '\n', prepend = '', append = '' } = {}) {
    if (text.length <= maxLength) return text;
    const splitText = text.split(char);
    if (splitText.length === 1) throw new Error('Message exceeds the max length and contains no split characters.');
    const messages = [''];
    let msg = 0;
    for (let i = 0; i < splitText.length; i++) {
      if (messages[msg].length + splitText[i].length + 1 > maxLength) {
        messages[msg] += append;
        messages.push(prepend);
        msg++;
      }
      messages[msg] += (messages[msg].length > 0 && messages[msg] !== prepend ? char : '') + splitText[i];
    }
    return messages;
  }

  /**
   * Escapes any Discord-flavour markdown in a string.
   * @param {string} text Content to escape
   * @param {boolean} [onlyCodeBlock=false] Whether to only escape codeblocks (takes priority)
   * @param {boolean} [onlyInlineCode=false] Whether to only escape inline code
   * @returns {string}
   */
  static escapeMarkdown(text, onlyCodeBlock = false, onlyInlineCode = false) {
    if (onlyCodeBlock) return text.replace(/```/g, '`\u200b``');
    if (onlyInlineCode) return text.replace(/\\(`|\\)/g, '$1').replace(/(`|\\)/g, '\\$1');
    return text.replace(/\\(\*|_|`|~|\\)/g, '$1').replace(/(\*|_|`|~|\\)/g, '\\$1');
  }

  /**
   * Gets the recommended shard count from Discord.
   * @param {string} token Discord auth token
   * @param {number} [guildsPerShard=1000] Number of guilds per shard
   * @returns {Promise<number>} The recommended number of shards
   */
  static fetchRecommendedShards(token, guildsPerShard = 1000) {
    return new Promise((resolve, reject) => {
      if (!token) throw new Error('A token must be provided.');
      snekfetch.get(`${ConstantsHttp.host}/api/v${ConstantsHttp.version}${Constants.Endpoints.gateway.bot}`)
        .set('Authorization', `Bot ${token.replace(/^Bot\s*/i, '')}`)
        .end((err, res) => {
          if (err) reject(err);
          resolve(res.body.shards * (1000 / guildsPerShard));
        });
    });
  }

  /**
   * Parses emoji info out of a string. The string must be one of:
   * - A UTF-8 emoji (no ID)
   * - A URL-encoded UTF-8 emoji (no ID)
   * - A Discord custom emoji (`<:name:id>`)
   * @param {string} text Emoji string to parse
   * @returns {Object} Object with `name` and `id` properties
   * @private
   */
  static parseEmoji(text) {
    if (text.includes('%')) text = decodeURIComponent(text);
    if (text.includes(':')) {
      const [name, id] = text.split(':');
      return { name, id };
    } else {
      return {
        name: text,
        id: null,
      };
    }
  }

  /**
   * Checks whether the arrays are equal, also removes duplicated entries from b.
   * @param {Array<*>} a Array which will not be modified.
   * @param {Array<*>} b Array to remove duplicated entries from.
   * @returns {boolean} Whether the arrays are equal.
   * @private
   */
  static arraysEqual(a, b) {
    if (a === b) return true;
    if (a.length !== b.length) return false;

    for (const item of a) {
      const ind = b.indexOf(item);
      if (ind !== -1) b.splice(ind, 1);
    }

    return b.length === 0;
  }

  /**
   * Shallow-copies an object with its class/prototype intact.
   * @param {Object} obj Object to clone
   * @returns {Object}
   * @private
   */
  static cloneObject(obj) {
    return Object.assign(Object.create(obj), obj);
  }

  /**
   * Sets default properties on an object that aren't already specified.
   * @param {Object} def Default properties
   * @param {Object} given Object to assign defaults to
   * @returns {Object}
   * @private
   */
  static mergeDefault(def, given) {
    if (!given) return def;
    for (const key in def) {
      if (!{}.hasOwnProperty.call(given, key)) {
        given[key] = def[key];
      } else if (given[key] === Object(given[key])) {
        given[key] = this.mergeDefault(def[key], given[key]);
      }
    }

    return given;
  }

  /**
   * Converts an ArrayBuffer or string to a Buffer.
   * @param {ArrayBuffer|string} ab ArrayBuffer to convert
   * @returns {Buffer}
   * @private
   */
  static convertToBuffer(ab) {
    if (typeof ab === 'string') ab = this.str2ab(ab);
    return Buffer.from(ab);
  }

  /**
   * Converts a string to an ArrayBuffer.
   * @param {string} str String to convert
   * @returns {ArrayBuffer}
   * @private
   */
  static str2ab(str) {
    const buffer = new ArrayBuffer(str.length * 2);
    const view = new Uint16Array(buffer);
    for (var i = 0, strLen = str.length; i < strLen; i++) view[i] = str.charCodeAt(i);
    return buffer;
  }

  /**
   * Makes an Error from a plain info object.
   * @param {Object} obj Error info
   * @param {string} obj.name Error type
   * @param {string} obj.message Message for the error
   * @param {string} obj.stack Stack for the error
   * @returns {Error}
   * @private
   */
  static makeError(obj) {
    const err = new Error(obj.message);
    err.name = obj.name;
    err.stack = obj.stack;
    return err;
  }

  /**
   * Makes a plain error info object from an Error.
   * @param {Error} err Error to get info from
   * @returns {Object}
   * @private
   */
  static makePlainError(err) {
    const obj = {};
    obj.name = err.name;
    obj.message = err.message;
    obj.stack = err.stack;
    return obj;
  }

  /**
   * Moves an element in an array *in place*.
   * @param {Array<*>} array Array to modify
   * @param {*} element Element to move
   * @param {number} newIndex Index or offset to move the element to
   * @param {boolean} [offset=false] Move the element by an offset amount rather than to a set index
   * @returns {number}
   * @private
   */
  static moveElementInArray(array, element, newIndex, offset = false) {
    const index = array.indexOf(element);
    newIndex = (offset ? index : 0) + newIndex;
    if (newIndex > -1 && newIndex < array.length) {
      const removedElement = array.splice(index, 1)[0];
      array.splice(newIndex, 0, removedElement);
    }
    return array.indexOf(element);
  }

  static search(target, options) {
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

    // Lazy load these because some of them use util
    const Channel = require('../structures/Channel');
    const Guild = require('../structures/Guild');
    const Message = require('../structures/Message');

    if (!(target instanceof Channel || target instanceof Guild)) {
      throw new TypeError('Target must be a TextChannel, DMChannel, GroupDMChannel, or Guild.');
    }

    let endpoint = target.client.rest.api[target instanceof Channel ? 'channels' : 'guilds'].messages.search;
    return endpoint.get({ query: options }).then(body => {
      const messages = body.messages.map(x =>
        x.map(m => new Message(this.target.client.channels.get(m.channel_id), m, this.target.client))
      );
      return {
        totalResults: body.total_results,
        messages,
      };
    });
  }
}

module.exports = Util;
