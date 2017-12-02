const snekfetch = require('snekfetch');
const { Colors, DefaultOptions, Endpoints } = require('./Constants');
const { Error: DiscordError, RangeError, TypeError } = require('../errors');
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^/]+?|)(\.[^./]*|))(?:[/]*)$/;

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
    if (splitText.length === 1) throw new RangeError('SPLIT_MAX_LEN');
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
    return messages.filter(m => m);
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
      if (!token) throw new DiscordError('TOKEN_MISSING');
      snekfetch.get(`${DefaultOptions.http.api}/v${DefaultOptions.http.version}${Endpoints.botGateway}`)
        .set('Authorization', `Bot ${token.replace(/^Bot\s*/i, '')}`)
        .end((err, res) => {
          if (err) reject(err);
          resolve(res.body.shards * (1000 / guildsPerShard));
        });
    });
  }

  /**
   * Parses emoji info out of a string. The string must be one of:
   * * A UTF-8 emoji (no ID)
   * * A URL-encoded UTF-8 emoji (no ID)
   * * A Discord custom emoji (`<:name:id>`)
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
      return { name: text, id: null };
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
      if (!has(given, key) || given[key] === undefined) {
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

  /**
   * Data that can be resolved to give a string. This can be:
   * * A string
   * * An array (joined with a new line delimiter to give a string)
   * * Any value
   * @typedef {string|Array|*} StringResolvable
   */

  /**
   * Resolves a StringResolvable to a string.
   * @param {StringResolvable} data The string resolvable to resolve
   * @returns {string}
   */
  static resolveString(data) {
    if (typeof data === 'string') return data;
    if (data instanceof Array) return data.join('\n');
    return String(data);
  }

  /**
   * Can be a number, hex string, an RGB array like:
   * ```js
   * [255, 0, 255] // purple
   * ```
   * or one of the following strings:
   * - `DEFAULT`
   * - `AQUA`
   * - `GREEN`
   * - `BLUE`
   * - `PURPLE`
   * - `GOLD`
   * - `ORANGE`
   * - `RED`
   * - `GREY`
   * - `DARKER_GREY`
   * - `NAVY`
   * - `DARK_AQUA`
   * - `DARK_GREEN`
   * - `DARK_BLUE`
   * - `DARK_PURPLE`
   * - `DARK_GOLD`
   * - `DARK_ORANGE`
   * - `DARK_RED`
   * - `DARK_GREY`
   * - `LIGHT_GREY`
   * - `DARK_NAVY`
   * - `RANDOM`
   * @typedef {string|number|number[]} ColorResolvable
   */

  /**
   * Resolves a ColorResolvable into a color number.
   * @param {ColorResolvable} color Color to resolve
   * @returns {number} A color
   */
  static resolveColor(color) {
    if (typeof color === 'string') {
      if (color === 'RANDOM') return Math.floor(Math.random() * (0xFFFFFF + 1));
      color = Colors[color] || parseInt(color.replace('#', ''), 16);
    } else if (color instanceof Array) {
      color = (color[0] << 16) + (color[1] << 8) + color[2];
    }

    if (color < 0 || color > 0xFFFFFF) throw new RangeError('COLOR_RANGE');
    else if (color && isNaN(color)) throw new TypeError('COLOR_CONVERT');

    return color;
  }

  /**
   * Sorts by Discord's position and ID.
   * @param  {Collection} collection Collection of objects to sort
   * @returns {Collection}
   */
  static discordSort(collection) {
    return collection.sort((a, b) =>
      a.rawPosition - b.rawPosition ||
      parseInt(a.id.slice(0, -10)) - parseInt(b.id.slice(0, -10)) ||
      parseInt(a.id.slice(10)) - parseInt(b.id.slice(10))
    );
  }

  /**
   * Sets the position of a Channel or Role.
   * @param {Channel|Role} item Object to set the position of
   * @param {number} position New position for the object
   * @param {boolean} relative Whether `position` is relative to its current position
   * @param {Collection<string, Channel|Role>} sorted A collection of the objects sorted properly
   * @param {APIRouter} route Route to call PATCH on
   * @param {string} [reason] Reason for the change
   * @returns {Promise<Object[]>} Updated item list, with `id` and `position` properties
   * @private
   */
  static setPosition(item, position, relative, sorted, route, reason) {
    let updatedItems = sorted.array();
    Util.moveElementInArray(updatedItems, item, position, relative);
    updatedItems = updatedItems.map((r, i) => ({ id: r.id, position: i }));
    return route.patch({ data: updatedItems, reason }).then(() => updatedItems);
  }

  /**
   * Alternative to Node's `path.basename` that we have for some (probably stupid) reason.
   * @param {string} path Path to get the basename of
   * @param {string} [ext] File extension to remove
   * @returns {string} Basename of the path
   * @private
   */
  static basename(path, ext) {
    let f = splitPathRe.exec(path).slice(1)[2];
    if (ext && f.substr(-1 * ext.length) === ext) f = f.substr(0, f.length - ext.length);
    return f;
  }

  /**
   * Transforms a snowflake from a decimal string to a bit string.
   * @param  {Snowflake} num Snowflake to be transformed
   * @returns {string}
   * @private
   */
  static idToBinary(num) {
    let bin = '';
    let high = parseInt(num.slice(0, -10)) || 0;
    let low = parseInt(num.slice(-10));
    while (low > 0 || high > 0) {
      bin = String(low & 1) + bin;
      low = Math.floor(low / 2);
      if (high > 0) {
        low += 5000000000 * (high % 2);
        high = Math.floor(high / 2);
      }
    }
    return bin;
  }

  /**
   * Transforms a snowflake from a bit string to a decimal string.
   * @param  {string} num Bit string to be transformed
   * @returns {Snowflake}
   * @private
   */
  static binaryToID(num) {
    let dec = '';

    while (num.length > 50) {
      const high = parseInt(num.slice(0, -32), 2);
      const low = parseInt((high % 10).toString(2) + num.slice(-32), 2);

      dec = (low % 10).toString() + dec;
      num = Math.floor(high / 10).toString(2) + Math.floor(low / 10).toString(2).padStart(32, '0');
    }

    num = parseInt(num, 2);
    while (num > 0) {
      dec = (num % 10).toString() + dec;
      num = Math.floor(num / 10);
    }

    return dec;
  }

  /**
   * Creates a Promise that resolves after a specified duration.
   * @param {number} ms How long to wait before resolving (in milliseconds)
   * @returns {Promise<void>}
   * @private
   */
  static delayFor(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}

module.exports = Util;
