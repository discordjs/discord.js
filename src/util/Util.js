'use strict';

const { parse } = require('path');
const fetch = require('node-fetch');
const { Colors, DefaultOptions, Endpoints } = require('./Constants');
const { Error: DiscordError, RangeError, TypeError } = require('../errors');
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const isObject = d => typeof d === 'object' && d !== null;

/**
 * Contains various general-purpose utility methods. These functions are also available on the base `Discord` object.
 */
class Util {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Flatten an object. Any properties that are collections will get converted to an array of keys.
   * @param {Object} obj The object to flatten.
   * @param {...Object<string, boolean|string>} [props] Specific properties to include/exclude.
   * @returns {Object}
   */
  static flatten(obj, ...props) {
    if (!isObject(obj)) return obj;

    props = Object.assign(
      ...Object.keys(obj)
        .filter(k => !k.startsWith('_'))
        .map(k => ({ [k]: true })),
      ...props,
    );

    const out = {};

    for (let [prop, newProp] of Object.entries(props)) {
      if (!newProp) continue;
      newProp = newProp === true ? prop : newProp;

      const element = obj[prop];
      const elemIsObj = isObject(element);
      const valueOf = elemIsObj && typeof element.valueOf === 'function' ? element.valueOf() : null;

      // If it's a Collection, make the array of keys
      if (element instanceof require('./Collection')) out[newProp] = Array.from(element.keys());
      // If the valueOf is a Collection, use its array of keys
      else if (valueOf instanceof require('./Collection')) out[newProp] = Array.from(valueOf.keys());
      // If it's an array, flatten each element
      else if (Array.isArray(element)) out[newProp] = element.map(e => Util.flatten(e));
      // If it's an object with a primitive `valueOf`, use that value
      else if (typeof valueOf !== 'object') out[newProp] = valueOf;
      // If it's a primitive
      else if (!elemIsObj) out[newProp] = element;
    }

    return out;
  }

  /**
   * Splits a string into multiple chunks at a designated character that do not exceed a specific length.
   * @param {StringResolvable} text Content to split
   * @param {SplitOptions} [options] Options controlling the behavior of the split
   * @returns {string[]}
   */
  static splitMessage(text, { maxLength = 2000, char = '\n', prepend = '', append = '' } = {}) {
    text = Util.resolveString(text);
    if (text.length <= maxLength) return [text];
    const splitText = text.split(char);
    if (splitText.some(chunk => chunk.length > maxLength)) throw new RangeError('SPLIT_MAX_LEN');
    const messages = [];
    let msg = '';
    for (const chunk of splitText) {
      if (msg && (msg + char + chunk + append).length > maxLength) {
        messages.push(msg + append);
        msg = prepend;
      }
      msg += (msg && msg !== prepend ? char : '') + chunk;
    }
    return messages.concat(msg).filter(m => m);
  }

  /**
   * Escapes any Discord-flavour markdown in a string.
   * @param {string} text Content to escape
   * @param {Object} [options={}] What types of markdown to escape
   * @param {boolean} [options.codeBlock=true] Whether to escape code blocks or not
   * @param {boolean} [options.inlineCode=true] Whether to escape inline code or not
   * @param {boolean} [options.bold=true] Whether to escape bolds or not
   * @param {boolean} [options.italic=true] Whether to escape italics or not
   * @param {boolean} [options.underline=true] Whether to escape underlines or not
   * @param {boolean} [options.strikethrough=true] Whether to escape strikethroughs or not
   * @param {boolean} [options.spoiler=true] Whether to escape spoilers or not
   * @param {boolean} [options.codeBlockContent=true] Whether to escape text inside code blocks or not
   * @param {boolean} [options.inlineCodeContent=true] Whether to escape text inside inline code or not
   * @returns {string}
   */
  static escapeMarkdown(
    text,
    {
      codeBlock = true,
      inlineCode = true,
      bold = true,
      italic = true,
      underline = true,
      strikethrough = true,
      spoiler = true,
      codeBlockContent = true,
      inlineCodeContent = true,
    } = {},
  ) {
    if (!codeBlockContent) {
      return text
        .split('```')
        .map((subString, index, array) => {
          if (index % 2 && index !== array.length - 1) return subString;
          return Util.escapeMarkdown(subString, {
            inlineCode,
            bold,
            italic,
            underline,
            strikethrough,
            spoiler,
            inlineCodeContent,
          });
        })
        .join(codeBlock ? '\\`\\`\\`' : '```');
    }
    if (!inlineCodeContent) {
      return text
        .split(/(?<=^|[^`])`(?=[^`]|$)/g)
        .map((subString, index, array) => {
          if (index % 2 && index !== array.length - 1) return subString;
          return Util.escapeMarkdown(subString, {
            codeBlock,
            bold,
            italic,
            underline,
            strikethrough,
            spoiler,
          });
        })
        .join(inlineCode ? '\\`' : '`');
    }
    if (inlineCode) text = Util.escapeInlineCode(text);
    if (codeBlock) text = Util.escapeCodeBlock(text);
    if (italic) text = Util.escapeItalic(text);
    if (bold) text = Util.escapeBold(text);
    if (underline) text = Util.escapeUnderline(text);
    if (strikethrough) text = Util.escapeStrikethrough(text);
    if (spoiler) text = Util.escapeSpoiler(text);
    return text;
  }

  /**
   * Escapes code block markdown in a string.
   * @param {string} text Content to escape
   * @returns {string}
   */
  static escapeCodeBlock(text) {
    return text.replace(/```/g, '\\`\\`\\`');
  }

  /**
   * Escapes inline code markdown in a string.
   * @param {string} text Content to escape
   * @returns {string}
   */
  static escapeInlineCode(text) {
    return text.replace(/(?<=^|[^`])`(?=[^`]|$)/g, '\\`');
  }

  /**
   * Escapes italic markdown in a string.
   * @param {string} text Content to escape
   * @returns {string}
   */
  static escapeItalic(text) {
    let i = 0;
    text = text.replace(/(?<=^|[^*])\*([^*]|\*\*|$)/g, (_, match) => {
      if (match === '**') return ++i % 2 ? `\\*${match}` : `${match}\\*`;
      return `\\*${match}`;
    });
    i = 0;
    return text.replace(/(?<=^|[^_])_([^_]|__|$)/g, (_, match) => {
      if (match === '__') return ++i % 2 ? `\\_${match}` : `${match}\\_`;
      return `\\_${match}`;
    });
  }

  /**
   * Escapes bold markdown in a string.
   * @param {string} text Content to escape
   * @returns {string}
   */
  static escapeBold(text) {
    let i = 0;
    return text.replace(/\*\*(\*)?/g, (_, match) => {
      if (match) return ++i % 2 ? `${match}\\*\\*` : `\\*\\*${match}`;
      return '\\*\\*';
    });
  }

  /**
   * Escapes underline markdown in a string.
   * @param {string} text Content to escape
   * @returns {string}
   */
  static escapeUnderline(text) {
    let i = 0;
    return text.replace(/__(_)?/g, (_, match) => {
      if (match) return ++i % 2 ? `${match}\\_\\_` : `\\_\\_${match}`;
      return '\\_\\_';
    });
  }

  /**
   * Escapes strikethrough markdown in a string.
   * @param {string} text Content to escape
   * @returns {string}
   */
  static escapeStrikethrough(text) {
    return text.replace(/~~/g, '\\~\\~');
  }

  /**
   * Escapes spoiler markdown in a string.
   * @param {string} text Content to escape
   * @returns {string}
   */
  static escapeSpoiler(text) {
    return text.replace(/\|\|/g, '\\|\\|');
  }

  /**
   * Gets the recommended shard count from Discord.
   * @param {string} token Discord auth token
   * @param {number} [guildsPerShard=1000] Number of guilds per shard
   * @returns {Promise<number>} The recommended number of shards
   */
  static fetchRecommendedShards(token, guildsPerShard = 1000) {
    if (!token) throw new DiscordError('TOKEN_MISSING');
    return fetch(`${DefaultOptions.http.api}/v${DefaultOptions.http.version}${Endpoints.botGateway}`, {
      method: 'GET',
      headers: { Authorization: `Bot ${token.replace(/^Bot\s*/i, '')}` },
    })
      .then(res => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(data => data.shards * (1000 / guildsPerShard));
  }

  /**
   * Parses emoji info out of a string. The string must be one of:
   * * A UTF-8 emoji (no ID)
   * * A URL-encoded UTF-8 emoji (no ID)
   * * A Discord custom emoji (`<:name:id>` or `<a:name:id>`)
   * @param {string} text Emoji string to parse
   * @returns {Object} Object with `animated`, `name`, and `id` properties
   * @private
   */
  static parseEmoji(text) {
    if (text.includes('%')) text = decodeURIComponent(text);
    if (!text.includes(':')) return { animated: false, name: text, id: null };
    const m = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
    if (!m) return null;
    return { animated: Boolean(m[1]), name: m[2], id: m[3] || null };
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
        given[key] = Util.mergeDefault(def[key], given[key]);
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
    if (typeof ab === 'string') ab = Util.str2ab(ab);
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
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
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
    if (Array.isArray(data)) return data.join('\n');
    return String(data);
  }

  /**
   * Can be a number, hex string, an RGB array like:
   * ```js
   * [255, 0, 255] // purple
   * ```
   * or one of the following strings:
   * - `DEFAULT`
   * - `WHITE`
   * - `AQUA`
   * - `GREEN`
   * - `BLUE`
   * - `YELLOW`
   * - `PURPLE`
   * - `LUMINOUS_VIVID_PINK`
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
   * - `DARK_VIVID_PINK`
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
      if (color === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1));
      if (color === 'DEFAULT') return 0;
      color = Colors[color] || parseInt(color.replace('#', ''), 16);
    } else if (Array.isArray(color)) {
      color = (color[0] << 16) + (color[1] << 8) + color[2];
    }

    if (color < 0 || color > 0xffffff) throw new RangeError('COLOR_RANGE');
    else if (color && isNaN(color)) throw new TypeError('COLOR_CONVERT');

    return color;
  }

  /**
   * Sorts by Discord's position and ID.
   * @param  {Collection} collection Collection of objects to sort
   * @returns {Collection}
   */
  static discordSort(collection) {
    return collection.sorted(
      (a, b) =>
        a.rawPosition - b.rawPosition ||
        parseInt(b.id.slice(0, -10)) - parseInt(a.id.slice(0, -10)) ||
        parseInt(b.id.slice(10)) - parseInt(a.id.slice(10)),
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
   * Alternative to Node's `path.basename`, removing query string after the extension if it exists.
   * @param {string} path Path to get the basename of
   * @param {string} [ext] File extension to remove
   * @returns {string} Basename of the path
   * @private
   */
  static basename(path, ext) {
    let res = parse(path);
    return ext && res.ext.startsWith(ext) ? res.name : res.base.split('?')[0];
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
      num =
        Math.floor(high / 10).toString(2) +
        Math.floor(low / 10)
          .toString(2)
          .padStart(32, '0');
    }

    num = parseInt(num, 2);
    while (num > 0) {
      dec = (num % 10).toString() + dec;
      num = Math.floor(num / 10);
    }

    return dec;
  }

  /**
   * Breaks user, role and everyone/here mentions by adding a zero width space after every @ character
   * @param {string} str The string to sanitize
   * @returns {string}
   */
  static removeMentions(str) {
    return str.replace(/@/g, '@\u200b');
  }

  /**
   * The content to have all mentions replaced by the equivalent text.
   * @param {string} str The string to be converted
   * @param {Message} message The message object to reference
   * @returns {string}
   */
  static cleanContent(str, message) {
    if (message.client.options.disableMentions === 'everyone') {
      str = str.replace(/@([^<>@ ]*)/gmsu, (match, target) => {
        if (target.match(/^[&!]?\d+$/)) {
          return `@${target}`;
        } else {
          return `@\u200b${target}`;
        }
      });
    }
    str = str
      .replace(/<@!?[0-9]+>/g, input => {
        const id = input.replace(/<|!|>|@/g, '');
        if (message.channel.type === 'dm') {
          const user = message.client.users.cache.get(id);
          return user ? `@${user.username}` : input;
        }

        const member = message.channel.guild.members.cache.get(id);
        if (member) {
          return `@${member.displayName}`;
        } else {
          const user = message.client.users.cache.get(id);
          return user ? `@${user.username}` : input;
        }
      })
      .replace(/<#[0-9]+>/g, input => {
        const channel = message.client.channels.cache.get(input.replace(/<|#|>/g, ''));
        return channel ? `#${channel.name}` : input;
      })
      .replace(/<@&[0-9]+>/g, input => {
        if (message.channel.type === 'dm') return input;
        const role = message.guild.roles.cache.get(input.replace(/<|@|>|&/g, ''));
        return role ? `@${role.name}` : input;
      });
    if (message.client.options.disableMentions === 'all') {
      return Util.removeMentions(str);
    } else {
      return str;
    }
  }

  /**
   * The content to put in a codeblock with all codeblock fences replaced by the equivalent backticks.
   * @param {string} text The string to be converted
   * @returns {string}
   */
  static cleanCodeBlockContent(text) {
    return text.replace(/```/g, '`\u200b``');
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
