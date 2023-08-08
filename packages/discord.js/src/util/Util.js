'use strict';

const { parse } = require('node:path');
const { Collection } = require('@discordjs/collection');
const { ChannelType, RouteBases, Routes } = require('discord-api-types/v10');
const { fetch } = require('undici');
const Colors = require('./Colors');
const { DiscordjsError, DiscordjsRangeError, DiscordjsTypeError, ErrorCodes } = require('../errors');
const isObject = d => typeof d === 'object' && d !== null;

/**
 * Flatten an object. Any properties that are collections will get converted to an array of keys.
 * @param {Object} obj The object to flatten.
 * @param {...Object<string, boolean|string>} [props] Specific properties to include/exclude.
 * @returns {Object}
 */
function flatten(obj, ...props) {
  if (!isObject(obj)) return obj;

  const objProps = Object.keys(obj)
    .filter(k => !k.startsWith('_'))
    .map(k => ({ [k]: true }));

  props = objProps.length ? Object.assign(...objProps, ...props) : Object.assign({}, ...props);

  const out = {};

  for (let [prop, newProp] of Object.entries(props)) {
    if (!newProp) continue;
    newProp = newProp === true ? prop : newProp;

    const element = obj[prop];
    const elemIsObj = isObject(element);
    const valueOf = elemIsObj && typeof element.valueOf === 'function' ? element.valueOf() : null;
    const hasToJSON = elemIsObj && typeof element.toJSON === 'function';

    // If it's a Collection, make the array of keys
    if (element instanceof Collection) out[newProp] = Array.from(element.keys());
    // If the valueOf is a Collection, use its array of keys
    else if (valueOf instanceof Collection) out[newProp] = Array.from(valueOf.keys());
    // If it's an array, call toJSON function on each element if present, otherwise flatten each element
    else if (Array.isArray(element)) out[newProp] = element.map(e => e.toJSON?.() ?? flatten(e));
    // If it's an object with a primitive `valueOf`, use that value
    else if (typeof valueOf !== 'object') out[newProp] = valueOf;
    // If it's an object with a toJSON function, use the return value of it
    else if (hasToJSON) out[newProp] = element.toJSON();
    // If element is an object, use the flattened version of it
    else if (typeof element === 'object') out[newProp] = flatten(element);
    // If it's a primitive
    else if (!elemIsObj) out[newProp] = element;
  }

  return out;
}

/**
 * @typedef {Object} FetchRecommendedShardCountOptions
 * @property {number} [guildsPerShard=1000] Number of guilds assigned per shard
 * @property {number} [multipleOf=1] The multiple the shard count should round up to. (16 for large bot sharding)
 */

/**
 * Gets the recommended shard count from Discord.
 * @param {string} token Discord auth token
 * @param {FetchRecommendedShardCountOptions} [options] Options for fetching the recommended shard count
 * @returns {Promise<number>} The recommended number of shards
 */
async function fetchRecommendedShardCount(token, { guildsPerShard = 1_000, multipleOf = 1 } = {}) {
  if (!token) throw new DiscordjsError(ErrorCodes.TokenMissing);
  const response = await fetch(RouteBases.api + Routes.gatewayBot(), {
    method: 'GET',
    headers: { Authorization: `Bot ${token.replace(/^Bot\s*/i, '')}` },
  });
  if (!response.ok) {
    if (response.status === 401) throw new DiscordjsError(ErrorCodes.TokenInvalid);
    throw response;
  }
  const { shards } = await response.json();
  return Math.ceil((shards * (1_000 / guildsPerShard)) / multipleOf) * multipleOf;
}

/**
 * Parses emoji info out of a string. The string must be one of:
 * * A UTF-8 emoji (no id)
 * * A URL-encoded UTF-8 emoji (no id)
 * * A Discord custom emoji (`<:name:id>` or `<a:name:id>`)
 * @param {string} text Emoji string to parse
 * @returns {APIEmoji} Object with `animated`, `name`, and `id` properties
 */
function parseEmoji(text) {
  if (text.includes('%')) text = decodeURIComponent(text);
  if (!text.includes(':')) return { animated: false, name: text, id: undefined };
  const match = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
  return match && { animated: Boolean(match[1]), name: match[2], id: match[3] };
}

/**
 * Resolves a partial emoji object from an {@link EmojiIdentifierResolvable}, without checking a Client.
 * @param {EmojiIdentifierResolvable} emoji Emoji identifier to resolve
 * @returns {?RawEmoji}
 * @private
 */
function resolvePartialEmoji(emoji) {
  if (!emoji) return null;
  if (typeof emoji === 'string') return /^\d{17,19}$/.test(emoji) ? { id: emoji } : parseEmoji(emoji);
  const { id, name, animated } = emoji;
  if (!id && !name) return null;
  return { id, name, animated: Boolean(animated) };
}

/**
 * Sets default properties on an object that aren't already specified.
 * @param {Object} def Default properties
 * @param {Object} given Object to assign defaults to
 * @returns {Object}
 * @private
 */
function mergeDefault(def, given) {
  if (!given) return def;
  for (const key in def) {
    if (!Object.hasOwn(given, key) || given[key] === undefined) {
      given[key] = def[key];
    } else if (given[key] === Object(given[key])) {
      given[key] = mergeDefault(def[key], given[key]);
    }
  }

  return given;
}

/**
 * Options used to make an error object.
 * @typedef {Object} MakeErrorOptions
 * @property {string} name Error type
 * @property {string} message Message for the error
 * @property {string} stack Stack for the error
 */

/**
 * Makes an Error from a plain info object.
 * @param {MakeErrorOptions} obj Error info
 * @returns {Error}
 * @private
 */
function makeError(obj) {
  const err = new Error(obj.message);
  err.name = obj.name;
  err.stack = obj.stack;
  return err;
}

/**
 * Makes a plain error info object from an Error.
 * @param {Error} err Error to get info from
 * @returns {MakeErrorOptions}
 * @private
 */
function makePlainError(err) {
  return {
    name: err.name,
    message: err.message,
    stack: err.stack,
  };
}

const TextSortableGroupTypes = [ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.GuildForum];
const VoiceSortableGroupTypes = [ChannelType.GuildVoice, ChannelType.GuildStageVoice];
const CategorySortableGroupTypes = [ChannelType.GuildCategory];

/**
 * Gets an array of the channel types that can be moved in the channel group. For example, a GuildText channel would
 * return an array containing the types that can be ordered within the text channels (always at the top), and a voice
 * channel would return an array containing the types that can be ordered within the voice channels (always at the
 * bottom).
 * @param {ChannelType} type The type of the channel
 * @returns {ChannelType[]}
 * @private
 */
function getSortableGroupTypes(type) {
  switch (type) {
    case ChannelType.GuildText:
    case ChannelType.GuildAnnouncement:
    case ChannelType.GuildForum:
      return TextSortableGroupTypes;
    case ChannelType.GuildVoice:
    case ChannelType.GuildStageVoice:
      return VoiceSortableGroupTypes;
    case ChannelType.GuildCategory:
      return CategorySortableGroupTypes;
    default:
      return [type];
  }
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
function moveElementInArray(array, element, newIndex, offset = false) {
  const index = array.indexOf(element);
  newIndex = (offset ? index : 0) + newIndex;
  if (newIndex > -1 && newIndex < array.length) {
    const removedElement = array.splice(index, 1)[0];
    array.splice(newIndex, 0, removedElement);
  }
  return array.indexOf(element);
}

/**
 * Verifies the provided data is a string, otherwise throws provided error.
 * @param {string} data The string resolvable to resolve
 * @param {Function} [error] The Error constructor to instantiate. Defaults to Error
 * @param {string} [errorMessage] The error message to throw with. Defaults to "Expected string, got <data> instead."
 * @param {boolean} [allowEmpty=true] Whether an empty string should be allowed
 * @returns {string}
 */
function verifyString(
  data,
  error = Error,
  errorMessage = `Expected a string, got ${data} instead.`,
  allowEmpty = true,
) {
  if (typeof data !== 'string') throw new error(errorMessage);
  if (!allowEmpty && data.length === 0) throw new error(errorMessage);
  return data;
}

/**
 * Can be a number, hex string, an RGB array like:
 * ```js
 * [255, 0, 255] // purple
 * ```
 * or HSV object like:
 * ```js
 * { h: 30, s: 100, v: 100 }
 * ```
 * or HSL object like:
 * ```js
 * { h: 30, s: 100, l: 50 }
 * ```
 * or one of the following strings:
 * - `Default`
 * - `White`
 * - `Aqua`
 * - `Green`
 * - `Blue`
 * - `Yellow`
 * - `Purple`
 * - `LuminousVividPink`
 * - `Fuchsia`
 * - `Gold`
 * - `Orange`
 * - `Red`
 * - `Grey`
 * - `Navy`
 * - `DarkAqua`
 * - `DarkGreen`
 * - `DarkBlue`
 * - `DarkPurple`
 * - `DarkVividPink`
 * - `DarkGold`
 * - `DarkOrange`
 * - `DarkRed`
 * - `DarkGrey`
 * - `DarkerGrey`
 * - `LightGrey`
 * - `DarkNavy`
 * - `Blurple`
 * - `Greyple`
 * - `DarkButNotBlack`
 * - `NotQuiteBlack`
 * - `Random`
 * @typedef {string|number|number[]} ColorResolvable
 */

/**
 * Resolves a ColorResolvable into a color number.
 * @param {ColorResolvable} color Color to resolve
 * @returns {number} A color
 */
function resolveColor(color) {
  if (typeof color === 'string') {
    if (color === 'Random') return Math.floor(Math.random() * (0xffffff + 1));
    if (color === 'Default') return 0;
    
    if (/^#?[\da-f]{6}$/i.test(color)) {
      return parseInt(color.replace('#', ''), 16);
    }
    
    color = Colors[color];
  } else if (Array.isArray(color)) {
    if (color.length === 3) {
      return (color[0] << 16) + (color[1] << 8) + color[2];
    } else if (color.length === 4) {
      return (color[0] << 24) + (color[1] << 16) + (color[2] << 8) + color[3];
    }
  } else if (typeof color === 'object' && color !== null) {
    if (color.hasOwnProperty('r') && color.hasOwnProperty('g') && color.hasOwnProperty('b')) {
      return (color.r << 16) + (color.g << 8) + color.b;
    }
    
    if (color.hasOwnProperty('h') && color.hasOwnProperty('s') && color.hasOwnProperty('l')) {
      const rgb = hslToRgb(color.h, color.s, color.l);
      return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
    }
    
    if (color.hasOwnProperty('h') && color.hasOwnProperty('s') && color.hasOwnProperty('v')) {
      const rgb = hsvToRgb(color.h, color.s, color.v);
      return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
    }
  }

  if (color < 0 || color > 0xffffff) throw new DiscordjsRangeError(ErrorCodes.ColorRange);
  if (typeof color !== 'number' || Number.isNaN(color)) throw new DiscordjsTypeError(ErrorCodes.ColorConvert);

  return color;
}

/**
 * Converts HSL (Hue, Saturation, Lightness) color to RGB color.
 *
 * @param {number} h - The hue value in degrees (0-360).
 * @param {number} s - The saturation value in percentage (0-100).
 * @param {number} l - The lightness value in percentage (0-100).
 * @returns {number[]} An array containing RGB values [r, g, b].
 */
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Converts HSV (Hue, Saturation, Value) color to RGB color.
 *
 * @param {number} h - The hue value in degrees (0-360).
 * @param {number} s - The saturation value in percentage (0-100).
 * @param {number} v - The value (brightness) value in percentage (0-100).
 * @returns {number[]} An array containing RGB values [r, g, b].
 */
function hsvToRgb(h, s, v) {
  h /= 360;
  s /= 100;
  v /= 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      return [Math.round(v * 255), Math.round(t * 255), Math.round(p * 255)];
    case 1:
      return [Math.round(q * 255), Math.round(v * 255), Math.round(p * 255)];
    case 2:
      return [Math.round(p * 255), Math.round(v * 255), Math.round(t * 255)];
    case 3:
      return [Math.round(p * 255), Math.round(q * 255), Math.round(v * 255)];
    case 4:
      return [Math.round(t * 255), Math.round(p * 255), Math.round(v * 255)];
    case 5:
      return [Math.round(v * 255), Math.round(p * 255), Math.round(q * 255)];
    default:
      return [0, 0, 0];
  }
}

/**
 * Sorts by Discord's position and id.
 * @param {Collection} collection Collection of objects to sort
 * @returns {Collection}
 */
function discordSort(collection) {
  const isGuildChannel = collection.first() instanceof GuildChannel;
  return collection.sorted(
    isGuildChannel
      ? (a, b) => a.rawPosition - b.rawPosition || Number(BigInt(a.id) - BigInt(b.id))
      : (a, b) => a.rawPosition - b.rawPosition || Number(BigInt(b.id) - BigInt(a.id)),
  );
}

/**
 * Sets the position of a Channel or Role.
 * @param {BaseChannel|Role} item Object to set the position of
 * @param {number} position New position for the object
 * @param {boolean} relative Whether `position` is relative to its current position
 * @param {Collection<string, BaseChannel|Role>} sorted A collection of the objects sorted properly
 * @param {Client} client The client to use to patch the data
 * @param {string} route Route to call PATCH on
 * @param {string} [reason] Reason for the change
 * @returns {Promise<BaseChannel[]|Role[]>} Updated item list, with `id` and `position` properties
 * @private
 */
async function setPosition(item, position, relative, sorted, client, route, reason) {
  let updatedItems = [...sorted.values()];
  moveElementInArray(updatedItems, item, position, relative);
  updatedItems = updatedItems.map((r, i) => ({ id: r.id, position: i }));
  await client.rest.patch(route, { body: updatedItems, reason });
  return updatedItems;
}

/**
 * Alternative to Node's `path.basename`, removing query string after the extension if it exists.
 * @param {string} path Path to get the basename of
 * @param {string} [ext] File extension to remove
 * @returns {string} Basename of the path
 * @private
 */
function basename(path, ext) {
  const res = parse(path);
  return ext && res.ext.startsWith(ext) ? res.name : res.base.split('?')[0];
}

/**
 * The content to have all mentions replaced by the equivalent text.
 * @param {string} str The string to be converted
 * @param {TextBasedChannels} channel The channel the string was sent in
 * @returns {string}
 */
function cleanContent(str, channel) {
  return str.replaceAll(/<(@[!&]?|#)(\d{17,19})>/g, (match, type, id) => {
    switch (type) {
      case '@':
      case '@!': {
        const member = channel.guild?.members.cache.get(id);
        if (member) {
          return `@${member.displayName}`;
        }

        const user = channel.client.users.cache.get(id);
        return user ? `@${user.username}` : match;
      }
      case '@&': {
        if (channel.type === ChannelType.DM) return match;
        const role = channel.guild.roles.cache.get(id);
        return role ? `@${role.name}` : match;
      }
      case '#': {
        const mentionedChannel = channel.client.channels.cache.get(id);
        return mentionedChannel ? `#${mentionedChannel.name}` : match;
      }
      default: {
        return match;
      }
    }
  });
}

/**
 * The content to put in a code block with all code block fences replaced by the equivalent backticks.
 * @param {string} text The string to be converted
 * @returns {string}
 */
function cleanCodeBlockContent(text) {
  return text.replaceAll('```', '`\u200b``');
}

/**
 * Parses a webhook URL for the id and token.
 * @param {string} url The URL to parse
 * @returns {?WebhookClientDataIdWithToken} `null` if the URL is invalid, otherwise the id and the token
 */
function parseWebhookURL(url) {
  const matches = url.match(
    /https?:\/\/(?:ptb\.|canary\.)?discord\.com\/api(?:\/v\d{1,2})?\/webhooks\/(\d{17,19})\/([\w-]{68})/i,
  );

  if (!matches || matches.length <= 2) return null;

  const [, id, token] = matches;
  return {
    id,
    token,
  };
}

module.exports = {
  flatten,
  fetchRecommendedShardCount,
  parseEmoji,
  resolvePartialEmoji,
  mergeDefault,
  makeError,
  makePlainError,
  getSortableGroupTypes,
  moveElementInArray,
  verifyString,
  resolveColor,
  discordSort,
  setPosition,
  basename,
  cleanContent,
  cleanCodeBlockContent,
  parseWebhookURL,
};

// Fixes Circular
const GuildChannel = require('../structures/GuildChannel');
