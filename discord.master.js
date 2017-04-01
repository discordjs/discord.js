/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 145);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {exports.Package = __webpack_require__(28);

/**
 * Options for a Client.
 * @typedef {Object} ClientOptions
 * @property {string} [apiRequestMethod='sequential'] One of `sequential` or `burst`. The sequential handler executes
 * all requests in the order they are triggered, whereas the burst handler runs multiple in parallel, and doesn't
 * provide the guarantee of any particular order. Burst mode is more likely to hit a 429 ratelimit error by its nature,
 * and is therefore slightly riskier to use.
 * @property {number} [shardId=0] ID of the shard to run
 * @property {number} [shardCount=0] Total number of shards
 * @property {number} [messageCacheMaxSize=200] Maximum number of messages to cache per channel
 * (-1 or Infinity for unlimited - don't do this without message sweeping, otherwise memory usage will climb
 * indefinitely)
 * @property {number} [messageCacheLifetime=0] How long a message should stay in the cache until it is considered
 * sweepable (in seconds, 0 for forever)
 * @property {number} [messageSweepInterval=0] How frequently to remove messages from the cache that are older than
 * the message cache lifetime (in seconds, 0 for never)
 * @property {boolean} [fetchAllMembers=false] Whether to cache all guild members and users upon startup, as well as
 * upon joining a guild (should be avoided whenever possible)
 * @property {boolean} [disableEveryone=false] Default value for {@link MessageOptions#disableEveryone}
 * @property {boolean} [sync=false] Whether to periodically sync guilds (for user accounts)
 * @property {number} [restWsBridgeTimeout=5000] Maximum time permitted between REST responses and their
 * corresponding websocket events
 * @property {number} [restTimeOffset=500] Extra time in millseconds to wait before continuing to make REST
 * requests (higher values will reduce rate-limiting errors on bad connections)
 * @property {WSEventType[]} [disabledEvents] An array of disabled websocket events. Events in this array will not be
 * processed, potentially resulting in performance improvements for larger bots. Only disable events you are
 * 100% certain you don't need, as many are important, but not obviously so. The safest one to disable with the
 * most impact is typically `TYPING_START`.
 * @property {WebsocketOptions} [ws] Options for the websocket
 */
exports.DefaultOptions = {
  apiRequestMethod: 'sequential',
  shardId: 0,
  shardCount: 0,
  messageCacheMaxSize: 200,
  messageCacheLifetime: 0,
  messageSweepInterval: 0,
  fetchAllMembers: false,
  disableEveryone: false,
  sync: false,
  restWsBridgeTimeout: 5000,
  disabledEvents: [],
  restTimeOffset: 500,

  /**
   * Websocket options (these are left as snake_case to match the API)
   * @typedef {Object} WebsocketOptions
   * @property {number} [large_threshold=250] Number of members in a guild to be considered large
   * @property {boolean} [compress=true] Whether to compress data sent on the connection
   * (defaults to `false` for browsers)
   */
  ws: {
    large_threshold: 250,
    compress: __webpack_require__(15).platform() !== 'browser',
    properties: {
      $os: process ? process.platform : 'discord.js',
      $browser: 'discord.js',
      $device: 'discord.js',
      $referrer: '',
      $referring_domain: '',
    },
    version: 6,
  },
  http: {
    version: 6,
    host: 'https://discordapp.com',
    cdn: 'https://cdn.discordapp.com',
  },
};

exports.Errors = {
  NO_TOKEN: 'Request to use token, but token was unavailable to the client.',
  NO_BOT_ACCOUNT: 'Only bot accounts are able to make use of this feature.',
  NO_USER_ACCOUNT: 'Only user accounts are able to make use of this feature.',
  BAD_WS_MESSAGE: 'A bad message was received from the websocket; either bad compression, or not JSON.',
  TOOK_TOO_LONG: 'Something took too long to do.',
  NOT_A_PERMISSION: 'Invalid permission string or number.',
  INVALID_RATE_LIMIT_METHOD: 'Unknown rate limiting method.',
  BAD_LOGIN: 'Incorrect login details were provided.',
  INVALID_SHARD: 'Invalid shard settings were provided.',
  SHARDING_REQUIRED: 'This session would have handled too many guilds - Sharding is required.',
  INVALID_TOKEN: 'An invalid token was provided.',
};

const Endpoints = exports.Endpoints = {
  User: userID => {
    if (userID.id) userID = userID.id;
    const base = `/users/${userID}`;
    return {
      toString: () => base,
      channels: `${base}/channels`,
      profile: `${base}/profile`,
      relationships: `${base}/relationships`,
      Relationship: uID => `${base}/relationships/${uID}`,
      Guild: guildID => `${base}/guilds/${guildID}`,
      Note: id => `${base}/notes/${id}`,
      Mentions: (limit, roles, everyone, guildID) =>
        `${base}/mentions?limit=${limit}&roles=${roles}&everyone=${everyone}${guildID ? `&guild_id=${guildID}` : ''}`,
      Avatar: (root, hash) => {
        if (userID === '1') return hash;
        return Endpoints.CDN(root).Avatar(userID, hash);
      },
    };
  },
  guilds: '/guilds',
  Guild: guildID => {
    if (guildID.id) guildID = guildID.id;
    const base = `/guilds/${guildID}`;
    return {
      toString: () => base,
      prune: `${base}/prune`,
      embed: `${base}/embed`,
      bans: `${base}/bans`,
      integrations: `${base}/integrations`,
      members: `${base}/members`,
      channels: `${base}/channels`,
      invites: `${base}/invites`,
      roles: `${base}/roles`,
      emojis: `${base}/emojis`,
      search: `${base}/messages/search`,
      voiceRegions: `${base}/regions`,
      webhooks: `${base}/webhooks`,
      ack: `${base}/ack`,
      settings: `${base}/settings`,
      Emoji: emojiID => `${base}/emojis/${emojiID}`,
      Icon: (root, hash) => Endpoints.CDN(root).Icon(guildID, hash),
      Splash: (root, hash) => Endpoints.CDN(root).Splash(guildID, hash),
      Role: roleID => `${base}/roles/${roleID}`,
      Member: memberID => {
        if (memberID.id) memberID = memberID.id;
        const mbase = `${base}/members/${memberID}`;
        return {
          toString: () => mbase,
          Role: roleID => `${mbase}/roles/${roleID}`,
          nickname: `${base}/members/@me/nick`,
        };
      },
    };
  },
  channels: '/channels',
  Channel: channelID => {
    if (channelID.id) channelID = channelID.id;
    const base = `/channels/${channelID}`;
    return {
      toString: () => base,
      messages: {
        toString: () => `${base}/messages`,
        bulkDelete: `${base}/messages/bulk-delete`,
      },
      invites: `${base}/invites`,
      typing: `${base}/typing`,
      permissions: `${base}/permissions`,
      webhooks: `${base}/webhooks`,
      search: `${base}/search`,
      ack: `${base}/ack`,
      pins: `${base}/pins`,
      Pin: messageID => `${base}/pins/${messageID}`,
      Recipient: recipientID => `${base}/recipients/${recipientID}`,
      Message: messageID => {
        if (messageID.id) messageID = messageID.id;
        const mbase = `${base}/messages/${messageID}`;
        return {
          toString: () => mbase,
          reactions: `${mbase}/reactions`,
          ack: `${base}/ack`,
          Reaction: (emoji, limit) => {
            const rbase = `${mbase}/reactions/${emoji}${limit ? `?limit=${limit}` : ''}`;
            return {
              toString: () => rbase,
              User: userID => `${rbase}/${userID}`,
            };
          },
        };
      },
    };
  },
  Message: m => exports.Endpoints.Channel(m.channel).Message(m),
  Member: m => exports.Endpoints.Guild(m.guild).Member(m),
  CDN(root) {
    return {
      Emoji: emojiID => `${root}/emojis/$${emojiID}.png`,
      Asset: name => `${root}/assets/${name}`,
      Avatar: (userID, hash) => `${root}/avatars/${userID}/${hash}.${hash.startsWith('a_') ? 'gif' : 'png'}?size=2048`,
      Icon: (guildID, hash) => `${root}/icons/${guildID}/${hash}.jpg`,
      Splash: (guildID, hash) => `${root}/splashes/${guildID}/${hash}.jpg`,
    };
  },
  OAUTH2: {
    Application: appID => {
      const base = `/oauth2/applications/${appID}`;
      return {
        toString: () => base,
        reset: `${base}/reset`,
      };
    },
    App: appID => `/oauth2/authorize?client_id=${appID}`,
  },
  login: '/auth/login',
  logout: '/auth/logout',
  voiceRegions: '/voice/regions',
  gateway: {
    toString: () => '/gateway',
    bot: '/gateway/bot',
  },
  Invite: inviteID => `/invite/${inviteID}`,
  Webhook: (webhookID, token) => `/webhooks/${webhookID}${token ? `/${token}` : ''}`,
};


/**
 * The current status of the client. Here are the available statuses:
 * - READY
 * - CONNECTING
 * - RECONNECTING
 * - IDLE
 * - NEARLY
 * - DISCONNECTED
 * @typedef {number} Status
 */
exports.Status = {
  READY: 0,
  CONNECTING: 1,
  RECONNECTING: 2,
  IDLE: 3,
  NEARLY: 4,
  DISCONNECTED: 5,
};

/**
 * The current status of a voice connection. Here are the available statuses:
 * - CONNECTED
 * - CONNECTING
 * - AUTHENTICATING
 * - RECONNECTING
 * - DISCONNECTED
 * @typedef {number} VoiceStatus
 */
exports.VoiceStatus = {
  CONNECTED: 0,
  CONNECTING: 1,
  AUTHENTICATING: 2,
  RECONNECTING: 3,
  DISCONNECTED: 4,
};

exports.ChannelTypes = {
  TEXT: 0,
  DM: 1,
  VOICE: 2,
  GROUP_DM: 3,
};

exports.OPCodes = {
  DISPATCH: 0,
  HEARTBEAT: 1,
  IDENTIFY: 2,
  STATUS_UPDATE: 3,
  VOICE_STATE_UPDATE: 4,
  VOICE_GUILD_PING: 5,
  RESUME: 6,
  RECONNECT: 7,
  REQUEST_GUILD_MEMBERS: 8,
  INVALID_SESSION: 9,
  HELLO: 10,
  HEARTBEAT_ACK: 11,
};

exports.VoiceOPCodes = {
  IDENTIFY: 0,
  SELECT_PROTOCOL: 1,
  READY: 2,
  HEARTBEAT: 3,
  SESSION_DESCRIPTION: 4,
  SPEAKING: 5,
};

exports.Events = {
  READY: 'ready',
  GUILD_CREATE: 'guildCreate',
  GUILD_DELETE: 'guildDelete',
  GUILD_UPDATE: 'guildUpdate',
  GUILD_UNAVAILABLE: 'guildUnavailable',
  GUILD_AVAILABLE: 'guildAvailable',
  GUILD_MEMBER_ADD: 'guildMemberAdd',
  GUILD_MEMBER_REMOVE: 'guildMemberRemove',
  GUILD_MEMBER_UPDATE: 'guildMemberUpdate',
  GUILD_MEMBER_AVAILABLE: 'guildMemberAvailable',
  GUILD_MEMBER_SPEAKING: 'guildMemberSpeaking',
  GUILD_MEMBERS_CHUNK: 'guildMembersChunk',
  GUILD_ROLE_CREATE: 'roleCreate',
  GUILD_ROLE_DELETE: 'roleDelete',
  GUILD_ROLE_UPDATE: 'roleUpdate',
  GUILD_EMOJI_CREATE: 'emojiCreate',
  GUILD_EMOJI_DELETE: 'emojiDelete',
  GUILD_EMOJI_UPDATE: 'emojiUpdate',
  GUILD_BAN_ADD: 'guildBanAdd',
  GUILD_BAN_REMOVE: 'guildBanRemove',
  CHANNEL_CREATE: 'channelCreate',
  CHANNEL_DELETE: 'channelDelete',
  CHANNEL_UPDATE: 'channelUpdate',
  CHANNEL_PINS_UPDATE: 'channelPinsUpdate',
  MESSAGE_CREATE: 'message',
  MESSAGE_DELETE: 'messageDelete',
  MESSAGE_UPDATE: 'messageUpdate',
  MESSAGE_BULK_DELETE: 'messageDeleteBulk',
  MESSAGE_REACTION_ADD: 'messageReactionAdd',
  MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
  MESSAGE_REACTION_REMOVE_ALL: 'messageReactionRemoveAll',
  USER_UPDATE: 'userUpdate',
  USER_NOTE_UPDATE: 'userNoteUpdate',
  PRESENCE_UPDATE: 'presenceUpdate',
  VOICE_STATE_UPDATE: 'voiceStateUpdate',
  TYPING_START: 'typingStart',
  TYPING_STOP: 'typingStop',
  DISCONNECT: 'disconnect',
  RECONNECTING: 'reconnecting',
  ERROR: 'error',
  WARN: 'warn',
  DEBUG: 'debug',
};

/**
 * The type of a websocket message event, e.g. `MESSAGE_CREATE`. Here are the available events:
 * - READY
 * - GUILD_SYNC
 * - GUILD_CREATE
 * - GUILD_DELETE
 * - GUILD_UPDATE
 * - GUILD_MEMBER_ADD
 * - GUILD_MEMBER_REMOVE
 * - GUILD_MEMBER_UPDATE
 * - GUILD_MEMBERS_CHUNK
 * - GUILD_ROLE_CREATE
 * - GUILD_ROLE_DELETE
 * - GUILD_ROLE_UPDATE
 * - GUILD_BAN_ADD
 * - GUILD_BAN_REMOVE
 * - CHANNEL_CREATE
 * - CHANNEL_DELETE
 * - CHANNEL_UPDATE
 * - CHANNEL_PINS_UPDATE
 * - MESSAGE_CREATE
 * - MESSAGE_DELETE
 * - MESSAGE_UPDATE
 * - MESSAGE_DELETE_BULK
 * - MESSAGE_REACTION_ADD
 * - MESSAGE_REACTION_REMOVE
 * - MESSAGE_REACTION_REMOVE_ALL
 * - USER_UPDATE
 * - USER_NOTE_UPDATE
 * - PRESENCE_UPDATE
 * - VOICE_STATE_UPDATE
 * - TYPING_START
 * - VOICE_SERVER_UPDATE
 * - RELATIONSHIP_ADD
 * - RELATIONSHIP_REMOVE
 * @typedef {string} WSEventType
 */
exports.WSEvents = {
  READY: 'READY',
  GUILD_SYNC: 'GUILD_SYNC',
  GUILD_CREATE: 'GUILD_CREATE',
  GUILD_DELETE: 'GUILD_DELETE',
  GUILD_UPDATE: 'GUILD_UPDATE',
  GUILD_MEMBER_ADD: 'GUILD_MEMBER_ADD',
  GUILD_MEMBER_REMOVE: 'GUILD_MEMBER_REMOVE',
  GUILD_MEMBER_UPDATE: 'GUILD_MEMBER_UPDATE',
  GUILD_MEMBERS_CHUNK: 'GUILD_MEMBERS_CHUNK',
  GUILD_ROLE_CREATE: 'GUILD_ROLE_CREATE',
  GUILD_ROLE_DELETE: 'GUILD_ROLE_DELETE',
  GUILD_ROLE_UPDATE: 'GUILD_ROLE_UPDATE',
  GUILD_BAN_ADD: 'GUILD_BAN_ADD',
  GUILD_BAN_REMOVE: 'GUILD_BAN_REMOVE',
  GUILD_EMOJIS_UPDATE: 'GUILD_EMOJIS_UPDATE',
  CHANNEL_CREATE: 'CHANNEL_CREATE',
  CHANNEL_DELETE: 'CHANNEL_DELETE',
  CHANNEL_UPDATE: 'CHANNEL_UPDATE',
  CHANNEL_PINS_UPDATE: 'CHANNEL_PINS_UPDATE',
  MESSAGE_CREATE: 'MESSAGE_CREATE',
  MESSAGE_DELETE: 'MESSAGE_DELETE',
  MESSAGE_UPDATE: 'MESSAGE_UPDATE',
  MESSAGE_DELETE_BULK: 'MESSAGE_DELETE_BULK',
  MESSAGE_REACTION_ADD: 'MESSAGE_REACTION_ADD',
  MESSAGE_REACTION_REMOVE: 'MESSAGE_REACTION_REMOVE',
  MESSAGE_REACTION_REMOVE_ALL: 'MESSAGE_REACTION_REMOVE_ALL',
  USER_UPDATE: 'USER_UPDATE',
  USER_NOTE_UPDATE: 'USER_NOTE_UPDATE',
  PRESENCE_UPDATE: 'PRESENCE_UPDATE',
  VOICE_STATE_UPDATE: 'VOICE_STATE_UPDATE',
  TYPING_START: 'TYPING_START',
  VOICE_SERVER_UPDATE: 'VOICE_SERVER_UPDATE',
  RELATIONSHIP_ADD: 'RELATIONSHIP_ADD',
  RELATIONSHIP_REMOVE: 'RELATIONSHIP_REMOVE',
};

exports.MessageTypes = [
  'DEFAULT',
  'RECIPIENT_ADD',
  'RECIPIENT_REMOVE',
  'CALL',
  'CHANNEL_NAME_CHANGE',
  'CHANNEL_ICON_CHANGE',
  'PINS_ADD',
  'GUILD_MEMBER_JOIN',
];

exports.DefaultAvatars = {
  BLURPLE: '6debd47ed13483642cf09e832ed0bc1b',
  GREY: '322c936a8c8be1b803cd94861bdfa868',
  GREEN: 'dd4dbc0016779df1378e7812eabaa04d',
  ORANGE: '0e291f67c9274a1abdddeb3fd919cbaa',
  RED: '1cbd08c76f8af6dddce02c5138971129',
};

exports.Colors = {
  DEFAULT: 0x000000,
  AQUA: 0x1ABC9C,
  GREEN: 0x2ECC71,
  BLUE: 0x3498DB,
  PURPLE: 0x9B59B6,
  GOLD: 0xF1C40F,
  ORANGE: 0xE67E22,
  RED: 0xE74C3C,
  GREY: 0x95A5A6,
  NAVY: 0x34495E,
  DARK_AQUA: 0x11806A,
  DARK_GREEN: 0x1F8B4C,
  DARK_BLUE: 0x206694,
  DARK_PURPLE: 0x71368A,
  DARK_GOLD: 0xC27C0E,
  DARK_ORANGE: 0xA84300,
  DARK_RED: 0x992D22,
  DARK_GREY: 0x979C9F,
  DARKER_GREY: 0x7F8C8D,
  LIGHT_GREY: 0xBCC0C0,
  DARK_NAVY: 0x2C3E50,
  BLURPLE: 0x7289DA,
  GREYPLE: 0x99AAB5,
  DARK_BUT_NOT_BLACK: 0x2C2F33,
  NOT_QUITE_BLACK: 0x23272A,
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

class AbstractHandler {
  constructor(packetManager) {
    this.packetManager = packetManager;
  }

  handle(packet) {
    return packet;
  }
}

module.exports = AbstractHandler;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*

ABOUT ACTIONS

Actions are similar to WebSocket Packet Handlers, but since introducing
the REST API methods, in order to prevent rewriting code to handle data,
"actions" have been introduced. They're basically what Packet Handlers
used to be but they're strictly for manipulating data and making sure
that WebSocket events don't clash with REST methods.

*/

class GenericAction {
  constructor(client) {
    this.client = client;
  }

  handle(data) {
    return data;
  }
}

module.exports = GenericAction;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 * @extends {Map}
 */
class Collection extends Map {
  constructor(iterable) {
    super(iterable);

    /**
     * Cached array for the `array()` method - will be reset to `null` whenever `set()` or `delete()` are called.
     * @name Collection#_array
     * @type {?Array}
     * @private
     */
    Object.defineProperty(this, '_array', { value: null, writable: true, configurable: true });

    /**
     * Cached array for the `keyArray()` method - will be reset to `null` whenever `set()` or `delete()` are called.
     * @name Collection#_keyArray
     * @type {?Array}
     * @private
     */
    Object.defineProperty(this, '_keyArray', { value: null, writable: true, configurable: true });
  }

  set(key, val) {
    this._array = null;
    this._keyArray = null;
    return super.set(key, val);
  }

  delete(key) {
    this._array = null;
    this._keyArray = null;
    return super.delete(key);
  }

  /**
   * Creates an ordered array of the values of this collection, and caches it internally. The array will only be
   * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
   * itself. If you don't want this caching behaviour, use `Array.from(collection.values())` instead.
   * @returns {Array}
   */
  array() {
    if (!this._array || this._array.length !== this.size) this._array = Array.from(this.values());
    return this._array;
  }

  /**
   * Creates an ordered array of the keys of this collection, and caches it internally. The array will only be
   * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
   * itself. If you don't want this caching behaviour, use `Array.from(collection.keys())` instead.
   * @returns {Array}
   */
  keyArray() {
    if (!this._keyArray || this._keyArray.length !== this.size) this._keyArray = Array.from(this.keys());
    return this._keyArray;
  }

  /**
   * Obtains the first item in this collection.
   * @returns {*}
   */
  first() {
    return this.values().next().value;
  }

  /**
   * Obtains the first key in this collection.
   * @returns {*}
   */
  firstKey() {
    return this.keys().next().value;
  }

  /**
   * Obtains the last item in this collection. This relies on the `array()` method, and thus the caching mechanism
   * applies here as well.
   * @returns {*}
   */
  last() {
    const arr = this.array();
    return arr[arr.length - 1];
  }

  /**
   * Obtains the last key in this collection. This relies on the `keyArray()` method, and thus the caching mechanism
   * applies here as well.
   * @returns {*}
   */
  lastKey() {
    const arr = this.keyArray();
    return arr[arr.length - 1];
  }

  /**
   * Obtains a random item from this collection. This relies on the `array()` method, and thus the caching mechanism
   * applies here as well.
   * @returns {*}
   */
  random() {
    const arr = this.array();
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Obtains a random key from this collection. This relies on the `keyArray()` method, and thus the caching mechanism
   * applies here as well.
   * @returns {*}
   */
  randomKey() {
    const arr = this.keyArray();
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Searches for all items where their specified property's value is identical to the given value
   * (`item[prop] === value`).
   * @param {string} prop The property to test against
   * @param {*} value The expected value
   * @returns {Array}
   * @example
   * collection.findAll('username', 'Bob');
   */
  findAll(prop, value) {
    if (typeof prop !== 'string') throw new TypeError('Key must be a string.');
    if (typeof value === 'undefined') throw new Error('Value must be specified.');
    const results = [];
    for (const item of this.values()) {
      if (item[prop] === value) results.push(item);
    }
    return results;
  }

  /**
   * Searches for a single item where its specified property's value is identical to the given value
   * (`item[prop] === value`), or the given function returns a truthy value. In the latter case, this is identical to
   * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
   * <warn>All collections used in Discord.js are mapped using their `id` property, and if you want to find by id you
   * should use the `get` method. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get) for details.</warn>
   * @param {string|Function} propOrFn The property to test against, or the function to test with
   * @param {*} [value] The expected value - only applicable and required if using a property for the first argument
   * @returns {*}
   * @example
   * collection.find('username', 'Bob');
   * @example
   * collection.find(val => val.username === 'Bob');
   */
  find(propOrFn, value) {
    if (typeof propOrFn === 'string') {
      if (typeof value === 'undefined') throw new Error('Value must be specified.');
      for (const item of this.values()) {
        if (item[propOrFn] === value) return item;
      }
      return null;
    } else if (typeof propOrFn === 'function') {
      for (const [key, val] of this) {
        if (propOrFn(val, key, this)) return val;
      }
      return null;
    } else {
      throw new Error('First argument must be a property string or a function.');
    }
  }

  /* eslint-disable max-len */
  /**
   * Searches for the key of a single item where its specified property's value is identical to the given value
   * (`item[prop] === value`), or the given function returns a truthy value. In the latter case, this is identical to
   * [Array.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex).
   * @param {string|Function} propOrFn The property to test against, or the function to test with
   * @param {*} [value] The expected value - only applicable and required if using a property for the first argument
   * @returns {*}
   * @example
   * collection.findKey('username', 'Bob');
   * @example
   * collection.findKey(val => val.username === 'Bob');
   */
  /* eslint-enable max-len */
  findKey(propOrFn, value) {
    if (typeof propOrFn === 'string') {
      if (typeof value === 'undefined') throw new Error('Value must be specified.');
      for (const [key, val] of this) {
        if (val[propOrFn] === value) return key;
      }
      return null;
    } else if (typeof propOrFn === 'function') {
      for (const [key, val] of this) {
        if (propOrFn(val, key, this)) return key;
      }
      return null;
    } else {
      throw new Error('First argument must be a property string or a function.');
    }
  }

  /**
   * Searches for the existence of a single item where its specified property's value is identical to the given value
   * (`item[prop] === value`).
   * <warn>Do not use this to check for an item by its ID. Instead, use `collection.has(id)`. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has) for details.</warn>
   * @param {string} prop The property to test against
   * @param {*} value The expected value
   * @returns {boolean}
   * @example
   * if (collection.exists('username', 'Bob')) {
   *  console.log('user here!');
   * }
   */
  exists(prop, value) {
    return Boolean(this.find(prop, value));
  }

  /**
   * Identical to
   * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
   * but returns a Collection instead of an Array.
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {Object} [thisArg] Value to use as `this` when executing function
   * @returns {Collection}
   */
  filter(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const results = new Collection();
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val);
    }
    return results;
  }

  /**
   * Identical to
   * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {Object} [thisArg] Value to use as `this` when executing function
   * @returns {Array}
   */
  filterArray(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const results = [];
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.push(val);
    }
    return results;
  }

  /**
   * Identical to
   * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
   * @param {Function} fn Function that produces an element of the new array, taking three arguments
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {Array}
   */
  map(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const arr = new Array(this.size);
    let i = 0;
    for (const [key, val] of this) arr[i++] = fn(val, key, this);
    return arr;
  }

  /**
   * Identical to
   * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {Object} [thisArg] Value to use as `this` when executing function
   * @returns {boolean}
   */
  some(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return true;
    }
    return false;
  }

  /**
   * Identical to
   * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {Object} [thisArg] Value to use as `this` when executing function
   * @returns {boolean}
   */
  every(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false;
    }
    return true;
  }

  /**
   * Identical to
   * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
   * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
   * and `collection`
   * @param {*} [initialValue] Starting value for the accumulator
   * @returns {*}
   */
  reduce(fn, initialValue) {
    let accumulator;
    if (typeof initialValue !== 'undefined') {
      accumulator = initialValue;
      for (const [key, val] of this) accumulator = fn(accumulator, val, key, this);
    } else {
      let first = true;
      for (const [key, val] of this) {
        if (first) {
          accumulator = val;
          first = false;
          continue;
        }
        accumulator = fn(accumulator, val, key, this);
      }
    }
    return accumulator;
  }

  /**
   * Creates an identical shallow copy of this collection.
   * @returns {Collection}
   * @example const newColl = someColl.clone();
   */
  clone() {
    return new this.constructor(this);
  }

  /**
   * Combines this collection with others into a new collection. None of the source collections are modified.
   * @param {...Collection} collections Collections to merge
   * @returns {Collection}
   * @example const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
   */
  concat(...collections) {
    const newColl = this.clone();
    for (const coll of collections) {
      for (const [key, val] of coll) newColl.set(key, val);
    }
    return newColl;
  }

  /**
   * Calls the `delete()` method on all items that have it.
   * @returns {Promise[]}
   */
  deleteAll() {
    const returns = [];
    for (const item of this.values()) {
      if (item.delete) returns.push(item.delete());
    }
    return returns;
  }

  /**
   * Checks if this collection shares identical key-value pairings with another.
   * This is different to checking for equality using equal-signs, because
   * the collections may be different objects, but contain the same data.
   * @param {Collection} collection Collection to compare with
   * @returns {boolean} Whether the collections have identical contents
   */
  equals(collection) {
    if (!collection) return false;
    if (this === collection) return true;
    if (this.size !== collection.size) return false;
    return !this.find((value, key) => {
      const testVal = collection.get(key);
      return testVal !== value || (testVal === undefined && !collection.has(key));
    });
  }
}

module.exports = Collection;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {const superagent = __webpack_require__(25);
const Constants = __webpack_require__(0);

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
   * @returns {Promise<number>} the recommended number of shards
   */
  static fetchRecommendedShards(token, guildsPerShard = 1000) {
    return new Promise((resolve, reject) => {
      if (!token) throw new Error('A token must be provided.');
      superagent.get(Constants.Endpoints.gateway.bot)
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
   * Does some weird shit to test the equality of two arrays' elements.
   * <warn>Do not use. This will give your dog/cat severe untreatable cancer of the everything. RIP Fluffykins.</warn>
   * @param {Array<*>} a ????
   * @param {Array<*>} b ?????????
   * @returns {boolean}
   * @private
   */
  static arraysEqual(a, b) {
    if (a === b) return true;
    if (a.length !== b.length) return false;

    for (const itemInd in a) {
      const item = a[itemInd];
      const ind = b.indexOf(item);
      if (ind) b.splice(ind, 1);
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
   * Makes an Error from a plain info object
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
   * Makes a plain error info object from an Error
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
   * Moves an element in an array *in place*
   * @param {Array<*>} array Array to modify
   * @param {*} element Element to move
   * @param {number} newIndex Index or offset to move the element to
   * @param {boolean} [offset=false] Move the element by an offset amount rather than to a set index
   * @returns {Array<*>}
   * @private
   */
  static moveElementInArray(array, element, newIndex, offset = false) {
    const index = array.indexOf(element);
    newIndex = (offset ? index : 0) + newIndex;
    if (newIndex > -1 && newIndex < array.length) {
      const removedElement = array.splice(index, 1)[0];
      array.splice(newIndex, 0, removedElement);
    }
    return array;
  }
}

module.exports = Util;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22).Buffer))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Long = __webpack_require__(42);

// Discord epoch (2015-01-01T00:00:00.000Z)
const EPOCH = 1420070400000;
let INCREMENT = 0;

/**
 * A container for useful snowflake-related methods
 */
class SnowflakeUtil {
  /**
   * A Twitter snowflake, except the epoch is 2015-01-01T00:00:00.000Z
   * ```
   * If we have a snowflake '266241948824764416' we can represent it as binary:
   *
   * 64                                          22     17     12          0
   *  000000111011000111100001101001000101000000  00001  00000  000000000000
   *       number of ms since discord epoch       worker  pid    increment
   * ```
   * @typedef {string} Snowflake
   */

  /**
   * Generates a Discord snowflake
   * <info>This hardcodes the worker ID as 1 and the process ID as 0.</info>
   * @returns {Snowflake} The generated snowflake
   */
  static generate() {
    if (INCREMENT >= 4095) INCREMENT = 0;
    const BINARY = `${pad((Date.now() - EPOCH).toString(2), 42)}0000100000${pad((INCREMENT++).toString(2), 12)}`;
    return Long.fromString(BINARY, 2).toString();
  }

  /**
   * A deconstructed snowflake
   * @typedef {Object} DeconstructedSnowflake
   * @property {number} timestamp Timestamp the snowflake was created
   * @property {Date} date Date the snowflake was created
   * @property {number} workerID Worker ID in the snowflake
   * @property {number} processID Process ID in the snowflake
   * @property {number} increment Increment in the snowflake
   * @property {string} binary Binary representation of the snowflake
   */

  /**
   * Deconstructs a Discord snowflake
   * @param {Snowflake} snowflake Snowflake to deconstruct
   * @returns {DeconstructedSnowflake} Deconstructed snowflake
   */
  static deconstruct(snowflake) {
    const BINARY = pad(Long.fromString(snowflake).toString(2), 64);
    const res = {
      timestamp: parseInt(BINARY.substring(0, 42), 2) + EPOCH,
      workerID: parseInt(BINARY.substring(42, 47), 2),
      processID: parseInt(BINARY.substring(47, 52), 2),
      increment: parseInt(BINARY.substring(52, 64), 2),
      binary: BINARY,
    };
    Object.defineProperty(res, 'date', {
      get: function get() { return new Date(this.timestamp); },
      enumerable: true,
    });
    return res;
  }
}

function pad(v, n, c = '0') {
  return String(v).length >= n ? String(v) : (String(c).repeat(n) + v).slice(-n);
}

module.exports = SnowflakeUtil;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Constants = __webpack_require__(0);

/**
 * Data structure that makes it easy to interact with a permission bitfield. All {@link GuildMember}s have a set of
 * permissions in their guild, and each channel in the guild may also have {@link PermissionOverwrites} for the member
 * that override their default permissions.
 */
class Permissions {
  /**
   * @param {GuildMember} [member] Member the permissions are for **(deprecated)**
   * @param {number|PermissionResolvable[]} permissions Permissions or bitfield to read from
   */
  constructor(member, permissions) {
    permissions = typeof member === 'object' && !(member instanceof Array) ? permissions : member;

    /**
     * Member the permissions are for
     * @type {GuildMember}
     * @deprecated
     */
    this.member = typeof member === 'object' ? member : null;

    /**
     * Bitfield of the packed permissions
     * @type {number}
     */
    this.bitfield = typeof permissions === 'number' ? permissions : this.constructor.resolve(permissions);
  }

  /**
   * Bitfield of the packed permissions
   * @type {number}
   * @see {@link Permissions#bitfield}
   * @deprecated
   */
  get raw() {
    return this.bitfield;
  }

  set raw(raw) {
    this.bitfield = raw;
  }

  /**
   * Checks whether the bitfield has a permission, or multiple permissions.
   * @param {PermissionResolvable|PermissionResolvable[]} permission Permission(s) to check for
   * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
   * @returns {boolean}
   */
  has(permission, checkAdmin = true) {
    if (permission instanceof Array) return permission.every(p => this.has(p, checkAdmin));
    permission = this.constructor.resolve(permission);
    if (checkAdmin && (this.bitfield & this.constructor.FLAGS.ADMINISTRATOR) > 0) return true;
    return (this.bitfield & permission) === permission;
  }

  /**
   * Gets all given permissions that are missing from the bitfield.
   * @param {PermissionResolvable[]} permissions Permissions to check for
   * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
   * @returns {PermissionResolvable[]}
   */
  missing(permissions, checkAdmin = true) {
    return permissions.filter(p => !this.has(p, checkAdmin));
  }

  /**
   * Adds permissions to this one, creating a new instance to represent the new bitfield.
   * @param {...PermissionResolvable} permissions Permissions to add
   * @returns {Permissions}
   */
  add(...permissions) {
    let total = 0;
    for (let p = 0; p < permissions.length; p++) {
      const perm = this.constructor.resolve(permissions[p]);
      if ((this.bitfield & perm) !== perm) total |= perm;
    }
    return new this.constructor(this.member, this.bitfield | total);
  }

  /**
   * Removes permissions to this one, creating a new instance to represent the new bitfield.
   * @param {...PermissionResolvable} permissions Permissions to remove
   * @returns {Permissions}
   */
  remove(...permissions) {
    let total = 0;
    for (let p = 0; p < permissions.length; p++) {
      const perm = this.constructor.resolve(permissions[p]);
      if ((this.bitfield & perm) === perm) total |= perm;
    }
    return new this.constructor(this.member, this.bitfield & ~total);
  }

  /**
   * Gets an object mapping permission name (like `READ_MESSAGES`) to a {@link boolean} indicating whether the
   * permission is available.
   * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
   * @returns {Object}
   */
  serialize(checkAdmin = true) {
    const serialized = {};
    for (const perm in this.constructor.FLAGS) serialized[perm] = this.has(perm, checkAdmin);
    return serialized;
  }

  /**
   * Checks whether the user has a certain permission, e.g. `READ_MESSAGES`.
   * @param {PermissionResolvable} permission The permission to check for
   * @param {boolean} [explicit=false] Whether to require the user to explicitly have the exact permission
   * @returns {boolean}
   * @see {@link Permissions#has}
   * @deprecated
   */
  hasPermission(permission, explicit = false) {
    return this.has(permission, !explicit);
  }

  /**
   * Checks whether the user has all specified permissions.
   * @param {PermissionResolvable[]} permissions The permissions to check for
   * @param {boolean} [explicit=false] Whether to require the user to explicitly have the exact permissions
   * @returns {boolean}
   * @see {@link Permissions#has}
   * @deprecated
   */
  hasPermissions(permissions, explicit = false) {
    return this.has(permissions, !explicit);
  }

  /**
   * Checks whether the user has all specified permissions, and lists any missing permissions.
   * @param {PermissionResolvable[]} permissions The permissions to check for
   * @param {boolean} [explicit=false] Whether to require the user to explicitly have the exact permissions
   * @returns {PermissionResolvable[]}
   * @see {@link Permissions#missing}
   * @deprecated
   */
  missingPermissions(permissions, explicit = false) {
    return this.missing(permissions, !explicit);
  }

  /**
   * Data that can be resolved to give a permission number. This can be:
   * - A string (see {@link Permissions.flags})
   * - A permission number
   * @typedef {string|number} PermissionResolvable
   */

  /**
   * Resolves permissions to their numeric form.
   * @param {PermissionResolvable|PermissionResolvable[]} permission - Permission(s) to resolve
   * @returns {number}
   */
  static resolve(permission) {
    if (permission instanceof Array) return permission.map(p => this.resolve(p)).reduce((prev, p) => prev | p, 0);
    if (typeof permission === 'string') permission = this.FLAGS[permission];
    if (typeof permission !== 'number' || permission < 1) throw new RangeError(Constants.Errors.NOT_A_PERMISSION);
    return permission;
  }
}

/**
 * Numeric permission flags. All available properties:
 * - `ADMINISTRATOR` (implicitly has *all* permissions, and bypasses all channel overwrites)
 * - `CREATE_INSTANT_INVITE` (create invitations to the guild)
 * - `KICK_MEMBERS`
 * - `BAN_MEMBERS`
 * - `MANAGE_CHANNELS` (edit and reorder channels)
 * - `MANAGE_GUILD` (edit the guild information, region, etc.)
 * - `ADD_REACTIONS` (add new reactions to messages)
 * - `READ_MESSAGES`
 * - `SEND_MESSAGES`
 * - `SEND_TTS_MESSAGES`
 * - `MANAGE_MESSAGES` (delete messages and reactions)
 * - `EMBED_LINKS` (links posted will have a preview embedded)
 * - `ATTACH_FILES`
 * - `READ_MESSAGE_HISTORY` (view messages that were posted prior to opening Discord)
 * - `MENTION_EVERYONE`
 * - `USE_EXTERNAL_EMOJIS` (use emojis from different guilds)
 * - `EXTERNAL_EMOJIS` **(deprecated)**
 * - `CONNECT` (connect to a voice channel)
 * - `SPEAK` (speak in a voice channel)
 * - `MUTE_MEMBERS` (mute members across all voice channels)
 * - `DEAFEN_MEMBERS` (deafen members across all voice channels)
 * - `MOVE_MEMBERS` (move members between voice channels)
 * - `USE_VAD` (use voice activity detection)
 * - `CHANGE_NICKNAME`
 * - `MANAGE_NICKNAMES` (change other members' nicknames)
 * - `MANAGE_ROLES`
 * - `MANAGE_ROLES_OR_PERMISSIONS` **(deprecated)**
 * - `MANAGE_WEBHOOKS`
 * - `MANAGE_EMOJIS`
 * @type {Object}
 * @see {@link https://discordapp.com/developers/docs/topics/permissions}
 */
Permissions.FLAGS = {
  CREATE_INSTANT_INVITE: 1 << 0,
  KICK_MEMBERS: 1 << 1,
  BAN_MEMBERS: 1 << 2,
  ADMINISTRATOR: 1 << 3,
  MANAGE_CHANNELS: 1 << 4,
  MANAGE_GUILD: 1 << 5,
  ADD_REACTIONS: 1 << 6,

  READ_MESSAGES: 1 << 10,
  SEND_MESSAGES: 1 << 11,
  SEND_TTS_MESSAGES: 1 << 12,
  MANAGE_MESSAGES: 1 << 13,
  EMBED_LINKS: 1 << 14,
  ATTACH_FILES: 1 << 15,
  READ_MESSAGE_HISTORY: 1 << 16,
  MENTION_EVERYONE: 1 << 17,
  EXTERNAL_EMOJIS: 1 << 18,
  USE_EXTERNAL_EMOJIS: 1 << 18,

  CONNECT: 1 << 20,
  SPEAK: 1 << 21,
  MUTE_MEMBERS: 1 << 22,
  DEAFEN_MEMBERS: 1 << 23,
  MOVE_MEMBERS: 1 << 24,
  USE_VAD: 1 << 25,

  CHANGE_NICKNAME: 1 << 26,
  MANAGE_NICKNAMES: 1 << 27,
  MANAGE_ROLES: 1 << 28,
  MANAGE_ROLES_OR_PERMISSIONS: 1 << 28,
  MANAGE_WEBHOOKS: 1 << 29,
  MANAGE_EMOJIS: 1 << 30,
};

/**
 * Bitfield representing every permission combined
 * @type {number}
 */
Permissions.ALL = Object.keys(Permissions.FLAGS).reduce((all, p) => all | Permissions.FLAGS[p], 0);

/**
 * Bitfield representing the default permissions for users
 * @type {number}
 */
Permissions.DEFAULT = 104324097;

/**
 * @class EvaluatedPermissions
 * @classdesc The final evaluated permissions for a member in a channel
 * @see {@link Permissions}
 * @deprecated
 */

module.exports = Permissions;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/**
 * Represents a user's presence
 */
class Presence {
  constructor(data = {}) {
    /**
     * The status of the presence:
     *
     * * **`online`** - user is online
     * * **`offline`** - user is offline or invisible
     * * **`idle`** - user is AFK
     * * **`dnd`** - user is in Do not Disturb
     * @type {string}
     */
    this.status = data.status || 'offline';

    /**
     * The game that the user is playing, `null` if they aren't playing a game.
     * @type {?Game}
     */
    this.game = data.game ? new Game(data.game) : null;
  }

  update(data) {
    this.status = data.status || this.status;
    this.game = data.game ? new Game(data.game) : null;
  }

  /**
   * Whether this presence is equal to another
   * @param {Presence} presence Presence to compare with
   * @returns {boolean}
   */
  equals(presence) {
    return this === presence || (
      presence &&
      this.status === presence.status &&
      this.game ? this.game.equals(presence.game) : !presence.game
    );
  }
}

/**
 * Represents a game that is part of a user's presence.
 */
class Game {
  constructor(data) {
    /**
     * The name of the game being played
     * @type {string}
     */
    this.name = data.name;

    /**
     * The type of the game status
     * @type {number}
     */
    this.type = data.type;

    /**
     * If the game is being streamed, a link to the stream
     * @type {?string}
     */
    this.url = data.url || null;
  }

  /**
   * Whether or not the game is being streamed
   * @type {boolean}
   * @readonly
   */
  get streaming() {
    return this.type === 1;
  }

  /**
   * Whether this game is equal to another game
   * @param {Game} game Game to compare with
   * @returns {boolean}
   */
  equals(game) {
    return this === game || (
      game &&
      this.name === game.name &&
      this.type === game.type &&
      this.url === game.url
    );
  }
}

exports.Presence = Presence;
exports.Game = Game;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const Snowflake = __webpack_require__(5);

/**
 * Represents any channel on Discord
 */
class Channel {
  constructor(client, data) {
    /**
     * The client that instantiated the Channel
     * @name Channel#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The type of the channel, either:
     * * `dm` - a DM channel
     * * `group` - a Group DM channel
     * * `text` - a guild text channel
     * * `voice` - a guild voice channel
     * @type {string}
     */
    this.type = null;

    if (data) this.setup(data);
  }

  setup(data) {
    /**
     * The unique ID of the channel
     * @type {Snowflake}
     */
    this.id = data.id;
  }

  /**
   * The timestamp the channel was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the channel was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * Deletes the channel
   * @returns {Promise<Channel>}
   * @example
   * // delete the channel
   * channel.delete()
   *  .then() // success
   *  .catch(console.error); // log error
   */
  delete() {
    return this.client.rest.methods.deleteChannel(this);
  }
}

module.exports = Channel;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const Attachment = __webpack_require__(32);
const Embed = __webpack_require__(34);
const MessageReaction = __webpack_require__(35);
const Util = __webpack_require__(4);
const Collection = __webpack_require__(3);
const Constants = __webpack_require__(0);
const Permissions = __webpack_require__(6);
let GuildMember;

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
     * @type {Snowflake}
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
     * @type {?GuildMember}
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
    this.embeds = data.embeds.map(e => new Embed(this, e));

    /**
     * A collection of attachments in the message - e.g. Pictures - mapped by their ID.
     * @type {Collection<Snowflake, MessageAttachment>}
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
     * @property {Collection<Snowflake, User>} mentions.users Mentioned users, maps their ID to the user object.
     * @property {Collection<Snowflake, GuildMember>} mentions.members Mentioned members, maps their ID
     * to the member object.
     * @property {Collection<Snowflake, Role>} mentions.roles Mentioned roles, maps their ID to the role object.
     * @property {Collection<Snowflake, GuildChannel>} mentions.channels Mentioned channels,
     * maps their ID to the channel object.
     * @property {boolean} mentions.everyone Whether or not @everyone was mentioned.
     */
    this.mentions = {
      users: new Collection(),
      roles: new Collection(),
      channels: new Collection(),
      everyone: data.mention_everyone,
    };

    // Add user mentions
    for (const mention of data.mentions) {
      let user = this.client.users.get(mention.id);
      if (!user) user = this.client.dataManager.newUser(mention);
      this.mentions.users.set(user.id, user);
    }

    // Add getter for member mentions
    Object.defineProperty(this.mentions, 'members', {
      get: () => {
        if (this.channel.type !== 'text') return null;
        const members = new Collection();
        this.mentions.users.forEach(user => {
          const member = this.client.resolver.resolveGuildMember(this.channel.guild, user);
          if (member) members.set(member.id, member);
        });
        return members;
      },
    });

    // Add role mentions
    if (data.mention_roles) {
      for (const mention of data.mention_roles) {
        const role = this.channel.guild.roles.get(mention);
        if (role) this.mentions.roles.set(role.id, role);
      }
    }

    // Add channel mentions
    if (this.channel.type === 'text') {
      const channMentionsRaw = data.content.match(/<#([0-9]{14,20})>/g) || [];
      for (const raw of channMentionsRaw) {
        const chan = this.channel.guild.channels.get(raw.match(/([0-9]{14,20})/g)[0]);
        if (chan) this.mentions.channels.set(chan.id, chan);
      }
    }

    this._edits = [];

    /**
     * A collection of reactions to this message, mapped by the reaction "id".
     * @type {Collection<Snowflake, MessageReaction>}
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
     * @type {?Snowflake}
     */
    this.webhookID = data.webhook_id || null;

    /**
     * Whether this message is a hit in a search
     * @type {?boolean}
     */
    this.hit = typeof data.hit === 'boolean' ? data.hit : null;
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
      this.channel.permissionsFor(this.client.user).hasPermission(Permissions.FLAGS.MANAGE_MESSAGES)
    );
  }

  /**
   * Whether the message is pinnable by the client user.
   * @type {boolean}
   * @readonly
   */
  get pinnable() {
    return !this.guild ||
      this.channel.permissionsFor(this.client.user).hasPermission(Permissions.FLAGS.MANAGE_MESSAGES);
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
    // Lazy-loading is used here to get around a circular dependency that breaks things
    if (!GuildMember) GuildMember = __webpack_require__(13);
    if (this.mentions.everyone) return true;
    if (this.mentions.users.has(member.id)) return true;
    if (member instanceof GuildMember && member.roles.some(r => this.mentions.roles.has(r.id))) return true;
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
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
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
    content = Util.escapeMarkdown(this.client.resolver.resolveString(content), true);
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
   * @param {StringResolvable} [content] The content for the message
   * @param {MessageOptions} [options] The options to provide
   * @returns {Promise<Message|Message[]>}
   * @example
   * // reply to a message
   * message.reply('Hey, I\'m a reply!')
   *  .then(msg => console.log(`Sent a reply to ${msg.author}`))
   *  .catch(console.error);
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
   * Marks the message as read
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<Message>}
   */
  acknowledge() {
    return this.client.rest.methods.ackMessage(this);
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
    const emojiID = emoji.id ? `${emoji.name}:${emoji.id}` : encodeURIComponent(emoji.name);
    let reaction;
    if (this.reactions.has(emojiID)) {
      reaction = this.reactions.get(emojiID);
      if (!reaction.me) reaction.me = user.id === this.client.user.id;
    } else {
      reaction = new MessageReaction(this, emoji, 0, user.id === this.client.user.id);
      this.reactions.set(emojiID, reaction);
    }
    if (!reaction.users.has(user.id)) reaction.users.set(user.id, user);
    reaction.count++;
    return reaction;
  }

  _removeReaction(emoji, user) {
    const emojiID = emoji.id ? `${emoji.name}:${emoji.id}` : encodeURIComponent(emoji.name);
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


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const Snowflake = __webpack_require__(5);
const Permissions = __webpack_require__(6);

/**
 * Represents a role on Discord
 */
class Role {
  constructor(guild, data) {
    /**
     * The client that instantiated the role
     * @name Role#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: guild.client });

    /**
     * The guild that the role belongs to
     * @type {Guild}
     */
    this.guild = guild;

    if (data) this.setup(data);
  }

  setup(data) {
    /**
     * The ID of the role (unique to the guild it is part of)
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of the role
     * @type {string}
     */
    this.name = data.name;

    /**
     * The base 10 color of the role
     * @type {number}
     */
    this.color = data.color;

    /**
     * If true, users that are part of this role will appear in a separate category in the users list
     * @type {boolean}
     */
    this.hoist = data.hoist;

    /**
     * The position of the role from the API
     * @type {number}
     */
    this.position = data.position;

    /**
     * The permissions bitfield of the role
     * @type {number}
     */
    this.permissions = data.permissions;

    /**
     * Whether or not the role is managed by an external service
     * @type {boolean}
     */
    this.managed = data.managed;

    /**
     * Whether or not the role can be mentioned by anyone
     * @type {boolean}
     */
    this.mentionable = data.mentionable;
  }

  /**
   * The timestamp the role was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the role was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The hexadecimal version of the role color, with a leading hashtag.
   * @type {string}
   * @readonly
   */
  get hexColor() {
    let col = this.color.toString(16);
    while (col.length < 6) col = `0${col}`;
    return `#${col}`;
  }

  /**
   * The cached guild members that have this role.
   * @type {Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get members() {
    return this.guild.members.filter(m => m.roles.has(this.id));
  }

  /**
   * Whether the role is editable by the client user.
   * @type {boolean}
   * @readonly
   */
  get editable() {
    if (this.managed) return false;
    const clientMember = this.guild.member(this.client.user);
    if (!clientMember.hasPermission(Permissions.FLAGS.MANAGE_ROLES_OR_PERMISSIONS)) return false;
    return clientMember.highestRole.comparePositionTo(this) > 0;
  }

  /**
   * The position of the role in the role manager
   * @type {number}
   */
  get calculatedPosition() {
    const sorted = this.guild.roles.array()
      .sort((r1, r2) => r1.position !== r2.position ? r1.position - r2.position : r1.id - r2.id);
    return sorted.indexOf(sorted.find(r => r.id === this.id));
  }

  /**
   * Get an object mapping permission names to whether or not the role enables that permission
   * @returns {Object<string, boolean>}
   * @example
   * // print the serialized role permissions
   * console.log(role.serialize());
   */
  serialize() {
    return new Permissions(this.permissions).serialize();
  }

  /**
   * Checks if the role has a permission.
   * @param {PermissionResolvable|PermissionResolvable[]} permission Permission(s) to check for
   * @param {boolean} [explicit=false] Whether to require the role to explicitly have the exact permission
   * **(deprecated)**
   * @param {boolean} [checkAdmin] Whether to allow the administrator permission to override
   * (takes priority over `explicit`)
   * @returns {boolean}
   * @example
   * // see if a role can ban a member
   * if (role.hasPermission('BAN_MEMBERS')) {
   *   console.log('This role can ban members');
   * } else {
   *   console.log('This role can\'t ban members');
   * }
   */
  hasPermission(permission, explicit = false, checkAdmin) {
    return new Permissions(this.permissions).has(
      permission, typeof checkAdmin !== 'undefined' ? checkAdmin : !explicit
    );
  }

  /**
   * Checks if the role has all specified permissions.
   * @param {PermissionResolvable[]} permissions The permissions to check for
   * @param {boolean} [explicit=false] Whether to require the role to explicitly have the exact permissions
   * @returns {boolean}
   * @deprecated
   */
  hasPermissions(permissions, explicit = false) {
    return new Permissions(this.permissions).has(permissions, !explicit);
  }

  /**
   * Compares this role's position to another role's.
   * @param {Role} role Role to compare to this one
   * @returns {number} Negative number if the this role's position is lower (other role's is higher),
   * positive number if the this one is higher (other's is lower), 0 if equal
   */
  comparePositionTo(role) {
    return this.constructor.comparePositions(this, role);
  }

  /**
   * The data for a role
   * @typedef {Object} RoleData
   * @property {string} [name] The name of the role
   * @property {ColorResolvable} [color] The color of the role, either a hex string or a base 10 number
   * @property {boolean} [hoist] Whether or not the role should be hoisted
   * @property {number} [position] The position of the role
   * @property {string[]} [permissions] The permissions of the role
   * @property {boolean} [mentionable] Whether or not the role should be mentionable
   */

  /**
   * Edits the role
   * @param {RoleData} data The new data for the role
   * @returns {Promise<Role>}
   * @example
   * // edit a role
   * role.edit({name: 'new role'})
   *  .then(r => console.log(`Edited role ${r}`))
   *  .catch(console.error);
   */
  edit(data) {
    return this.client.rest.methods.updateGuildRole(this, data);
  }

  /**
   * Set a new name for the role
   * @param {string} name The new name of the role
   * @returns {Promise<Role>}
   * @example
   * // set the name of the role
   * role.setName('new role')
   *  .then(r => console.log(`Edited name of role ${r}`))
   *  .catch(console.error);
   */
  setName(name) {
    return this.edit({ name });
  }

  /**
   * Set a new color for the role
   * @param {ColorResolvable} color The color of the role
   * @returns {Promise<Role>}
   * @example
   * // set the color of a role
   * role.setColor('#FF0000')
   *  .then(r => console.log(`Set color of role ${r}`))
   *  .catch(console.error);
   */
  setColor(color) {
    return this.edit({ color });
  }

  /**
   * Set whether or not the role should be hoisted
   * @param {boolean} hoist Whether or not to hoist the role
   * @returns {Promise<Role>}
   * @example
   * // set the hoist of the role
   * role.setHoist(true)
   *  .then(r => console.log(`Role hoisted: ${r.hoist}`))
   *  .catch(console.error);
   */
  setHoist(hoist) {
    return this.edit({ hoist });
  }

  /**
   * Set the position of the role
   * @param {number} position The position of the role
   * @param {boolean} [relative=false] Move the position relative to its current value
   * @returns {Promise<Role>}
   * @example
   * // set the position of the role
   * role.setPosition(1)
   *  .then(r => console.log(`Role position: ${r.position}`))
   *  .catch(console.error);
   */
  setPosition(position, relative) {
    return this.guild.setRolePosition(this, position, relative).then(() => this);
  }

  /**
   * Set the permissions of the role
   * @param {string[]} permissions The permissions of the role
   * @returns {Promise<Role>}
   * @example
   * // set the permissions of the role
   * role.setPermissions(['KICK_MEMBERS', 'BAN_MEMBERS'])
   *  .then(r => console.log(`Role updated ${r}`))
   *  .catch(console.error);
   */
  setPermissions(permissions) {
    return this.edit({ permissions });
  }

  /**
   * Set whether this role is mentionable
   * @param {boolean} mentionable Whether this role should be mentionable
   * @returns {Promise<Role>}
   * @example
   * // make the role mentionable
   * role.setMentionable(true)
   *  .then(r => console.log(`Role updated ${r}`))
   *  .catch(console.error);
   */
  setMentionable(mentionable) {
    return this.edit({ mentionable });
  }

  /**
   * Deletes the role
   * @returns {Promise<Role>}
   * @example
   * // delete a role
   * role.delete()
   *  .then(r => console.log(`Deleted role ${r}`))
   *  .catch(console.error);
   */
  delete() {
    return this.client.rest.methods.deleteGuildRole(this);
  }

  /**
   * Whether this role equals another role. It compares all properties, so for most operations
   * it is advisable to just compare `role.id === role2.id` as it is much faster and is often
   * what most users need.
   * @param {Role} role Role to compare with
   * @returns {boolean}
   */
  equals(role) {
    return role &&
      this.id === role.id &&
      this.name === role.name &&
      this.color === role.color &&
      this.hoist === role.hoist &&
      this.position === role.position &&
      this.permissions === role.permissions &&
      this.managed === role.managed;
  }

  /**
   * When concatenated with a string, this automatically concatenates the role mention rather than the Role object.
   * @returns {string}
   */
  toString() {
    if (this.id === this.guild.id) return '@everyone';
    return `<@&${this.id}>`;
  }

  /**
   * Compares the positions of two roles.
   * @param {Role} role1 First role to compare
   * @param {Role} role2 Second role to compare
   * @returns {number} Negative number if the first role's position is lower (second role's is higher),
   * positive number if the first's is higher (second's is lower), 0 if equal
   */
  static comparePositions(role1, role2) {
    if (role1.position === role2.position) return role2.id - role1.id;
    return role1.position - role2.position;
  }
}

module.exports = Role;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const TextBasedChannel = __webpack_require__(14);
const Constants = __webpack_require__(0);
const Presence = __webpack_require__(7).Presence;
const Snowflake = __webpack_require__(5);

/**
 * Represents a user on Discord.
 * @implements {TextBasedChannel}
 */
class User {
  constructor(client, data) {
    /**
     * The Client that created the instance of the the User.
     * @name User#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    if (data) this.setup(data);
  }

  setup(data) {
    /**
     * The ID of the user
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The username of the user
     * @type {string}
     */
    this.username = data.username;

    /**
     * A discriminator based on username for the user
     * @type {string}
     */
    this.discriminator = data.discriminator;

    /**
     * The ID of the user's avatar
     * @type {string}
     */
    this.avatar = data.avatar;

    /**
     * Whether or not the user is a bot.
     * @type {boolean}
     */
    this.bot = Boolean(data.bot);

    /**
     * The ID of the last message sent by the user, if one was sent.
     * @type {?Snowflake}
     */
    this.lastMessageID = null;

    /**
     * The Message object of the last message sent by the user, if one was sent.
     * @type {?Message}
     */
    this.lastMessage = null;
  }

  patch(data) {
    for (const prop of ['id', 'username', 'discriminator', 'avatar', 'bot']) {
      if (typeof data[prop] !== 'undefined') this[prop] = data[prop];
    }
    if (data.token) this.client.token = data.token;
  }

  /**
   * The timestamp the user was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the user was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The presence of this user
   * @type {Presence}
   * @readonly
   */
  get presence() {
    if (this.client.presences.has(this.id)) return this.client.presences.get(this.id);
    for (const guild of this.client.guilds.values()) {
      if (guild.presences.has(this.id)) return guild.presences.get(this.id);
    }
    return new Presence();
  }

  /**
   * A link to the user's avatar (if they have one, otherwise null)
   * @type {?string}
   * @readonly
   */
  get avatarURL() {
    if (!this.avatar) return null;
    return Constants.Endpoints.User(this).Avatar(this.client.options.http.cdn, this.avatar);
  }

  /**
   * A link to the user's default avatar
   * @type {string}
   * @readonly
   */
  get defaultAvatarURL() {
    const avatars = Object.keys(Constants.DefaultAvatars);
    const avatar = avatars[this.discriminator % avatars.length];
    return Constants.Endpoints.assets(`${Constants.DefaultAvatars[avatar]}.png`);
  }

  /**
   * A link to the user's avatar if they have one. Otherwise a link to their default avatar will be returned
   * @type {string}
   * @readonly
   */
  get displayAvatarURL() {
    return this.avatarURL || this.defaultAvatarURL;
  }

  /**
   * The note that is set for the user
   * <warn>This is only available when using a user account.</warn>
   * @type {?string}
   * @readonly
   */
  get note() {
    return this.client.user.notes.get(this.id) || null;
  }

  /**
   * Check whether the user is typing in a channel.
   * @param {ChannelResolvable} channel The channel to check in
   * @returns {boolean}
   */
  typingIn(channel) {
    channel = this.client.resolver.resolveChannel(channel);
    return channel._typing.has(this.id);
  }

  /**
   * Get the time that the user started typing.
   * @param {ChannelResolvable} channel The channel to get the time in
   * @returns {?Date}
   */
  typingSinceIn(channel) {
    channel = this.client.resolver.resolveChannel(channel);
    return channel._typing.has(this.id) ? new Date(channel._typing.get(this.id).since) : null;
  }

  /**
   * Get the amount of time the user has been typing in a channel for (in milliseconds), or -1 if they're not typing.
   * @param {ChannelResolvable} channel The channel to get the time in
   * @returns {number}
   */
  typingDurationIn(channel) {
    channel = this.client.resolver.resolveChannel(channel);
    return channel._typing.has(this.id) ? channel._typing.get(this.id).elapsedTime : -1;
  }

  /**
   * The DM between the client's user and this user
   * @type {?DMChannel}
   */
  get dmChannel() {
    return this.client.channels.filter(c => c.type === 'dm').find(c => c.recipient.id === this.id);
  }

  /**
   * Creates a DM channel between the client and the user
   * @returns {Promise<DMChannel>}
   */
  createDM() {
    return this.client.rest.methods.createDM(this);
  }

  /**
   * Deletes a DM channel (if one exists) between the client and the user. Resolves with the channel if successful.
   * @returns {Promise<DMChannel>}
   */
  deleteDM() {
    return this.client.rest.methods.deleteChannel(this);
  }

  /**
   * Sends a friend request to the user
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<User>}
   */
  addFriend() {
    return this.client.rest.methods.addFriend(this);
  }

  /**
   * Removes the user from your friends
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<User>}
   */
  removeFriend() {
    return this.client.rest.methods.removeFriend(this);
  }

  /**
   * Blocks the user
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<User>}
   */
  block() {
    return this.client.rest.methods.blockUser(this);
  }

  /**
   * Unblocks the user
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<User>}
   */
  unblock() {
    return this.client.rest.methods.unblockUser(this);
  }

  /**
   * Get the profile of the user
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<UserProfile>}
   */
  fetchProfile() {
    return this.client.rest.methods.fetchUserProfile(this);
  }

  /**
   * Sets a note for the user
   * <warn>This is only available when using a user account.</warn>
   * @param {string} note The note to set for the user
   * @returns {Promise<User>}
   */
  setNote(note) {
    return this.client.rest.methods.setNote(this, note);
  }

  /**
   * Checks if the user is equal to another. It compares ID, username, discriminator, avatar, and bot flags.
   * It is recommended to compare equality by using `user.id === user2.id` unless you want to compare all properties.
   * @param {User} user User to compare with
   * @returns {boolean}
   */
  equals(user) {
    let equal = user &&
      this.id === user.id &&
      this.username === user.username &&
      this.discriminator === user.discriminator &&
      this.avatar === user.avatar &&
      this.bot === Boolean(user.bot);

    return equal;
  }

  /**
   * When concatenated with a string, this automatically concatenates the user's mention instead of the User object.
   * @returns {string}
   * @example
   * // logs: Hello from <@123456789>!
   * console.log(`Hello from ${user}!`);
   */
  toString() {
    return `<@${this.id}>`;
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
  sendMessage() {}
  sendEmbed() {}
  sendFile() {}
  sendCode() {}
}

TextBasedChannel.applyToClass(User);

module.exports = User;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const Constants = __webpack_require__(0);
const Collection = __webpack_require__(3);
const Snowflake = __webpack_require__(5);

/**
 * Represents a custom emoji
 */
class Emoji {
  constructor(guild, data) {
    /**
     * The Client that instantiated this object
     * @name Emoji#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: guild.client });

    /**
     * The guild this emoji is part of
     * @type {Guild}
     */
    this.guild = guild;

    this.setup(data);
  }

  setup(data) {
    /**
     * The ID of the emoji
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of the emoji
     * @type {string}
     */
    this.name = data.name;

    /**
     * Whether or not this emoji requires colons surrounding it
     * @type {boolean}
     */
    this.requiresColons = data.require_colons;

    /**
     * Whether this emoji is managed by an external service
     * @type {boolean}
     */
    this.managed = data.managed;

    this._roles = data.roles;
  }

  /**
   * The timestamp the emoji was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the emoji was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * A collection of roles this emoji is active for (empty if all), mapped by role ID.
   * @type {Collection<Snowflake, Role>}
   * @readonly
   */
  get roles() {
    const roles = new Collection();
    for (const role of this._roles) {
      if (this.guild.roles.has(role)) roles.set(role, this.guild.roles.get(role));
    }
    return roles;
  }

  /**
   * The URL to the emoji file
   * @type {string}
   * @readonly
   */
  get url() {
    return Constants.Endpoints.emoji(this.id);
  }

  /**
   * The identifier of this emoji, used for message reactions
   * @type {string}
   * @readonly
   */
  get identifier() {
    if (this.id) return `${this.name}:${this.id}`;
    return encodeURIComponent(this.name);
  }

  /**
   * Data for editing an emoji
   * @typedef {Object} EmojiEditData
   * @property {string} [name] The name of the emoji
   * @property {Collection<Snowflake, Role>|Array<Snowflake|Role>} [roles] Roles to restrict emoji to
   */

  /**
   * Edits the emoji
   * @param {EmojiEditData} data The new data for the emoji
   * @returns {Promise<Emoji>}
   * @example
   * // edit a emoji
   * emoji.edit({name: 'newemoji'})
   *  .then(e => console.log(`Edited emoji ${e}`))
   *  .catch(console.error);
   */
  edit(data) {
    return this.client.rest.methods.updateEmoji(this, data);
  }

  /**
   * When concatenated with a string, this automatically returns the emoji mention rather than the object.
   * @returns {string}
   * @example
   * // send an emoji:
   * const emoji = guild.emojis.first();
   * msg.reply(`Hello! ${emoji}`);
   */
  toString() {
    return this.requiresColons ? `<:${this.name}:${this.id}>` : this.name;
  }

  /**
   * Whether this emoji is the same as another one
   * @param {Emoji|Object} other the emoji to compare it to
   * @returns {boolean} whether the emoji is equal to the given emoji or not
   */
  equals(other) {
    if (other instanceof Emoji) {
      return (
        other.id === this.id &&
        other.name === this.name &&
        other.managed === this.managed &&
        other.requiresColons === this.requiresColons
      );
    } else {
      return (
        other.id === this.id &&
        other.name === this.name
      );
    }
  }
}

module.exports = Emoji;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const TextBasedChannel = __webpack_require__(14);
const Role = __webpack_require__(10);
const Permissions = __webpack_require__(6);
const Collection = __webpack_require__(3);
const Presence = __webpack_require__(7).Presence;

/**
 * Represents a member of a guild on Discord
 * @implements {TextBasedChannel}
 */
class GuildMember {
  constructor(guild, data) {
    /**
     * The Client that instantiated this GuildMember
     * @name GuildMember#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: guild.client });

    /**
     * The guild that this member is part of
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The user that this guild member instance Represents
     * @type {User}
     */
    this.user = {};

    this._roles = [];
    if (data) this.setup(data);

    /**
     * The ID of the last message sent by the member in their guild, if one was sent.
     * @type {?Snowflake}
     */
    this.lastMessageID = null;

    /**
     * The Message object of the last message sent by the member in their guild, if one was sent.
     * @type {?Message}
     */
    this.lastMessage = null;
  }

  setup(data) {
    /**
     * Whether this member is deafened server-wide
     * @type {boolean}
     */
    this.serverDeaf = data.deaf;

    /**
     * Whether this member is muted server-wide
     * @type {boolean}
     */
    this.serverMute = data.mute;

    /**
     * Whether this member is self-muted
     * @type {boolean}
     */
    this.selfMute = data.self_mute;

    /**
     * Whether this member is self-deafened
     * @type {boolean}
     */
    this.selfDeaf = data.self_deaf;

    /**
     * The voice session ID of this member, if any
     * @type {?Snowflake}
     */
    this.voiceSessionID = data.session_id;

    /**
     * The voice channel ID of this member, if any
     * @type {?Snowflake}
     */
    this.voiceChannelID = data.channel_id;

    /**
     * Whether this member is speaking
     * @type {boolean}
     */
    this.speaking = false;

    /**
     * The nickname of this guild member, if they have one
     * @type {?string}
     */
    this.nickname = data.nick || null;

    /**
     * The timestamp the member joined the guild at
     * @type {number}
     */
    this.joinedTimestamp = new Date(data.joined_at).getTime();

    this.user = data.user;
    this._roles = data.roles;
  }

  /**
   * The time the member joined the guild
   * @type {Date}
   * @readonly
   */
  get joinedAt() {
    return new Date(this.joinedTimestamp);
  }

  /**
   * The presence of this guild member
   * @type {Presence}
   * @readonly
   */
  get presence() {
    return this.frozenPresence || this.guild.presences.get(this.id) || new Presence();
  }

  /**
   * A list of roles that are applied to this GuildMember, mapped by the role ID.
   * @type {Collection<Snowflake, Role>}
   * @readonly
   */
  get roles() {
    const list = new Collection();
    const everyoneRole = this.guild.roles.get(this.guild.id);

    if (everyoneRole) list.set(everyoneRole.id, everyoneRole);

    for (const roleID of this._roles) {
      const role = this.guild.roles.get(roleID);
      if (role) list.set(role.id, role);
    }

    return list;
  }

  /**
   * The role of the member with the highest position.
   * @type {Role}
   * @readonly
   */
  get highestRole() {
    return this.roles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * The role of the member used to set their color.
   * @type {?Role}
   * @readonly
   */
  get colorRole() {
    const coloredRoles = this.roles.filter(role => role.color);
    if (!coloredRoles.size) return null;
    return coloredRoles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * The displayed color of the member in base 10.
   * @type {number}
   * @readonly
   */
  get displayColor() {
    const role = this.colorRole;
    return (role && role.color) || 0;
  }

  /**
   * The displayed color of the member in hexadecimal.
   * @type {string}
   * @readonly
   */
  get displayHexColor() {
    const role = this.colorRole;
    return (role && role.hexColor) || '#000000';
  }

  /**
   * The role of the member used to hoist them in a separate category in the users list.
   * @type {?Role}
   * @readonly
   */
  get hoistRole() {
    const hoistedRoles = this.roles.filter(role => role.hoist);
    if (!hoistedRoles.size) return null;
    return hoistedRoles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * Whether this member is muted in any way
   * @type {boolean}
   * @readonly
   */
  get mute() {
    return this.selfMute || this.serverMute;
  }

  /**
   * Whether this member is deafened in any way
   * @type {boolean}
   * @readonly
   */
  get deaf() {
    return this.selfDeaf || this.serverDeaf;
  }

  /**
   * The voice channel this member is in, if any
   * @type {?VoiceChannel}
   * @readonly
   */
  get voiceChannel() {
    return this.guild.channels.get(this.voiceChannelID);
  }

  /**
   * The ID of this user
   * @type {Snowflake}
   * @readonly
   */
  get id() {
    return this.user.id;
  }

  /**
   * The nickname of the member, or their username if they don't have one
   * @type {string}
   * @readonly
   */
  get displayName() {
    return this.nickname || this.user.username;
  }

  /**
   * The overall set of permissions for the guild member, taking only roles into account
   * @type {Permissions}
   * @readonly
   */
  get permissions() {
    if (this.user.id === this.guild.ownerID) return new Permissions(this, Permissions.ALL);

    let permissions = 0;
    const roles = this.roles;
    for (const role of roles.values()) permissions |= role.permissions;

    return new Permissions(this, permissions);
  }

  /**
   * Whether the member is kickable by the client user.
   * @type {boolean}
   * @readonly
   */
  get kickable() {
    if (this.user.id === this.guild.ownerID) return false;
    if (this.user.id === this.client.user.id) return false;
    const clientMember = this.guild.member(this.client.user);
    if (!clientMember.hasPermission(Permissions.FLAGS.KICK_MEMBERS)) return false;
    return clientMember.highestRole.comparePositionTo(this.highestRole) > 0;
  }

  /**
   * Whether the member is bannable by the client user.
   * @type {boolean}
   * @readonly
   */
  get bannable() {
    if (this.user.id === this.guild.ownerID) return false;
    if (this.user.id === this.client.user.id) return false;
    const clientMember = this.guild.member(this.client.user);
    if (!clientMember.hasPermission(Permissions.FLAGS.BAN_MEMBERS)) return false;
    return clientMember.highestRole.comparePositionTo(this.highestRole) > 0;
  }

  /**
   * Returns `channel.permissionsFor(guildMember)`. Returns permissions for a member in a guild channel,
   * taking into account roles and permission overwrites.
   * @param {ChannelResolvable} channel Guild channel to use as context
   * @returns {?Permissions}
   */
  permissionsIn(channel) {
    channel = this.client.resolver.resolveChannel(channel);
    if (!channel || !channel.guild) throw new Error('Could not resolve channel to a guild channel.');
    return channel.permissionsFor(this);
  }

  /**
   * Checks if any of the member's roles have a permission.
   * @param {PermissionResolvable|PermissionResolvable[]} permission Permission(s) to check for
   * @param {boolean} [explicit=false] Whether to require the role to explicitly have the exact permission
   * **(deprecated)**
   * @param {boolean} [checkAdmin] Whether to allow the administrator permission to override
   * (takes priority over `explicit`)
   * @param {boolean} [checkOwner] Whether to allow being the guild's owner to override
   * (takes priority over `explicit`)
   * @returns {boolean}
   */
  hasPermission(permission, explicit = false, checkAdmin, checkOwner) {
    if (typeof checkAdmin === 'undefined') checkAdmin = !explicit;
    if (typeof checkOwner === 'undefined') checkOwner = !explicit;
    if (checkOwner && this.user.id === this.guild.ownerID) return true;
    return this.roles.some(r => r.hasPermission(permission, undefined, checkAdmin));
  }

  /**
   * Checks whether the roles of the member allows them to perform specific actions.
   * @param {PermissionResolvable[]} permissions The permissions to check for
   * @param {boolean} [explicit=false] Whether to require the member to explicitly have the exact permissions
   * @returns {boolean}
   * @deprecated
   */
  hasPermissions(permissions, explicit = false) {
    if (!explicit && this.user.id === this.guild.ownerID) return true;
    return permissions.every(p => this.hasPermission(p, explicit));
  }

  /**
   * Checks whether the roles of the member allows them to perform specific actions, and lists any missing permissions.
   * @param {PermissionResolvable[]} permissions The permissions to check for
   * @param {boolean} [explicit=false] Whether to require the member to explicitly have the exact permissions
   * @returns {PermissionResolvable[]}
   */
  missingPermissions(permissions, explicit = false) {
    return permissions.filter(p => !this.hasPermission(p, explicit));
  }

  /**
   * The data for editing a guild member
   * @typedef {Object} GuildMemberEditData
   * @property {string} [nick] The nickname to set for the member
   * @property {Collection<Snowflake, Role>|Role[]|Snowflake[]} [roles] The roles or role IDs to apply
   * @property {boolean} [mute] Whether or not the member should be muted
   * @property {boolean} [deaf] Whether or not the member should be deafened
   * @property {ChannelResolvable} [channel] Channel to move member to (if they are connected to voice)
   */

  /**
   * Edit a guild member
   * @param {GuildMemberEditData} data The data to edit the member with
   * @returns {Promise<GuildMember>}
   */
  edit(data) {
    return this.client.rest.methods.updateGuildMember(this, data);
  }

  /**
   * Mute/unmute a user
   * @param {boolean} mute Whether or not the member should be muted
   * @returns {Promise<GuildMember>}
   */
  setMute(mute) {
    return this.edit({ mute });
  }

  /**
   * Deafen/undeafen a user
   * @param {boolean} deaf Whether or not the member should be deafened
   * @returns {Promise<GuildMember>}
   */
  setDeaf(deaf) {
    return this.edit({ deaf });
  }

  /**
   * Moves the guild member to the given channel.
   * @param {ChannelResolvable} channel The channel to move the member to
   * @returns {Promise<GuildMember>}
   */
  setVoiceChannel(channel) {
    return this.edit({ channel });
  }

  /**
   * Sets the roles applied to the member.
   * @param {Collection<Snowflake, Role>|Role[]|Snowflake[]} roles The roles or role IDs to apply
   * @returns {Promise<GuildMember>}
   */
  setRoles(roles) {
    return this.edit({ roles });
  }

  /**
   * Adds a single role to the member.
   * @param {Role|Snowflake} role The role or ID of the role to add
   * @returns {Promise<GuildMember>}
   */
  addRole(role) {
    if (!(role instanceof Role)) role = this.guild.roles.get(role);
    return this.client.rest.methods.addMemberRole(this, role);
  }

  /**
   * Adds multiple roles to the member.
   * @param {Collection<Snowflake, Role>|Role[]|Snowflake[]} roles The roles or role IDs to add
   * @returns {Promise<GuildMember>}
   */
  addRoles(roles) {
    let allRoles;
    if (roles instanceof Collection) {
      allRoles = this._roles.slice();
      for (const role of roles.values()) allRoles.push(role.id);
    } else {
      allRoles = this._roles.concat(roles);
    }
    return this.edit({ roles: allRoles });
  }

  /**
   * Removes a single role from the member.
   * @param {Role|Snowflake} role The role or ID of the role to remove
   * @returns {Promise<GuildMember>}
   */
  removeRole(role) {
    if (!(role instanceof Role)) role = this.guild.roles.get(role);
    return this.client.rest.methods.removeMemberRole(this, role);
  }

  /**
   * Removes multiple roles from the member.
   * @param {Collection<Snowflake, Role>|Role[]|Snowflake[]} roles The roles or role IDs to remove
   * @returns {Promise<GuildMember>}
   */
  removeRoles(roles) {
    const allRoles = this._roles.slice();
    if (roles instanceof Collection) {
      for (const role of roles.values()) {
        const index = allRoles.indexOf(role.id);
        if (index >= 0) allRoles.splice(index, 1);
      }
    } else {
      for (const role of roles) {
        const index = allRoles.indexOf(role instanceof Role ? role.id : role);
        if (index >= 0) allRoles.splice(index, 1);
      }
    }
    return this.edit({ roles: allRoles });
  }

  /**
   * Set the nickname for the guild member
   * @param {string} nick The nickname for the guild member
   * @returns {Promise<GuildMember>}
   */
  setNickname(nick) {
    return this.edit({ nick });
  }

  /**
   * Creates a DM channel between the client and the member
   * @returns {Promise<DMChannel>}
   */
  createDM() {
    return this.user.createDM();
  }

  /**
   * Deletes any DMs with this guild member
   * @returns {Promise<DMChannel>}
   */
  deleteDM() {
    return this.user.deleteDM();
  }

  /**
   * Kick this member from the guild
   * @returns {Promise<GuildMember>}
   */
  kick() {
    return this.client.rest.methods.kickGuildMember(this.guild, this);
  }

  /**
   * Ban this guild member
   * @param {number} [deleteDays=0] The amount of days worth of messages from this member that should
   * also be deleted. Between `0` and `7`.
   * @returns {Promise<GuildMember>}
   * @example
   * // ban a guild member
   * guildMember.ban(7);
   */
  ban(deleteDays = 0) {
    return this.client.rest.methods.banGuildMember(this.guild, this, deleteDays);
  }

  /**
   * When concatenated with a string, this automatically concatenates the user's mention instead of the Member object.
   * @returns {string}
   * @example
   * // logs: Hello from <@123456789>!
   * console.log(`Hello from ${member}!`);
   */
  toString() {
    return `<@${this.nickname ? '!' : ''}${this.user.id}>`;
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
  sendMessage() {}
  sendEmbed() {}
  sendFile() {}
  sendCode() {}
}

TextBasedChannel.applyToClass(GuildMember);

module.exports = GuildMember;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const path = __webpack_require__(24);
const Message = __webpack_require__(9);
const MessageCollector = __webpack_require__(33);
const Collection = __webpack_require__(3);

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
   * @property {FileOptions|string} [file] A file to send with the message **(deprecated)**
   * @property {FileOptions[]|string[]} [files] Files to send with the message
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
      if (options.files) options.files.push(options.file);
      else options.files = [options.file];
    }

    if (options.files) {
      for (const i in options.files) {
        let file = options.files[i];
        if (typeof file === 'string') file = { attachment: file };
        if (!file.name) {
          if (typeof file.attachment === 'string') {
            file.name = path.basename(file.attachment);
          } else if (file.attachment && file.attachment.path) {
            file.name = path.basename(file.attachment.path);
          } else {
            file.name = 'file.jpg';
          }
        }
        options.files[i] = file;
      }

      return Promise.all(options.files.map(file =>
        this.client.resolver.resolveBuffer(file.attachment).then(buffer => {
          file.file = buffer;
          return file;
        })
      )).then(files => this.client.rest.methods.sendMessage(this, content, options, files));
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
   * Send files to this channel
   * @param {FileOptions[]|string[]} files Files to send with the message
   * @param {StringResolvable} [content] Text for the message
   * @param {MessageOptions} [options] Options for the message
   * @returns {Promise<Message>}
   */
  sendFiles(files, content, options = {}) {
    return this.send(content, Object.assign(options, { files }));
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
    return this.sendFiles([{ attachment, name }], content, options);
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
   * Gets a single message from this channel, regardless of it being cached or not. Since the single message fetching
   * endpoint is reserved for bot accounts, this abstracts the `fetchMessages` method to obtain the single message when
   * using a user account.
   * @param {Snowflake} messageID ID of the message to get
   * @returns {Promise<Message>}
   * @example
   * // get message
   * channel.fetchMessage('99539446449315840')
   *   .then(message => console.log(message.content))
   *   .catch(console.error);
   */
  fetchMessage(messageID) {
    if (!this.client.user.bot) {
      return this.fetchMessages({ limit: 1, around: messageID }).then(messages => {
        const msg = messages.first();
        if (msg.id !== messageID) throw new Error('Message not found.');
        return msg;
      });
    }
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
   * @property {Snowflake} [before] ID of a message to get the messages that were posted before it
   * @property {Snowflake} [after] ID of a message to get the messages that were posted after it
   * @property {Snowflake} [around] ID of a message to get the messages that were posted around it
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
   * @property {Snowflake} [maxID] Maximum ID for the filter
   * @property {Snowflake} [minID] Minimum ID for the filter
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
    if (!isNaN(messages)) return this.fetchMessages({ limit: messages }).then(msgs => this.bulkDelete(msgs, filterOld));
    if (messages instanceof Array || messages instanceof Collection) {
      const messageIDs = messages instanceof Collection ? messages.keyArray() : messages.map(m => m.id);
      return this.client.rest.methods.bulkDeleteMessages(this, messageIDs, filterOld);
    }
    throw new TypeError('The messages must be an Array, Collection, or number.');
  }

  /**
   * Marks all messages in this channel as read
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<TextChannel|GroupDMChannel|DMChannel>}
   */
  acknowledge() {
    return this.client.rest.methods.ackTextMessage(this);
  }

  _cacheMessage(message) {
    const maxSize = this.client.options.messageCacheMaxSize;
    if (maxSize === 0) return null;
    if (this.messages.size >= maxSize && maxSize > 0) this.messages.delete(this.messages.firstKey());
    this.messages.set(message.id, message);
    return message;
  }
}

exports.applyToClass = (structure, full = false, ignore = []) => {
  const props = ['send', 'sendMessage', 'sendEmbed', 'sendFile', 'sendFiles', 'sendCode'];
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
    if (ignore.includes(prop)) continue;
    Object.defineProperty(structure.prototype, prop, Object.getOwnPropertyDescriptor(TextBasedChannel.prototype, prop));
  }
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const User = __webpack_require__(11);
const Role = __webpack_require__(10);
const Emoji = __webpack_require__(12);
const Presence = __webpack_require__(7).Presence;
const GuildMember = __webpack_require__(13);
const Constants = __webpack_require__(0);
const Collection = __webpack_require__(3);
const Util = __webpack_require__(4);
const Snowflake = __webpack_require__(5);

/**
 * Represents a guild (or a server) on Discord.
 * <info>It's recommended to see if a guild is available before performing operations or reading data from it. You can
 * check this with `guild.available`.</info>
 */
class Guild {
  constructor(client, data) {
    /**
     * The Client that created the instance of the the Guild.
     * @name Guild#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * A collection of members that are in this guild. The key is the member's ID, the value is the member.
     * @type {Collection<Snowflake, GuildMember>}
     */
    this.members = new Collection();

    /**
     * A collection of channels that are in this guild. The key is the channel's ID, the value is the channel.
     * @type {Collection<Snowflake, GuildChannel>}
     */
    this.channels = new Collection();

    /**
     * A collection of roles that are in this guild. The key is the role's ID, the value is the role.
     * @type {Collection<Snowflake, Role>}
     */
    this.roles = new Collection();

    /**
     * A collection of presences in this guild
     * @type {Collection<Snowflake, Presence>}
     */
    this.presences = new Collection();

    if (!data) return;
    if (data.unavailable) {
      /**
       * Whether the guild is available to access. If it is not available, it indicates a server outage.
       * @type {boolean}
       */
      this.available = false;

      /**
       * The Unique ID of the Guild, useful for comparisons.
       * @type {Snowflake}
       */
      this.id = data.id;
    } else {
      this.available = true;
      this.setup(data);
    }
  }

  /**
   * Sets up the Guild
   * @param {*} data The raw data of the guild
   * @private
   */
  setup(data) {
    /**
     * The name of the guild
     * @type {string}
     */
    this.name = data.name;

    /**
     * The hash of the guild icon, or null if there is no icon.
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * The hash of the guild splash image, or null if no splash (VIP only)
     * @type {?string}
     */
    this.splash = data.splash;

    /**
     * The region the guild is located in
     * @type {string}
     */
    this.region = data.region;

    /**
     * The full amount of members in this guild as of `READY`
     * @type {number}
     */
    this.memberCount = data.member_count || this.memberCount;

    /**
     * Whether the guild is "large" (has more than 250 members)
     * @type {boolean}
     */
    this.large = Boolean('large' in data ? data.large : this.large);

    /**
     * An array of guild features.
     * @type {Object[]}
     */
    this.features = data.features;

    /**
     * The ID of the application that created this guild (if applicable)
     * @type {?Snowflake}
     */
    this.applicationID = data.application_id;

    /**
     * A collection of emojis that are in this guild. The key is the emoji's ID, the value is the emoji.
     * @type {Collection<Snowflake, Emoji>}
     */
    this.emojis = new Collection();
    for (const emoji of data.emojis) this.emojis.set(emoji.id, new Emoji(this, emoji));

    /**
     * The time in seconds before a user is counted as "away from keyboard".
     * @type {?number}
     */
    this.afkTimeout = data.afk_timeout;

    /**
     * The ID of the voice channel where AFK members are moved.
     * @type {?string}
     */
    this.afkChannelID = data.afk_channel_id;

    /**
     * Whether embedded images are enabled on this guild.
     * @type {boolean}
     */
    this.embedEnabled = data.embed_enabled;

    /**
     * The verification level of the guild.
     * @type {number}
     */
    this.verificationLevel = data.verification_level;

    /**
     * The timestamp the client user joined the guild at
     * @type {number}
     */
    this.joinedTimestamp = data.joined_at ? new Date(data.joined_at).getTime() : this.joinedTimestamp;

    this.id = data.id;
    this.available = !data.unavailable;
    this.features = data.features || this.features || [];

    if (data.members) {
      this.members.clear();
      for (const guildUser of data.members) this._addMember(guildUser, false);
    }

    if (data.owner_id) {
      /**
       * The user ID of this guild's owner.
       * @type {Snowflake}
       */
      this.ownerID = data.owner_id;
    }

    if (data.channels) {
      this.channels.clear();
      for (const channel of data.channels) this.client.dataManager.newChannel(channel, this);
    }

    if (data.roles) {
      this.roles.clear();
      for (const role of data.roles) {
        const newRole = new Role(this, role);
        this.roles.set(newRole.id, newRole);
      }
    }

    if (data.presences) {
      for (const presence of data.presences) {
        this._setPresence(presence.user.id, presence);
      }
    }

    this._rawVoiceStates = new Collection();
    if (data.voice_states) {
      for (const voiceState of data.voice_states) {
        this._rawVoiceStates.set(voiceState.user_id, voiceState);
        const member = this.members.get(voiceState.user_id);
        if (member) {
          member.serverMute = voiceState.mute;
          member.serverDeaf = voiceState.deaf;
          member.selfMute = voiceState.self_mute;
          member.selfDeaf = voiceState.self_deaf;
          member.voiceSessionID = voiceState.session_id;
          member.voiceChannelID = voiceState.channel_id;
          this.channels.get(voiceState.channel_id).members.set(member.user.id, member);
        }
      }
    }
  }

  /**
   * The timestamp the guild was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the guild was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The time the client user joined the guild
   * @type {Date}
   * @readonly
   */
  get joinedAt() {
    return new Date(this.joinedTimestamp);
  }

  /**
   * Gets the URL to this guild's icon (if it has one, otherwise it returns null)
   * @type {?string}
   * @readonly
   */
  get iconURL() {
    if (!this.icon) return null;
    return Constants.Endpoints.Guild(this).Icon(this.client.options.http.cdn, this.icon);
  }

  /**
   * Gets the URL to this guild's splash (if it has one, otherwise it returns null)
   * @type {?string}
   * @readonly
   */
  get splashURL() {
    if (!this.splash) return null;
    return Constants.Endpoints.Guild(this).Splash(this.client.options.http.cdn, this.splash);
  }

  /**
   * The owner of the guild
   * @type {GuildMember}
   * @readonly
   */
  get owner() {
    return this.members.get(this.ownerID);
  }

  /**
   * If the client is connected to any voice channel in this guild, this will be the relevant VoiceConnection.
   * @type {?VoiceConnection}
   * @readonly
   */
  get voiceConnection() {
    if (this.client.browser) return null;
    return this.client.voice.connections.get(this.id) || null;
  }

  /**
   * The `#general` TextChannel of the guild.
   * @type {TextChannel}
   * @readonly
   */
  get defaultChannel() {
    return this.channels.get(this.id);
  }

  /**
   * The `@everyone` Role of the guild.
   * @type {Role}
   * @readonly
   */
  get defaultRole() {
    return this.roles.get(this.id);
  }

  /**
   * Returns the GuildMember form of a User object, if the user is present in the guild.
   * @param {UserResolvable} user The user that you want to obtain the GuildMember of
   * @returns {?GuildMember}
   * @example
   * // get the guild member of a user
   * const member = guild.member(message.author);
   */
  member(user) {
    return this.client.resolver.resolveGuildMember(this, user);
  }

  /**
   * Fetch a collection of banned users in this guild.
   * @returns {Promise<Collection<Snowflake, User>>}
   */
  fetchBans() {
    return this.client.rest.methods.getGuildBans(this);
  }

  /**
   * Fetch a collection of invites to this guild. Resolves with a collection mapping invites by their codes.
   * @returns {Promise<Collection<string, Invite>>}
   */
  fetchInvites() {
    return this.client.rest.methods.getGuildInvites(this);
  }

  /**
   * Fetch all webhooks for the guild.
   * @returns {Collection<Snowflake, Webhook>}
   */
  fetchWebhooks() {
    return this.client.rest.methods.getGuildWebhooks(this);
  }

  /**
   * Fetch available voice regions
   * @returns {Collection<string, VoiceRegion>}
   */
  fetchVoiceRegions() {
    return this.client.rest.methods.fetchVoiceRegions(this.id);
  }

  /**
   * Adds a user to the guild using OAuth2. Requires the `CREATE_INSTANT_INVITE` permission.
   * @param {UserResolvable} user User to add to the guild
   * @param {Object} options Options for the addition
   * @param {string} options.accessToken An OAuth2 access token for the user with the `guilds.join` scope granted to the
   * bot's application
   * @param {string} [options.nick] Nickname to give the member (requires `MANAGE_NICKNAMES`)
   * @param {Collection<Snowflake, Role>|Role[]|Snowflake[]} [options.roles] Roles to add to the member
   * (requires `MANAGE_ROLES`)
   * @param {boolean} [options.mute] Whether the member should be muted (requires `MUTE_MEMBERS`)
   * @param {boolean} [options.deaf] Whether the member should be deafened (requires `DEAFEN_MEMBERS`)
   * @returns {Promise<GuildMember>}
   */
  addMember(user, options) {
    if (this.members.has(user.id)) return Promise.resolve(this.members.get(user.id));
    return this.client.rest.methods.putGuildMember(this, user, options);
  }

  /**
   * Fetch a single guild member from a user.
   * @param {UserResolvable} user The user to fetch the member for
   * @param {boolean} [cache=true] Insert the user into the users cache
   * @returns {Promise<GuildMember>}
   */
  fetchMember(user, cache = true) {
    user = this.client.resolver.resolveUser(user);
    if (!user) return Promise.reject(new Error('User is not cached. Use Client.fetchUser first.'));
    if (this.members.has(user.id)) return Promise.resolve(this.members.get(user.id));
    return this.client.rest.methods.getGuildMember(this, user, cache);
  }

  /**
   * Fetches all the members in the guild, even if they are offline. If the guild has less than 250 members,
   * this should not be necessary.
   * @param {string} [query=''] Limit fetch to members with similar usernames
   * @param {number} [limit=0] Maximum number of members to request
   * @returns {Promise<Guild>}
   */
  fetchMembers(query = '', limit = 0) {
    return new Promise((resolve, reject) => {
      if (this.memberCount === this.members.size) {
        // Uncomment in v12
        // resolve(this.members)
        resolve(this);
        return;
      }
      this.client.ws.send({
        op: Constants.OPCodes.REQUEST_GUILD_MEMBERS,
        d: {
          guild_id: this.id,
          query,
          limit,
        },
      });
      const handler = (members, guild) => {
        if (guild.id !== this.id) return;
        if (this.memberCount === this.members.size || members.length < 1000) {
          this.client.removeListener(Constants.Events.GUILD_MEMBERS_CHUNK, handler);
          // Uncomment in v12
          // resolve(this.members)
          resolve(this);
        }
      };
      this.client.on(Constants.Events.GUILD_MEMBERS_CHUNK, handler);
      this.client.setTimeout(() => reject(new Error('Members didn\'t arrive in time.')), 120 * 1000);
    });
  }

  /**
   * Performs a search within the entire guild.
   * @param {MessageSearchOptions} [options={}] Options to pass to the search
   * @returns {Promise<Array<Message[]>>}
   * An array containing arrays of messages. Each inner array is a search context cluster.
   * The message which has triggered the result will have the `hit` property set to `true`.
   * @example
   * guild.search({
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
   * The data for editing a guild
   * @typedef {Object} GuildEditData
   * @property {string} [name] The name of the guild
   * @property {string} [region] The region of the guild
   * @property {number} [verificationLevel] The verification level of the guild
   * @property {ChannelResolvable} [afkChannel] The AFK channel of the guild
   * @property {number} [afkTimeout] The AFK timeout of the guild
   * @property {Base64Resolvable} [icon] The icon of the guild
   * @property {GuildMemberResolvable} [owner] The owner of the guild
   * @property {Base64Resolvable} [splash] The splash screen of the guild
   */

  /**
   * Updates the Guild with new information - e.g. a new name.
   * @param {GuildEditData} data The data to update the guild with
   * @returns {Promise<Guild>}
   * @example
   * // set the guild name and region
   * guild.edit({
   *  name: 'Discord Guild',
   *  region: 'london',
   * })
   * .then(updated => console.log(`New guild name ${updated.name} in region ${updated.region}`))
   * .catch(console.error);
   */
  edit(data) {
    return this.client.rest.methods.updateGuild(this, data);
  }

  /**
   * Edit the name of the guild.
   * @param {string} name The new name of the guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild name
   * guild.setName('Discord Guild')
   *  .then(updated => console.log(`Updated guild name to ${guild.name}`))
   *  .catch(console.error);
   */
  setName(name) {
    return this.edit({ name });
  }

  /**
   * Edit the region of the guild.
   * @param {string} region The new region of the guild.
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild region
   * guild.setRegion('london')
   *  .then(updated => console.log(`Updated guild region to ${guild.region}`))
   *  .catch(console.error);
   */
  setRegion(region) {
    return this.edit({ region });
  }

  /**
   * Edit the verification level of the guild.
   * @param {number} verificationLevel The new verification level of the guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild verification level
   * guild.setVerificationLevel(1)
   *  .then(updated => console.log(`Updated guild verification level to ${guild.verificationLevel}`))
   *  .catch(console.error);
   */
  setVerificationLevel(verificationLevel) {
    return this.edit({ verificationLevel });
  }

  /**
   * Edit the AFK channel of the guild.
   * @param {ChannelResolvable} afkChannel The new AFK channel
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild AFK channel
   * guild.setAFKChannel(channel)
   *  .then(updated => console.log(`Updated guild AFK channel to ${guild.afkChannel}`))
   *  .catch(console.error);
   */
  setAFKChannel(afkChannel) {
    return this.edit({ afkChannel });
  }

  /**
   * Edit the AFK timeout of the guild.
   * @param {number} afkTimeout The time in seconds that a user must be idle to be considered AFK
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild AFK channel
   * guild.setAFKTimeout(60)
   *  .then(updated => console.log(`Updated guild AFK timeout to ${guild.afkTimeout}`))
   *  .catch(console.error);
   */
  setAFKTimeout(afkTimeout) {
    return this.edit({ afkTimeout });
  }

  /**
   * Set a new guild icon.
   * @param {Base64Resolvable} icon The new icon of the guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild icon
   * guild.setIcon(fs.readFileSync('./icon.png'))
   *  .then(updated => console.log('Updated the guild icon'))
   *  .catch(console.error);
   */
  setIcon(icon) {
    return this.edit({ icon });
  }

  /**
   * Sets a new owner of the guild.
   * @param {GuildMemberResolvable} owner The new owner of the guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild owner
   * guild.setOwner(guilds.members[0])
   *  .then(updated => console.log(`Updated the guild owner to ${updated.owner.username}`))
   *  .catch(console.error);
   */
  setOwner(owner) {
    return this.edit({ owner });
  }

  /**
   * Set a new guild splash screen.
   * @param {Base64Resolvable} splash The new splash screen of the guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild splash
   * guild.setIcon(fs.readFileSync('./splash.png'))
   *  .then(updated => console.log('Updated the guild splash'))
   *  .catch(console.error);
   */
  setSplash(splash) {
    return this.edit({ splash });
  }

  /**
   * Bans a user from the guild.
   * @param {UserResolvable} user The user to ban
   * @param {number} [deleteDays=0] The amount of days worth of messages from this user that should
   * also be deleted. Between `0` and `7`.
   * @returns {Promise<GuildMember|User|string>} Result object will be resolved as specifically as possible.
   * If the GuildMember cannot be resolved, the User will instead be attempted to be resolved. If that also cannot
   * be resolved, the user ID will be the result.
   * @example
   * // ban a user by ID (or with a user/guild member object)
   * guild.ban('some user ID')
   *  .then(user => console.log(`Banned ${user.username || user.id || user} from ${guild.name}`))
   *  .catch(console.error);
   */
  ban(user, deleteDays = 0) {
    return this.client.rest.methods.banGuildMember(this, user, deleteDays);
  }

  /**
   * Unbans a user from the guild.
   * @param {UserResolvable} user The user to unban
   * @returns {Promise<User>}
   * @example
   * // unban a user by ID (or with a user/guild member object)
   * guild.unban('some user ID')
   *  .then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
   *  .catch(console.error);
   */
  unban(user) {
    return this.client.rest.methods.unbanGuildMember(this, user);
  }

  /**
   * Prunes members from the guild based on how long they have been inactive.
   * @param {number} days Number of days of inactivity required to kick
   * @param {boolean} [dry=false] If true, will return number of users that will be kicked, without actually doing it
   * @returns {Promise<number>} The number of members that were/will be kicked
   * @example
   * // see how many members will be pruned
   * guild.pruneMembers(12, true)
   *   .then(pruned => console.log(`This will prune ${pruned} people!`))
   *   .catch(console.error);
   * @example
   * // actually prune the members
   * guild.pruneMembers(12)
   *   .then(pruned => console.log(`I just pruned ${pruned} people!`))
   *   .catch(console.error);
   */
  pruneMembers(days, dry = false) {
    if (typeof days !== 'number') throw new TypeError('Days must be a number.');
    return this.client.rest.methods.pruneGuildMembers(this, days, dry);
  }

  /**
   * Syncs this guild (already done automatically every 30 seconds).
   * <warn>This is only available when using a user account.</warn>
   */
  sync() {
    if (!this.client.user.bot) this.client.syncGuilds([this]);
  }

  /**
   * Creates a new channel in the guild.
   * @param {string} name The name of the new channel
   * @param {string} type The type of the new channel, either `text` or `voice`
   * @param {Array<PermissionOverwrites|Object>} overwrites Permission overwrites to apply to the new channel
   * @returns {Promise<TextChannel|VoiceChannel>}
   * @example
   * // create a new text channel
   * guild.createChannel('new-general', 'text')
   *  .then(channel => console.log(`Created new channel ${channel}`))
   *  .catch(console.error);
   */
  createChannel(name, type, overwrites) {
    return this.client.rest.methods.createChannel(this, name, type, overwrites);
  }

  /**
   * The data needed for updating a channel's position.
   * @typedef {Object} ChannelPosition
   * @property {ChannelResolvable} channel Channel to update
   * @property {number} position New position for the channel
   */

  /**
   * Batch-updates the guild's channels' positions.
   * @param {ChannelPosition[]} channelPositions Channel positions to update
   * @returns {Promise<Guild>}
   * @example
   * guild.updateChannels([{ channel: channelID, position: newChannelIndex }])
   *  .then(guild => console.log(`Updated channel positions for ${guild.id}`))
   *  .catch(console.error);
   */
  setChannelPositions(channelPositions) {
    return this.client.rest.methods.updateChannelPositions(this.id, channelPositions);
  }

  /**
   * Creates a new role in the guild with given information
   * @param {RoleData} [data] The data to update the role with
   * @returns {Promise<Role>}
   * @example
   * // create a new role
   * guild.createRole()
   *  .then(role => console.log(`Created role ${role}`))
   *  .catch(console.error);
   * @example
   * // create a new role with data
   * guild.createRole({
   *   name: 'Super Cool People',
   *   color: 'BLUE',
   * })
   * .then(role => console.log(`Created role ${role}`))
   * .catch(console.error)
   */
  createRole(data = {}) {
    return this.client.rest.methods.createGuildRole(this, data);
  }

  /**
   * Set the position of a role in this guild
   * @param {Role|Snowflake} role the role to edit, can be a role object or a role ID.
   * @param {number} position the new position of the role
   * @param {boolean} [relative=false] Position moves the role relative to its current position
   * @returns {Promise<Guild>}
   */
  setRolePosition(role, position, relative = false) {
    if (typeof role === 'string') {
      role = this.roles.get(role);
      if (!role) return Promise.reject(new Error('Supplied role is not a role or string.'));
    }

    position = Number(position);
    if (isNaN(position)) return Promise.reject(new Error('Supplied position is not a number.'));

    let updatedRoles = Object.assign([], this.roles.array()
      .sort((r1, r2) => r1.position !== r2.position ? r1.position - r2.position : r1.id - r2.id));

    Util.moveElementInArray(updatedRoles, role, position, relative);

    updatedRoles = updatedRoles.map((r, i) => ({ id: r.id, position: i }));
    return this.client.rest.methods.setRolePositions(this.id, updatedRoles);
  }

  /**
   * Creates a new custom emoji in the guild.
   * @param {BufferResolvable|Base64Resolvable} attachment The image for the emoji.
   * @param {string} name The name for the emoji.
   * @param {Collection<Snowflake, Role>|Role[]} [roles] Roles to limit the emoji to
   * @returns {Promise<Emoji>} The created emoji.
   * @example
   * // create a new emoji from a url
   * guild.createEmoji('https://i.imgur.com/w3duR07.png', 'rip')
   *  .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *  .catch(console.error);
   * @example
   * // create a new emoji from a file on your computer
   * guild.createEmoji('./memes/banana.png', 'banana')
   *  .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *  .catch(console.error);
   */
  createEmoji(attachment, name, roles) {
    return new Promise(resolve => {
      if (typeof attachment === 'string' && attachment.startsWith('data:')) {
        resolve(this.client.rest.methods.createEmoji(this, attachment, name, roles));
      } else {
        this.client.resolver.resolveBuffer(attachment).then(data => {
          const dataURI = this.client.resolver.resolveBase64(data);
          resolve(this.client.rest.methods.createEmoji(this, dataURI, name, roles));
        });
      }
    });
  }

  /**
   * Delete an emoji.
   * @param {Emoji|string} emoji The emoji to delete.
   * @returns {Promise}
   */
  deleteEmoji(emoji) {
    if (!(emoji instanceof Emoji)) emoji = this.emojis.get(emoji);
    return this.client.rest.methods.deleteEmoji(emoji);
  }

  /**
   * Causes the Client to leave the guild.
   * @returns {Promise<Guild>}
   * @example
   * // leave a guild
   * guild.leave()
   *  .then(g => console.log(`Left the guild ${g}`))
   *  .catch(console.error);
   */
  leave() {
    return this.client.rest.methods.leaveGuild(this);
  }

  /**
   * Causes the Client to delete the guild.
   * @returns {Promise<Guild>}
   * @example
   * // delete a guild
   * guild.delete()
   *  .then(g => console.log(`Deleted the guild ${g}`))
   *  .catch(console.error);
   */
  delete() {
    return this.client.rest.methods.deleteGuild(this);
  }

  /**
   * Marks all messages in this guild as read
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<Guild>} this guild
   */
  acknowledge() {
    return this.client.rest.methods.ackGuild(this);
  }

  /**
   * Whether this Guild equals another Guild. It compares all properties, so for most operations
   * it is advisable to just compare `guild.id === guild2.id` as it is much faster and is often
   * what most users need.
   * @param {Guild} guild Guild to compare with
   * @returns {boolean}
   */
  equals(guild) {
    let equal =
      guild &&
      this.id === guild.id &&
      this.available === !guild.unavailable &&
      this.splash === guild.splash &&
      this.region === guild.region &&
      this.name === guild.name &&
      this.memberCount === guild.member_count &&
      this.large === guild.large &&
      this.icon === guild.icon &&
      Util.arraysEqual(this.features, guild.features) &&
      this.ownerID === guild.owner_id &&
      this.verificationLevel === guild.verification_level &&
      this.embedEnabled === guild.embed_enabled;

    if (equal) {
      if (this.embedChannel) {
        if (this.embedChannel.id !== guild.embed_channel_id) equal = false;
      } else if (guild.embed_channel_id) {
        equal = false;
      }
    }

    return equal;
  }

  /**
   * When concatenated with a string, this automatically concatenates the guild's name instead of the Guild object.
   * @returns {string}
   * @example
   * // logs: Hello from My Guild!
   * console.log(`Hello from ${guild}!`);
   * @example
   * // logs: Hello from My Guild!
   * console.log(`Hello from ' + guild + '!');
   */
  toString() {
    return this.name;
  }

  _addMember(guildUser, emitEvent = true) {
    const existing = this.members.has(guildUser.user.id);
    if (!(guildUser.user instanceof User)) guildUser.user = this.client.dataManager.newUser(guildUser.user);

    guildUser.joined_at = guildUser.joined_at || 0;
    const member = new GuildMember(this, guildUser);
    this.members.set(member.id, member);

    if (this._rawVoiceStates && this._rawVoiceStates.has(member.user.id)) {
      const voiceState = this._rawVoiceStates.get(member.user.id);
      member.serverMute = voiceState.mute;
      member.serverDeaf = voiceState.deaf;
      member.selfMute = voiceState.self_mute;
      member.selfDeaf = voiceState.self_deaf;
      member.voiceSessionID = voiceState.session_id;
      member.voiceChannelID = voiceState.channel_id;
      if (this.client.channels.has(voiceState.channel_id)) {
        this.client.channels.get(voiceState.channel_id).members.set(member.user.id, member);
      } else {
        this.client.emit('warn', `Member ${member.id} added in guild ${this.id} with an uncached voice channel`);
      }
    }

    /**
     * Emitted whenever a user joins a guild.
     * @event Client#guildMemberAdd
     * @param {GuildMember} member The member that has joined a guild
     */
    if (this.client.ws.status === Constants.Status.READY && emitEvent && !existing) {
      this.client.emit(Constants.Events.GUILD_MEMBER_ADD, member);
    }

    return member;
  }

  _updateMember(member, data) {
    const oldMember = Util.cloneObject(member);

    if (data.roles) member._roles = data.roles;
    if (typeof data.nick !== 'undefined') member.nickname = data.nick;

    const notSame = member.nickname !== oldMember.nickname || !Util.arraysEqual(member._roles, oldMember._roles);

    if (this.client.ws.status === Constants.Status.READY && notSame) {
      /**
       * Emitted whenever a guild member changes - i.e. new role, removed role, nickname
       * @event Client#guildMemberUpdate
       * @param {GuildMember} oldMember The member before the update
       * @param {GuildMember} newMember The member after the update
       */
      this.client.emit(Constants.Events.GUILD_MEMBER_UPDATE, oldMember, member);
    }

    return {
      old: oldMember,
      mem: member,
    };
  }

  _removeMember(guildMember) {
    this.members.delete(guildMember.id);
  }

  _memberSpeakUpdate(user, speaking) {
    const member = this.members.get(user);
    if (member && member.speaking !== speaking) {
      member.speaking = speaking;
      /**
       * Emitted once a guild member starts/stops speaking
       * @event Client#guildMemberSpeaking
       * @param {GuildMember} member The member that started/stopped speaking
       * @param {boolean} speaking Whether or not the member is speaking
       */
      this.client.emit(Constants.Events.GUILD_MEMBER_SPEAKING, member, speaking);
    }
  }

  _setPresence(id, presence) {
    if (this.presences.get(id)) {
      this.presences.get(id).update(presence);
      return;
    }
    this.presences.set(id, new Presence(presence));
  }
}

module.exports = Guild;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const Channel = __webpack_require__(8);
const Role = __webpack_require__(10);
const PermissionOverwrites = __webpack_require__(39);
const Permissions = __webpack_require__(6);
const Collection = __webpack_require__(3);

/**
 * Represents a guild channel (i.e. text channels and voice channels)
 * @extends {Channel}
 */
class GuildChannel extends Channel {
  constructor(guild, data) {
    super(guild.client, data);

    /**
     * The guild the channel is in
     * @type {Guild}
     */
    this.guild = guild;
  }

  setup(data) {
    super.setup(data);

    /**
     * The name of the guild channel
     * @type {string}
     */
    this.name = data.name;

    /**
     * The position of the channel in the list.
     * @type {number}
     */
    this.position = data.position;

    /**
     * A map of permission overwrites in this channel for roles and users.
     * @type {Collection<Snowflake, PermissionOverwrites>}
     */
    this.permissionOverwrites = new Collection();
    if (data.permission_overwrites) {
      for (const overwrite of data.permission_overwrites) {
        this.permissionOverwrites.set(overwrite.id, new PermissionOverwrites(this, overwrite));
      }
    }
  }

  /**
   * Gets the overall set of permissions for a user in this channel, taking into account roles and permission
   * overwrites.
   * @param {GuildMemberResolvable} member The user that you want to obtain the overall permissions for
   * @returns {?Permissions}
   */
  permissionsFor(member) {
    member = this.client.resolver.resolveGuildMember(this.guild, member);
    if (!member) return null;
    if (member.id === this.guild.ownerID) return new Permissions(member, Permissions.ALL);

    let permissions = 0;

    const roles = member.roles;
    for (const role of roles.values()) permissions |= role.permissions;

    const overwrites = this.overwritesFor(member, true, roles);

    if (overwrites.everyone) {
      permissions &= ~overwrites.everyone.deny;
      permissions |= overwrites.everyone.allow;
    }

    let allow = 0;
    for (const overwrite of overwrites.roles) {
      permissions &= ~overwrite.deny;
      allow |= overwrite.allow;
    }
    permissions |= allow;

    if (overwrites.member) {
      permissions &= ~overwrites.member.deny;
      permissions |= overwrites.member.allow;
    }

    const admin = Boolean(permissions & Permissions.FLAGS.ADMINISTRATOR);
    if (admin) permissions = Permissions.ALL;

    return new Permissions(member, permissions);
  }

  overwritesFor(member, verified = false, roles = null) {
    if (!verified) member = this.client.resolver.resolveGuildMember(this.guild, member);
    if (!member) return [];

    roles = roles || member.roles;
    const roleOverwrites = [];
    let memberOverwrites;
    let everyoneOverwrites;

    for (const overwrite of this.permissionOverwrites.values()) {
      if (overwrite.id === this.guild.id) {
        everyoneOverwrites = overwrite;
      } else if (roles.has(overwrite.id)) {
        roleOverwrites.push(overwrite);
      } else if (overwrite.id === member.id) {
        memberOverwrites = overwrite;
      }
    }

    return {
      everyone: everyoneOverwrites,
      roles: roleOverwrites,
      member: memberOverwrites,
    };
  }

  /**
   * An object mapping permission flags to `true` (enabled) or `false` (disabled)
   * ```js
   * {
   *  'SEND_MESSAGES': true,
   *  'ATTACH_FILES': false,
   * }
   * ```
   * @typedef {Object} PermissionOverwriteOptions
   */

  /**
   * Overwrites the permissions for a user or role in this channel.
   * @param {RoleResolvable|UserResolvable} userOrRole The user or role to update
   * @param {PermissionOverwriteOptions} options The configuration for the update
   * @returns {Promise}
   * @example
   * // overwrite permissions for a message author
   * message.channel.overwritePermissions(message.author, {
   *  SEND_MESSAGES: false
   * })
   * .then(() => console.log('Done!'))
   * .catch(console.error);
   */
  overwritePermissions(userOrRole, options) {
    const payload = {
      allow: 0,
      deny: 0,
    };

    if (userOrRole instanceof Role) {
      payload.type = 'role';
    } else if (this.guild.roles.has(userOrRole)) {
      userOrRole = this.guild.roles.get(userOrRole);
      payload.type = 'role';
    } else {
      userOrRole = this.client.resolver.resolveUser(userOrRole);
      payload.type = 'member';
      if (!userOrRole) return Promise.reject(new TypeError('Supplied parameter was neither a User nor a Role.'));
    }

    payload.id = userOrRole.id;

    const prevOverwrite = this.permissionOverwrites.get(userOrRole.id);

    if (prevOverwrite) {
      payload.allow = prevOverwrite.allow;
      payload.deny = prevOverwrite.deny;
    }

    for (const perm in options) {
      if (options[perm] === true) {
        payload.allow |= Permissions.FLAGS[perm] || 0;
        payload.deny &= ~(Permissions.FLAGS[perm] || 0);
      } else if (options[perm] === false) {
        payload.allow &= ~(Permissions.FLAGS[perm] || 0);
        payload.deny |= Permissions.FLAGS[perm] || 0;
      } else if (options[perm] === null) {
        payload.allow &= ~(Permissions.FLAGS[perm] || 0);
        payload.deny &= ~(Permissions.FLAGS[perm] || 0);
      }
    }

    return this.client.rest.methods.setChannelOverwrite(this, payload);
  }

  /**
   * The data for a guild channel
   * @typedef {Object} ChannelData
   * @property {string} [name] The name of the channel
   * @property {number} [position] The position of the channel
   * @property {string} [topic] The topic of the text channel
   * @property {number} [bitrate] The bitrate of the voice channel
   * @property {number} [userLimit] The user limit of the channel
   */

  /**
   * Edits the channel
   * @param {ChannelData} data The new data for the channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // edit a channel
   * channel.edit({name: 'new-channel'})
   *  .then(c => console.log(`Edited channel ${c}`))
   *  .catch(console.error);
   */
  edit(data) {
    return this.client.rest.methods.updateChannel(this, data);
  }

  /**
   * Set a new name for the guild channel
   * @param {string} name The new name for the guild channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // set a new channel name
   * channel.setName('not_general')
   *  .then(newChannel => console.log(`Channel's new name is ${newChannel.name}`))
   *  .catch(console.error);
   */
  setName(name) {
    return this.edit({ name });
  }

  /**
   * Set a new position for the guild channel
   * @param {number} position The new position for the guild channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // set a new channel position
   * channel.setPosition(2)
   *  .then(newChannel => console.log(`Channel's new position is ${newChannel.position}`))
   *  .catch(console.error);
   */
  setPosition(position) {
    return this.client.rest.methods.updateChannel(this, { position });
  }

  /**
   * Set a new topic for the guild channel
   * @param {string} topic The new topic for the guild channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // set a new channel topic
   * channel.setTopic('needs more rate limiting')
   *  .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
   *  .catch(console.error);
   */
  setTopic(topic) {
    return this.client.rest.methods.updateChannel(this, { topic });
  }

  /**
   * Options given when creating a guild channel invite
   * @typedef {Object} InviteOptions

   */

  /**
   * Create an invite to this guild channel
   * @param {InviteOptions} [options={}] Options for the invite
   * @param {boolean} [options.temporary=false] Whether members that joined via the invite should be automatically
   * kicked after 24 hours if they have not yet received a role
   * @param {number} [options.maxAge=86400] How long the invite should last (in seconds, 0 for forever)
   * @param {number} [options.maxUses=0] Maximum number of uses
   * @returns {Promise<Invite>}
   */
  createInvite(options = {}) {
    return this.client.rest.methods.createChannelInvite(this, options);
  }

  /**
   * Clone this channel
   * @param {string} [name=this.name] Optional name for the new channel, otherwise it has the name of this channel
   * @param {boolean} [withPermissions=true] Whether to clone the channel with this channel's permission overwrites
   * @param {boolean} [withTopic=true] Whether to clone the channel with this channel's topic
   * @returns {Promise<GuildChannel>}
   */
  clone(name = this.name, withPermissions = true, withTopic = true) {
    return this.guild.createChannel(name, this.type, withPermissions ? this.permissionOverwrites : [])
      .then(channel => withTopic ? channel.setTopic(this.topic) : channel);
  }

  /**
   * Checks if this channel has the same type, topic, position, name, overwrites and ID as another channel.
   * In most cases, a simple `channel.id === channel2.id` will do, and is much faster too.
   * @param {GuildChannel} channel Channel to compare with
   * @returns {boolean}
   */
  equals(channel) {
    let equal = channel &&
      this.id === channel.id &&
      this.type === channel.type &&
      this.topic === channel.topic &&
      this.position === channel.position &&
      this.name === channel.name;

    if (equal) {
      if (this.permissionOverwrites && channel.permissionOverwrites) {
        equal = this.permissionOverwrites.equals(channel.permissionOverwrites);
      } else {
        equal = !this.permissionOverwrites && !channel.permissionOverwrites;
      }
    }

    return equal;
  }

  /**
   * Whether the channel is deletable by the client user.
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    return this.id !== this.guild.id &&
      this.permissionsFor(this.client.user).hasPermission(Permissions.FLAGS.MANAGE_CHANNELS);
  }

  /**
   * When concatenated with a string, this automatically returns the channel's mention instead of the Channel object.
   * @returns {string}
   * @example
   * // Outputs: Hello from #general
   * console.log(`Hello from ${channel}`);
   * @example
   * // Outputs: Hello from #general
   * console.log('Hello from ' + channel);
   */
  toString() {
    return `<#${this.id}>`;
  }
}

module.exports = GuildChannel;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const Channel = __webpack_require__(8);
const TextBasedChannel = __webpack_require__(14);
const Collection = __webpack_require__(3);

/*
{ type: 3,
  recipients:
   [ { username: 'Charlie',
       id: '123',
       discriminator: '6631',
       avatar: '123' },
     { username: 'Ben',
       id: '123',
       discriminator: '2055',
       avatar: '123' },
     { username: 'Adam',
       id: '123',
       discriminator: '2406',
       avatar: '123' } ],
  owner_id: '123',
  name: null,
  last_message_id: '123',
  id: '123',
  icon: null }
*/

/**
 * Represents a Group DM on Discord
 * @extends {Channel}
 * @implements {TextBasedChannel}
 */
class GroupDMChannel extends Channel {
  constructor(client, data) {
    super(client, data);
    this.type = 'group';
    this.messages = new Collection();
    this._typing = new Map();
  }

  setup(data) {
    super.setup(data);

    /**
     * The name of this Group DM, can be null if one isn't set.
     * @type {string}
     */
    this.name = data.name;

    /**
     * A hash of the Group DM icon.
     * @type {string}
     */
    this.icon = data.icon;

    /**
     * The user ID of this Group DM's owner.
     * @type {string}
     */
    this.ownerID = data.owner_id;

    /**
     * If the dm is managed by an application
     * @type {boolean}
     */
    this.managed = data.managed;

    /**
     * Application ID of the application that made this group dm, if applicable
     * @type {?string}
     */
    this.applicationID = data.application_id;

    /**
     * Nicknames for group members
     * @type {?Collection<Snowflake, String>}
     */
    if (data.nicks) this.nicks = new Collection(data.nicks.map(n => [n.id, n.nick]));

    if (!this.recipients) {
      /**
       * A collection of the recipients of this DM, mapped by their ID.
       * @type {Collection<Snowflake, User>}
       */
      this.recipients = new Collection();
    }

    if (data.recipients) {
      for (const recipient of data.recipients) {
        const user = this.client.dataManager.newUser(recipient);
        this.recipients.set(user.id, user);
      }
    }

    this.lastMessageID = data.last_message_id;
  }

  /**
   * The owner of this Group DM.
   * @type {User}
   * @readonly
   */
  get owner() {
    return this.client.users.get(this.ownerID);
  }

  /**
   * Whether this channel equals another channel. It compares all properties, so for most operations
   * it is advisable to just compare `channel.id === channel2.id` as it is much faster and is often
   * what most users need.
   * @param {GroupDMChannel} channel Channel to compare with
   * @returns {boolean}
   */
  equals(channel) {
    const equal = channel &&
      this.id === channel.id &&
      this.name === channel.name &&
      this.icon === channel.icon &&
      this.ownerID === channel.ownerID;

    if (equal) {
      return this.recipients.equals(channel.recipients);
    }

    return equal;
  }

  /**
   * Add a user to the dm
   * @param {UserResolvable|String} accessTokenOrID Access token or user resolvable
   * @param {string} [nick] Permanent nickname to give the user (only available if a bot is creating the dm)
   */

  addUser(accessTokenOrID, nick) {
    return this.client.rest.methods.addUserToGroupDM(this, {
      nick,
      id: this.client.resolver.resolveUserID(accessTokenOrID),
      accessToken: accessTokenOrID,
    });
  }

  /**
   * When concatenated with a string, this automatically concatenates the channel's name instead of the Channel object.
   * @returns {string}
   * @example
   * // logs: Hello from My Group DM!
   * console.log(`Hello from ${channel}!`);
   * @example
   * // logs: Hello from My Group DM!
   * console.log(`Hello from ' + channel + '!');
   */
  toString() {
    return this.name;
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
  sendMessage() {}
  sendEmbed() {}
  sendFile() {}
  sendFiles() {}
  sendCode() {}
  fetchMessage() {}
  fetchMessages() {}
  fetchPinnedMessages() {}
  search() {}
  startTyping() {}
  stopTyping() {}
  get typing() {}
  get typingCount() {}
  createCollector() {}
  awaitMessages() {}
  // Doesn't work on group DMs; bulkDelete() {}
  acknowledge() {}
  _cacheMessage() {}
}

TextBasedChannel.applyToClass(GroupDMChannel, true, ['bulkDelete']);

module.exports = GroupDMChannel;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/**
 * Represents a limited emoji set used for both custom and unicode emojis. Custom emojis
 * will use this class opposed to the Emoji class when the client doesn't know enough
 * information about them.
 */
class ReactionEmoji {
  constructor(reaction, name, id) {
    /**
     * The message reaction this emoji refers to
     * @type {MessageReaction}
     */
    this.reaction = reaction;

    /**
     * The name of this reaction emoji.
     * @type {string}
     */
    this.name = name;

    /**
     * The ID of this reaction emoji.
     * @type {?Snowflake}
     */
    this.id = id;
  }

  /**
   * The identifier of this emoji, used for message reactions
   * @type {string}
   * @readonly
   */
  get identifier() {
    if (this.id) return `${this.name}:${this.id}`;
    return encodeURIComponent(this.name);
  }

  /**
   * Creates the text required to form a graphical emoji on Discord.
   * @example
   * // send the emoji used in a reaction to the channel the reaction is part of
   * reaction.message.channel.sendMessage(`The emoji used is ${reaction.emoji}`);
   * @returns {string}
   */
  toString() {
    return this.id ? `<:${this.name}:${this.id}>` : this.name;
  }
}

module.exports = ReactionEmoji;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const path = __webpack_require__(24);

/**
 * Represents a webhook
 */
class Webhook {
  constructor(client, dataOrID, token) {
    if (client) {
      /**
       * The Client that instantiated the Webhook
       * @name Webhook#client
       * @type {Client}
       * @readonly
       */
      Object.defineProperty(this, 'client', { value: client });
      if (dataOrID) this.setup(dataOrID);
    } else {
      this.id = dataOrID;
      this.token = token;
      Object.defineProperty(this, 'client', { value: this });
    }
  }

  setup(data) {
    /**
     * The name of the webhook
     * @type {string}
     */
    this.name = data.name;

    /**
     * The token for the webhook
     * @type {string}
     */
    this.token = data.token;

    /**
     * The avatar for the webhook
     * @type {string}
     */
    this.avatar = data.avatar;

    /**
     * The ID of the webhook
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The guild the webhook belongs to
     * @type {Snowflake}
     */
    this.guildID = data.guild_id;

    /**
     * The channel the webhook belongs to
     * @type {Snowflake}
     */
    this.channelID = data.channel_id;

    if (data.user) {
      /**
       * The owner of the webhook
       * @type {?User|Object}
       */
      this.owner = this.client.users ? this.client.users.get(data.user.id) : data.user;
    } else {
      this.owner = null;
    }
  }

  /**
   * Options that can be passed into send, sendMessage, sendFile, sendEmbed, and sendCode
   * @typedef {Object} WebhookMessageOptions
   * @property {string} [username=this.name] Username override for the message
   * @property {string} [avatarURL] Avatar URL override for the message
   * @property {boolean} [tts=false] Whether or not the message should be spoken aloud
   * @property {string} [nonce=''] The nonce for the message
   * @property {Object[]} [embeds] An array of embeds for the message
   * (see [here](https://discordapp.com/developers/docs/resources/channel#embed-object) for more details)
   * @property {boolean} [disableEveryone=this.client.options.disableEveryone] Whether or not @everyone and @here
   * should be replaced with plain-text
   * @property {FileOptions|string} [file] A file to send with the message
   * @property {string|boolean} [code] Language for optional codeblock formatting to apply
   * @property {boolean|SplitOptions} [split=false] Whether or not the message should be split into multiple messages if
   * it exceeds the character limit. If an object is provided, these are the options for splitting the message.
   */

  /**
   * Send a message with this webhook
   * @param {StringResolvable} content The content to send.
   * @param {WebhookMessageOptions} [options={}] The options to provide.
   * @returns {Promise<Message|Message[]>}
   * @example
   * // send a message
   * webhook.send('hello!')
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
        this.client.rest.methods.sendWebhookMessage(this, content, options, {
          file,
          name: options.file.name,
        })
      );
    }
    return this.client.rest.methods.sendWebhookMessage(this, content, options);
  }

  /**
   * Send a message with this webhook
   * @param {StringResolvable} content The content to send.
   * @param {WebhookMessageOptions} [options={}] The options to provide.
   * @returns {Promise<Message|Message[]>}
   * @example
   * // send a message
   * webhook.sendMessage('hello!')
   *  .then(message => console.log(`Sent message: ${message.content}`))
   *  .catch(console.error);
   */
  sendMessage(content, options = {}) {
    return this.send(content, options);
  }

  /**
   * Send a file with this webhook
   * @param {BufferResolvable} attachment The file to send
   * @param {string} [name='file.jpg'] The name and extension of the file
   * @param {StringResolvable} [content] Text message to send with the attachment
   * @param {WebhookMessageOptions} [options] The options to provide
   * @returns {Promise<Message>}
   */
  sendFile(attachment, name, content, options = {}) {
    return this.send(content, Object.assign(options, { file: { attachment, name } }));
  }

  /**
   * Send a code block with this webhook
   * @param {string} lang Language for the code block
   * @param {StringResolvable} content Content of the code block
   * @param {WebhookMessageOptions} options The options to provide
   * @returns {Promise<Message|Message[]>}
   */
  sendCode(lang, content, options = {}) {
    return this.send(content, Object.assign(options, { code: lang }));
  }

  /**
   * Send a raw slack message with this webhook
   * @param {Object} body The raw body to send.
   * @returns {Promise}
   * @example
   * // send a slack message
   * webhook.sendSlackMessage({
   *   'username': 'Wumpus',
   *   'attachments': [{
   *     'pretext': 'this looks pretty cool',
   *     'color': '#F0F',
   *     'footer_icon': 'http://snek.s3.amazonaws.com/topSnek.png',
   *     'footer': 'Powered by sneks',
   *     'ts': Date.now() / 1000
   *   }]
   * }).catch(console.error);
   */
  sendSlackMessage(body) {
    return this.client.rest.methods.sendSlackWebhookMessage(this, body);
  }

  /**
   * Edit the webhook.
   * @param {string} name The new name for the Webhook
   * @param {BufferResolvable} avatar The new avatar for the Webhook.
   * @returns {Promise<Webhook>}
   */
  edit(name = this.name, avatar) {
    if (avatar) {
      return this.client.resolver.resolveBuffer(avatar).then(file => {
        const dataURI = this.client.resolver.resolveBase64(file);
        return this.client.rest.methods.editWebhook(this, name, dataURI);
      });
    }
    return this.client.rest.methods.editWebhook(this, name).then(data => {
      this.setup(data);
      return this;
    });
  }

  /**
   * Delete the webhook
   * @returns {Promise}
   */
  delete() {
    return this.client.rest.methods.deleteWebhook(this);
  }
}

module.exports = Webhook;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(52)
var ieee754 = __webpack_require__(54)
var isArray = __webpack_require__(55)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(64)))

/***/ }),
/* 23 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = this;
}

var Emitter = __webpack_require__(53);
var RequestBase = __webpack_require__(60);
var isObject = __webpack_require__(26);
var isFunction = __webpack_require__(59);
var ResponseBase = __webpack_require__(61);
var shouldRetry = __webpack_require__(62);

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = exports = module.exports = function(method, url) {
  // callback
  if ('function' == typeof url) {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
}

exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  throw Error("Browser-only verison of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function(v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for(var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
      status = 204;
  }
  this._setStatusProperties(status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);

  if (null === this.text && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method != 'HEAD'
      ? this._parseBody(this.text ? this.text : this.xhr.response)
      : null;
  }
}

ResponseBase(Response.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function(str){
  var parse = request.parse[this.type];
  if(this.req._parser) {
    return this.req._parser(this, str);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
        new_err.original = err;
        new_err.response = res;
        new_err.status = res.status;
      }
    } catch(e) {
      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

Emitter(Request.prototype);
RequestBase(Request.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (!options) {
    options = {
      type: 'function' === typeof btoa ? 'basic' : 'auto',
    }
  }

  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + btoa(user + ':' + pass));
    break;

    case 'auto':
      this.username = user;
      this.password = pass;
    break;
  }
  return this;
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, options){
  if (this._data) {
    throw Error("superagent can't mix .send() and .attach()");
  }

  this._getFormData().append(field, file, options || file.name);
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  // console.log(this._retries, this._maxRetries)
  if (this._maxRetries && this._retries++ < this._maxRetries && shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

// This only warns, because the request is still likely to work
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
  console.warn("This is not supported in browser version of superagent");
  return this;
};

// This throws, because it can't send/receive data as expected
Request.prototype.pipe = Request.prototype.write = function(){
  throw Error("Streaming is not supported in browser version of superagent");
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */

Request.prototype._appendQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');
      if (isFunction(this._sort)) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }
      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
Request.prototype._isHost = function _isHost(obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
}

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  if (this._endCalled) {
    console.warn("Warning: .end() was called twice. This is not supported in superagent");
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._appendQueryString();

  return this._end();
};

Request.prototype._end = function() {
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var data = this._formData || this._data;

  this._setTimeouts();

  // state change
  xhr.onreadystatechange = function(){
    var readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (4 != readyState) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  }
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch(e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function(url, data, fn){
  var req = request('OPTIONS', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn){
  var req = request('DELETE', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {const path = __webpack_require__(24);
const fs = __webpack_require__(43);
const request = __webpack_require__(25);

const Constants = __webpack_require__(0);
const convertToBuffer = __webpack_require__(4).convertToBuffer;
const User = __webpack_require__(11);
const Message = __webpack_require__(9);
const Guild = __webpack_require__(16);
const Channel = __webpack_require__(8);
const GuildMember = __webpack_require__(13);
const Emoji = __webpack_require__(12);
const ReactionEmoji = __webpack_require__(20);

/**
 * The DataResolver identifies different objects and tries to resolve a specific piece of information from them, e.g.
 * extracting a User from a Message object.
 * @private
 */
class ClientDataResolver {
  /**
   * @param {Client} client The client the resolver is for
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Data that resolves to give a User object. This can be:
   * * A User object
   * * A user ID
   * * A Message object (resolves to the message author)
   * * A Guild object (owner of the guild)
   * * A GuildMember object
   * @typedef {User|Snowflake|Message|Guild|GuildMember} UserResolvable
   */

  /**
   * Resolves a UserResolvable to a User object
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {?User}
   */
  resolveUser(user) {
    if (user instanceof User) return user;
    if (typeof user === 'string') return this.client.users.get(user) || null;
    if (user instanceof GuildMember) return user.user;
    if (user instanceof Message) return user.author;
    if (user instanceof Guild) return user.owner;
    return null;
  }

  /**
   * Resolves a UserResolvable to a user ID string
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {?Snowflake}
   */
  resolveUserID(user) {
    if (user instanceof User || user instanceof GuildMember) return user.id;
    if (typeof user === 'string') return user || null;
    if (user instanceof Message) return user.author.id;
    if (user instanceof Guild) return user.ownerID;
    return null;
  }

  /**
   * Data that resolves to give a Guild object. This can be:
   * * A Guild object
   * * A Guild ID
   * @typedef {Guild|Snowflake} GuildResolvable
   */

  /**
   * Resolves a GuildResolvable to a Guild object
   * @param {GuildResolvable} guild The GuildResolvable to identify
   * @returns {?Guild}
   */
  resolveGuild(guild) {
    if (guild instanceof Guild) return guild;
    if (typeof guild === 'string') return this.client.guilds.get(guild) || null;
    return null;
  }

  /**
   * Data that resolves to give a GuildMember object. This can be:
   * * A GuildMember object
   * * A User object
   * @typedef {Guild} GuildMemberResolvable
   */

  /**
   * Resolves a GuildMemberResolvable to a GuildMember object
   * @param {GuildResolvable} guild The guild that the member is part of
   * @param {UserResolvable} user The user that is part of the guild
   * @returns {?GuildMember}
   */
  resolveGuildMember(guild, user) {
    if (user instanceof GuildMember) return user;
    guild = this.resolveGuild(guild);
    user = this.resolveUser(user);
    if (!guild || !user) return null;
    return guild.members.get(user.id) || null;
  }

  /**
   * Data that can be resolved to give a Channel object. This can be:
   * * A Channel object
   * * A Message object (the channel the message was sent in)
   * * A Guild object (the #general channel)
   * * A channel ID
   * @typedef {Channel|Guild|Message|Snowflake} ChannelResolvable
   */

  /**
   * Resolves a ChannelResolvable to a Channel object
   * @param {ChannelResolvable} channel The channel resolvable to resolve
   * @returns {?Channel}
   */
  resolveChannel(channel) {
    if (channel instanceof Channel) return channel;
    if (typeof channel === 'string') return this.client.channels.get(channel) || null;
    if (channel instanceof Message) return channel.channel;
    if (channel instanceof Guild) return channel.channels.get(channel.id) || null;
    return null;
  }

  /**
   * Resolves a ChannelResolvable to a channel ID
   * @param {ChannelResolvable} channel The channel resolvable to resolve
   * @returns {?Snowflake}
   */
  resolveChannelID(channel) {
    if (channel instanceof Channel) return channel.id;
    if (typeof channel === 'string') return channel;
    if (channel instanceof Message) return channel.channel.id;
    if (channel instanceof Guild) return channel.defaultChannel.id;
    return null;
  }

  /**
   * Data that can be resolved to give an invite code. This can be:
   * * An invite code
   * * An invite URL
   * @typedef {string} InviteResolvable
   */

  /**
   * Resolves InviteResolvable to an invite code
   * @param {InviteResolvable} data The invite resolvable to resolve
   * @returns {string}
   */
  resolveInviteCode(data) {
    const inviteRegex = /discord(?:app\.com\/invite|\.gg)\/([\w-]{2,255})/i;
    const match = inviteRegex.exec(data);
    if (match && match[1]) return match[1];
    return data;
  }

  /**
   * Data that can be resolved to give a string. This can be:
   * * A string
   * * An array (joined with a new line delimiter to give a string)
   * * Any value
   * @typedef {string|Array|*} StringResolvable
   */

  /**
   * Resolves a StringResolvable to a string
   * @param {StringResolvable} data The string resolvable to resolve
   * @returns {string}
   */
  resolveString(data) {
    if (typeof data === 'string') return data;
    if (data instanceof Array) return data.join('\n');
    return String(data);
  }

  /**
   * Data that resolves to give a Base64 string, typically for image uploading. This can be:
   * * A Buffer
   * * A base64 string
   * @typedef {Buffer|string} Base64Resolvable
   */

  /**
   * Resolves a Base64Resolvable to a Base 64 image
   * @param {Base64Resolvable} data The base 64 resolvable you want to resolve
   * @returns {?string}
   */
  resolveBase64(data) {
    if (data instanceof Buffer) return `data:image/jpg;base64,${data.toString('base64')}`;
    return data;
  }

  /**
   * Data that can be resolved to give a Buffer. This can be:
   * * A Buffer
   * * The path to a local file
   * * A URL
   * @typedef {string|Buffer} BufferResolvable
   */

  /**
   * Resolves a BufferResolvable to a Buffer
   * @param {BufferResolvable} resource The buffer resolvable to resolve
   * @returns {Promise<Buffer>}
   */
  resolveBuffer(resource) {
    if (resource instanceof Buffer) return Promise.resolve(resource);
    if (this.client.browser && resource instanceof ArrayBuffer) return Promise.resolve(convertToBuffer(resource));

    if (typeof resource === 'string') {
      return new Promise((resolve, reject) => {
        if (/^https?:\/\//.test(resource)) {
          const req = request.get(resource).set('Content-Type', 'blob');
          if (this.client.browser) req.responseType('arraybuffer');
          req.end((err, res) => {
            if (err) return reject(err);
            if (this.client.browser) return resolve(convertToBuffer(res.xhr.response));
            if (!(res.body instanceof Buffer)) return reject(new TypeError('The response body isn\'t a Buffer.'));
            return resolve(res.body);
          });
        } else {
          const file = path.resolve(resource);
          fs.stat(file, (err, stats) => {
            if (err) return reject(err);
            if (!stats || !stats.isFile()) return reject(new Error(`The file could not be found: ${file}`));
            fs.readFile(file, (err2, data) => {
              if (err2) reject(err2); else resolve(data);
            });
            return null;
          });
        }
      });
    }

    return Promise.reject(new TypeError('The resource must be a string or Buffer.'));
  }

  /**
   * Data that can be resolved to give an emoji identifier. This can be:
   * * A string
   * * An Emoji
   * * A ReactionEmoji
   * @typedef {string|Emoji|ReactionEmoji} EmojiIdentifierResolvable
   */

  /**
   * Resolves an EmojiResolvable to an emoji identifier
   * @param {EmojiIdentifierResolvable} emoji The emoji resolvable to resolve
   * @returns {string}
   */
  resolveEmojiIdentifier(emoji) {
    if (emoji instanceof Emoji || emoji instanceof ReactionEmoji) return emoji.identifier;
    if (typeof emoji === 'string') {
      if (!emoji.includes('%')) return encodeURIComponent(emoji);
    }
    return null;
  }

  /**
   * Can be a Hex Literal, Hex String, Number, RGB Array, or one of the following
   * ```
   * [
   *   'DEFAULT',
   *   'AQUA',
   *   'GREEN',
   *   'BLUE',
   *   'PURPLE',
   *   'GOLD',
   *   'ORANGE',
   *   'RED',
   *   'GREY',
   *   'DARKER_GREY',
   *   'NAVY',
   *   'DARK_AQUA',
   *   'DARK_GREEN',
   *   'DARK_BLUE',
   *   'DARK_PURPLE',
   *   'DARK_GOLD',
   *   'DARK_ORANGE',
   *   'DARK_RED',
   *   'DARK_GREY',
   *   'LIGHT_GREY',
   *   'DARK_NAVY',
   *   'RANDOM',
   * ]
   * ```
   * or something like
   * ```
   * [255, 0, 255]
   * ```
   * for purple
   * @typedef {String|number|Array} ColorResolvable
   */

  /**
   * Resolves a ColorResolvable into a color number
   * @param {ColorResolvable} color Color to resolve
   * @returns {number} A color
   */
  static resolveColor(color) {
    if (typeof color === 'string') {
      if (color === 'RANDOM') return Math.floor(Math.random() * (0xFFFFFF + 1));
      color = Constants.Colors[color] || parseInt(color.replace('#', ''), 16);
    } else if (color instanceof Array) {
      color = (color[0] << 16) + (color[1] << 8) + color[2];
    }

    if (color < 0 || color > 0xFFFFFF) {
      throw new RangeError('Color must be within the range 0 - 16777215 (0xFFFFFF).');
    } else if (color && isNaN(color)) {
      throw new TypeError('Unable to convert color to a number.');
    }

    return color;
  }

  /**
   * @param {ColorResolvable} color Color to resolve
   * @returns {number} A color
   */
  resolveColor(color) {
    return this.constructor.resolveColor(color);
  }
}

module.exports = ClientDataResolver;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22).Buffer))

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = {
	"name": "discord.js",
	"version": "11.0.0",
	"description": "A powerful library for interacting with the Discord API",
	"main": "./src/index",
	"types": "./typings/index.d.ts",
	"scripts": {
		"test": "npm run lint && npm run docs:test",
		"docs": "docgen --source src --custom docs/index.yml --output docs/docs.json",
		"docs:test": "docgen --source src --custom docs/index.yml",
		"lint": "eslint src",
		"lint:fix": "eslint --fix src",
		"webpack": "parallel-webpack"
	},
	"repository": {
		"type": "git",
		"url": "git+https://github.com/hydrabolt/discord.js.git"
	},
	"keywords": [
		"discord",
		"api",
		"bot",
		"client",
		"node",
		"discordapp"
	],
	"author": "Amish Shah <amishshah.2k@gmail.com>",
	"license": "Apache-2.0",
	"bugs": {
		"url": "https://github.com/hydrabolt/discord.js/issues"
	},
	"homepage": "https://github.com/hydrabolt/discord.js#readme",
	"runkitExampleFilename": "./docs/examples/ping.js",
	"dependencies": {
		"@types/node": "^7.0.0",
		"long": "^3.2.0",
		"prism-media": "hydrabolt/prism-media",
		"superagent": "^3.4.0",
		"tweetnacl": "^0.14.0",
		"ws": "^2.0.0"
	},
	"peerDependencies": {
		"bufferutil": "^2.0.0",
		"erlpack": "hammerandchisel/erlpack",
		"node-opus": "^0.2.0",
		"opusscript": "^0.0.2",
		"sodium": "^2.0.1",
		"uws": "^0.14.1"
	},
	"devDependencies": {
		"discord.js-docgen": "hydrabolt/discord.js-docgen",
		"eslint": "^3.17.0",
		"parallel-webpack": "^1.6.0",
		"uglify-js": "mishoo/UglifyJS2#harmony",
		"webpack": "^2.2.0"
	},
	"engines": {
		"node": ">=6.0.0"
	},
	"browser": {
		"ws": false,
		"uws": false,
		"erlpack": false,
		"prism-media": false,
		"opusscript": false,
		"node-opus": false,
		"tweetnacl": false,
		"sodium": false,
		"src/sharding/Shard.js": false,
		"src/sharding/ShardClientUtil.js": false,
		"src/sharding/ShardingManager.js": false,
		"src/client/voice/dispatcher/StreamDispatcher.js": false,
		"src/client/voice/opus/BaseOpusEngine.js": false,
		"src/client/voice/opus/NodeOpusEngine.js": false,
		"src/client/voice/opus/OpusEngineList.js": false,
		"src/client/voice/opus/OpusScriptEngine.js": false,
		"src/client/voice/pcm/ConverterEngine.js": false,
		"src/client/voice/pcm/ConverterEngineList.js": false,
		"src/client/voice/pcm/FfmpegConverterEngine.js": false,
		"src/client/voice/player/AudioPlayer.js": false,
		"src/client/voice/receiver/VoiceReadable.js": false,
		"src/client/voice/receiver/VoiceReceiver.js": false,
		"src/client/voice/util/Secretbox.js": false,
		"src/client/voice/util/SecretKey.js": false,
		"src/client/voice/util/VolumeInterface.js": false,
		"src/client/voice/ClientVoiceManager.js": false,
		"src/client/voice/VoiceBroadcast.js": false,
		"src/client/voice/VoiceConnection.js": false,
		"src/client/voice/VoiceUDPClient.js": false,
		"src/client/voice/VoiceWebSocket.js": false
	}
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const User = __webpack_require__(11);
const Collection = __webpack_require__(3);

/**
 * Represents the logged in client's Discord user
 * @extends {User}
 */
class ClientUser extends User {
  setup(data) {
    super.setup(data);

    /**
     * Whether or not this account has been verified
     * @type {boolean}
     */
    this.verified = data.verified;

    /**
     * The email of this account
     * @type {string}
     */
    this.email = data.email;
    this.localPresence = {};
    this._typing = new Map();

    /**
     * A Collection of friends for the logged in user.
     * <warn>This is only filled when using a user account.</warn>
     * @type {Collection<Snowflake, User>}
     */
    this.friends = new Collection();

    /**
     * A Collection of blocked users for the logged in user.
     * <warn>This is only filled when using a user account.</warn>
     * @type {Collection<Snowflake, User>}
     */
    this.blocked = new Collection();

    /**
     * A Collection of notes for the logged in user.
     * <warn>This is only filled when using a user account.</warn>
     * @type {Collection<Snowflake, string>}
     */
    this.notes = new Collection();

    /**
     * Discord client settings, such as guild positions
     * <warn>This is only filled when using a user account.</warn>
     * @type {Object}
     */
    this.settings = {};

    /**
     * If the user has discord premium (nitro)
     * <warn>This is only filled when using a user account.</warn>
     * @type {?boolean}
     */
    this.premium = typeof data.premium === 'boolean' ? data.premium : null;

    /**
     * If the user has MFA enabled on their account
     * <warn>This is only filled when using a user account.</warn>
     * @type {?boolean}
     */
    this.mfaEnabled = typeof data.mfa_enabled === 'boolean' ? data.mfa_enabled : null;

    /**
     * If the user has ever used a mobile device on discord
     * <warn>This is only filled when using a user account.</warn>
     * @type {?boolean}
     */
    this.mobile = typeof data.mobile === 'boolean' ? data.mobile : null;
  }

  edit(data) {
    return this.client.rest.methods.updateCurrentUser(data);
  }

  /**
   * Set the username of the logged in Client.
   * <info>Changing usernames in Discord is heavily rate limited, with only 2 requests
   * every hour. Use this sparingly!</info>
   * @param {string} username The new username
   * @param {string} [password] Current password (only for user accounts)
   * @returns {Promise<ClientUser>}
   * @example
   * // set username
   * client.user.setUsername('discordjs')
   *  .then(user => console.log(`My new username is ${user.username}`))
   *  .catch(console.error);
   */
  setUsername(username, password) {
    return this.client.rest.methods.updateCurrentUser({ username }, password);
  }

  /**
   * Changes the email for the client user's account.
   * <warn>This is only available when using a user account.</warn>
   * @param {string} email New email to change to
   * @param {string} password Current password
   * @returns {Promise<ClientUser>}
   * @example
   * // set email
   * client.user.setEmail('bob@gmail.com', 'some amazing password 123')
   *  .then(user => console.log(`My new email is ${user.email}`))
   *  .catch(console.error);
   */
  setEmail(email, password) {
    return this.client.rest.methods.updateCurrentUser({ email }, password);
  }

  /**
   * Changes the password for the client user's account.
   * <warn>This is only available when using a user account.</warn>
   * @param {string} newPassword New password to change to
   * @param {string} oldPassword Current password
   * @returns {Promise<ClientUser>}
   * @example
   * // set password
   * client.user.setPassword('some new amazing password 456', 'some amazing password 123')
   *  .then(user => console.log('New password set!'))
   *  .catch(console.error);
   */
  setPassword(newPassword, oldPassword) {
    return this.client.rest.methods.updateCurrentUser({ password: newPassword }, oldPassword);
  }

  /**
   * Set the avatar of the logged in Client.
   * @param {BufferResolvable|Base64Resolvable} avatar The new avatar
   * @returns {Promise<ClientUser>}
   * @example
   * // set avatar
   * client.user.setAvatar('./avatar.png')
   *  .then(user => console.log(`New avatar set!`))
   *  .catch(console.error);
   */
  setAvatar(avatar) {
    if (typeof avatar === 'string' && avatar.startsWith('data:')) {
      return this.client.rest.methods.updateCurrentUser({ avatar });
    } else {
      return this.client.resolver.resolveBuffer(avatar).then(data =>
        this.client.rest.methods.updateCurrentUser({ avatar: data })
      );
    }
  }

  /**
   * Data resembling a raw Discord presence
   * @typedef {Object} PresenceData
   * @property {PresenceStatus} [status] Status of the user
   * @property {boolean} [afk] Whether the user is AFK
   * @property {Object} [game] Game the user is playing
   * @property {string} [game.name] Name of the game
   * @property {string} [game.url] Twitch stream URL
   */

  /**
   * Sets the full presence of the client user.
   * @param {PresenceData} data Data for the presence
   * @returns {Promise<ClientUser>}
   */
  setPresence(data) {
    // {"op":3,"d":{"status":"dnd","since":0,"game":null,"afk":false}}
    return new Promise(resolve => {
      let status = this.localPresence.status || this.presence.status;
      let game = this.localPresence.game;
      let afk = this.localPresence.afk || this.presence.afk;

      if (!game && this.presence.game) {
        game = {
          name: this.presence.game.name,
          type: this.presence.game.type,
          url: this.presence.game.url,
        };
      }

      if (data.status) {
        if (typeof data.status !== 'string') throw new TypeError('Status must be a string');
        status = data.status;
      }

      if (data.game) {
        game = data.game;
        if (game.url) game.type = 1;
      }

      if (data.game === null) game = null;

      if (typeof data.afk !== 'undefined') afk = data.afk;
      afk = Boolean(afk);

      this.localPresence = { status, game, afk };
      this.localPresence.since = 0;
      this.localPresence.game = this.localPresence.game || null;

      this.client.ws.send({
        op: 3,
        d: this.localPresence,
      });

      this.client._setPresence(this.id, this.localPresence);

      resolve(this);
    });
  }

  /**
   * A user's status. Must be one of:
   * - `online`
   * - `idle`
   * - `invisible`
   * - `dnd` (do not disturb)
   * @typedef {string} PresenceStatus
   */

  /**
   * Sets the status of the client user.
   * @param {PresenceStatus} status Status to change to
   * @returns {Promise<ClientUser>}
   */
  setStatus(status) {
    return this.setPresence({ status });
  }

  /**
   * Sets the game the client user is playing.
   * @param {?string} game Game being played
   * @param {string} [streamingURL] Twitch stream URL
   * @returns {Promise<ClientUser>}
   */
  setGame(game, streamingURL) {
    if (game === null) return this.setPresence({ game });
    return this.setPresence({ game: {
      name: game,
      url: streamingURL,
    } });
  }

  /**
   * Sets/removes the AFK flag for the client user.
   * @param {boolean} afk Whether or not the user is AFK
   * @returns {Promise<ClientUser>}
   */
  setAFK(afk) {
    return this.setPresence({ afk });
  }

  /**
   * Fetches messages that mentioned the client's user
   * @param {Object} [options] Options for the fetch
   * @param {number} [options.limit=25] Maximum number of mentions to retrieve
   * @param {boolean} [options.roles=true] Whether to include role mentions
   * @param {boolean} [options.everyone=true] Whether to include everyone/here mentions
   * @param {Guild|Snowflake} [options.guild] Limit the search to a specific guild
   * @returns {Promise<Message[]>}
   */
  fetchMentions(options = { limit: 25, roles: true, everyone: true, guild: null }) {
    return this.client.rest.methods.fetchMentions(options);
  }

  /**
   * Send a friend request
   * <warn>This is only available when using a user account.</warn>
   * @param {UserResolvable} user The user to send the friend request to.
   * @returns {Promise<User>} The user the friend request was sent to.
   */
  addFriend(user) {
    user = this.client.resolver.resolveUser(user);
    return this.client.rest.methods.addFriend(user);
  }

  /**
   * Remove a friend
   * <warn>This is only available when using a user account.</warn>
   * @param {UserResolvable} user The user to remove from your friends
   * @returns {Promise<User>} The user that was removed
   */
  removeFriend(user) {
    user = this.client.resolver.resolveUser(user);
    return this.client.rest.methods.removeFriend(user);
  }

  /**
   * Creates a guild
   * <warn>This is only available when using a user account.</warn>
   * @param {string} name The name of the guild
   * @param {string} region The region for the server
   * @param {BufferResolvable|Base64Resolvable} [icon=null] The icon for the guild
   * @returns {Promise<Guild>} The guild that was created
   */
  createGuild(name, region, icon = null) {
    if (!icon) return this.client.rest.methods.createGuild({ name, icon, region });
    if (typeof icon === 'string' && icon.startsWith('data:')) {
      return this.client.rest.methods.createGuild({ name, icon, region });
    } else {
      return this.client.resolver.resolveBuffer(icon).then(data =>
        this.client.rest.methods.createGuild({ name, icon: data, region })
      );
    }
  }

  /**
   * An object containing either a user or access token, and an optional nickname
   * @typedef {Object} GroupDMRecipientOptions
   * @property {UserResolvable|Snowflake} [user] User to add to the group DM
   * (only available if a user is creating the DM)
   * @property {string} [accessToken] Access token to use to add a user to the group DM
   * (only available if a bot is creating the DM)
   * @property {string} [nick] Permanent nickname (only available if a bot is creating the DM)
   */

  /**
   * Creates a group DM
   * @param {GroupDMRecipientOptions[]} recipients The recipients
   * @returns {Promise<GroupDMChannel>}
   */
  createGroupDM(recipients) {
    return this.client.rest.methods.createGroupDM({
      recipients: recipients.map(u => this.client.resolver.resolveUserID(u.user)),
      accessTokens: recipients.map(u => u.accessToken),
      nicks: recipients.map(u => u.nick),
    });
  }

  /**
   * Accepts an invite to join a guild
   * <warn>This is only available when using a user account.</warn>
   * @param {Invite|string} invite Invite or code to accept
   * @returns {Promise<Guild>} Joined guild
   */
  acceptInvite(invite) {
    return this.client.rest.methods.acceptInvite(invite);
  }
}

module.exports = ClientUser;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

const Channel = __webpack_require__(8);
const TextBasedChannel = __webpack_require__(14);
const Collection = __webpack_require__(3);

/**
 * Represents a direct message channel between two users.
 * @extends {Channel}
 * @implements {TextBasedChannel}
 */
class DMChannel extends Channel {
  constructor(client, data) {
    super(client, data);
    this.type = 'dm';
    this.messages = new Collection();
    this._typing = new Map();
  }

  setup(data) {
    super.setup(data);

    /**
     * The recipient on the other end of the DM
     * @type {User}
     */
    this.recipient = this.client.dataManager.newUser(data.recipients[0]);

    this.lastMessageID = data.last_message_id;
  }

  /**
   * When concatenated with a string, this automatically concatenates the recipient's mention instead of the
   * DM channel object.
   * @returns {string}
   */
  toString() {
    return this.recipient.toString();
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
  sendMessage() {}
  sendEmbed() {}
  sendFile() {}
  sendFiles() {}
  sendCode() {}
  fetchMessage() {}
  fetchMessages() {}
  fetchPinnedMessages() {}
  search() {}
  startTyping() {}
  stopTyping() {}
  get typing() {}
  get typingCount() {}
  createCollector() {}
  awaitMessages() {}
  // Doesn't work on DM channels; bulkDelete() {}
  acknowledge() {}
  _cacheMessage() {}
}

TextBasedChannel.applyToClass(DMChannel, true, ['bulkDelete']);

module.exports = DMChannel;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const PartialGuild = __webpack_require__(37);
const PartialGuildChannel = __webpack_require__(38);
const Constants = __webpack_require__(0);

/*
{ max_age: 86400,
  code: 'CG9A5',
  guild:
   { splash: null,
     id: '123123123',
     icon: '123123123',
     name: 'name' },
  created_at: '2016-08-28T19:07:04.763368+00:00',
  temporary: false,
  uses: 0,
  max_uses: 0,
  inviter:
   { username: '123',
     discriminator: '4204',
     bot: true,
     id: '123123123',
     avatar: '123123123' },
  channel: { type: 0, id: '123123', name: 'heavy-testing' } }
*/

/**
 * Represents an invitation to a guild channel.
 * <warn>The only guaranteed properties are `code`, `guild` and `channel`. Other properties can be missing.</warn>
 */
class Invite {
  constructor(client, data) {
    /**
     * The client that instantiated the invite
     * @name Invite#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    this.setup(data);
  }

  setup(data) {
    /**
     * The guild the invite is for. If this guild is already known, this will be a Guild object. If the guild is
     * unknown, this will be a PartialGuild object.
     * @type {Guild|PartialGuild}
     */
    this.guild = this.client.guilds.get(data.guild.id) || new PartialGuild(this.client, data.guild);

    /**
     * The code for this invite
     * @type {string}
     */
    this.code = data.code;

    /**
     * Whether or not this invite is temporary
     * @type {boolean}
     */
    this.temporary = data.temporary;

    /**
     * The maximum age of the invite, in seconds
     * @type {?number}
     */
    this.maxAge = data.max_age;

    /**
     * How many times this invite has been used
     * @type {number}
     */
    this.uses = data.uses;

    /**
     * The maximum uses of this invite
     * @type {number}
     */
    this.maxUses = data.max_uses;

    if (data.inviter) {
      /**
       * The user who created this invite
       * @type {User}
       */
      this.inviter = this.client.dataManager.newUser(data.inviter);
    }

    /**
     * The channel the invite is for. If this channel is already known, this will be a GuildChannel object.
     * If the channel is unknown, this will be a PartialGuildChannel object.
     * @type {GuildChannel|PartialGuildChannel}
     */
    this.channel = this.client.channels.get(data.channel.id) || new PartialGuildChannel(this.client, data.channel);

    /**
     * The timestamp the invite was created at
     * @type {number}
     */
    this.createdTimestamp = new Date(data.created_at).getTime();
  }

  /**
   * The time the invite was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The timestamp the invite will expire at
   * @type {number}
   * @readonly
   */
  get expiresTimestamp() {
    return this.createdTimestamp + (this.maxAge * 1000);
  }

  /**
   * The time the invite will expire
   * @type {Date}
   * @readonly
   */
  get expiresAt() {
    return new Date(this.expiresTimestamp);
  }

  /**
   * The URL to the invite
   * @type {string}
   * @readonly
   */
  get url() {
    return Constants.Endpoints.inviteLink(this.code);
  }

  /**
   * Deletes this invite
   * @returns {Promise<Invite>}
   */
  delete() {
    return this.client.rest.methods.deleteInvite(this);
  }

  /**
   * When concatenated with a string, this automatically concatenates the invite's URL instead of the object.
   * @returns {string}
   * @example
   * // logs: Invite: https://discord.gg/A1b2C3
   * console.log(`Invite: ${invite}`);
   */
  toString() {
    return this.url;
  }
}

module.exports = Invite;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

/**
 * Represents an attachment in a message
 */
class MessageAttachment {
  constructor(message, data) {
    /**
     * The Client that instantiated this MessageAttachment.
     * @name MessageAttachment#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: message.client });

    /**
     * The message this attachment is part of.
     * @type {Message}
     */
    this.message = message;

    this.setup(data);
  }

  setup(data) {
    /**
     * The ID of this attachment
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The file name of this attachment
     * @type {string}
     */
    this.filename = data.filename;

    /**
     * The size of this attachment in bytes
     * @type {number}
     */
    this.filesize = data.size;

    /**
     * The URL to this attachment
     * @type {string}
     */
    this.url = data.url;

    /**
     * The Proxy URL to this attachment
     * @type {string}
     */
    this.proxyURL = data.proxy_url;

    /**
     * The height of this attachment (if an image)
     * @type {?number}
     */
    this.height = data.height;

    /**
     * The width of this attachment (if an image)
     * @type {?number}
     */
    this.width = data.width;
  }
}

module.exports = MessageAttachment;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

const EventEmitter = __webpack_require__(23).EventEmitter;
const Collection = __webpack_require__(3);

/**
 * Collects messages based on a specified filter, then emits them.
 * @extends {EventEmitter}
 */
class MessageCollector extends EventEmitter {
  /**
   * A function that takes a Message object and a MessageCollector and returns a boolean.
   * ```js
   * function(message, collector) {
   *  if (message.content.includes('discord')) {
   *    return true; // passed the filter test
   *  }
   *  return false; // failed the filter test
   * }
   * ```
   * @typedef {Function} CollectorFilterFunction
   */

  /**
   * An object containing options used to configure a MessageCollector. All properties are optional.
   * @typedef {Object} CollectorOptions
   * @property {number} [time] Duration for the collector in milliseconds
   * @property {number} [max] Maximum number of messages to handle
   * @property {number} [maxMatches] Maximum number of successfully filtered messages to obtain
   */

  /**
   * @param {Channel} channel The channel to collect messages in
   * @param {CollectorFilterFunction} filter The filter function
   * @param {CollectorOptions} [options] Options for the collector
   */
  constructor(channel, filter, options = {}) {
    super();

    /**
     * The channel this collector is operating on
     * @type {Channel}
     */
    this.channel = channel;

    /**
     * A function used to filter messages that the collector collects.
     * @type {CollectorFilterFunction}
     */
    this.filter = filter;

    /**
     * Options for the collecor.
     * @type {CollectorOptions}
     */
    this.options = options;

    /**
     * Whether this collector has stopped collecting messages.
     * @type {boolean}
     */
    this.ended = false;

    /**
     * A collection of collected messages, mapped by message ID.
     * @type {Collection<Snowflake, Message>}
     */
    this.collected = new Collection();

    this.listener = message => this.verify(message);
    this.channel.client.on('message', this.listener);
    if (options.time) this.channel.client.setTimeout(() => this.stop('time'), options.time);
  }

  /**
   * Verifies a message against the filter and options
   * @private
   * @param {Message} message The message
   * @returns {boolean}
   */
  verify(message) {
    if (this.channel ? this.channel.id !== message.channel.id : false) return false;
    if (this.filter(message, this)) {
      this.collected.set(message.id, message);
      /**
       * Emitted whenever the collector receives a message that passes the filter test.
       * @param {Message} message The received message
       * @param {MessageCollector} collector The collector the message passed through
       * @event MessageCollector#message
       */
      this.emit('message', message, this);
      if (this.collected.size >= this.options.maxMatches) this.stop('matchesLimit');
      else if (this.options.max && this.collected.size === this.options.max) this.stop('limit');
      return true;
    }
    return false;
  }

  /**
   * Returns a promise that resolves when a valid message is sent. Rejects
   * with collected messages if the Collector ends before receiving a message.
   * @type {Promise<Message>}
   * @readonly
   */
  get next() {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        reject(this.collected);
        return;
      }

      const cleanup = () => {
        this.removeListener('message', onMessage);
        this.removeListener('end', onEnd);
      };

      const onMessage = (...args) => {
        cleanup();
        resolve(...args);
      };

      const onEnd = (...args) => {
        cleanup();
        reject(...args); // eslint-disable-line prefer-promise-reject-errors
      };

      this.once('message', onMessage);
      this.once('end', onEnd);
    });
  }

  /**
   * Stops the collector and emits `end`.
   * @param {string} [reason='user'] An optional reason for stopping the collector
   */
  stop(reason = 'user') {
    if (this.ended) return;
    this.ended = true;
    this.channel.client.removeListener('message', this.listener);
    /**
     * Emitted when the Collector stops collecting.
     * @param {Collection<Snowflake, Message>} collection A collection of messages collected
     * during the lifetime of the collector, mapped by the ID of the messages.
     * @param {string} reason The reason for the end of the collector. If it ended because it reached the specified time
     * limit, this would be `time`. If you invoke `.stop()` without specifying a reason, this would be `user`. If it
     * ended because it reached its message limit, it will be `limit`.
     * @event MessageCollector#end
     */
    this.emit('end', this.collected, reason);
  }
}

module.exports = MessageCollector;


/***/ }),
/* 34 */
/***/ (function(module, exports) {

/**
 * Represents an embed in a message (image/video preview, rich embed, etc.)
 * <info>This class is only used for *recieved* embeds. If you wish to send one, use the {@link RichEmbed} class.</info>
 */
class MessageEmbed {
  constructor(message, data) {
    /**
     * The client that instantiated this embed
     * @name MessageEmbed#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: message.client });

    /**
     * The message this embed is part of
     * @type {Message}
     */
    this.message = message;

    this.setup(data);
  }

  setup(data) {
    /**
     * The type of this embed
     * @type {string}
     */
    this.type = data.type;

    /**
     * The title of this embed, if there is one
     * @type {?string}
     */
    this.title = data.title;

    /**
     * The description of this embed, if there is one
     * @type {?string}
     */
    this.description = data.description;

    /**
     * The URL of this embed
     * @type {string}
     */
    this.url = data.url;

    /**
     * The color of the embed
     * @type {number}
     */
    this.color = data.color;

    /**
     * The fields of this embed
     * @type {MessageEmbedField[]}
     */
    this.fields = [];
    if (data.fields) for (const field of data.fields) this.fields.push(new MessageEmbedField(this, field));

    /**
     * The timestamp of this embed
     * @type {number}
     */
    this.createdTimestamp = data.timestamp;

    /**
     * The thumbnail of this embed, if there is one
     * @type {?MessageEmbedThumbnail}
     */
    this.thumbnail = data.thumbnail ? new MessageEmbedThumbnail(this, data.thumbnail) : null;

    /**
     * The image of this embed, if there is one
     * @type {?MessageEmbedImage}
     */
    this.image = data.image ? new MessageEmbedImage(this, data.image) : null;

    /**
     * The video of this embed, if there is one
     * @type {?MessageEmbedVideo}
     */
    this.video = data.video ? new MessageEmbedVideo(this, data.video) : null;

    /**
     * The author of this embed, if there is one
     * @type {?MessageEmbedAuthor}
     */
    this.author = data.author ? new MessageEmbedAuthor(this, data.author) : null;

    /**
     * The provider of this embed, if there is one
     * @type {?MessageEmbedProvider}
     */
    this.provider = data.provider ? new MessageEmbedProvider(this, data.provider) : null;

    /**
     * The footer of this embed
     * @type {?MessageEmbedFooter}
     */
    this.footer = data.footer ? new MessageEmbedFooter(this, data.footer) : null;
  }

  /**
   * The date this embed was created
   * @type {Date}
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The hexadecimal version of the embed color, with a leading hash.
   * @type {string}
   * @readonly
   */
  get hexColor() {
    let col = this.color.toString(16);
    while (col.length < 6) col = `0${col}`;
    return `#${col}`;
  }
}

/**
 * Represents a thumbnail for a message embed
 */
class MessageEmbedThumbnail {
  constructor(embed, data) {
    /**
     * The embed this thumbnail is part of
     * @type {MessageEmbed}
     */
    this.embed = embed;

    this.setup(data);
  }

  setup(data) {
    /**
     * The URL for this thumbnail
     * @type {string}
     */
    this.url = data.url;

    /**
     * The Proxy URL for this thumbnail
     * @type {string}
     */
    this.proxyURL = data.proxy_url;

    /**
     * The height of the thumbnail
     * @type {number}
     */
    this.height = data.height;

    /**
     * The width of the thumbnail
     * @type {number}
     */
    this.width = data.width;
  }
}

/**
 * Represents an image for a message embed
 */
class MessageEmbedImage {
  constructor(embed, data) {
    /**
     * The embed this image is part of
     * @type {MessageEmbed}
     */
    this.embed = embed;

    this.setup(data);
  }

  setup(data) {
    /**
     * The URL for this image
     * @type {string}
     */
    this.url = data.url;

    /**
     * The Proxy URL for this image
     * @type {string}
     */
    this.proxyURL = data.proxy_url;

    /**
     * The height of the image
     * @type {number}
     */
    this.height = data.height;

    /**
     * The width of the image
     * @type {number}
     */
    this.width = data.width;
  }
}

/**
 * Represents a video for a message embed
 */
class MessageEmbedVideo {
  constructor(embed, data) {
    /**
     * The embed this video is part of
     * @type {MessageEmbed}
     */
    this.embed = embed;

    this.setup(data);
  }

  setup(data) {
    /**
     * The source URL for this video
     * @type {string}
     */
    this.url = data.url;

    /**
     * The height of the video
     * @type {number}
     */
    this.height = data.height;

    /**
     * The width of the video
     * @type {number}
     */
    this.width = data.width;
  }
}

/**
 * Represents a provider for a message embed
 */
class MessageEmbedProvider {
  constructor(embed, data) {
    /**
     * The embed this provider is part of
     * @type {MessageEmbed}
     */
    this.embed = embed;

    this.setup(data);
  }

  setup(data) {
    /**
     * The name of this provider
     * @type {string}
     */
    this.name = data.name;

    /**
     * The URL of this provider
     * @type {string}
     */
    this.url = data.url;
  }
}

/**
 * Represents an author for a message embed
 */
class MessageEmbedAuthor {
  constructor(embed, data) {
    /**
     * The embed this author is part of
     * @type {MessageEmbed}
     */
    this.embed = embed;

    this.setup(data);
  }

  setup(data) {
    /**
     * The name of this author
     * @type {string}
     */
    this.name = data.name;

    /**
     * The URL of this author
     * @type {string}
     */
    this.url = data.url;

    /**
     * The icon URL of this author
     * @type {string}
     */
    this.iconURL = data.icon_url;
  }
}

/**
 * Represents a field for a message embed
 */
class MessageEmbedField {
  constructor(embed, data) {
    /**
     * The embed this footer is part of
     * @type {MessageEmbed}
     */
    this.embed = embed;

    this.setup(data);
  }

  setup(data) {
    /**
     * The name of this field
     * @type {string}
     */
    this.name = data.name;

    /**
     * The value of this field
     * @type {string}
     */
    this.value = data.value;

    /**
     * If this field is displayed inline
     * @type {boolean}
     */
    this.inline = data.inline;
  }
}

/**
 * Represents the footer of a message embed
 */
class MessageEmbedFooter {
  constructor(embed, data) {
    /**
     * The embed this footer is part of
     * @type {MessageEmbed}
     */
    this.embed = embed;

    this.setup(data);
  }

  setup(data) {
    /**
     * The text in this footer
     * @type {string}
     */
    this.text = data.text;

    /**
     * The icon URL of this footer
     * @type {string}
     */
    this.iconURL = data.icon_url;

    /**
     * The proxy icon URL of this footer
     * @type {string}
     */
    this.proxyIconUrl = data.proxy_icon_url;
  }
}

MessageEmbed.Thumbnail = MessageEmbedThumbnail;
MessageEmbed.Image = MessageEmbedImage;
MessageEmbed.Video = MessageEmbedVideo;
MessageEmbed.Provider = MessageEmbedProvider;
MessageEmbed.Author = MessageEmbedAuthor;
MessageEmbed.Field = MessageEmbedField;
MessageEmbed.Footer = MessageEmbedFooter;

module.exports = MessageEmbed;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(3);
const Emoji = __webpack_require__(12);
const ReactionEmoji = __webpack_require__(20);

/**
 * Represents a reaction to a message
 */
class MessageReaction {
  constructor(message, emoji, count, me) {
    /**
     * The message that this reaction refers to
     * @type {Message}
     */
    this.message = message;

    /**
     * Whether the client has given this reaction
     * @type {boolean}
     */
    this.me = me;

    /**
     * The number of people that have given the same reaction.
     * @type {number}
     */
    this.count = count || 0;

    /**
     * The users that have given this reaction, mapped by their ID.
     * @type {Collection<Snowflake, User>}
     */
    this.users = new Collection();

    this._emoji = new ReactionEmoji(this, emoji.name, emoji.id);
  }

  /**
   * The emoji of this reaction, either an Emoji object for known custom emojis, or a ReactionEmoji
   * object which has fewer properties. Whatever the prototype of the emoji, it will still have
   * `name`, `id`, `identifier` and `toString()`
   * @type {Emoji|ReactionEmoji}
   */
  get emoji() {
    if (this._emoji instanceof Emoji) return this._emoji;
    // Check to see if the emoji has become known to the client
    if (this._emoji.id) {
      const emojis = this.message.client.emojis;
      if (emojis.has(this._emoji.id)) {
        const emoji = emojis.get(this._emoji.id);
        this._emoji = emoji;
        return emoji;
      }
    }
    return this._emoji;
  }

  /**
   * Removes a user from this reaction.
   * @param {UserResolvable} [user=this.message.client.user] User to remove the reaction of
   * @returns {Promise<MessageReaction>}
   */
  remove(user = this.message.client.user) {
    const message = this.message;
    user = this.message.client.resolver.resolveUserID(user);
    if (!user) return Promise.reject(new Error('Couldn\'t resolve the user ID to remove from the reaction.'));
    return message.client.rest.methods.removeMessageReaction(
      message, this.emoji.identifier, user
    );
  }

  /**
   * Fetch all the users that gave this reaction. Resolves with a collection of users, mapped by their IDs.
   * @param {number} [limit=100] the maximum amount of users to fetch, defaults to 100
   * @returns {Promise<Collection<Snowflake, User>>}
   */
  fetchUsers(limit = 100) {
    const message = this.message;
    return message.client.rest.methods.getMessageReactionUsers(
      message, this.emoji.identifier, limit
    ).then(users => {
      this.users = new Collection();
      for (const rawUser of users) {
        const user = this.message.client.dataManager.newUser(rawUser);
        this.users.set(user.id, user);
      }
      this.count = this.users.size;
      return this.users;
    });
  }
}

module.exports = MessageReaction;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

const Snowflake = __webpack_require__(5);

/**
 * Represents an OAuth2 Application
 */
class OAuth2Application {
  constructor(client, data) {
    /**
     * The client that instantiated the application
     * @name OAuth2Application#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    this.setup(data);
  }

  setup(data) {
    /**
     * The ID of the app
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of the app
     * @type {string}
     */
    this.name = data.name;

    /**
     * The app's description
     * @type {string}
     */
    this.description = data.description;

    /**
     * The app's icon hash
     * @type {string}
     */
    this.icon = data.icon;

    /**
     * The app's icon URL
     * @type {string}
     */
    this.iconURL = `https://cdn.discordapp.com/app-icons/${this.id}/${this.icon}.jpg`;

    /**
     * The app's RPC origins
     * @type {?string[]}
     */
    this.rpcOrigins = data.rpc_origins;

    /**
     * The app's redirect URIs
     * @type {string[]}
     */
    this.redirectURIs = data.redirect_uris;

    /**
     * If this app's bot requires a code grant when using the oauth2 flow
     * @type {boolean}
     */
    this.botRequireCodeGrant = data.bot_require_code_grant;

    /**
     * If this app's bot is public
     * @type {boolean}
     */
    this.botPublic = data.bot_public;

    /**
     * If this app can use rpc
     * @type {boolean}
     */
    this.rpcApplicationState = data.rpc_application_state;

    /**
     * Object containing basic info about this app's bot
     * @type {Object}
     */
    this.bot = data.bot;

    /**
     * Flags for the app
     * @type {number}
     */
    this.flags = data.flags;

    /**
     * OAuth2 secret for the application
     * @type {boolean}
     */
    this.secret = data.secret;
  }

  /**
   * The timestamp the app was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the app was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * Reset the app's secret and bot token
   * @returns {OAuth2Application}
   */
  reset() {
    return this.client.rest.methods.resetApplication(this.id);
  }

  /**
   * When concatenated with a string, this automatically concatenates the app name rather than the app object.
   * @returns {string}
   */
  toString() {
    return this.name;
  }
}

module.exports = OAuth2Application;


/***/ }),
/* 37 */
/***/ (function(module, exports) {

/*
{ splash: null,
     id: '123123123',
     icon: '123123123',
     name: 'name' }
*/

/**
 * Represents a guild that the client only has limited information for - e.g. from invites.
 */
class PartialGuild {
  constructor(client, data) {
    /**
     * The Client that instantiated this PartialGuild
     * @name PartialGuild#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    this.setup(data);
  }

  setup(data) {
    /**
     * The ID of this guild
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of this guild
     * @type {string}
     */
    this.name = data.name;

    /**
     * The hash of this guild's icon, or null if there is none.
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * The hash of the guild splash image, or null if no splash (VIP only)
     * @type {?string}
     */
    this.splash = data.splash;
  }
}

module.exports = PartialGuild;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

const Constants = __webpack_require__(0);

/*
{ type: 0, id: '123123', name: 'heavy-testing' } }
*/

/**
 * Represents a guild channel that the client only has limited information for - e.g. from invites.
 */
class PartialGuildChannel {
  constructor(client, data) {
    /**
     * The Client that instantiated this PartialGuildChannel
     * @name PartialGuildChannel#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    this.setup(data);
  }

  setup(data) {
    /**
     * The ID of this guild channel
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of this guild channel
     * @type {string}
     */
    this.name = data.name;

    /**
     * The type of this guild channel - `text` or `voice`
     * @type {string}
     */
    this.type = Constants.ChannelTypes.TEXT === data.type ? 'text' : 'voice';
  }
}

module.exports = PartialGuildChannel;


/***/ }),
/* 39 */
/***/ (function(module, exports) {

/**
 * Represents a permission overwrite for a role or member in a guild channel.
 */
class PermissionOverwrites {
  constructor(guildChannel, data) {
    /**
     * The GuildChannel this overwrite is for
     * @name PermissionOverwrites#channel
     * @type {GuildChannel}
     * @readonly
     */
    Object.defineProperty(this, 'channel', { value: guildChannel });

    if (data) this.setup(data);
  }

  setup(data) {
    /**
     * The ID of this overwrite, either a user ID or a role ID
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The type of this overwrite
     * @type {string}
     */
    this.type = data.type;

    this.deny = data.deny;
    this.allow = data.allow;
  }

  /**
   * Delete this Permission Overwrite.
   * @returns {Promise<PermissionOverwrites>}
   */
  delete() {
    return this.channel.client.rest.methods.deletePermissionOverwrites(this);
  }
}

module.exports = PermissionOverwrites;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

const GuildChannel = __webpack_require__(17);
const TextBasedChannel = __webpack_require__(14);
const Collection = __webpack_require__(3);

/**
 * Represents a guild text channel on Discord.
 * @extends {GuildChannel}
 * @implements {TextBasedChannel}
 */
class TextChannel extends GuildChannel {
  constructor(guild, data) {
    super(guild, data);
    this.type = 'text';
    this.messages = new Collection();
    this._typing = new Map();
  }

  setup(data) {
    super.setup(data);

    /**
     * The topic of the text channel, if there is one.
     * @type {?string}
     */
    this.topic = data.topic;

    this.lastMessageID = data.last_message_id;
  }

  /**
   * A collection of members that can see this channel, mapped by their ID.
   * @type {Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get members() {
    const members = new Collection();
    for (const member of this.guild.members.values()) {
      if (this.permissionsFor(member).hasPermission('READ_MESSAGES')) {
        members.set(member.id, member);
      }
    }
    return members;
  }

  /**
   * Fetch all webhooks for the channel.
   * @returns {Promise<Collection<Snowflake, Webhook>>}
   */
  fetchWebhooks() {
    return this.client.rest.methods.getChannelWebhooks(this);
  }

  /**
   * Create a webhook for the channel.
   * @param {string} name The name of the webhook.
   * @param {BufferResolvable|Base64Resolvable} avatar The avatar for the webhook.
   * @returns {Promise<Webhook>} webhook The created webhook.
   * @example
   * channel.createWebhook('Snek', 'http://snek.s3.amazonaws.com/topSnek.png')
   *  .then(webhook => console.log(`Created Webhook ${webhook}`))
   *  .catch(console.error)
   */
  createWebhook(name, avatar) {
    return new Promise(resolve => {
      if (typeof avatar === 'string' && avatar.startsWith('data:')) {
        resolve(this.client.rest.methods.createWebhook(this, name, avatar));
      } else {
        this.client.resolver.resolveBuffer(avatar).then(data =>
           resolve(this.client.rest.methods.createWebhook(this, name, data))
        );
      }
    });
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
  sendMessage() {}
  sendEmbed() {}
  sendFile() {}
  sendFiles() {}
  sendCode() {}
  fetchMessage() {}
  fetchMessages() {}
  fetchPinnedMessages() {}
  search() {}
  startTyping() {}
  stopTyping() {}
  get typing() {}
  get typingCount() {}
  createCollector() {}
  awaitMessages() {}
  bulkDelete() {}
  acknowledge() {}
  _cacheMessage() {}
}

TextBasedChannel.applyToClass(TextChannel, true);

module.exports = TextChannel;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

const GuildChannel = __webpack_require__(17);
const Collection = __webpack_require__(3);

/**
 * Represents a guild voice channel on Discord.
 * @extends {GuildChannel}
 */
class VoiceChannel extends GuildChannel {
  constructor(guild, data) {
    super(guild, data);

    /**
     * The members in this voice channel.
     * @type {Collection<Snowflake, GuildMember>}
     */
    this.members = new Collection();

    this.type = 'voice';
  }

  setup(data) {
    super.setup(data);

    /**
     * The bitrate of this voice channel
     * @type {number}
     */
    this.bitrate = data.bitrate;

    /**
     * The maximum amount of users allowed in this channel - 0 means unlimited.
     * @type {number}
     */
    this.userLimit = data.user_limit;
  }

  /**
   * The voice connection for this voice channel, if the client is connected
   * @type {?VoiceConnection}
   * @readonly
   */
  get connection() {
    const connection = this.guild.voiceConnection;
    if (connection && connection.channel.id === this.id) return connection;
    return null;
  }

  /**
   * Checks if the voice channel is full
   * @type {boolean}
   */
  get full() {
    return this.userLimit > 0 && this.members.size >= this.userLimit;
  }

  /**
   * Checks if the client has permission join the voice channel
   * @type {boolean}
   */
  get joinable() {
    if (this.client.browser) return false;
    if (!this.permissionsFor(this.client.user).hasPermission('CONNECT')) return false;
    if (this.full && !this.permissionsFor(this.client.user).hasPermission('MOVE_MEMBERS')) return false;
    return true;
  }

  /**
   * Checks if the client has permission to send audio to the voice channel
   * @type {boolean}
   */
  get speakable() {
    return this.permissionsFor(this.client.user).hasPermission('SPEAK');
  }

  /**
   * Sets the bitrate of the channel
   * @param {number} bitrate The new bitrate
   * @returns {Promise<VoiceChannel>}
   * @example
   * // set the bitrate of a voice channel
   * voiceChannel.setBitrate(48000)
   *  .then(vc => console.log(`Set bitrate to ${vc.bitrate} for ${vc.name}`))
   *  .catch(console.error);
   */
  setBitrate(bitrate) {
    return this.edit({ bitrate });
  }

  /**
   * Sets the user limit of the channel
   * @param {number} userLimit The new user limit
   * @returns {Promise<VoiceChannel>}
   * @example
   * // set the user limit of a voice channel
   * voiceChannel.setUserLimit(42)
   *  .then(vc => console.log(`Set user limit to ${vc.userLimit} for ${vc.name}`))
   *  .catch(console.error);
   */
  setUserLimit(userLimit) {
    return this.edit({ userLimit });
  }

  /**
   * Attempts to join this voice channel
   * @returns {Promise<VoiceConnection>}
   * @example
   * // join a voice channel
   * voiceChannel.join()
   *  .then(connection => console.log('Connected!'))
   *  .catch(console.error);
   */
  join() {
    if (this.client.browser) return Promise.reject(new Error('Voice connections are not available in browsers.'));
    return this.client.voice.joinChannel(this);
  }

  /**
   * Leaves this voice channel
   * @example
   * // leave a voice channel
   * voiceChannel.leave();
   */
  leave() {
    if (this.client.browser) return;
    const connection = this.client.voice.connections.get(this.guild.id);
    if (connection && connection.channel.id === this.id) connection.disconnect();
  }
}

module.exports = VoiceChannel;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 Copyright 2013 Daniel Wirtz <dcode@dcode.io>
 Copyright 2009 The Closure Library Authors. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS-IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * @license long.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/long.js for details
 */
(function(global, factory) {

    /* AMD */ if (true)
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    /* CommonJS */ else if (typeof require === 'function' && typeof module === "object" && module && module["exports"])
        module["exports"] = factory();
    /* Global */ else
        (global["dcodeIO"] = global["dcodeIO"] || {})["Long"] = factory();

})(this, function() {
    "use strict";

    /**
     * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
     *  See the from* functions below for more convenient ways of constructing Longs.
     * @exports Long
     * @class A Long class for representing a 64 bit two's-complement integer value.
     * @param {number} low The low (signed) 32 bits of the long
     * @param {number} high The high (signed) 32 bits of the long
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @constructor
     */
    function Long(low, high, unsigned) {

        /**
         * The low 32 bits as a signed value.
         * @type {number}
         */
        this.low = low | 0;

        /**
         * The high 32 bits as a signed value.
         * @type {number}
         */
        this.high = high | 0;

        /**
         * Whether unsigned or not.
         * @type {boolean}
         */
        this.unsigned = !!unsigned;
    }

    // The internal representation of a long is the two given signed, 32-bit values.
    // We use 32-bit pieces because these are the size of integers on which
    // Javascript performs bit-operations.  For operations like addition and
    // multiplication, we split each number into 16 bit pieces, which can easily be
    // multiplied within Javascript's floating-point representation without overflow
    // or change in sign.
    //
    // In the algorithms below, we frequently reduce the negative case to the
    // positive case by negating the input(s) and then post-processing the result.
    // Note that we must ALWAYS check specially whether those values are MIN_VALUE
    // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
    // a positive number, it overflows back into a negative).  Not handling this
    // case would often result in infinite recursion.
    //
    // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
    // methods on which they depend.

    /**
     * An indicator used to reliably determine if an object is a Long or not.
     * @type {boolean}
     * @const
     * @private
     */
    Long.prototype.__isLong__;

    Object.defineProperty(Long.prototype, "__isLong__", {
        value: true,
        enumerable: false,
        configurable: false
    });

    /**
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     * @inner
     */
    function isLong(obj) {
        return (obj && obj["__isLong__"]) === true;
    }

    /**
     * Tests if the specified object is a Long.
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     */
    Long.isLong = isLong;

    /**
     * A cache of the Long representations of small integer values.
     * @type {!Object}
     * @inner
     */
    var INT_CACHE = {};

    /**
     * A cache of the Long representations of small unsigned integer values.
     * @type {!Object}
     * @inner
     */
    var UINT_CACHE = {};

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromInt(value, unsigned) {
        var obj, cachedObj, cache;
        if (unsigned) {
            value >>>= 0;
            if (cache = (0 <= value && value < 256)) {
                cachedObj = UINT_CACHE[value];
                if (cachedObj)
                    return cachedObj;
            }
            obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
            if (cache)
                UINT_CACHE[value] = obj;
            return obj;
        } else {
            value |= 0;
            if (cache = (-128 <= value && value < 128)) {
                cachedObj = INT_CACHE[value];
                if (cachedObj)
                    return cachedObj;
            }
            obj = fromBits(value, value < 0 ? -1 : 0, false);
            if (cache)
                INT_CACHE[value] = obj;
            return obj;
        }
    }

    /**
     * Returns a Long representing the given 32 bit integer value.
     * @function
     * @param {number} value The 32 bit integer in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromInt = fromInt;

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromNumber(value, unsigned) {
        if (isNaN(value) || !isFinite(value))
            return unsigned ? UZERO : ZERO;
        if (unsigned) {
            if (value < 0)
                return UZERO;
            if (value >= TWO_PWR_64_DBL)
                return MAX_UNSIGNED_VALUE;
        } else {
            if (value <= -TWO_PWR_63_DBL)
                return MIN_VALUE;
            if (value + 1 >= TWO_PWR_63_DBL)
                return MAX_VALUE;
        }
        if (value < 0)
            return fromNumber(-value, unsigned).neg();
        return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
    }

    /**
     * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
     * @function
     * @param {number} value The number in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromNumber = fromNumber;

    /**
     * @param {number} lowBits
     * @param {number} highBits
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromBits(lowBits, highBits, unsigned) {
        return new Long(lowBits, highBits, unsigned);
    }

    /**
     * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
     *  assumed to use 32 bits.
     * @function
     * @param {number} lowBits The low 32 bits
     * @param {number} highBits The high 32 bits
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromBits = fromBits;

    /**
     * @function
     * @param {number} base
     * @param {number} exponent
     * @returns {number}
     * @inner
     */
    var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

    /**
     * @param {string} str
     * @param {(boolean|number)=} unsigned
     * @param {number=} radix
     * @returns {!Long}
     * @inner
     */
    function fromString(str, unsigned, radix) {
        if (str.length === 0)
            throw Error('empty string');
        if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
            return ZERO;
        if (typeof unsigned === 'number') {
            // For goog.math.long compatibility
            radix = unsigned,
            unsigned = false;
        } else {
            unsigned = !! unsigned;
        }
        radix = radix || 10;
        if (radix < 2 || 36 < radix)
            throw RangeError('radix');

        var p;
        if ((p = str.indexOf('-')) > 0)
            throw Error('interior hyphen');
        else if (p === 0) {
            return fromString(str.substring(1), unsigned, radix).neg();
        }

        // Do several (8) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 8));

        var result = ZERO;
        for (var i = 0; i < str.length; i += 8) {
            var size = Math.min(8, str.length - i),
                value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
                var power = fromNumber(pow_dbl(radix, size));
                result = result.mul(power).add(fromNumber(value));
            } else {
                result = result.mul(radixToPower);
                result = result.add(fromNumber(value));
            }
        }
        result.unsigned = unsigned;
        return result;
    }

    /**
     * Returns a Long representation of the given string, written using the specified radix.
     * @function
     * @param {string} str The textual representation of the Long
     * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
     * @returns {!Long} The corresponding Long value
     */
    Long.fromString = fromString;

    /**
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
     * @returns {!Long}
     * @inner
     */
    function fromValue(val) {
        if (val /* is compatible */ instanceof Long)
            return val;
        if (typeof val === 'number')
            return fromNumber(val);
        if (typeof val === 'string')
            return fromString(val);
        // Throws for non-objects, converts non-instanceof Long:
        return fromBits(val.low, val.high, val.unsigned);
    }

    /**
     * Converts the specified value to a Long.
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
     * @returns {!Long}
     */
    Long.fromValue = fromValue;

    // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
    // no runtime penalty for these.

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_16_DBL = 1 << 16;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_24_DBL = 1 << 24;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

    /**
     * @type {!Long}
     * @const
     * @inner
     */
    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

    /**
     * @type {!Long}
     * @inner
     */
    var ZERO = fromInt(0);

    /**
     * Signed zero.
     * @type {!Long}
     */
    Long.ZERO = ZERO;

    /**
     * @type {!Long}
     * @inner
     */
    var UZERO = fromInt(0, true);

    /**
     * Unsigned zero.
     * @type {!Long}
     */
    Long.UZERO = UZERO;

    /**
     * @type {!Long}
     * @inner
     */
    var ONE = fromInt(1);

    /**
     * Signed one.
     * @type {!Long}
     */
    Long.ONE = ONE;

    /**
     * @type {!Long}
     * @inner
     */
    var UONE = fromInt(1, true);

    /**
     * Unsigned one.
     * @type {!Long}
     */
    Long.UONE = UONE;

    /**
     * @type {!Long}
     * @inner
     */
    var NEG_ONE = fromInt(-1);

    /**
     * Signed negative one.
     * @type {!Long}
     */
    Long.NEG_ONE = NEG_ONE;

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

    /**
     * Maximum signed value.
     * @type {!Long}
     */
    Long.MAX_VALUE = MAX_VALUE;

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

    /**
     * Maximum unsigned value.
     * @type {!Long}
     */
    Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

    /**
     * @type {!Long}
     * @inner
     */
    var MIN_VALUE = fromBits(0, 0x80000000|0, false);

    /**
     * Minimum signed value.
     * @type {!Long}
     */
    Long.MIN_VALUE = MIN_VALUE;

    /**
     * @alias Long.prototype
     * @inner
     */
    var LongPrototype = Long.prototype;

    /**
     * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
     * @returns {number}
     */
    LongPrototype.toInt = function toInt() {
        return this.unsigned ? this.low >>> 0 : this.low;
    };

    /**
     * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
     * @returns {number}
     */
    LongPrototype.toNumber = function toNumber() {
        if (this.unsigned)
            return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };

    /**
     * Converts the Long to a string written in the specified radix.
     * @param {number=} radix Radix (2-36), defaults to 10
     * @returns {string}
     * @override
     * @throws {RangeError} If `radix` is out of range
     */
    LongPrototype.toString = function toString(radix) {
        radix = radix || 10;
        if (radix < 2 || 36 < radix)
            throw RangeError('radix');
        if (this.isZero())
            return '0';
        if (this.isNegative()) { // Unsigned Longs are never negative
            if (this.eq(MIN_VALUE)) {
                // We need to change the Long value before it can be negated, so we remove
                // the bottom-most digit in this base and then recurse to do the rest.
                var radixLong = fromNumber(radix),
                    div = this.div(radixLong),
                    rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
            } else
                return '-' + this.neg().toString(radix);
        }

        // Do several (6) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
            rem = this;
        var result = '';
        while (true) {
            var remDiv = rem.div(radixToPower),
                intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
                digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero())
                return digits + result;
            else {
                while (digits.length < 6)
                    digits = '0' + digits;
                result = '' + digits + result;
            }
        }
    };

    /**
     * Gets the high 32 bits as a signed integer.
     * @returns {number} Signed high bits
     */
    LongPrototype.getHighBits = function getHighBits() {
        return this.high;
    };

    /**
     * Gets the high 32 bits as an unsigned integer.
     * @returns {number} Unsigned high bits
     */
    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
        return this.high >>> 0;
    };

    /**
     * Gets the low 32 bits as a signed integer.
     * @returns {number} Signed low bits
     */
    LongPrototype.getLowBits = function getLowBits() {
        return this.low;
    };

    /**
     * Gets the low 32 bits as an unsigned integer.
     * @returns {number} Unsigned low bits
     */
    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
        return this.low >>> 0;
    };

    /**
     * Gets the number of bits needed to represent the absolute value of this Long.
     * @returns {number}
     */
    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
        if (this.isNegative()) // Unsigned Longs are never negative
            return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
        var val = this.high != 0 ? this.high : this.low;
        for (var bit = 31; bit > 0; bit--)
            if ((val & (1 << bit)) != 0)
                break;
        return this.high != 0 ? bit + 33 : bit + 1;
    };

    /**
     * Tests if this Long's value equals zero.
     * @returns {boolean}
     */
    LongPrototype.isZero = function isZero() {
        return this.high === 0 && this.low === 0;
    };

    /**
     * Tests if this Long's value is negative.
     * @returns {boolean}
     */
    LongPrototype.isNegative = function isNegative() {
        return !this.unsigned && this.high < 0;
    };

    /**
     * Tests if this Long's value is positive.
     * @returns {boolean}
     */
    LongPrototype.isPositive = function isPositive() {
        return this.unsigned || this.high >= 0;
    };

    /**
     * Tests if this Long's value is odd.
     * @returns {boolean}
     */
    LongPrototype.isOdd = function isOdd() {
        return (this.low & 1) === 1;
    };

    /**
     * Tests if this Long's value is even.
     * @returns {boolean}
     */
    LongPrototype.isEven = function isEven() {
        return (this.low & 1) === 0;
    };

    /**
     * Tests if this Long's value equals the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.equals = function equals(other) {
        if (!isLong(other))
            other = fromValue(other);
        if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
            return false;
        return this.high === other.high && this.low === other.low;
    };

    /**
     * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.eq = LongPrototype.equals;

    /**
     * Tests if this Long's value differs from the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.notEquals = function notEquals(other) {
        return !this.eq(/* validates */ other);
    };

    /**
     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.neq = LongPrototype.notEquals;

    /**
     * Tests if this Long's value is less than the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lessThan = function lessThan(other) {
        return this.comp(/* validates */ other) < 0;
    };

    /**
     * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lt = LongPrototype.lessThan;

    /**
     * Tests if this Long's value is less than or equal the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
        return this.comp(/* validates */ other) <= 0;
    };

    /**
     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lte = LongPrototype.lessThanOrEqual;

    /**
     * Tests if this Long's value is greater than the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.greaterThan = function greaterThan(other) {
        return this.comp(/* validates */ other) > 0;
    };

    /**
     * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.gt = LongPrototype.greaterThan;

    /**
     * Tests if this Long's value is greater than or equal the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
        return this.comp(/* validates */ other) >= 0;
    };

    /**
     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.gte = LongPrototype.greaterThanOrEqual;

    /**
     * Compares this Long's value with the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     */
    LongPrototype.compare = function compare(other) {
        if (!isLong(other))
            other = fromValue(other);
        if (this.eq(other))
            return 0;
        var thisNeg = this.isNegative(),
            otherNeg = other.isNegative();
        if (thisNeg && !otherNeg)
            return -1;
        if (!thisNeg && otherNeg)
            return 1;
        // At this point the sign bits are the same
        if (!this.unsigned)
            return this.sub(other).isNegative() ? -1 : 1;
        // Both are positive if at least one is unsigned
        return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
    };

    /**
     * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     */
    LongPrototype.comp = LongPrototype.compare;

    /**
     * Negates this Long's value.
     * @returns {!Long} Negated Long
     */
    LongPrototype.negate = function negate() {
        if (!this.unsigned && this.eq(MIN_VALUE))
            return MIN_VALUE;
        return this.not().add(ONE);
    };

    /**
     * Negates this Long's value. This is an alias of {@link Long#negate}.
     * @function
     * @returns {!Long} Negated Long
     */
    LongPrototype.neg = LongPrototype.negate;

    /**
     * Returns the sum of this and the specified Long.
     * @param {!Long|number|string} addend Addend
     * @returns {!Long} Sum
     */
    LongPrototype.add = function add(addend) {
        if (!isLong(addend))
            addend = fromValue(addend);

        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;

        var b48 = addend.high >>> 16;
        var b32 = addend.high & 0xFFFF;
        var b16 = addend.low >>> 16;
        var b00 = addend.low & 0xFFFF;

        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 + b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 + b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 + b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 + b48;
        c48 &= 0xFFFF;
        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    };

    /**
     * Returns the difference of this and the specified Long.
     * @param {!Long|number|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     */
    LongPrototype.subtract = function subtract(subtrahend) {
        if (!isLong(subtrahend))
            subtrahend = fromValue(subtrahend);
        return this.add(subtrahend.neg());
    };

    /**
     * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
     * @function
     * @param {!Long|number|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     */
    LongPrototype.sub = LongPrototype.subtract;

    /**
     * Returns the product of this and the specified Long.
     * @param {!Long|number|string} multiplier Multiplier
     * @returns {!Long} Product
     */
    LongPrototype.multiply = function multiply(multiplier) {
        if (this.isZero())
            return ZERO;
        if (!isLong(multiplier))
            multiplier = fromValue(multiplier);
        if (multiplier.isZero())
            return ZERO;
        if (this.eq(MIN_VALUE))
            return multiplier.isOdd() ? MIN_VALUE : ZERO;
        if (multiplier.eq(MIN_VALUE))
            return this.isOdd() ? MIN_VALUE : ZERO;

        if (this.isNegative()) {
            if (multiplier.isNegative())
                return this.neg().mul(multiplier.neg());
            else
                return this.neg().mul(multiplier).neg();
        } else if (multiplier.isNegative())
            return this.mul(multiplier.neg()).neg();

        // If both longs are small, use float multiplication
        if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
            return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
        // We can skip products that would overflow.

        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;

        var b48 = multiplier.high >>> 16;
        var b32 = multiplier.high & 0xFFFF;
        var b16 = multiplier.low >>> 16;
        var b00 = multiplier.low & 0xFFFF;

        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 * b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c16 += a00 * b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a00 * b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
        c48 &= 0xFFFF;
        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    };

    /**
     * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
     * @function
     * @param {!Long|number|string} multiplier Multiplier
     * @returns {!Long} Product
     */
    LongPrototype.mul = LongPrototype.multiply;

    /**
     * Returns this Long divided by the specified. The result is signed if this Long is signed or
     *  unsigned if this Long is unsigned.
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Quotient
     */
    LongPrototype.divide = function divide(divisor) {
        if (!isLong(divisor))
            divisor = fromValue(divisor);
        if (divisor.isZero())
            throw Error('division by zero');
        if (this.isZero())
            return this.unsigned ? UZERO : ZERO;
        var approx, rem, res;
        if (!this.unsigned) {
            // This section is only relevant for signed longs and is derived from the
            // closure library as a whole.
            if (this.eq(MIN_VALUE)) {
                if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                    return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
                else if (divisor.eq(MIN_VALUE))
                    return ONE;
                else {
                    // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                    var halfThis = this.shr(1);
                    approx = halfThis.div(divisor).shl(1);
                    if (approx.eq(ZERO)) {
                        return divisor.isNegative() ? ONE : NEG_ONE;
                    } else {
                        rem = this.sub(divisor.mul(approx));
                        res = approx.add(rem.div(divisor));
                        return res;
                    }
                }
            } else if (divisor.eq(MIN_VALUE))
                return this.unsigned ? UZERO : ZERO;
            if (this.isNegative()) {
                if (divisor.isNegative())
                    return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
            } else if (divisor.isNegative())
                return this.div(divisor.neg()).neg();
            res = ZERO;
        } else {
            // The algorithm below has not been made for unsigned longs. It's therefore
            // required to take special care of the MSB prior to running it.
            if (!divisor.unsigned)
                divisor = divisor.toUnsigned();
            if (divisor.gt(this))
                return UZERO;
            if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
                return UONE;
            res = UZERO;
        }

        // Repeat the following until the remainder is less than other:  find a
        // floating-point that approximates remainder / other *from below*, add this
        // into the result, and subtract it from the remainder.  It is critical that
        // the approximate value is less than or equal to the real value so that the
        // remainder never becomes negative.
        rem = this;
        while (rem.gte(divisor)) {
            // Approximate the result of division. This may be a little greater or
            // smaller than the actual value.
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

            // We will tweak the approximate result by changing it in the 48-th digit or
            // the smallest non-fractional digit, whichever is larger.
            var log2 = Math.ceil(Math.log(approx) / Math.LN2),
                delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

            // Decrease the approximation until it is smaller than the remainder.  Note
            // that if it is too large, the product overflows and is negative.
                approxRes = fromNumber(approx),
                approxRem = approxRes.mul(divisor);
            while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta;
                approxRes = fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(divisor);
            }

            // We know the answer can't be zero... and actually, zero would cause
            // infinite recursion since we would make no progress.
            if (approxRes.isZero())
                approxRes = ONE;

            res = res.add(approxRes);
            rem = rem.sub(approxRem);
        }
        return res;
    };

    /**
     * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
     * @function
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Quotient
     */
    LongPrototype.div = LongPrototype.divide;

    /**
     * Returns this Long modulo the specified.
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Remainder
     */
    LongPrototype.modulo = function modulo(divisor) {
        if (!isLong(divisor))
            divisor = fromValue(divisor);
        return this.sub(this.div(divisor).mul(divisor));
    };

    /**
     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
     * @function
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Remainder
     */
    LongPrototype.mod = LongPrototype.modulo;

    /**
     * Returns the bitwise NOT of this Long.
     * @returns {!Long}
     */
    LongPrototype.not = function not() {
        return fromBits(~this.low, ~this.high, this.unsigned);
    };

    /**
     * Returns the bitwise AND of this Long and the specified.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.and = function and(other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };

    /**
     * Returns the bitwise OR of this Long and the specified.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.or = function or(other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };

    /**
     * Returns the bitwise XOR of this Long and the given one.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.xor = function xor(other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };

    /**
     * Returns this Long with bits shifted to the left by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftLeft = function shiftLeft(numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        if ((numBits &= 63) === 0)
            return this;
        else if (numBits < 32)
            return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
        else
            return fromBits(0, this.low << (numBits - 32), this.unsigned);
    };

    /**
     * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shl = LongPrototype.shiftLeft;

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftRight = function shiftRight(numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        if ((numBits &= 63) === 0)
            return this;
        else if (numBits < 32)
            return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
        else
            return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
    };

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shr = LongPrototype.shiftRight;

    /**
     * Returns this Long with bits logically shifted to the right by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        numBits &= 63;
        if (numBits === 0)
            return this;
        else {
            var high = this.high;
            if (numBits < 32) {
                var low = this.low;
                return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
            } else if (numBits === 32)
                return fromBits(high, 0, this.unsigned);
            else
                return fromBits(high >>> (numBits - 32), 0, this.unsigned);
        }
    };

    /**
     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shru = LongPrototype.shiftRightUnsigned;

    /**
     * Converts this Long to signed.
     * @returns {!Long} Signed long
     */
    LongPrototype.toSigned = function toSigned() {
        if (!this.unsigned)
            return this;
        return fromBits(this.low, this.high, false);
    };

    /**
     * Converts this Long to unsigned.
     * @returns {!Long} Unsigned long
     */
    LongPrototype.toUnsigned = function toUnsigned() {
        if (this.unsigned)
            return this;
        return fromBits(this.low, this.high, true);
    };

    /**
     * Converts this Long to its byte representation.
     * @param {boolean=} le Whether little or big endian, defaults to big endian
     * @returns {!Array.<number>} Byte representation
     */
    LongPrototype.toBytes = function(le) {
        return le ? this.toBytesLE() : this.toBytesBE();
    }

    /**
     * Converts this Long to its little endian byte representation.
     * @returns {!Array.<number>} Little endian byte representation
     */
    LongPrototype.toBytesLE = function() {
        var hi = this.high,
            lo = this.low;
        return [
             lo         & 0xff,
            (lo >>>  8) & 0xff,
            (lo >>> 16) & 0xff,
            (lo >>> 24) & 0xff,
             hi         & 0xff,
            (hi >>>  8) & 0xff,
            (hi >>> 16) & 0xff,
            (hi >>> 24) & 0xff
        ];
    }

    /**
     * Converts this Long to its big endian byte representation.
     * @returns {!Array.<number>} Big endian byte representation
     */
    LongPrototype.toBytesBE = function() {
        var hi = this.high,
            lo = this.low;
        return [
            (hi >>> 24) & 0xff,
            (hi >>> 16) & 0xff,
            (hi >>>  8) & 0xff,
             hi         & 0xff,
            (lo >>> 24) & 0xff,
            (lo >>> 16) & 0xff,
            (lo >>>  8) & 0xff,
             lo         & 0xff
        ];
    }

    return Long;
});


/***/ }),
/* 43 */
/***/ (function(module, exports) {



/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

const UserAgentManager = __webpack_require__(99);
const RESTMethods = __webpack_require__(96);
const SequentialRequestHandler = __webpack_require__(98);
const BurstRequestHandler = __webpack_require__(97);
const APIRequest = __webpack_require__(95);
const Constants = __webpack_require__(0);

class RESTManager {
  constructor(client) {
    this.client = client;
    this.handlers = {};
    this.userAgentManager = new UserAgentManager(this);
    this.methods = new RESTMethods(this);
    this.rateLimitedEndpoints = {};
    this.globallyRateLimited = false;
  }

  push(handler, apiRequest) {
    return new Promise((resolve, reject) => {
      handler.push({
        request: apiRequest,
        resolve,
        reject,
      });
    });
  }

  getRequestHandler() {
    switch (this.client.options.apiRequestMethod) {
      case 'sequential':
        return SequentialRequestHandler;
      case 'burst':
        return BurstRequestHandler;
      default:
        throw new Error(Constants.Errors.INVALID_RATE_LIMIT_METHOD);
    }
  }

  makeRequest(method, url, auth, data, file) {
    const apiRequest = new APIRequest(this, method, url, auth, data, file);

    if (!this.handlers[apiRequest.route]) {
      const RequestHandlerType = this.getRequestHandler();
      this.handlers[apiRequest.route] = new RequestHandlerType(this, apiRequest.route);
    }

    return this.push(this.handlers[apiRequest.route], apiRequest);
  }
}

module.exports = RESTManager;


/***/ }),
/* 45 */
/***/ (function(module, exports) {

/**
 * A base class for different types of rate limiting handlers for the REST API.
 * @private
 */
class RequestHandler {
  /**
   * @param {RESTManager} restManager The REST manager to use
   */
  constructor(restManager) {
    /**
     * The RESTManager that instantiated this RequestHandler
     * @type {RESTManager}
     */
    this.restManager = restManager;

    /**
     * A list of requests that have yet to be processed.
     * @type {APIRequest[]}
     */
    this.queue = [];
  }

  /**
   * Whether or not the client is being rate limited on every endpoint.
   * @type {boolean}
   */
  get globalLimit() {
    return this.restManager.globallyRateLimited;
  }

  set globalLimit(value) {
    this.restManager.globallyRateLimited = value;
  }

  /**
   * Push a new API request into this bucket
   * @param {APIRequest} request The new request to push into the queue
   */
  push(request) {
    this.queue.push(request);
  }

  /**
   * Attempts to get this RequestHandler to process its current queue
   */
  handle() {} // eslint-disable-line no-empty-function
}

module.exports = RequestHandler;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {const os = __webpack_require__(15);
const EventEmitter = __webpack_require__(23).EventEmitter;
const Constants = __webpack_require__(0);
const Permissions = __webpack_require__(6);
const Util = __webpack_require__(4);
const RESTManager = __webpack_require__(44);
const ClientDataManager = __webpack_require__(65);
const ClientManager = __webpack_require__(66);
const ClientDataResolver = __webpack_require__(27);
const ClientVoiceManager = __webpack_require__(140);
const WebSocketManager = __webpack_require__(100);
const ActionsManager = __webpack_require__(67);
const Collection = __webpack_require__(3);
const Presence = __webpack_require__(7).Presence;
const ShardClientUtil = __webpack_require__(139);
const VoiceBroadcast = __webpack_require__(141);

/**
 * The main hub for interacting with the Discord API, and the starting point for any bot.
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {
  /**
   * @param {ClientOptions} [options] Options for the client
   */
  constructor(options = {}) {
    super();

    // Obtain shard details from environment
    if (!options.shardId && 'SHARD_ID' in process.env) options.shardId = Number(process.env.SHARD_ID);
    if (!options.shardCount && 'SHARD_COUNT' in process.env) options.shardCount = Number(process.env.SHARD_COUNT);

    /**
     * The options the client was instantiated with
     * @type {ClientOptions}
     */
    this.options = Util.mergeDefault(Constants.DefaultOptions, options);
    this._validateOptions();

    /**
     * The REST manager of the client
     * @type {RESTManager}
     * @private
     */
    this.rest = new RESTManager(this);

    /**
     * The data manager of the client
     * @type {ClientDataManager}
     * @private
     */
    this.dataManager = new ClientDataManager(this);

    /**
     * The manager of the client
     * @type {ClientManager}
     * @private
     */
    this.manager = new ClientManager(this);

    /**
     * The WebSocket manager of the client
     * @type {WebSocketManager}
     * @private
     */
    this.ws = new WebSocketManager(this);

    /**
     * The data resolver of the client
     * @type {ClientDataResolver}
     * @private
     */
    this.resolver = new ClientDataResolver(this);

    /**
     * The action manager of the client
     * @type {ActionsManager}
     * @private
     */
    this.actions = new ActionsManager(this);

    /**
     * The voice manager of the client (`null` in browsers)
     * @type {?ClientVoiceManager}
     * @private
     */
    this.voice = !this.browser ? new ClientVoiceManager(this) : null;

    /**
     * The shard helpers for the client
     * (only if the process was spawned as a child, such as from a {@link ShardingManager})
     * @type {?ShardClientUtil}
     */
    this.shard = process.send ? ShardClientUtil.singleton(this) : null;

    /**
     * All of the {@link User} objects that have been cached at any point, mapped by their IDs
     * @type {Collection<Snowflake, User>}
     */
    this.users = new Collection();

    /**
     * All of the guilds the client is currently handling, mapped by their IDs -
     * as long as sharding isn't being used, this will be *every* guild the bot is a member of
     * @type {Collection<Snowflake, Guild>}
     */
    this.guilds = new Collection();

    /**
     * All of the {@link Channel}s that the client is currently handling, mapped by their IDs -
     * as long as sharding isn't being used, this will be *every* channel in *every* guild, and all DM channels
     * @type {Collection<Snowflake, Channel>}
     */
    this.channels = new Collection();

    /**
     * Presences that have been received for the client user's friends, mapped by user IDs
     * <warn>This is only filled when using a user account.</warn>
     * @type {Collection<Snowflake, Presence>}
     */
    this.presences = new Collection();

    if (!this.token && 'CLIENT_TOKEN' in process.env) {
      /**
       * Authorization token for the logged in user/bot
       * <warn>This should be kept private at all times.</warn>
       * @type {?string}
       */
      this.token = process.env.CLIENT_TOKEN;
    } else {
      this.token = null;
    }

    /**
     * User that the client is logged in as
     * @type {?ClientUser}
     */
    this.user = null;

    /**
     * Time at which the client was last regarded as being in the `READY` state
     * (each time the client disconnects and successfully reconnects, this will be overwritten)
     * @type {?Date}
     */
    this.readyAt = null;

    /**
     * Active voice broadcasts that have been created
     * @type {VoiceBroadcast[]}
     */
    this.broadcasts = [];

    /**
     * Previous heartbeat pings of the websocket (most recent first, limited to three elements)
     * @type {number[]}
     */
    this.pings = [];

    /**
     * Timestamp of the latest ping's start time
     * @type {number}
     * @private
     */
    this._pingTimestamp = 0;

    /**
     * Timeouts set by {@link Client#setTimeout} that are still active
     * @type {Set<Timeout>}
     * @private
     */
    this._timeouts = new Set();

    /**
     * Intervals set by {@link Client#setInterval} that are still active
     * @type {Set<Timeout>}
     * @private
     */
    this._intervals = new Set();

    if (this.options.messageSweepInterval > 0) {
      this.setInterval(this.sweepMessages.bind(this), this.options.messageSweepInterval * 1000);
    }
  }

  /**
   * Current status of the client's connection to Discord
   * @type {?number}
   * @readonly
   */
  get status() {
    return this.ws.status;
  }

  /**
   * How long it has been since the client last entered the `READY` state
   * @type {?number}
   * @readonly
   */
  get uptime() {
    return this.readyAt ? Date.now() - this.readyAt : null;
  }

  /**
   * Average heartbeat ping of the websocket, obtained by averaging the {@link Client#pings} property
   * @type {number}
   * @readonly
   */
  get ping() {
    return this.pings.reduce((prev, p) => prev + p, 0) / this.pings.length;
  }

  /**
   * All active voice connections that have been established, mapped by channel ID
   * @type {Collection<Snowflake, VoiceConnection>}
   * @readonly
   */
  get voiceConnections() {
    if (this.browser) return new Collection();
    return this.voice.connections;
  }

  /**
   * All custom emojis that the client has access to, mapped by their IDs
   * @type {Collection<Snowflake, Emoji>}
   * @readonly
   */
  get emojis() {
    const emojis = new Collection();
    for (const guild of this.guilds.values()) {
      for (const emoji of guild.emojis.values()) emojis.set(emoji.id, emoji);
    }
    return emojis;
  }

  /**
   * Timestamp of the time the client was last `READY` at
   * @type {?number}
   * @readonly
   */
  get readyTimestamp() {
    return this.readyAt ? this.readyAt.getTime() : null;
  }

  /**
   * Whether the client is in a browser environment
   * @type {boolean}
   * @readonly
   */
  get browser() {
    return os.platform() === 'browser';
  }

  /**
   * Creates a voice broadcast.
   * @returns {VoiceBroadcast}
   */
  createVoiceBroadcast() {
    const broadcast = new VoiceBroadcast(this);
    this.broadcasts.push(broadcast);
    return broadcast;
  }

  /**
   * Logs the client in, establishing a websocket connection to Discord.
   * <info>Both bot and regular user accounts are supported, but it is highly recommended to use a bot account whenever
   * possible. User accounts are subject to harsher ratelimits and other restrictions that don't apply to bot accounts.
   * Bot accounts also have access to many features that user accounts cannot utilise. User accounts that are found to
   * be abusing/overusing the API will be banned, locking you out of Discord entirely.</info>
   * @param {string} token Token of the account to log in with
   * @returns {Promise<string>} Token of the account used
   * @example
   * client.login('my token');
   */
  login(token) {
    return this.rest.methods.login(token);
  }

  /**
   * Logs out, terminates the connection to Discord, and destroys the client.
   * @returns {Promise}
   */
  destroy() {
    for (const t of this._timeouts) clearTimeout(t);
    for (const i of this._intervals) clearInterval(i);
    this._timeouts.clear();
    this._intervals.clear();
    return this.manager.destroy();
  }

  /**
   * Requests a sync of guild data with Discord.
   * <info>This can be done automatically every 30 seconds by enabling {@link ClientOptions#sync}.</info>
   * <warn>This is only available when using a user account.</warn>
   * @param {Guild[]|Collection<Snowflake, Guild>} [guilds=this.guilds] An array or collection of guilds to sync
   */
  syncGuilds(guilds = this.guilds) {
    if (this.user.bot) return;
    this.ws.send({
      op: 12,
      d: guilds instanceof Collection ? guilds.keyArray() : guilds.map(g => g.id),
    });
  }

  /**
   * Obtains a user from Discord, or the user cache if it's already available.
   * <warn>This is only available when using a bot account.</warn>
   * @param {Snowflake} id ID of the user
   * @param {boolean} [cache=true] Whether to cache the new user object if it isn't already
   * @returns {Promise<User>}
   */
  fetchUser(id, cache = true) {
    if (this.users.has(id)) return Promise.resolve(this.users.get(id));
    return this.rest.methods.getUser(id, cache);
  }

  /**
   * Obtains an invite from Discord.
   * @param {InviteResolvable} invite Invite code or URL
   * @returns {Promise<Invite>}
   */
  fetchInvite(invite) {
    const code = this.resolver.resolveInviteCode(invite);
    return this.rest.methods.getInvite(code);
  }

  /**
   * Obtains a webhook from Discord.
   * @param {Snowflake} id ID of the webhook
   * @param {string} [token] Token for the webhook
   * @returns {Promise<Webhook>}
   */
  fetchWebhook(id, token) {
    return this.rest.methods.getWebhook(id, token);
  }

  /**
   * Obtains the available voice regions from Discord.
   * @returns {Collection<string, VoiceRegion>}
   */
  fetchVoiceRegions() {
    return this.rest.methods.fetchVoiceRegions();
  }

  /**
   * Sweeps all text-based channels' messages and removes the ones older than the max message lifetime.
   * If the message has been edited, the time of the edit is used rather than the time of the original message.
   * @param {number} [lifetime=this.options.messageCacheLifetime] Messages that are older than this (in seconds)
   * will be removed from the caches. The default is based on {@link ClientOptions#messageCacheLifetime}.
   * @returns {number} Amount of messages that were removed from the caches,
   * or -1 if the message cache lifetime is unlimited
   */
  sweepMessages(lifetime = this.options.messageCacheLifetime) {
    if (typeof lifetime !== 'number' || isNaN(lifetime)) throw new TypeError('The lifetime must be a number.');
    if (lifetime <= 0) {
      this.emit('debug', 'Didn\'t sweep messages - lifetime is unlimited');
      return -1;
    }

    const lifetimeMs = lifetime * 1000;
    const now = Date.now();
    let channels = 0;
    let messages = 0;

    for (const channel of this.channels.values()) {
      if (!channel.messages) continue;
      channels++;

      for (const message of channel.messages.values()) {
        if (now - (message.editedTimestamp || message.createdTimestamp) > lifetimeMs) {
          channel.messages.delete(message.id);
          messages++;
        }
      }
    }

    this.emit('debug', `Swept ${messages} messages older than ${lifetime} seconds in ${channels} text-based channels`);
    return messages;
  }

  /**
   * Obtains the OAuth Application of the bot from Discord.
   * @param {Snowflake} [id='@me'] ID of application to fetch
   * @returns {Promise<ClientOAuth2Application>}
   */
  fetchApplication(id = '@me') {
    return this.rest.methods.getApplication(id);
  }

  /**
   * Generates a link that can be used to invite the bot to a guild.
   * <warn>This is only available when using a bot account.</warn>
   * @param {PermissionResolvable[]|number} [permissions] Permissions to request
   * @returns {Promise<string>}
   * @example
   * client.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'])
   *   .then(link => {
   *     console.log(`Generated bot invite link: ${link}`);
   *   });
   */
  generateInvite(permissions) {
    if (permissions) {
      if (permissions instanceof Array) permissions = Permissions.resolve(permissions);
    } else {
      permissions = 0;
    }
    return this.fetchApplication().then(application =>
      `https://discordapp.com/oauth2/authorize?client_id=${application.id}&permissions=${permissions}&scope=bot`
    );
  }

  /**
   * Sets a timeout that will be automatically cancelled if the client is destroyed.
   * @param {Function} fn Function to execute
   * @param {number} delay Time to wait before executing (in milliseconds)
   * @param {...*} args Arguments for the function
   * @returns {Timeout}
   */
  setTimeout(fn, delay, ...args) {
    const timeout = setTimeout(() => {
      fn();
      this._timeouts.delete(timeout);
    }, delay, ...args);
    this._timeouts.add(timeout);
    return timeout;
  }

  /**
   * Clears a timeout.
   * @param {Timeout} timeout Timeout to cancel
   */
  clearTimeout(timeout) {
    clearTimeout(timeout);
    this._timeouts.delete(timeout);
  }

  /**
   * Sets an interval that will be automatically cancelled if the client is destroyed.
   * @param {Function} fn Function to execute
   * @param {number} delay Time to wait before executing (in milliseconds)
   * @param {...*} args Arguments for the function
   * @returns {Timeout}
   */
  setInterval(fn, delay, ...args) {
    const interval = setInterval(fn, delay, ...args);
    this._intervals.add(interval);
    return interval;
  }

  /**
   * Clears an interval.
   * @param {Timeout} interval Interval to cancel
   */
  clearInterval(interval) {
    clearInterval(interval);
    this._intervals.delete(interval);
  }

  /**
   * Adds a ping to {@link Client#pings}.
   * @param {number} startTime Starting time of the ping
   * @private
   */
  _pong(startTime) {
    this.pings.unshift(Date.now() - startTime);
    if (this.pings.length > 3) this.pings.length = 3;
    this.ws.lastHeartbeatAck = true;
  }

  /**
   * Adds/updates a friend's presence in {@link Client#presences}.
   * @param {Snowflake} id ID of the user
   * @param {Object} presence Raw presence object from Discord
   * @private
   */
  _setPresence(id, presence) {
    if (this.presences.has(id)) {
      this.presences.get(id).update(presence);
      return;
    }
    this.presences.set(id, new Presence(presence));
  }

  /**
   * Calls {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval} on a script
   * with the client as `this`.
   * @param {string} script Script to eval
   * @returns {*}
   * @private
   */
  _eval(script) {
    return eval(script);
  }

  /**
   * Validates the client options.
   * @param {ClientOptions} [options=this.options] Options to validate
   * @private
   */
  _validateOptions(options = this.options) {
    if (typeof options.shardCount !== 'number' || isNaN(options.shardCount)) {
      throw new TypeError('The shardCount option must be a number.');
    }
    if (typeof options.shardId !== 'number' || isNaN(options.shardId)) {
      throw new TypeError('The shardId option must be a number.');
    }
    if (options.shardCount < 0) throw new RangeError('The shardCount option must be at least 0.');
    if (options.shardId < 0) throw new RangeError('The shardId option must be at least 0.');
    if (options.shardId !== 0 && options.shardId >= options.shardCount) {
      throw new RangeError('The shardId option must be less than shardCount.');
    }
    if (typeof options.messageCacheMaxSize !== 'number' || isNaN(options.messageCacheMaxSize)) {
      throw new TypeError('The messageCacheMaxSize option must be a number.');
    }
    if (typeof options.messageCacheLifetime !== 'number' || isNaN(options.messageCacheLifetime)) {
      throw new TypeError('The messageCacheLifetime option must be a number.');
    }
    if (typeof options.messageSweepInterval !== 'number' || isNaN(options.messageSweepInterval)) {
      throw new TypeError('The messageSweepInterval option must be a number.');
    }
    if (typeof options.fetchAllMembers !== 'boolean') {
      throw new TypeError('The fetchAllMembers option must be a boolean.');
    }
    if (typeof options.disableEveryone !== 'boolean') {
      throw new TypeError('The disableEveryone option must be a boolean.');
    }
    if (typeof options.restWsBridgeTimeout !== 'number' || isNaN(options.restWsBridgeTimeout)) {
      throw new TypeError('The restWsBridgeTimeout option must be a number.');
    }
    if (!(options.disabledEvents instanceof Array)) throw new TypeError('The disabledEvents option must be an Array.');
  }
}

module.exports = Client;

/**
 * Emitted for general warnings
 * @event Client#warn
 * @param {string} info The warning
 */

/**
 * Emitted for general debugging information
 * @event Client#debug
 * @param {string} info The debug information
 */

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

const Webhook = __webpack_require__(21);
const RESTManager = __webpack_require__(44);
const ClientDataResolver = __webpack_require__(27);
const Constants = __webpack_require__(0);
const Util = __webpack_require__(4);

/**
 * The Webhook Client
 * @extends {Webhook}
 */
class WebhookClient extends Webhook {
  /**
   * @param {Snowflake} id ID of the webhook
   * @param {string} token Token of the webhook
   * @param {ClientOptions} [options] Options for the client
   * @example
   * // create a new webhook and send a message
   * const hook = new Discord.WebhookClient('1234', 'abcdef');
   * hook.sendMessage('This will send a message').catch(console.error);
   */
  constructor(id, token, options) {
    super(null, id, token);

    /**
     * The options the client was instantiated with
     * @type {ClientOptions}
     */
    this.options = Util.mergeDefault(Constants.DefaultOptions, options);

    /**
     * The REST manager of the client
     * @type {RESTManager}
     * @private
     */
    this.rest = new RESTManager(this);

    /**
     * The data resolver of the client
     * @type {ClientDataResolver}
     * @private
     */
    this.resolver = new ClientDataResolver(this);

    /**
     * Timeouts set by {@link WebhookClient#setTimeout} that are still active
     * @type {Set<Timeout>}
     * @private
     */
    this._timeouts = new Set();

    /**
     * Intervals set by {@link WebhookClient#setInterval} that are still active
     * @type {Set<Timeout>}
     * @private
     */
    this._intervals = new Set();
  }

  /**
   * Sets a timeout that will be automatically cancelled if the client is destroyed.
   * @param {Function} fn Function to execute
   * @param {number} delay Time to wait before executing (in milliseconds)
   * @param {...*} args Arguments for the function
   * @returns {Timeout}
   */
  setTimeout(fn, delay, ...args) {
    const timeout = setTimeout(() => {
      fn();
      this._timeouts.delete(timeout);
    }, delay, ...args);
    this._timeouts.add(timeout);
    return timeout;
  }

  /**
   * Clears a timeout.
   * @param {Timeout} timeout Timeout to cancel
   */
  clearTimeout(timeout) {
    clearTimeout(timeout);
    this._timeouts.delete(timeout);
  }

  /**
   * Sets an interval that will be automatically cancelled if the client is destroyed.
   * @param {Function} fn Function to execute
   * @param {number} delay Time to wait before executing (in milliseconds)
   * @param {...*} args Arguments for the function
   * @returns {Timeout}
   */
  setInterval(fn, delay, ...args) {
    const interval = setInterval(fn, delay, ...args);
    this._intervals.add(interval);
    return interval;
  }

  /**
   * Clears an interval.
   * @param {Timeout} interval Interval to cancel
   */
  clearInterval(interval) {
    clearInterval(interval);
    this._intervals.delete(interval);
  }


  /**
   * Destroys the client.
   */
  destroy() {
    for (const t of this._timeouts) clearTimeout(t);
    for (const i of this._intervals) clearInterval(i);
    this._timeouts.clear();
    this._intervals.clear();
  }
}

module.exports = WebhookClient;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

const ClientDataResolver = __webpack_require__(27);

/**
 * A rich embed to be sent with a message with a fluent interface for creation
 * @param {Object} [data] Data to set in the rich embed
 */
class RichEmbed {
  constructor(data = {}) {
    /**
     * Title for this Embed
     * @type {string}
     */
    this.title = data.title;

    /**
     * Description for this Embed
     * @type {string}
     */
    this.description = data.description;

    /**
     * URL for this Embed
     * @type {string}
     */
    this.url = data.url;

    /**
     * Color for this Embed
     * @type {number}
     */
    this.color = data.color;

    /**
     * Author for this Embed
     * @type {Object}
     */
    this.author = data.author;

    /**
     * Timestamp for this Embed
     * @type {Date}
     */
    this.timestamp = data.timestamp;

    /**
     * Fields for this Embed
     * @type {Object[]}
     */
    this.fields = data.fields || [];

    /**
     * Thumbnail for this Embed
     * @type {Object}
     */
    this.thumbnail = data.thumbnail;

    /**
     * Image for this Embed
     * @type {Object}
     */
    this.image = data.image;

    /**
     * Footer for this Embed
     * @type {Object}
     */
    this.footer = data.footer;

    /**
     * File to upload alongside this Embed
     * @type {string}
     */
    this.file = data.file;
  }

  /**
   * Sets the title of this embed
   * @param {StringResolvable} title The title
   * @returns {RichEmbed} This embed
   */
  setTitle(title) {
    title = resolveString(title);
    if (title.length > 256) throw new RangeError('RichEmbed titles may not exceed 256 characters.');
    this.title = title;
    return this;
  }

  /**
   * Sets the description of this embed
   * @param {StringResolvable} description The description
   * @returns {RichEmbed} This embed
   */
  setDescription(description) {
    description = resolveString(description);
    if (description.length > 2048) throw new RangeError('RichEmbed descriptions may not exceed 2048 characters.');
    this.description = description;
    return this;
  }

  /**
   * Sets the URL of this embed
   * @param {string} url The URL
   * @returns {RichEmbed} This embed
   */
  setURL(url) {
    this.url = url;
    return this;
  }

  /**
   * Sets the color of this embed
   * @param {ColorResolvable} color The color of the embed
   * @returns {RichEmbed} This embed
   */
  setColor(color) {
    this.color = ClientDataResolver.resolveColor(color);
    return this;
  }

  /**
   * Sets the author of this embed
   * @param {StringResolvable} name The name of the author
   * @param {string} [icon] The icon URL of the author
   * @param {string} [url] The URL of the author
   * @returns {RichEmbed} This embed
   */
  setAuthor(name, icon, url) {
    this.author = { name: resolveString(name), icon_url: icon, url };
    return this;
  }

  /**
   * Sets the timestamp of this embed
   * @param {Date} [timestamp=current date] The timestamp
   * @returns {RichEmbed} This embed
   */
  setTimestamp(timestamp = new Date()) {
    this.timestamp = timestamp;
    return this;
  }

  /**
   * Adds a field to the embed (max 25)
   * @param {StringResolvable} name The name of the field
   * @param {StringResolvable} value The value of the field
   * @param {boolean} [inline=false] Set the field to display inline
   * @returns {RichEmbed} This embed
   */
  addField(name, value, inline = false) {
    if (this.fields.length >= 25) throw new RangeError('RichEmbeds may not exceed 25 fields.');
    name = resolveString(name);
    if (name.length > 256) throw new RangeError('RichEmbed field names may not exceed 256 characters.');
    if (!/\S/.test(name)) throw new RangeError('RichEmbed field names may not be empty.');
    value = resolveString(value);
    if (value.length > 1024) throw new RangeError('RichEmbed field values may not exceed 1024 characters.');
    if (!/\S/.test(value)) throw new RangeError('RichEmbed field values may not be empty.');
    this.fields.push({ name, value, inline });
    return this;
  }

  /**
   * Convenience function for `<RichEmbed>.addField('\u200B', '\u200B', inline)`.
   * @param {boolean} [inline=false] Set the field to display inline
   * @returns {RichEmbed} This embed
   */
  addBlankField(inline = false) {
    return this.addField('\u200B', '\u200B', inline);
  }

  /**
   * Set the thumbnail of this embed
   * @param {string} url The URL of the thumbnail
   * @returns {RichEmbed} This embed
   */
  setThumbnail(url) {
    this.thumbnail = { url };
    return this;
  }

  /**
   * Set the image of this embed
   * @param {string} url The URL of the image
   * @returns {RichEmbed} This embed
   */
  setImage(url) {
    this.image = { url };
    return this;
  }

  /**
   * Sets the footer of this embed
   * @param {StringResolvable} text The text of the footer
   * @param {string} [icon] The icon URL of the footer
   * @returns {RichEmbed} This embed
   */
  setFooter(text, icon) {
    text = resolveString(text);
    if (text.length > 2048) throw new RangeError('RichEmbed footer text may not exceed 2048 characters.');
    this.footer = { text, icon_url: icon };
    return this;
  }

  /**
   * Sets the file to upload alongside the embed. This file can be accessed via `attachment://fileName.extension` when
   * setting an embed image or author/footer icons. Only one file may be attached.
   * @param {FileOptions|string} file Local path or URL to the file to attach, or valid FileOptions for a file to attach
   * @returns {RichEmbed} This embed
   */
  attachFile(file) {
    if (this.file) throw new RangeError('You may not upload more than one file at once.');
    this.file = file;
    return this;
  }
}

module.exports = RichEmbed;

function resolveString(data) {
  if (typeof data === 'string') return data;
  if (data instanceof Array) return data.join('\n');
  return String(data);
}


/***/ }),
/* 49 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 50 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 51 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 54 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 55 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(56);
exports.encode = exports.stringify = __webpack_require__(57);


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Check if `fn` is a function.
 *
 * @param {Function} fn
 * @return {Boolean}
 * @api private
 */
var isObject = __webpack_require__(26);

function isFunction(fn) {
  var tag = isObject(fn) ? Object.prototype.toString.call(fn) : '';
  return tag === '[object Function]';
}

module.exports = isFunction;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = __webpack_require__(26);

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }
  return obj;
}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function _clearTimeout(){
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, read, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function timeout(options){
  if (!options || 'object' !== typeof options) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  if ('undefined' !== typeof options.deadline) {
    this._timeout = options.deadline;
  }
  if ('undefined' !== typeof options.response) {
    this._responseTimeout = options.response;
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function retry(count){
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  return this;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function() {
  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;

  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
      self.end(function(err, res){
        if (err) innerReject(err); else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
}

RequestBase.prototype.catch = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
}

RequestBase.prototype.ok = function(cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function(res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};


/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
RequestBase.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function(name, val) {

  // name should be either a string or an object.
  if (null === name ||  undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if ('boolean' === typeof val) {
    val = '' + val;
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
RequestBase.prototype.abort = function(){
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

RequestBase.prototype.withCredentials = function(){
  // This is browser-only functionality. Node side is no-op.
  this._withCredentials = true;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function(n){
  this._maxRedirects = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function(){
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};


/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.send = function(data){
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  }

  // merge
  if (isObj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};


/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function(sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function(reason, timeout){
  if (this._aborted) {
    return;
  }
  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function() {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self._timeoutError('Timeout of ', self._timeout);
    }, this._timeout);
  }
  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function(){
      self._timeoutError('Response timeout of ', self._responseTimeout);
    }, this._responseTimeout);
  }
}


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var utils = __webpack_require__(63);

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }
  return obj;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function(field){
    return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function(header){
    // TODO: moar!
    // TODO: make this a util

    // content-type
    var ct = header['content-type'] || '';
    this.type = utils.type(ct);

    // params
    var params = utils.params(ct);
    for (var key in params) this[key] = params[key];

    this.links = {};

    // links
    try {
        if (header.link) {
            this.links = utils.parseLinks(header.link);
        }
    } catch (err) {
        // ignore
    }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function(status){
    var type = status / 100 | 0;

    // status / class
    this.status = this.statusCode = status;
    this.statusType = type;

    // basics
    this.info = 1 == type;
    this.ok = 2 == type;
    this.redirect = 3 == type;
    this.clientError = 4 == type;
    this.serverError = 5 == type;
    this.error = (4 == type || 5 == type)
        ? this.toError()
        : false;

    // sugar
    this.accepted = 202 == status;
    this.noContent = 204 == status;
    this.badRequest = 400 == status;
    this.unauthorized = 401 == status;
    this.notAcceptable = 406 == status;
    this.forbidden = 403 == status;
    this.notFound = 404 == status;
};


/***/ }),
/* 62 */
/***/ (function(module, exports) {

var ERROR_CODES = [
  'ECONNRESET',
  'ETIMEDOUT',
  'EADDRINFO',
  'ESOCKETTIMEDOUT'
];

/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err
 * @param {Response} [res]
 * @returns {Boolean}
 */
module.exports = function shouldRetry(err, res) {
  if (err && err.code && ~ERROR_CODES.indexOf(err.code)) return true;
  if (res && res.status && res.status >= 500) return true;
  // Superagent timeout
  if (err && 'timeout' in err && err.code == 'ECONNABORTED') return true;
  return false;
};

/***/ }),
/* 63 */
/***/ (function(module, exports) {


/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = function(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function(str){
  return str.split(/ *, */).reduce(function(obj, str){
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function(header, shouldStripCookie){
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];
  if (shouldStripCookie) {
    delete header['cookie'];
  }
  return header;
};

/***/ }),
/* 64 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

const Constants = __webpack_require__(0);
const Util = __webpack_require__(4);
const Guild = __webpack_require__(16);
const User = __webpack_require__(11);
const DMChannel = __webpack_require__(30);
const Emoji = __webpack_require__(12);
const TextChannel = __webpack_require__(40);
const VoiceChannel = __webpack_require__(41);
const GuildChannel = __webpack_require__(17);
const GroupDMChannel = __webpack_require__(19);

class ClientDataManager {
  constructor(client) {
    this.client = client;
  }

  get pastReady() {
    return this.client.ws.status === Constants.Status.READY;
  }

  newGuild(data) {
    const already = this.client.guilds.has(data.id);
    const guild = new Guild(this.client, data);
    this.client.guilds.set(guild.id, guild);
    if (this.pastReady && !already) {
      /**
       * Emitted whenever the client joins a guild.
       * @event Client#guildCreate
       * @param {Guild} guild The created guild
       */
      if (this.client.options.fetchAllMembers) {
        guild.fetchMembers().then(() => { this.client.emit(Constants.Events.GUILD_CREATE, guild); });
      } else {
        this.client.emit(Constants.Events.GUILD_CREATE, guild);
      }
    }

    return guild;
  }

  newUser(data) {
    if (this.client.users.has(data.id)) return this.client.users.get(data.id);
    const user = new User(this.client, data);
    this.client.users.set(user.id, user);
    return user;
  }

  newChannel(data, guild) {
    const already = this.client.channels.has(data.id);
    let channel;
    if (data.type === Constants.ChannelTypes.DM) {
      channel = new DMChannel(this.client, data);
    } else if (data.type === Constants.ChannelTypes.GROUP_DM) {
      channel = new GroupDMChannel(this.client, data);
    } else {
      guild = guild || this.client.guilds.get(data.guild_id);
      if (guild) {
        if (data.type === Constants.ChannelTypes.TEXT) {
          channel = new TextChannel(guild, data);
          guild.channels.set(channel.id, channel);
        } else if (data.type === Constants.ChannelTypes.VOICE) {
          channel = new VoiceChannel(guild, data);
          guild.channels.set(channel.id, channel);
        }
      }
    }

    if (channel) {
      if (this.pastReady && !already) this.client.emit(Constants.Events.CHANNEL_CREATE, channel);
      this.client.channels.set(channel.id, channel);
      return channel;
    }

    return null;
  }

  newEmoji(data, guild) {
    const already = guild.emojis.has(data.id);
    if (data && !already) {
      let emoji = new Emoji(guild, data);
      this.client.emit(Constants.Events.GUILD_EMOJI_CREATE, emoji);
      guild.emojis.set(emoji.id, emoji);
      return emoji;
    } else if (already) {
      return guild.emojis.get(data.id);
    }

    return null;
  }

  killEmoji(emoji) {
    if (!(emoji instanceof Emoji && emoji.guild)) return;
    this.client.emit(Constants.Events.GUILD_EMOJI_DELETE, emoji);
    emoji.guild.emojis.delete(emoji.id);
  }

  killGuild(guild) {
    const already = this.client.guilds.has(guild.id);
    this.client.guilds.delete(guild.id);
    if (already && this.pastReady) this.client.emit(Constants.Events.GUILD_DELETE, guild);
  }

  killUser(user) {
    this.client.users.delete(user.id);
  }

  killChannel(channel) {
    this.client.channels.delete(channel.id);
    if (channel instanceof GuildChannel) channel.guild.channels.delete(channel.id);
  }

  updateGuild(currentGuild, newData) {
    const oldGuild = Util.cloneObject(currentGuild);
    currentGuild.setup(newData);
    if (this.pastReady) this.client.emit(Constants.Events.GUILD_UPDATE, oldGuild, currentGuild);
  }

  updateChannel(currentChannel, newData) {
    currentChannel.setup(newData);
  }

  updateEmoji(currentEmoji, newData) {
    const oldEmoji = Util.cloneObject(currentEmoji);
    currentEmoji.setup(newData);
    this.client.emit(Constants.Events.GUILD_EMOJI_UPDATE, oldEmoji, currentEmoji);
    return currentEmoji;
  }
}

module.exports = ClientDataManager;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

const Constants = __webpack_require__(0);

/**
 * Manages the State and Background Tasks of the Client
 * @private
 */
class ClientManager {
  constructor(client) {
    /**
     * The Client that instantiated this Manager
     * @type {Client}
     */
    this.client = client;

    /**
     * The heartbeat interval, null if not yet set
     * @type {?number}
     */
    this.heartbeatInterval = null;
  }

  /**
   * Connects the Client to the WebSocket
   * @param {string} token The authorization token
   * @param {Function} resolve Function to run when connection is successful
   * @param {Function} reject Function to run when connection fails
   */
  connectToWebSocket(token, resolve, reject) {
    this.client.emit(Constants.Events.DEBUG, `Authenticated using token ${token}`);
    this.client.token = token;
    const timeout = this.client.setTimeout(() => reject(new Error(Constants.Errors.TOOK_TOO_LONG)), 1000 * 300);
    this.client.rest.methods.getGateway().then(gateway => {
      this.client.emit(Constants.Events.DEBUG, `Using gateway ${gateway}`);
      this.client.ws.connect(gateway);
      this.client.ws.once('close', event => {
        if (event.code === 4004) reject(new Error(Constants.Errors.BAD_LOGIN));
        if (event.code === 4010) reject(new Error(Constants.Errors.INVALID_SHARD));
        if (event.code === 4011) reject(new Error(Constants.Errors.SHARDING_REQUIRED));
      });
      this.client.once(Constants.Events.READY, () => {
        resolve(token);
        this.client.clearTimeout(timeout);
      });
    }, reject);
  }

  /**
   * Sets up a keep-alive interval to keep the Client's connection valid
   * @param {number} time The interval in milliseconds at which heartbeat packets should be sent
   */
  setupKeepAlive(time) {
    this.heartbeatInterval = this.client.setInterval(() => this.client.ws.heartbeat(true), time);
  }

  destroy() {
    this.client.ws.destroy();
    if (this.client.user.bot) {
      this.client.token = null;
      return Promise.resolve();
    } else {
      return this.client.rest.methods.logout().then(() => {
        this.client.token = null;
      });
    }
  }
}

module.exports = ClientManager;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

class ActionsManager {
  constructor(client) {
    this.client = client;

    this.register(__webpack_require__(85));
    this.register(__webpack_require__(86));
    this.register(__webpack_require__(87));
    this.register(__webpack_require__(91));
    this.register(__webpack_require__(88));
    this.register(__webpack_require__(89));
    this.register(__webpack_require__(90));
    this.register(__webpack_require__(68));
    this.register(__webpack_require__(69));
    this.register(__webpack_require__(70));
    this.register(__webpack_require__(73));
    this.register(__webpack_require__(84));
    this.register(__webpack_require__(77));
    this.register(__webpack_require__(78));
    this.register(__webpack_require__(71));
    this.register(__webpack_require__(79));
    this.register(__webpack_require__(80));
    this.register(__webpack_require__(81));
    this.register(__webpack_require__(92));
    this.register(__webpack_require__(94));
    this.register(__webpack_require__(93));
    this.register(__webpack_require__(83));
    this.register(__webpack_require__(74));
    this.register(__webpack_require__(75));
    this.register(__webpack_require__(76));
    this.register(__webpack_require__(82));
    this.register(__webpack_require__(72));
  }

  register(Action) {
    this[Action.name.replace(/Action$/, '')] = new Action(this.client);
  }
}

module.exports = ActionsManager;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class ChannelCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.dataManager.newChannel(data);
    return {
      channel,
    };
  }
}

module.exports = ChannelCreateAction;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class ChannelDeleteAction extends Action {
  constructor(client) {
    super(client);
    this.deleted = new Map();
  }

  handle(data) {
    const client = this.client;

    let channel = client.channels.get(data.id);
    if (channel) {
      client.dataManager.killChannel(channel);
      this.deleted.set(channel.id, channel);
      this.scheduleForDeletion(channel.id);
    } else {
      channel = this.deleted.get(data.id) || null;
    }

    return {
      channel,
    };
  }

  scheduleForDeletion(id) {
    this.client.setTimeout(() => this.deleted.delete(id), this.client.options.restWsBridgeTimeout);
  }
}

module.exports = ChannelDeleteAction;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Constants = __webpack_require__(0);
const Util = __webpack_require__(4);

class ChannelUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get(data.id);
    if (channel) {
      const oldChannel = Util.cloneObject(channel);
      channel.setup(data);
      client.emit(Constants.Events.CHANNEL_UPDATE, oldChannel, channel);
      return {
        old: oldChannel,
        updated: channel,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

/**
 * Emitted whenever a channel is updated - e.g. name change, topic change.
 * @event Client#channelUpdate
 * @param {Channel} oldChannel The channel before the update
 * @param {Channel} newChannel The channel after the update
 */

module.exports = ChannelUpdateAction;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Constants = __webpack_require__(0);

class GuildBanRemove extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    const user = client.dataManager.newUser(data.user);
    if (guild && user) client.emit(Constants.Events.GUILD_BAN_REMOVE, guild, user);
  }
}

module.exports = GuildBanRemove;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class GuildChannelsPositionUpdate extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      for (const partialChannel of data.channels) {
        const channel = guild.roles.get(partialChannel.id);
        if (channel) channel.position = partialChannel.position;
      }
    }

    return {
      guild,
    };
  }
}

module.exports = GuildChannelsPositionUpdate;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Constants = __webpack_require__(0);

class GuildDeleteAction extends Action {
  constructor(client) {
    super(client);
    this.deleted = new Map();
  }

  handle(data) {
    const client = this.client;

    let guild = client.guilds.get(data.id);
    if (guild) {
      for (const channel of guild.channels.values()) {
        if (channel.type === 'text') channel.stopTyping(true);
      }

      if (guild.available && data.unavailable) {
        // Guild is unavailable
        guild.available = false;
        client.emit(Constants.Events.GUILD_UNAVAILABLE, guild);

        // Stops the GuildDelete packet thinking a guild was actually deleted,
        // handles emitting of event itself
        return {
          guild: null,
        };
      }

      // Delete guild
      client.guilds.delete(guild.id);
      this.deleted.set(guild.id, guild);
      this.scheduleForDeletion(guild.id);
    } else {
      guild = this.deleted.get(data.id) || null;
    }

    return {
      guild,
    };
  }

  scheduleForDeletion(id) {
    this.client.setTimeout(() => this.deleted.delete(id), this.client.options.restWsBridgeTimeout);
  }
}

/**
 * Emitted whenever a guild becomes unavailable, likely due to a server outage.
 * @event Client#guildUnavailable
 * @param {Guild} guild The guild that has become unavailable.
 */

module.exports = GuildDeleteAction;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class GuildEmojiCreateAction extends Action {
  handle(guild, createdEmoji) {
    const client = this.client;
    const emoji = client.dataManager.newEmoji(createdEmoji, guild);
    return {
      emoji,
    };
  }
}

/**
 * Emitted whenever a custom emoji is created in a guild
 * @event Client#emojiCreate
 * @param {Emoji} emoji The emoji that was created.
 */
module.exports = GuildEmojiCreateAction;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class GuildEmojiDeleteAction extends Action {
  handle(emoji) {
    const client = this.client;
    client.dataManager.killEmoji(emoji);
    return {
      emoji,
    };
  }
}

/**
 * Emitted whenever a custom guild emoji is deleted
 * @event Client#emojiDelete
 * @param {Emoji} emoji The emoji that was deleted.
 */
module.exports = GuildEmojiDeleteAction;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class GuildEmojiUpdateAction extends Action {
  handle(oldEmoji, newEmoji) {
    const emoji = this.client.dataManager.updateEmoji(oldEmoji, newEmoji);
    return {
      emoji,
    };
  }
}

/**
 * Emitted whenever a custom guild emoji is updated
 * @event Client#emojiUpdate
 * @param {Emoji} oldEmoji The old emoji
 * @param {Emoji} newEmoji The new emoji
 */
module.exports = GuildEmojiUpdateAction;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class GuildMemberGetAction extends Action {
  handle(guild, data) {
    const member = guild._addMember(data, false);
    return {
      member,
    };
  }
}

module.exports = GuildMemberGetAction;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Constants = __webpack_require__(0);

class GuildMemberRemoveAction extends Action {
  constructor(client) {
    super(client);
    this.deleted = new Map();
  }

  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      let member = guild.members.get(data.user.id);
      if (member) {
        guild.memberCount--;
        guild._removeMember(member);
        this.deleted.set(guild.id + data.user.id, member);
        if (client.status === Constants.Status.READY) client.emit(Constants.Events.GUILD_MEMBER_REMOVE, member);
        this.scheduleForDeletion(guild.id, data.user.id);
      } else {
        member = this.deleted.get(guild.id + data.user.id) || null;
      }

      return {
        guild,
        member,
      };
    }

    return {
      guild,
      member: null,
    };
  }

  scheduleForDeletion(guildID, userID) {
    this.client.setTimeout(() => this.deleted.delete(guildID + userID), this.client.options.restWsBridgeTimeout);
  }
}

/**
 * Emitted whenever a member leaves a guild, or is kicked.
 * @event Client#guildMemberRemove
 * @param {GuildMember} member The member that has left/been kicked from the guild.
 */

module.exports = GuildMemberRemoveAction;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Constants = __webpack_require__(0);
const Role = __webpack_require__(10);

class GuildRoleCreate extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const already = guild.roles.has(data.role.id);
      const role = new Role(guild, data.role);
      guild.roles.set(role.id, role);
      if (!already) client.emit(Constants.Events.GUILD_ROLE_CREATE, role);

      return {
        role,
      };
    }

    return {
      role: null,
    };
  }
}

/**
 * Emitted whenever a role is created.
 * @event Client#roleCreate
 * @param {Role} role The role that was created.
 */

module.exports = GuildRoleCreate;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Constants = __webpack_require__(0);

class GuildRoleDeleteAction extends Action {
  constructor(client) {
    super(client);
    this.deleted = new Map();
  }

  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      let role = guild.roles.get(data.role_id);
      if (role) {
        guild.roles.delete(data.role_id);
        this.deleted.set(guild.id + data.role_id, role);
        this.scheduleForDeletion(guild.id, data.role_id);
        client.emit(Constants.Events.GUILD_ROLE_DELETE, role);
      } else {
        role = this.deleted.get(guild.id + data.role_id) || null;
      }

      return {
        role,
      };
    }

    return {
      role: null,
    };
  }

  scheduleForDeletion(guildID, roleID) {
    this.client.setTimeout(() => this.deleted.delete(guildID + roleID), this.client.options.restWsBridgeTimeout);
  }
}

/**
 * Emitted whenever a guild role is deleted.
 * @event Client#roleDelete
 * @param {Role} role The role that was deleted.
 */

module.exports = GuildRoleDeleteAction;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Constants = __webpack_require__(0);
const Util = __webpack_require__(4);

class GuildRoleUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const roleData = data.role;
      let oldRole = null;

      const role = guild.roles.get(roleData.id);
      if (role) {
        oldRole = Util.cloneObject(role);
        role.setup(data.role);
        client.emit(Constants.Events.GUILD_ROLE_UPDATE, oldRole, role);
      }

      return {
        old: oldRole,
        updated: role,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

/**
 * Emitted whenever a guild role is updated.
 * @event Client#roleUpdate
 * @param {Role} oldRole The role before the update.
 * @param {Role} newRole The role after the update.
 */

module.exports = GuildRoleUpdateAction;


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class GuildRolesPositionUpdate extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      for (const partialRole of data.roles) {
        const role = guild.roles.get(partialRole.id);
        if (role) {
          role.position = partialRole.position;
        }
      }
    }

    return {
      guild,
    };
  }
}

module.exports = GuildRolesPositionUpdate;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class GuildSync extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.id);
    if (guild) {
      if (data.presences) {
        for (const presence of data.presences) guild._setPresence(presence.user.id, presence);
      }

      if (data.members) {
        for (const syncMember of data.members) {
          const member = guild.members.get(syncMember.user.id);
          if (member) {
            guild._updateMember(member, syncMember);
          } else {
            guild._addMember(syncMember, false);
          }
        }
      }

      if ('large' in data) guild.large = data.large;
    }
  }
}

module.exports = GuildSync;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Constants = __webpack_require__(0);
const Util = __webpack_require__(4);

class GuildUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.id);
    if (guild) {
      const oldGuild = Util.cloneObject(guild);
      guild.setup(data);
      client.emit(Constants.Events.GUILD_UPDATE, oldGuild, guild);
      return {
        old: oldGuild,
        updated: guild,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

/**
 * Emitted whenever a guild is updated - e.g. name change.
 * @event Client#guildUpdate
 * @param {Guild} oldGuild The guild before the update.
 * @param {Guild} newGuild The guild after the update.
 */

module.exports = GuildUpdateAction;


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Message = __webpack_require__(9);

class MessageCreateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get((data instanceof Array ? data[0] : data).channel_id);
    const user = client.users.get((data instanceof Array ? data[0] : data).author.id);
    if (channel) {
      const member = channel.guild ? channel.guild.member(user) : null;
      if (data instanceof Array) {
        const messages = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
          messages[i] = channel._cacheMessage(new Message(channel, data[i], client));
        }
        const lastMessage = messages[messages.length - 1];
        channel.lastMessageID = lastMessage.id;
        channel.lastMessage = lastMessage;
        if (user) {
          user.lastMessageID = lastMessage.id;
          user.lastMessage = lastMessage;
        }
        if (member) {
          member.lastMessageID = lastMessage.id;
          member.lastMessage = lastMessage;
        }
        return {
          messages,
        };
      } else {
        const message = channel._cacheMessage(new Message(channel, data, client));
        channel.lastMessageID = data.id;
        channel.lastMessage = message;
        if (user) {
          user.lastMessageID = data.id;
          user.lastMessage = message;
        }
        if (member) {
          member.lastMessageID = data.id;
          member.lastMessage = message;
        }
        return {
          message,
        };
      }
    }

    return {
      message: null,
    };
  }
}

module.exports = MessageCreateAction;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class MessageDeleteAction extends Action {
  constructor(client) {
    super(client);
    this.deleted = new Map();
  }

  handle(data) {
    const client = this.client;

    const channel = client.channels.get(data.channel_id);
    if (channel) {
      let message = channel.messages.get(data.id);

      if (message) {
        channel.messages.delete(message.id);
        this.deleted.set(channel.id + message.id, message);
        this.scheduleForDeletion(channel.id, message.id);
      } else {
        message = this.deleted.get(channel.id + data.id) || null;
      }

      return {
        message,
      };
    }

    return {
      message: null,
    };
  }

  scheduleForDeletion(channelID, messageID) {
    this.client.setTimeout(() => this.deleted.delete(channelID + messageID),
      this.client.options.restWsBridgeTimeout);
  }
}

module.exports = MessageDeleteAction;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Collection = __webpack_require__(3);
const Constants = __webpack_require__(0);

class MessageDeleteBulkAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.get(data.channel_id);

    const ids = data.ids;
    const messages = new Collection();
    for (const id of ids) {
      const message = channel.messages.get(id);
      if (message) messages.set(message.id, message);
    }

    if (messages.size > 0) client.emit(Constants.Events.MESSAGE_BULK_DELETE, messages);
    return {
      messages,
    };
  }
}

module.exports = MessageDeleteBulkAction;


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Constants = __webpack_require__(0);

/*
{ user_id: 'id',
     message_id: 'id',
     emoji: { name: '�', id: null },
     channel_id: 'id' } }
*/

class MessageReactionAdd extends Action {
  handle(data) {
    const user = this.client.users.get(data.user_id);
    if (!user) return false;

    const channel = this.client.channels.get(data.channel_id);
    if (!channel || channel.type === 'voice') return false;

    const message = channel.messages.get(data.message_id);
    if (!message) return false;

    if (!data.emoji) return false;

    const reaction = message._addReaction(data.emoji, user);

    if (reaction) {
      this.client.emit(Constants.Events.MESSAGE_REACTION_ADD, reaction, user);
    }

    return {
      message,
      reaction,
      user,
    };
  }
}
/**
 * Emitted whenever a reaction is added to a message.
 * @event Client#messageReactionAdd
 * @param {MessageReaction} messageReaction The reaction object.
 * @param {User} user The user that applied the emoji or reaction emoji.
 */
module.exports = MessageReactionAdd;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Constants = __webpack_require__(0);

/*
{ user_id: 'id',
     message_id: 'id',
     emoji: { name: '�', id: null },
     channel_id: 'id' } }
*/

class MessageReactionRemove extends Action {
  handle(data) {
    const user = this.client.users.get(data.user_id);
    if (!user) return false;

    const channel = this.client.channels.get(data.channel_id);
    if (!channel || channel.type === 'voice') return false;

    const message = channel.messages.get(data.message_id);
    if (!message) return false;

    if (!data.emoji) return false;

    const reaction = message._removeReaction(data.emoji, user);

    if (reaction) {
      this.client.emit(Constants.Events.MESSAGE_REACTION_REMOVE, reaction, user);
    }

    return {
      message,
      reaction,
      user,
    };
  }
}
/**
 * Emitted whenever a reaction is removed from a message.
 * @event Client#messageReactionRemove
 * @param {MessageReaction} messageReaction The reaction object.
 * @param {User} user The user that removed the emoji or reaction emoji.
 */
module.exports = MessageReactionRemove;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Constants = __webpack_require__(0);

class MessageReactionRemoveAll extends Action {
  handle(data) {
    const channel = this.client.channels.get(data.channel_id);
    if (!channel || channel.type === 'voice') return false;

    const message = channel.messages.get(data.message_id);
    if (!message) return false;

    message._clearReactions();
    this.client.emit(Constants.Events.MESSAGE_REACTION_REMOVE_ALL, message);

    return {
      message,
    };
  }
}
/**
 * Emitted whenever all reactions are removed from a message.
 * @event Client#messageReactionRemoveAll
 * @param {MessageReaction} messageReaction The reaction object.
 */
module.exports = MessageReactionRemoveAll;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Constants = __webpack_require__(0);
const Message = __webpack_require__(9);

class MessageUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get(data.channel_id);
    if (channel) {
      const message = channel.messages.get(data.id);
      if (message) {
        const newMessage = new Message(message.channel, this.patchDataPacket(data, message), client);
        newMessage._edits.push(message, ...message._edits);
        newMessage.reactions = message.reactions;
        channel.messages.set(data.id, newMessage);
        client.emit(Constants.Events.MESSAGE_UPDATE, message, newMessage);
        return {
          old: message,
          updated: newMessage,
        };
      }

      return {
        old: message,
        updated: message,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }

  patchDataPacket(data, message) {
    data.type = 'type' in data ? data.type : Constants.MessageTypes.indexOf(message.type);
    data.tts = 'tts' in data ? data.tts : message.tts;
    data.timestamp = 'timestamp' in data ? data.timestamp : message.createdAt.toString();
    data.pinned = 'pinned' in data ? data.pinned : message.pinned;
    data.nonce = 'nonce' in data ? data.nonce : message.nonce;
    data.mentions = 'mentions' in data ? data.mentions : message.mentions.users.keyArray();
    data.mentions_roles = 'mentions_roles' in data ?
			data.mentions_roles : message.mentions.roles.keyArray();
    data.mention_everyone = 'mention_everyone' in data ? data.mention_everyone : message.mentions.everyone;
    data.embeds = 'embeds' in data ? data.embeds : message.embeds;
    data.content = 'content' in data ? data.content : message.content;
    data.author = 'author' in data ? data.author : {
      username: message.author.username,
      id: message.author.id,
      discriminator: message.author.discriminator,
      avatar: message.author.avatar,
    };
    data.attachments = 'attachments' in data ? data.attachments : message.attachments.array();
    return data;
  }

}

/**
 * Emitted whenever a message is updated - e.g. embed or content change.
 * @event Client#messageUpdate
 * @param {Message} oldMessage The message before the update.
 * @param {Message} newMessage The message after the update.
 */

module.exports = MessageUpdateAction;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class UserGetAction extends Action {
  handle(data) {
    const client = this.client;
    const user = client.dataManager.newUser(data);
    return {
      user,
    };
  }
}

module.exports = UserGetAction;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Constants = __webpack_require__(0);

class UserNoteUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const oldNote = client.user.notes.get(data.id);
    const note = data.note.length ? data.note : null;

    client.user.notes.set(data.id, note);

    client.emit(Constants.Events.USER_NOTE_UPDATE, data.id, oldNote, note);

    return {
      old: oldNote,
      updated: note,
    };
  }
}

/**
 * Emitted whenever a note is updated.
 * @event Client#userNoteUpdate
 * @param {User} user The user the note belongs to
 * @param {string} oldNote The note content before the update
 * @param {string} newNote The note content after the update
 */

module.exports = UserNoteUpdateAction;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Constants = __webpack_require__(0);
const Util = __webpack_require__(4);

class UserUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    if (client.user) {
      if (client.user.equals(data)) {
        return {
          old: client.user,
          updated: client.user,
        };
      }

      const oldUser = Util.cloneObject(client.user);
      client.user.patch(data);
      client.emit(Constants.Events.USER_UPDATE, oldUser, client.user);
      return {
        old: oldUser,
        updated: client.user,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

module.exports = UserUpdateAction;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

const request = __webpack_require__(25);
const Constants = __webpack_require__(0);

class APIRequest {
  constructor(rest, method, path, auth, data, files) {
    this.rest = rest;
    this.client = rest.client;
    this.method = method;
    this.path = path.toString();
    this.auth = auth;
    this.data = data;
    this.files = files;
    this.route = this.getRoute(this.path);
  }

  getRoute(url) {
    let route = url.split('?')[0];
    if (route.includes('/channels/') || route.includes('/guilds/')) {
      const startInd = route.includes('/channels/') ? route.indexOf('/channels/') : route.indexOf('/guilds/');
      const majorID = route.substring(startInd).split('/')[2];
      route = route.replace(/(\d{8,})/g, ':id').replace(':id', majorID);
    }
    return route;
  }

  getAuth() {
    if (this.client.token && this.client.user && this.client.user.bot) {
      return `Bot ${this.client.token}`;
    } else if (this.client.token) {
      return this.client.token;
    }
    throw new Error(Constants.Errors.NO_TOKEN);
  }

  gen() {
    const API = `${this.client.options.http.host}/api/v${this.client.options.http.version}`;
    const apiRequest = request[this.method](`${API}${this.path}`);
    if (this.auth) apiRequest.set('authorization', this.getAuth());
    if (this.files) {
      for (const file of this.files) if (file && file.file) apiRequest.attach(file.name, file.file, file.name);
      this.data = this.data || {};
      apiRequest.field('payload_json', JSON.stringify(this.data));
    } else if (this.data) {
      apiRequest.send(this.data);
    }
    if (!this.client.browser) apiRequest.set('User-Agent', this.rest.userAgentManager.userAgent);
    return apiRequest;
  }
}

module.exports = APIRequest;


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

const querystring = __webpack_require__(58);
const long = __webpack_require__(42);
const Permissions = __webpack_require__(6);
const Constants = __webpack_require__(0);
const Endpoints = Constants.Endpoints;
const Collection = __webpack_require__(3);
const Snowflake = __webpack_require__(5);
const Util = __webpack_require__(4);

const User = __webpack_require__(11);
const GuildMember = __webpack_require__(13);
const Message = __webpack_require__(9);
const Role = __webpack_require__(10);
const Invite = __webpack_require__(31);
const Webhook = __webpack_require__(21);
const UserProfile = __webpack_require__(137);
const OAuth2Application = __webpack_require__(36);
const Channel = __webpack_require__(8);
const GroupDMChannel = __webpack_require__(19);
const Guild = __webpack_require__(16);
const VoiceRegion = __webpack_require__(138);

class RESTMethods {
  constructor(restManager) {
    this.rest = restManager;
    this.client = restManager.client;
    this._ackToken = null;
  }

  login(token = this.client.token) {
    return new Promise((resolve, reject) => {
      if (typeof token !== 'string') throw new Error(Constants.Errors.INVALID_TOKEN);
      token = token.replace(/^Bot\s*/i, '');
      this.client.manager.connectToWebSocket(token, resolve, reject);
    });
  }

  logout() {
    return this.rest.makeRequest('post', Endpoints.logout, true, {});
  }

  getGateway() {
    return this.rest.makeRequest('get', Endpoints.gateway, true).then(res => {
      this.client.ws.gateway = `${res.url}/?v=${this.client.options.ws.version}`;
      return this.client.ws.gateway;
    });
  }

  getBotGateway() {
    return this.rest.makeRequest('get', Endpoints.gateway.bot, true);
  }

  fetchVoiceRegions(guildID) {
    let endpoint;
    if (guildID) endpoint = Endpoints.Guild(guildID).voiceRegions;
    else endpoint = Endpoints.voiceRegions;
    return this.rest.makeRequest('get', endpoint, true).then(res => {
      const regions = new Collection();
      for (const region of res) regions.set(region.id, new VoiceRegion(region));
      return regions;
    });
  }

  sendMessage(channel, content, { tts, nonce, embed, disableEveryone, split, code, reply } = {}, files = null) {
    return new Promise((resolve, reject) => { // eslint-disable-line complexity
      if (typeof content !== 'undefined') content = this.client.resolver.resolveString(content);

      // The nonce has to be a uint64 :<
      if (typeof nonce !== 'undefined') {
        nonce = parseInt(nonce);
        if (isNaN(nonce) || nonce < 0) throw new RangeError('Message nonce must fit in an unsigned 64-bit integer.');
      }

      if (content) {
        if (split && typeof split !== 'object') split = {};

        // Wrap everything in a code block
        if (typeof code !== 'undefined' && (typeof code !== 'boolean' || code === true)) {
          content = Util.escapeMarkdown(this.client.resolver.resolveString(content), true);
          content = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n${content}\n\`\`\``;
          if (split) {
            split.prepend = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n`;
            split.append = '\n```';
          }
        }

        // Add zero-width spaces to @everyone/@here
        if (disableEveryone || (typeof disableEveryone === 'undefined' && this.client.options.disableEveryone)) {
          content = content.replace(/@(everyone|here)/g, '@\u200b$1');
        }

        // Add the reply prefix
        if (reply && !(channel instanceof User || channel instanceof GuildMember) && channel.type !== 'dm') {
          const id = this.client.resolver.resolveUserID(reply);
          const mention = `<@${reply instanceof GuildMember && reply.nickname ? '!' : ''}${id}>`;
          content = `${mention}${content ? `, ${content}` : ''}`;
          if (split) split.prepend = `${mention}, ${split.prepend || ''}`;
        }

        // Split the content
        if (split) content = Util.splitMessage(content, split);
      } else if (reply && !(channel instanceof User || channel instanceof GuildMember) && channel.type !== 'dm') {
        const id = this.client.resolver.resolveUserID(reply);
        content = `<@${reply instanceof GuildMember && reply.nickname ? '!' : ''}${id}>`;
      }

      const send = chan => {
        if (content instanceof Array) {
          const messages = [];
          (function sendChunk(list, index) {
            const options = index === list.length ? { tts, embed } : { tts };
            chan.send(list[index], options, index === list.length ? files : null).then(message => {
              messages.push(message);
              if (index >= list.length - 1) return resolve(messages);
              return sendChunk(list, ++index);
            });
          }(content, 0));
        } else {
          this.rest.makeRequest('post', Endpoints.Channel(chan).messages, true, {
            content, tts, nonce, embed,
          }, files).then(data => resolve(this.client.actions.MessageCreate.handle(data).message), reject);
        }
      };

      if (channel instanceof User || channel instanceof GuildMember) this.createDM(channel).then(send, reject);
      else send(channel);
    });
  }

  updateMessage(message, content, { embed, code, reply } = {}) {
    if (typeof content !== 'undefined') content = this.client.resolver.resolveString(content);

    // Wrap everything in a code block
    if (typeof code !== 'undefined' && (typeof code !== 'boolean' || code === true)) {
      content = Util.escapeMarkdown(this.client.resolver.resolveString(content), true);
      content = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n${content}\n\`\`\``;
    }

    // Add the reply prefix
    if (reply && message.channel.type !== 'dm') {
      const id = this.client.resolver.resolveUserID(reply);
      const mention = `<@${reply instanceof GuildMember && reply.nickname ? '!' : ''}${id}>`;
      content = `${mention}${content ? `, ${content}` : ''}`;
    }

    return this.rest.makeRequest('patch', Endpoints.Message(message), true, {
      content, embed,
    }).then(data => this.client.actions.MessageUpdate.handle(data).updated);
  }

  deleteMessage(message) {
    return this.rest.makeRequest('del', Endpoints.Message(message), true)
      .then(() =>
        this.client.actions.MessageDelete.handle({
          id: message.id,
          channel_id: message.channel.id,
        }).message
      );
  }

  ackMessage(message) {
    return this.rest.makeRequest('post', Endpoints.Message(message).ack, true, { token: this._ackToken }).then(res => {
      if (res.token) this._ackToken = res.token;
      return message;
    });
  }

  ackTextChannel(channel) {
    return this.rest.makeRequest('post', Endpoints.Channel(channel).ack, true, { token: this._ackToken }).then(res => {
      if (res.token) this._ackToken = res.token;
      return channel;
    });
  }

  ackGuild(guild) {
    return this.rest.makeRequest('post', Endpoints.Guild(guild).ack, true).then(() => guild);
  }

  bulkDeleteMessages(channel, messages, filterOld) {
    if (filterOld) {
      messages = messages.filter(id =>
        Date.now() - Snowflake.deconstruct(id).date.getTime() < 1209600000
      );
    }
    return this.rest.makeRequest('post', Endpoints.Channel(channel).messages.bulkDelete, true, {
      messages,
    }).then(() =>
      this.client.actions.MessageDeleteBulk.handle({
        channel_id: channel.id,
        ids: messages,
      }).messages
    );
  }

  search(target, options) {
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

    for (const key in options) if (options[key] === undefined) delete options[key];
    const queryString = (querystring.stringify(options).match(/[^=&?]+=[^=&?]+/g) || []).join('&');

    let endpoint;
    if (target instanceof Channel) {
      endpoint = Endpoints.Channel(target).search;
    } else if (target instanceof Guild) {
      endpoint = Endpoints.Guild(target).search;
    } else {
      throw new TypeError('Target must be a TextChannel, DMChannel, GroupDMChannel, or Guild.');
    }
    return this.rest.makeRequest('get', `${endpoint}?${queryString}`, true).then(body => {
      const messages = body.messages.map(x =>
        x.map(m => new Message(this.client.channels.get(m.channel_id), m, this.client))
      );
      return {
        totalResults: body.total_results,
        messages,
      };
    });
  }

  createChannel(guild, channelName, channelType, overwrites) {
    if (overwrites instanceof Collection) overwrites = overwrites.array();
    return this.rest.makeRequest('post', Endpoints.Guild(guild).channels, true, {
      name: channelName,
      type: channelType,
      permission_overwrites: overwrites,
    }).then(data => this.client.actions.ChannelCreate.handle(data).channel);
  }

  createDM(recipient) {
    const dmChannel = this.getExistingDM(recipient);
    if (dmChannel) return Promise.resolve(dmChannel);
    return this.rest.makeRequest('post', Endpoints.User(this.client.user).channels, true, {
      recipient_id: recipient.id,
    }).then(data => this.client.actions.ChannelCreate.handle(data).channel);
  }

  createGroupDM(options) {
    const data = this.client.user.bot ?
      { access_tokens: options.accessTokens, nicks: options.nicks } :
      { recipients: options.recipients };
    return this.rest.makeRequest('post', Endpoints.User('@me').channels, true, data)
      .then(res => new GroupDMChannel(this.client, res));
  }

  addUserToGroupDM(channel, options) {
    const data = this.client.user.bot ?
      { nick: options.nick, access_token: options.accessToken } :
      { recipient: options.id };
    return this.rest.makeRequest('put', Endpoints.Channel(channel).Recipient(options.id), true, data)
      .then(() => channel);
  }

  getExistingDM(recipient) {
    return this.client.channels.find(channel =>
      channel.recipient && channel.recipient.id === recipient.id
    );
  }

  deleteChannel(channel) {
    if (channel instanceof User || channel instanceof GuildMember) channel = this.getExistingDM(channel);
    if (!channel) return Promise.reject(new Error('No channel to delete.'));
    return this.rest.makeRequest('del', Endpoints.Channel(channel), true).then(data => {
      data.id = channel.id;
      return this.client.actions.ChannelDelete.handle(data).channel;
    });
  }

  updateChannel(channel, _data) {
    const data = {};
    data.name = (_data.name || channel.name).trim();
    data.topic = _data.topic || channel.topic;
    data.position = _data.position || channel.position;
    data.bitrate = _data.bitrate || channel.bitrate;
    data.user_limit = _data.userLimit || channel.userLimit;
    return this.rest.makeRequest('patch', Endpoints.Channel(channel), true, data).then(newData =>
      this.client.actions.ChannelUpdate.handle(newData).updated
    );
  }

  leaveGuild(guild) {
    if (guild.ownerID === this.client.user.id) return Promise.reject(new Error('Guild is owned by the client.'));
    return this.rest.makeRequest('del', Endpoints.User('@me').Guild(guild.id), true).then(() =>
      this.client.actions.GuildDelete.handle({ id: guild.id }).guild
    );
  }

  createGuild(options) {
    options.icon = this.client.resolver.resolveBase64(options.icon) || null;
    options.region = options.region || 'us-central';
    return new Promise((resolve, reject) => {
      this.rest.makeRequest('post', Endpoints.guilds, true, options).then(data => {
        if (this.client.guilds.has(data.id)) return resolve(this.client.guilds.get(data.id));

        const handleGuild = guild => {
          if (guild.id === data.id) {
            this.client.removeListener(Constants.Events.GUILD_CREATE, handleGuild);
            this.client.clearTimeout(timeout);
            resolve(guild);
          }
        };
        this.client.on(Constants.Events.GUILD_CREATE, handleGuild);

        const timeout = this.client.setTimeout(() => {
          this.client.removeListener(Constants.Events.GUILD_CREATE, handleGuild);
          reject(new Error('Took too long to receive guild data.'));
        }, 10000);
        return undefined;
      }, reject);
    });
  }

  // Untested but probably will work
  deleteGuild(guild) {
    return this.rest.makeRequest('del', Endpoints.Guild(guild), true).then(() =>
      this.client.actions.GuildDelete.handle({ id: guild.id }).guild
    );
  }

  getUser(userID, cache) {
    return this.rest.makeRequest('get', Endpoints.User(userID), true).then(data => {
      if (cache) return this.client.actions.UserGet.handle(data).user;
      else return new User(this.client, data);
    });
  }

  updateCurrentUser(_data, password) {
    const user = this.client.user;
    const data = {};
    data.username = _data.username || user.username;
    data.avatar = this.client.resolver.resolveBase64(_data.avatar) || user.avatar;
    if (!user.bot) {
      data.email = _data.email || user.email;
      data.password = password;
      if (_data.new_password) data.new_password = _data.newPassword;
    }
    return this.rest.makeRequest('patch', Endpoints.User('@me'), true, data).then(newData =>
      this.client.actions.UserUpdate.handle(newData).updated
    );
  }

  updateGuild(guild, _data) {
    const data = {};
    if (_data.name) data.name = _data.name;
    if (_data.region) data.region = _data.region;
    if (_data.verificationLevel) data.verification_level = Number(_data.verificationLevel);
    if (_data.afkChannel) data.afk_channel_id = this.client.resolver.resolveChannel(_data.afkChannel).id;
    if (_data.afkTimeout) data.afk_timeout = Number(_data.afkTimeout);
    if (_data.icon) data.icon = this.client.resolver.resolveBase64(_data.icon);
    if (_data.owner) data.owner_id = this.client.resolver.resolveUser(_data.owner).id;
    if (_data.splash) data.splash = this.client.resolver.resolveBase64(_data.splash);
    return this.rest.makeRequest('patch', Endpoints.Guild(guild), true, data).then(newData =>
      this.client.actions.GuildUpdate.handle(newData).updated
    );
  }

  kickGuildMember(guild, member) {
    return this.rest.makeRequest('del', Endpoints.Guild(guild).Member(member), true).then(() =>
      this.client.actions.GuildMemberRemove.handle({
        guild_id: guild.id,
        user: member.user,
      }).member
    );
  }

  createGuildRole(guild, data) {
    if (data.color) data.color = this.client.resolver.resolveColor(data.color);
    if (data.permissions) data.permissions = Permissions.resolve(data.permissions);
    return this.rest.makeRequest('post', Endpoints.Guild(guild).roles, true, data).then(role =>
      this.client.actions.GuildRoleCreate.handle({
        guild_id: guild.id,
        role,
      }).role
    );
  }

  deleteGuildRole(role) {
    return this.rest.makeRequest('del', Endpoints.Guild(role.guild).Role(role.id), true).then(() =>
      this.client.actions.GuildRoleDelete.handle({
        guild_id: role.guild.id,
        role_id: role.id,
      }).role
    );
  }

  setChannelOverwrite(channel, payload) {
    return this.rest.makeRequest('put', `${Endpoints.Channel(channel).permissions}/${payload.id}`, true, payload);
  }

  deletePermissionOverwrites(overwrite) {
    return this.rest.makeRequest(
      'del', `${Endpoints.Channel(overwrite.channel).permissions}/${overwrite.id}`, true
    ).then(() => overwrite);
  }

  getChannelMessages(channel, payload = {}) {
    const params = [];
    if (payload.limit) params.push(`limit=${payload.limit}`);
    if (payload.around) params.push(`around=${payload.around}`);
    else if (payload.before) params.push(`before=${payload.before}`);
    else if (payload.after) params.push(`after=${payload.after}`);

    let endpoint = Endpoints.Channel(channel).messages;
    if (params.length > 0) endpoint += `?${params.join('&')}`;
    return this.rest.makeRequest('get', endpoint, true);
  }

  getChannelMessage(channel, messageID) {
    const msg = channel.messages.get(messageID);
    if (msg) return Promise.resolve(msg);
    return this.rest.makeRequest('get', Endpoints.Channel(channel).Message(messageID), true);
  }

  putGuildMember(guild, user, options) {
    options.access_token = options.accessToken;
    if (options.roles) {
      const roles = options.roles;
      if (roles instanceof Collection || (roles instanceof Array && roles[0] instanceof Role)) {
        options.roles = roles.map(role => role.id);
      }
    }
    return this.rest.makeRequest('put', Endpoints.Guild(guild).Member(user.id), true, options)
      .then(data => this.client.actions.GuildMemberGet.handle(guild, data).member);
  }

  getGuildMember(guild, user, cache) {
    return this.rest.makeRequest('get', Endpoints.Guild(guild).Member(user.id), true).then(data => {
      if (cache) return this.client.actions.GuildMemberGet.handle(guild, data).member;
      else return new GuildMember(guild, data);
    });
  }

  updateGuildMember(member, data) {
    if (data.channel) data.channel_id = this.client.resolver.resolveChannel(data.channel).id;
    if (data.roles) data.roles = data.roles.map(role => role instanceof Role ? role.id : role);

    let endpoint = Endpoints.Member(member);
    // Fix your endpoints, discord ;-;
    if (member.id === this.client.user.id) {
      const keys = Object.keys(data);
      if (keys.length === 1 && keys[0] === 'nick') {
        endpoint = Endpoints.Member(member).nickname;
      }
    }

    return this.rest.makeRequest('patch', endpoint, true, data).then(newData =>
      member.guild._updateMember(member, newData).mem
    );
  }

  addMemberRole(member, role) {
    return new Promise((resolve, reject) => {
      if (member._roles.includes(role.id)) return resolve(member);

      const listener = (oldMember, newMember) => {
        if (!oldMember._roles.includes(role.id) && newMember._roles.includes(role.id)) {
          this.client.removeListener(Constants.Events.GUILD_MEMBER_UPDATE, listener);
          resolve(newMember);
        }
      };

      this.client.on(Constants.Events.GUILD_MEMBER_UPDATE, listener);
      const timeout = this.client.setTimeout(() =>
        this.client.removeListener(Constants.Events.GUILD_MEMBER_UPDATE, listener), 10e3);

      return this.rest.makeRequest('put', Endpoints.Member(member).Role(role.id), true).catch(err => {
        this.client.removeListener(Constants.Events.GUILD_BAN_REMOVE, listener);
        this.client.clearTimeout(timeout);
        reject(err);
      });
    });
  }

  removeMemberRole(member, role) {
    return new Promise((resolve, reject) => {
      if (!member._roles.includes(role.id)) return resolve(member);

      const listener = (oldMember, newMember) => {
        if (oldMember._roles.includes(role.id) && !newMember._roles.includes(role.id)) {
          this.client.removeListener(Constants.Events.GUILD_MEMBER_UPDATE, listener);
          resolve(newMember);
        }
      };

      this.client.on(Constants.Events.GUILD_MEMBER_UPDATE, listener);
      const timeout = this.client.setTimeout(() =>
        this.client.removeListener(Constants.Events.GUILD_MEMBER_UPDATE, listener), 10e3);

      return this.rest.makeRequest('delete', Endpoints.Member(member).Role(role.id), true).catch(err => {
        this.client.removeListener(Constants.Events.GUILD_BAN_REMOVE, listener);
        this.client.clearTimeout(timeout);
        reject(err);
      });
    });
  }

  sendTyping(channelID) {
    return this.rest.makeRequest('post', Endpoints.Channel(channelID).typing, true);
  }

  banGuildMember(guild, member, deleteDays = 0) {
    const id = this.client.resolver.resolveUserID(member);
    if (!id) return Promise.reject(new Error('Couldn\'t resolve the user ID to ban.'));
    return this.rest.makeRequest(
      'put', `${Endpoints.Guild(guild).bans}/${id}?delete-message-days=${deleteDays}`, true, {
        'delete-message-days': deleteDays,
      }
    ).then(() => {
      if (member instanceof GuildMember) return member;
      const user = this.client.resolver.resolveUser(id);
      if (user) {
        member = this.client.resolver.resolveGuildMember(guild, user);
        return member || user;
      }
      return id;
    });
  }

  unbanGuildMember(guild, member) {
    return new Promise((resolve, reject) => {
      const id = this.client.resolver.resolveUserID(member);
      if (!id) throw new Error('Couldn\'t resolve the user ID to unban.');

      const listener = (eGuild, eUser) => {
        if (eGuild.id === guild.id && eUser.id === id) {
          this.client.removeListener(Constants.Events.GUILD_BAN_REMOVE, listener);
          this.client.clearTimeout(timeout);
          resolve(eUser);
        }
      };
      this.client.on(Constants.Events.GUILD_BAN_REMOVE, listener);

      const timeout = this.client.setTimeout(() => {
        this.client.removeListener(Constants.Events.GUILD_BAN_REMOVE, listener);
        reject(new Error('Took too long to receive the ban remove event.'));
      }, 10000);

      this.rest.makeRequest('del', `${Endpoints.Guild(guild).bans}/${id}`, true).catch(err => {
        this.client.removeListener(Constants.Events.GUILD_BAN_REMOVE, listener);
        this.client.clearTimeout(timeout);
        reject(err);
      });
    });
  }

  getGuildBans(guild) {
    return this.rest.makeRequest('get', Endpoints.Guild(guild).bans, true).then(banItems => {
      const bannedUsers = new Collection();
      for (const banItem of banItems) {
        const user = this.client.dataManager.newUser(banItem.user);
        bannedUsers.set(user.id, user);
      }
      return bannedUsers;
    });
  }

  updateGuildRole(role, _data) {
    const data = {};
    data.name = _data.name || role.name;
    data.position = typeof _data.position !== 'undefined' ? _data.position : role.position;
    data.color = this.client.resolver.resolveColor(_data.color || role.color);
    data.hoist = typeof _data.hoist !== 'undefined' ? _data.hoist : role.hoist;
    data.mentionable = typeof _data.mentionable !== 'undefined' ? _data.mentionable : role.mentionable;

    if (_data.permissions) data.permissions = Permissions.resolve(_data.permissions);
    else data.permissions = role.permissions;

    return this.rest.makeRequest('patch', Endpoints.Guild(role.guild).Role(role.id), true, data).then(_role =>
      this.client.actions.GuildRoleUpdate.handle({
        role: _role,
        guild_id: role.guild.id,
      }).updated
    );
  }

  pinMessage(message) {
    return this.rest.makeRequest('put', Endpoints.Channel(message.channel).Pin(message.id), true)
      .then(() => message);
  }

  unpinMessage(message) {
    return this.rest.makeRequest('del', Endpoints.Channel(message.channel).Pin(message.id), true)
      .then(() => message);
  }

  getChannelPinnedMessages(channel) {
    return this.rest.makeRequest('get', Endpoints.Channel(channel).pins, true);
  }

  createChannelInvite(channel, options) {
    const payload = {};
    payload.temporary = options.temporary;
    payload.max_age = options.maxAge;
    payload.max_uses = options.maxUses;
    return this.rest.makeRequest('post', Endpoints.Channel(channel).invites, true, payload)
      .then(invite => new Invite(this.client, invite));
  }

  deleteInvite(invite) {
    return this.rest.makeRequest('del', Endpoints.Invite(invite.code), true).then(() => invite);
  }

  getInvite(code) {
    return this.rest.makeRequest('get', Endpoints.Invite(code), true).then(invite =>
      new Invite(this.client, invite)
    );
  }

  getGuildInvites(guild) {
    return this.rest.makeRequest('get', Endpoints.Guild(guild).invites, true).then(inviteItems => {
      const invites = new Collection();
      for (const inviteItem of inviteItems) {
        const invite = new Invite(this.client, inviteItem);
        invites.set(invite.code, invite);
      }
      return invites;
    });
  }

  pruneGuildMembers(guild, days, dry) {
    return this.rest.makeRequest(dry ? 'get' : 'post', `${Endpoints.Guild(guild).prune}?days=${days}`, true)
      .then(data => data.pruned);
  }

  createEmoji(guild, image, name, roles) {
    const data = { image, name };
    if (roles) data.roles = roles.map(r => r.id ? r.id : r);
    return this.rest.makeRequest('post', Endpoints.Guild(guild).emojis, true, data)
      .then(emoji => this.client.actions.GuildEmojiCreate.handle(guild, emoji).emoji);
  }

  updateEmoji(emoji, _data) {
    const data = {};
    if (_data.name) data.name = _data.name;
    if (_data.roles) data.roles = _data.roles.map(r => r.id ? r.id : r);
    return this.rest.makeRequest('patch', Endpoints.Guild(emoji.guild).Emoji(emoji.id), true, data)
      .then(newEmoji => this.client.actions.GuildEmojiUpdate.handle(emoji, newEmoji).emoji);
  }

  deleteEmoji(emoji) {
    return this.rest.makeRequest('delete', Endpoints.Guild(emoji.guild).Emoji(emoji.id), true)
      .then(() => this.client.actions.GuildEmojiDelete.handle(emoji).data);
  }

  getWebhook(id, token) {
    return this.rest.makeRequest('get', Endpoints.Webhook(id, token), !token).then(data =>
      new Webhook(this.client, data)
    );
  }

  getGuildWebhooks(guild) {
    return this.rest.makeRequest('get', Endpoints.Guild(guild).webhooks, true).then(data => {
      const hooks = new Collection();
      for (const hook of data) hooks.set(hook.id, new Webhook(this.client, hook));
      return hooks;
    });
  }

  getChannelWebhooks(channel) {
    return this.rest.makeRequest('get', Endpoints.Channel(channel).webhooks, true).then(data => {
      const hooks = new Collection();
      for (const hook of data) hooks.set(hook.id, new Webhook(this.client, hook));
      return hooks;
    });
  }

  createWebhook(channel, name, avatar) {
    return this.rest.makeRequest('post', Endpoints.Channel(channel).webhooks, true, { name, avatar })
      .then(data => new Webhook(this.client, data));
  }

  editWebhook(webhook, name, avatar) {
    return this.rest.makeRequest('patch', Endpoints.Webhook(webhook.id, webhook.token), false, {
      name,
      avatar,
    }).then(data => {
      webhook.name = data.name;
      webhook.avatar = data.avatar;
      return webhook;
    });
  }

  deleteWebhook(webhook) {
    return this.rest.makeRequest('delete', Endpoints.Webhook(webhook.id, webhook.token), false);
  }

  sendWebhookMessage(webhook, content, { avatarURL, tts, disableEveryone, embeds, username } = {}, file = null) {
    username = username || webhook.name;
    if (typeof content !== 'undefined') content = this.client.resolver.resolveString(content);
    if (content) {
      if (disableEveryone || (typeof disableEveryone === 'undefined' && this.client.options.disableEveryone)) {
        content = content.replace(/@(everyone|here)/g, '@\u200b$1');
      }
    }
    return this.rest.makeRequest('post', `${Endpoints.Webhook(webhook.id, webhook.token)}?wait=true`, false, {
      username,
      avatar_url: avatarURL,
      content,
      tts,
      embeds,
    }, file);
  }

  sendSlackWebhookMessage(webhook, body) {
    return this.rest.makeRequest(
      'post', `${Endpoints.Webhook(webhook.id, webhook.token)}/slack?wait=true`, false, body
    );
  }

  fetchUserProfile(user) {
    return this.rest.makeRequest('get', Endpoints.User(user).profile, true).then(data =>
      new UserProfile(user, data)
    );
  }

  fetchMeMentions(options) {
    if (options.guild) options.guild = options.guild.id ? options.guild.id : options.guild;
    return this.rest.makeRequest(
      'get',
      Endpoints.User('@me').mentions(options.limit, options.roles, options.everyone, options.guild)
    ).then(res => res.body.map(m => new Message(this.client.channels.get(m.channel_id), m, this.client)));
  }

  addFriend(user) {
    return this.rest.makeRequest('post', Endpoints.User('@me'), true, {
      username: user.username,
      discriminator: user.discriminator,
    }).then(() => user);
  }

  removeFriend(user) {
    return this.rest.makeRequest('delete', Endpoints.User('@me').Relationship(user.id), true)
      .then(() => user);
  }

  blockUser(user) {
    return this.rest.makeRequest('put', Endpoints.User('@me').Relationship(user.id), true, { type: 2 })
      .then(() => user);
  }

  unblockUser(user) {
    return this.rest.makeRequest('delete', Endpoints.User('@me').Relationship(user.id), true)
      .then(() => user);
  }

  updateChannelPositions(guildID, channels) {
    const data = new Array(channels.length);
    for (let i = 0; i < channels.length; i++) {
      data[i] = {
        id: this.client.resolver.resolveChannelID(channels[i].channel),
        position: channels[i].position,
      };
    }

    return this.rest.makeRequest('patch', Endpoints.Guild(guildID).channels, true, data).then(() =>
      this.client.actions.GuildChannelsPositionUpdate.handle({
        guild_id: guildID,
        channels,
      }).guild
    );
  }

  setRolePositions(guildID, roles) {
    return this.rest.makeRequest('patch', Endpoints.Guild(guildID).roles, true, roles).then(() =>
      this.client.actions.GuildRolesPositionUpdate.handle({
        guild_id: guildID,
        roles,
      }).guild
    );
  }

  addMessageReaction(message, emoji) {
    return this.rest.makeRequest(
      'put', Endpoints.Message(message).Reaction(emoji).User('@me'), true
    ).then(() =>
      this.client.actions.MessageReactionAdd.handle({
        user_id: this.client.user.id,
        message_id: message.id,
        emoji: Util.parseEmoji(emoji),
        channel_id: message.channel.id,
      }).reaction
      );
  }

  removeMessageReaction(message, emoji, user) {
    const endpoint = Endpoints.Message(message).Reaction(emoji).User(user === this.client.user.id ? '@me' : user.id);
    return this.rest.makeRequest('delete', endpoint, true).then(() =>
      this.client.actions.MessageReactionRemove.handle({
        user_id: user,
        message_id: message.id,
        emoji: Util.parseEmoji(emoji),
        channel_id: message.channel.id,
      }).reaction
    );
  }

  removeMessageReactions(message) {
    return this.rest.makeRequest('delete', Endpoints.Message(message).reactions, true)
      .then(() => message);
  }

  getMessageReactionUsers(message, emoji, limit = 100) {
    return this.rest.makeRequest('get', Endpoints.Message(message).Reaction(emoji, limit), true);
  }

  getApplication(id) {
    return this.rest.makeRequest('get', Endpoints.OAUTH2.Application(id), true).then(app =>
      new OAuth2Application(this.client, app)
    );
  }

  resetApplication(id) {
    return this.rest.makeRequest('post', Endpoints.OAUTH2.Application(id).reset, true)
      .then(app => new OAuth2Application(this.client, app));
  }

  setNote(user, note) {
    return this.rest.makeRequest('put', Endpoints.User(user).note, true, { note }).then(() => user);
  }

  acceptInvite(code) {
    if (code.id) code = code.id;
    return new Promise((resolve, reject) =>
      this.rest.makeRequest('post', Endpoints.Invite(code), true).then(res => {
        const handler = guild => {
          if (guild.id === res.id) {
            resolve(guild);
            this.client.removeListener(Constants.Events.GUILD_CREATE, handler);
          }
        };
        this.client.on(Constants.Events.GUILD_CREATE, handler);
        this.client.setTimeout(() => {
          this.client.removeListener(Constants.Events.GUILD_CREATE, handler);
          reject(new Error('Accepting invite timed out'));
        }, 120e3);
      })
    );
  }
}

module.exports = RESTMethods;


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

const RequestHandler = __webpack_require__(45);

class BurstRequestHandler extends RequestHandler {
  constructor(restManager, endpoint) {
    super(restManager, endpoint);

    this.client = restManager.client;

    this.limit = Infinity;
    this.resetTime = null;
    this.remaining = 1;
    this.timeDifference = 0;

    this.resetTimeout = null;
  }

  push(request) {
    super.push(request);
    this.handle();
  }

  execute(item) {
    if (!item) return;
    item.request.gen().end((err, res) => {
      if (res && res.headers) {
        this.limit = Number(res.headers['x-ratelimit-limit']);
        this.resetTime = Number(res.headers['x-ratelimit-reset']) * 1000;
        this.remaining = Number(res.headers['x-ratelimit-remaining']);
        this.timeDifference = Date.now() - new Date(res.headers.date).getTime();
      }
      if (err) {
        if (err.status === 429) {
          this.queue.unshift(item);
          if (res.headers['x-ratelimit-global']) this.globalLimit = true;
          if (this.resetTimeout) return;
          this.resetTimeout = this.client.setTimeout(() => {
            this.remaining = this.limit;
            this.globalLimit = false;
            this.handle();
            this.resetTimeout = null;
          }, Number(res.headers['retry-after']) + this.client.options.restTimeOffset);
        } else {
          item.reject(err);
          this.handle();
        }
      } else {
        this.globalLimit = false;
        const data = res && res.body ? res.body : {};
        item.resolve(data);
        this.handle();
      }
    });
  }

  handle() {
    super.handle();
    if (this.remaining <= 0 || this.queue.length === 0 || this.globalLimit) return;
    this.execute(this.queue.shift());
    this.remaining--;
    this.handle();
  }
}

module.exports = BurstRequestHandler;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

const RequestHandler = __webpack_require__(45);

/**
 * Handles API Requests sequentially, i.e. we wait until the current request is finished before moving onto
 * the next. This plays a _lot_ nicer in terms of avoiding 429's when there is more than one session of the account,
 * but it can be slower.
 * @extends {RequestHandler}
 * @private
 */
class SequentialRequestHandler extends RequestHandler {
  /**
   * @param {RESTManager} restManager The REST manager to use
   * @param {string} endpoint The endpoint to handle
   */
  constructor(restManager, endpoint) {
    super(restManager, endpoint);

    /**
     * The endpoint that this handler is handling
     * @type {string}
     */
    this.endpoint = endpoint;

    /**
     * The time difference between Discord's Dates and the local computer's Dates. A positive number means the local
     * computer's time is ahead of Discord's.
     * @type {number}
     */
    this.timeDifference = 0;
  }

  push(request) {
    super.push(request);
    this.handle();
  }

  /**
   * Performs a request then resolves a promise to indicate its readiness for a new request
   * @param {APIRequest} item The item to execute
   * @returns {Promise<?Object|Error>}
   */
  execute(item) {
    return new Promise(resolve => {
      item.request.gen().end((err, res) => {
        if (res && res.headers) {
          this.requestLimit = Number(res.headers['x-ratelimit-limit']);
          this.requestResetTime = Number(res.headers['x-ratelimit-reset']) * 1000;
          this.requestRemaining = Number(res.headers['x-ratelimit-remaining']);
          this.timeDifference = Date.now() - new Date(res.headers.date).getTime();
        }
        if (err) {
          if (err.status === 429) {
            this.queue.unshift(item);
            this.restManager.client.setTimeout(() => {
              this.globalLimit = false;
              resolve();
            }, Number(res.headers['retry-after']) + this.restManager.client.options.restTimeOffset);
            if (res.headers['x-ratelimit-global']) this.globalLimit = true;
          } else {
            item.reject(err);
            resolve(err);
          }
        } else {
          this.globalLimit = false;
          const data = res && res.body ? res.body : {};
          item.resolve(data);
          if (this.requestRemaining === 0) {
            this.restManager.client.setTimeout(
              () => {
                this.waiting = false;
                resolve(data);
              },
              this.requestResetTime - Date.now() + this.timeDifference + this.restManager.client.options.restTimeOffset
            );
          } else {
            resolve(data);
          }
        }
      });
    });
  }

  handle() {
    super.handle();
    if (this.remaining === 0 || this.queue.length === 0 || this.globalLimit) return;
    this.execute(this.queue.shift()).then(() => this.handle());
  }
}

module.exports = SequentialRequestHandler;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {const Constants = __webpack_require__(0);

class UserAgentManager {
  constructor() {
    this.build(this.constructor.DEFAULT);
  }

  set({ url, version } = {}) {
    this.build({
      url: url || this.constructor.DFEAULT.url,
      version: version || this.constructor.DEFAULT.version,
    });
  }

  build(ua) {
    this.userAgent = `DiscordBot (${ua.url}, ${ua.version}) Node.js/${process.version}`;
  }
}

UserAgentManager.DEFAULT = {
  url: Constants.Package.homepage.split('#')[0],
  version: Constants.Package.version,
};

module.exports = UserAgentManager;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {const browser = __webpack_require__(15).platform() === 'browser';
const EventEmitter = __webpack_require__(23).EventEmitter;
const Constants = __webpack_require__(0);
const convertToBuffer = __webpack_require__(4).convertToBuffer;
const zlib = __webpack_require__(43);
const PacketManager = __webpack_require__(101);

let WebSocket, erlpack;
let serialize = JSON.stringify;
if (browser) {
  WebSocket = window.WebSocket; // eslint-disable-line no-undef
} else {
  try {
    WebSocket = __webpack_require__(143);
  } catch (err) {
    WebSocket = __webpack_require__(144);
  }

  try {
    erlpack = __webpack_require__(142);
    serialize = erlpack.pack;
  } catch (err) {
    erlpack = null;
  }
}

/**
 * The WebSocket Manager of the Client
 * @private
 */
class WebSocketManager extends EventEmitter {
  constructor(client) {
    super();
    /**
     * The Client that instantiated this WebSocketManager
     * @type {Client}
     */
    this.client = client;

    /**
     * A WebSocket Packet manager, it handles all the messages
     * @type {PacketManager}
     */
    this.packetManager = new PacketManager(this);

    /**
     * The status of the WebSocketManager, a type of Constants.Status. It defaults to IDLE.
     * @type {number}
     */
    this.status = Constants.Status.IDLE;

    /**
     * The session ID of the connection, null if not yet available.
     * @type {?string}
     */
    this.sessionID = null;

    /**
     * The packet count of the client, null if not yet available.
     * @type {?number}
     */
    this.sequence = -1;

    /**
     * The gateway address for this WebSocket connection, null if not yet available.
     * @type {?string}
     */
    this.gateway = null;

    /**
     * Whether READY was emitted normally (all packets received) or not
     * @type {boolean}
     */
    this.normalReady = false;

    /**
     * The WebSocket connection to the gateway
     * @type {?WebSocket}
     */
    this.ws = null;

    /**
     * An object with keys that are websocket event names that should be ignored
     * @type {Object}
     */
    this.disabledEvents = {};
    for (const event of client.options.disabledEvents) this.disabledEvents[event] = true;

    this.first = true;

    this.lastHeartbeatAck = true;
  }

  /**
   * Connects the client to a given gateway
   * @param {string} gateway The gateway to connect to
   */
  _connect(gateway) {
    this.client.emit('debug', `Connecting to gateway ${gateway}`);
    this.normalReady = false;
    if (this.status !== Constants.Status.RECONNECTING) this.status = Constants.Status.CONNECTING;
    this.ws = new WebSocket(gateway);
    if (browser) this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = this.eventOpen.bind(this);
    this.ws.onmessage = this.eventMessage.bind(this);
    this.ws.onclose = this.eventClose.bind(this);
    this.ws.onerror = this.eventError.bind(this);
    this._queue = [];
    this._remaining = 120;
    this.client.setInterval(() => {
      this._remaining = 120;
      this._remainingReset = Date.now();
    }, 60e3);
  }

  connect(gateway) {
    gateway = `${gateway}&encoding=${erlpack ? 'etf' : 'json'}`;
    if (this.first) {
      this._connect(gateway);
      this.first = false;
    } else {
      this.client.setTimeout(() => this._connect(gateway), 5500);
    }
  }

  heartbeat(normal) {
    if (normal && !this.lastHeartbeatAck) {
      this.ws.close(1007);
      return;
    }

    this.client.emit('debug', 'Sending heartbeat');
    this.client._pingTimestamp = Date.now();
    this.client.ws.send({
      op: Constants.OPCodes.HEARTBEAT,
      d: this.sequence,
    }, true);

    this.lastHeartbeatAck = false;
  }

  /**
   * Sends a packet to the gateway
   * @param {Object} data An object that can be JSON stringified
   * @param {boolean} force Whether or not to send the packet immediately
   */
  send(data, force = false) {
    if (force) {
      this._send(serialize(data));
      return;
    }
    this._queue.push(serialize(data));
    this.doQueue();
  }

  destroy() {
    if (this.ws) this.ws.close(1000);
    this._queue = [];
    this.status = Constants.Status.IDLE;
  }

  _send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.emit('send', data);
      this.ws.send(data);
    }
  }

  doQueue() {
    const item = this._queue[0];
    if (!(this.ws.readyState === WebSocket.OPEN && item)) return;
    if (this.remaining === 0) {
      this.client.setTimeout(this.doQueue.bind(this), Date.now() - this.remainingReset);
      return;
    }
    this._remaining--;
    this._send(item);
    this._queue.shift();
    this.doQueue();
  }

  /**
   * Run whenever the gateway connections opens up
   */
  eventOpen() {
    this.client.emit('debug', 'Connection to gateway opened');
    this.lastHeartbeatAck = true;
    if (this.status === Constants.Status.RECONNECTING) this._sendResume();
    else this._sendNewIdentify();
  }

  /**
   * Sends a gateway resume packet, in cases of unexpected disconnections.
   */
  _sendResume() {
    if (!this.sessionID) {
      this._sendNewIdentify();
      return;
    }
    this.client.emit('debug', 'Identifying as resumed session');
    const payload = {
      token: this.client.token,
      session_id: this.sessionID,
      seq: this.sequence,
    };

    this.send({
      op: Constants.OPCodes.RESUME,
      d: payload,
    });
  }

  /**
   * Sends a new identification packet, in cases of new connections or failed reconnections.
   */
  _sendNewIdentify() {
    this.reconnecting = false;
    const payload = this.client.options.ws;
    payload.token = this.client.token;
    if (this.client.options.shardCount > 0) {
      payload.shard = [Number(this.client.options.shardId), Number(this.client.options.shardCount)];
    }
    this.client.emit('debug', 'Identifying as new session');
    this.send({
      op: Constants.OPCodes.IDENTIFY,
      d: payload,
    });
    this.sequence = -1;
  }

  /**
   * @external CloseEvent
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent}
   */

  /**
   * Run whenever the connection to the gateway is closed, it will try to reconnect the client.
   * @param {CloseEvent} event The WebSocket close event
   */
  eventClose(event) {
    this.emit('close', event);
    this.client.clearInterval(this.client.manager.heartbeatInterval);
    this.status = Constants.Status.DISCONNECTED;
    this._queue = [];
    /**
     * Emitted whenever the client websocket is disconnected
     * @event Client#disconnect
     * @param {CloseEvent} event The WebSocket close event
     */
    if (!this.reconnecting) this.client.emit(Constants.Events.DISCONNECT, event);
    if ([4004, 4010, 4011].includes(event.code)) return;
    if (!this.reconnecting && event.code !== 1000) this.tryReconnect();
  }

  /**
   * Run whenever a message is received from the WebSocket. Returns `true` if the message
   * was handled properly.
   * @param {Object} event The received websocket data
   * @returns {boolean}
   */
  eventMessage(event) {
    const data = this.tryParseEventData(event.data);
    if (data === null) {
      this.eventError(new Error(Constants.Errors.BAD_WS_MESSAGE));
      return false;
    }

    this.client.emit('raw', data);

    if (data.op === Constants.OPCodes.HELLO) this.client.manager.setupKeepAlive(data.d.heartbeat_interval);
    return this.packetManager.handle(data);
  }

  /**
   * Parses the raw data from a websocket event, inflating it if necessary
   * @param {*} data Event data
   * @returns {Object}
   */
  parseEventData(data) {
    if (erlpack) {
      if (data instanceof ArrayBuffer) data = convertToBuffer(data);
      return erlpack.unpack(data);
    } else {
      if (data instanceof Buffer || data instanceof ArrayBuffer) data = zlib.inflateSync(data).toString();
      return JSON.parse(data);
    }
  }

  /**
   * Tries to call `parseEventData()` and return its result, or returns `null` upon thrown errors.
   * @param {*} data Event data
   * @returns {?Object}
   */
  tryParseEventData(data) {
    try {
      return this.parseEventData(data);
    } catch (err) {
      return null;
    }
  }

  /**
   * Run whenever an error occurs with the WebSocket connection. Tries to reconnect
   * @param {Error} err The encountered error
   */
  eventError(err) {
    /**
     * Emitted whenever the Client encounters a serious connection error
     * @event Client#error
     * @param {Error} error The encountered error
     */
    if (this.client.listenerCount('error') > 0) this.client.emit('error', err);
    this.tryReconnect();
  }

  _emitReady(normal = true) {
    /**
     * Emitted when the Client becomes ready to start working
     * @event Client#ready
     */
    this.status = Constants.Status.READY;
    this.client.emit(Constants.Events.READY);
    this.packetManager.handleQueue();
    this.normalReady = normal;
  }

  /**
   * Runs on new packets before `READY` to see if the Client is ready yet, if it is prepares
   * the `READY` event.
   */
  checkIfReady() {
    if (this.status !== Constants.Status.READY && this.status !== Constants.Status.NEARLY) {
      let unavailableCount = 0;
      for (const guildID of this.client.guilds.keys()) {
        unavailableCount += this.client.guilds.get(guildID).available ? 0 : 1;
      }
      if (unavailableCount === 0) {
        this.status = Constants.Status.NEARLY;
        if (this.client.options.fetchAllMembers) {
          const promises = this.client.guilds.map(g => g.fetchMembers());
          Promise.all(promises).then(() => this._emitReady(), e => {
            this.client.emit(Constants.Events.WARN, 'Error in pre-ready guild member fetching');
            this.client.emit(Constants.Events.ERROR, e);
            this._emitReady();
          });
          return;
        }
        this._emitReady();
      }
    }
  }

  /**
   * Tries to reconnect the client, changing the status to Constants.Status.RECONNECTING.
   */
  tryReconnect() {
    if (this.status === Constants.Status.RECONNECTING || this.status === Constants.Status.CONNECTING) return;
    this.status = Constants.Status.RECONNECTING;
    this.ws.close();
    this.packetManager.handleQueue();
    /**
     * Emitted when the Client tries to reconnect after being disconnected
     * @event Client#reconnecting
     */
    this.client.emit(Constants.Events.RECONNECTING);
    this.connect(this.client.ws.gateway);
  }
}

module.exports = WebSocketManager;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22).Buffer))

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

const Constants = __webpack_require__(0);

const BeforeReadyWhitelist = [
  Constants.WSEvents.READY,
  Constants.WSEvents.GUILD_CREATE,
  Constants.WSEvents.GUILD_DELETE,
  Constants.WSEvents.GUILD_MEMBERS_CHUNK,
  Constants.WSEvents.GUILD_MEMBER_ADD,
  Constants.WSEvents.GUILD_MEMBER_REMOVE,
];

class WebSocketPacketManager {
  constructor(websocketManager) {
    this.ws = websocketManager;
    this.handlers = {};
    this.queue = [];

    this.register(Constants.WSEvents.READY, __webpack_require__(128));
    this.register(Constants.WSEvents.GUILD_CREATE, __webpack_require__(108));
    this.register(Constants.WSEvents.GUILD_DELETE, __webpack_require__(109));
    this.register(Constants.WSEvents.GUILD_UPDATE, __webpack_require__(119));
    this.register(Constants.WSEvents.GUILD_BAN_ADD, __webpack_require__(106));
    this.register(Constants.WSEvents.GUILD_BAN_REMOVE, __webpack_require__(107));
    this.register(Constants.WSEvents.GUILD_MEMBER_ADD, __webpack_require__(111));
    this.register(Constants.WSEvents.GUILD_MEMBER_REMOVE, __webpack_require__(112));
    this.register(Constants.WSEvents.GUILD_MEMBER_UPDATE, __webpack_require__(113));
    this.register(Constants.WSEvents.GUILD_ROLE_CREATE, __webpack_require__(115));
    this.register(Constants.WSEvents.GUILD_ROLE_DELETE, __webpack_require__(116));
    this.register(Constants.WSEvents.GUILD_ROLE_UPDATE, __webpack_require__(117));
    this.register(Constants.WSEvents.GUILD_EMOJIS_UPDATE, __webpack_require__(110));
    this.register(Constants.WSEvents.GUILD_MEMBERS_CHUNK, __webpack_require__(114));
    this.register(Constants.WSEvents.CHANNEL_CREATE, __webpack_require__(102));
    this.register(Constants.WSEvents.CHANNEL_DELETE, __webpack_require__(103));
    this.register(Constants.WSEvents.CHANNEL_UPDATE, __webpack_require__(105));
    this.register(Constants.WSEvents.CHANNEL_PINS_UPDATE, __webpack_require__(104));
    this.register(Constants.WSEvents.PRESENCE_UPDATE, __webpack_require__(127));
    this.register(Constants.WSEvents.USER_UPDATE, __webpack_require__(133));
    this.register(Constants.WSEvents.USER_NOTE_UPDATE, __webpack_require__(132));
    this.register(Constants.WSEvents.VOICE_STATE_UPDATE, __webpack_require__(135));
    this.register(Constants.WSEvents.TYPING_START, __webpack_require__(131));
    this.register(Constants.WSEvents.MESSAGE_CREATE, __webpack_require__(120));
    this.register(Constants.WSEvents.MESSAGE_DELETE, __webpack_require__(121));
    this.register(Constants.WSEvents.MESSAGE_UPDATE, __webpack_require__(126));
    this.register(Constants.WSEvents.MESSAGE_DELETE_BULK, __webpack_require__(122));
    this.register(Constants.WSEvents.VOICE_SERVER_UPDATE, __webpack_require__(134));
    this.register(Constants.WSEvents.GUILD_SYNC, __webpack_require__(118));
    this.register(Constants.WSEvents.RELATIONSHIP_ADD, __webpack_require__(129));
    this.register(Constants.WSEvents.RELATIONSHIP_REMOVE, __webpack_require__(130));
    this.register(Constants.WSEvents.MESSAGE_REACTION_ADD, __webpack_require__(123));
    this.register(Constants.WSEvents.MESSAGE_REACTION_REMOVE, __webpack_require__(124));
    this.register(Constants.WSEvents.MESSAGE_REACTION_REMOVE_ALL, __webpack_require__(125));
  }

  get client() {
    return this.ws.client;
  }

  register(event, Handler) {
    this.handlers[event] = new Handler(this);
  }

  handleQueue() {
    this.queue.forEach((element, index) => {
      this.handle(this.queue[index]);
      this.queue.splice(index, 1);
    });
  }

  setSequence(s) {
    if (s && s > this.ws.sequence) this.ws.sequence = s;
  }

  handle(packet) {
    if (packet.op === Constants.OPCodes.RECONNECT) {
      this.setSequence(packet.s);
      this.ws.tryReconnect();
      return false;
    }

    if (packet.op === Constants.OPCodes.INVALID_SESSION) {
      if (packet.d) {
        setTimeout(() => {
          this.ws._sendResume();
        }, 2500);
      } else {
        this.ws.sessionID = null;
        this.ws._sendNewIdentify();
      }
      return false;
    }

    if (packet.op === Constants.OPCodes.HEARTBEAT_ACK) {
      this.ws.client._pong(this.ws.client._pingTimestamp);
      this.ws.lastHeartbeatAck = true;
      this.ws.client.emit('debug', 'Heartbeat acknowledged');
    } else if (packet.op === Constants.OPCodes.HEARTBEAT) {
      this.client.ws.send({
        op: Constants.OPCodes.HEARTBEAT,
        d: this.client.ws.sequence,
      });
      this.ws.client.emit('debug', 'Received gateway heartbeat');
    }

    if (this.ws.status === Constants.Status.RECONNECTING) {
      this.ws.reconnecting = false;
      this.ws.checkIfReady();
    }

    this.setSequence(packet.s);

    if (this.ws.disabledEvents[packet.t] !== undefined) return false;

    if (this.ws.status !== Constants.Status.READY) {
      if (BeforeReadyWhitelist.indexOf(packet.t) === -1) {
        this.queue.push(packet);
        return false;
      }
    }

    if (this.handlers[packet.t]) return this.handlers[packet.t].handle(packet);
    return false;
  }
}

module.exports = WebSocketPacketManager;


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class ChannelCreateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.ChannelCreate.handle(data);
  }
}

/**
 * Emitted whenever a channel is created.
 * @event Client#channelCreate
 * @param {Channel} channel The channel that was created
 */

module.exports = ChannelCreateHandler;


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

const Constants = __webpack_require__(0);

class ChannelDeleteHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const response = client.actions.ChannelDelete.handle(data);
    if (response.channel) client.emit(Constants.Events.CHANNEL_DELETE, response.channel);
  }
}

/**
 * Emitted whenever a channel is deleted.
 * @event Client#channelDelete
 * @param {Channel} channel The channel that was deleted
 */

module.exports = ChannelDeleteHandler;


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const Constants = __webpack_require__(0);

/*
{ t: 'CHANNEL_PINS_UPDATE',
  s: 666,
  op: 0,
  d:
   { last_pin_timestamp: '2016-08-28T17:37:13.171774+00:00',
     channel_id: '314866471639044027' } }
*/

class ChannelPinsUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const channel = client.channels.get(data.channel_id);
    const time = new Date(data.last_pin_timestamp);
    if (channel && time) client.emit(Constants.Events.CHANNEL_PINS_UPDATE, channel, time);
  }
}

/**
 * Emitted whenever the pins of a channel are updated. Due to the nature of the WebSocket event, not much information
 * can be provided easily here - you need to manually check the pins yourself.
 * @event Client#channelPinsUpdate
 * @param {Channel} channel The channel that the pins update occured in
 * @param {Date} time The time of the pins update
 */

module.exports = ChannelPinsUpdate;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class ChannelUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.ChannelUpdate.handle(data);
  }
}

module.exports = ChannelUpdateHandler;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

// ##untested handler##

const AbstractHandler = __webpack_require__(1);
const Constants = __webpack_require__(0);

class GuildBanAddHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    const user = client.users.get(data.user.id);
    if (guild && user) client.emit(Constants.Events.GUILD_BAN_ADD, guild, user);
  }
}

/**
 * Emitted whenever a member is banned from a guild.
 * @event Client#guildBanAdd
 * @param {Guild} guild The guild that the ban occurred in
 * @param {User} user The user that was banned
 */

module.exports = GuildBanAddHandler;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

// ##untested handler##

const AbstractHandler = __webpack_require__(1);

class GuildBanRemoveHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildBanRemove.handle(data);
  }
}

/**
 * Emitted whenever a member is unbanned from a guild.
 * @event Client#guildBanRemove
 * @param {Guild} guild The guild that the unban occurred in
 * @param {User} user The user that was unbanned
 */

module.exports = GuildBanRemoveHandler;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class GuildCreateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    const guild = client.guilds.get(data.id);
    if (guild) {
      if (!guild.available && !data.unavailable) {
        // A newly available guild
        guild.setup(data);
        this.packetManager.ws.checkIfReady();
      }
    } else {
      // A new guild
      client.dataManager.newGuild(data);
    }
  }
}

module.exports = GuildCreateHandler;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const Constants = __webpack_require__(0);

class GuildDeleteHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const response = client.actions.GuildDelete.handle(data);
    if (response.guild) client.emit(Constants.Events.GUILD_DELETE, response.guild);
  }
}

/**
 * Emitted whenever a guild is deleted/left.
 * @event Client#guildDelete
 * @param {Guild} guild The guild that was deleted
 */

module.exports = GuildDeleteHandler;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

function mappify(iterable) {
  const map = new Map();
  for (const x of iterable) map.set(...x);
  return map;
}

class GuildEmojisUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    if (!guild || !guild.emojis) return;

    const deletions = mappify(guild.emojis.entries());

    for (const emoji of data.emojis) {
      // Determine type of emoji event
      const cachedEmoji = guild.emojis.get(emoji.id);
      if (cachedEmoji) {
        deletions.delete(emoji.id);
        if (!cachedEmoji.equals(emoji, true)) {
          // Emoji updated
          client.actions.GuildEmojiUpdate.handle(cachedEmoji, emoji);
        }
      } else {
        // Emoji added
        client.actions.GuildEmojiCreate.handle(guild, emoji);
      }
    }

    for (const emoji of deletions.values()) {
      // Emoji deleted
      client.actions.GuildEmojiDelete.handle(emoji);
    }
  }
}

module.exports = GuildEmojisUpdate;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

// ##untested handler##

const AbstractHandler = __webpack_require__(1);

class GuildMemberAddHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      guild.memberCount++;
      guild._addMember(data);
    }
  }
}

module.exports = GuildMemberAddHandler;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

// ##untested handler##

const AbstractHandler = __webpack_require__(1);

class GuildMemberRemoveHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildMemberRemove.handle(data);
  }
}

module.exports = GuildMemberRemoveHandler;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

// ##untested handler##

const AbstractHandler = __webpack_require__(1);

class GuildMemberUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const member = guild.members.get(data.user.id);
      if (member) guild._updateMember(member, data);
    }
  }
}

module.exports = GuildMemberUpdateHandler;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const Constants = __webpack_require__(0);
// Uncomment in v12
// const Collection = require('../../../../util/Collection');

class GuildMembersChunkHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    if (!guild) return;

    // Uncomment in v12
    // const members = new Collection();
    //
    // for (const member of data.members) members.set(member.id, guild._addMember(member, false));

    const members = data.members.map(member => guild._addMember(member, false));

    client.emit(Constants.Events.GUILD_MEMBERS_CHUNK, members, guild);

    client.ws.lastHeartbeatAck = true;
  }
}

/**
 * Emitted whenever a chunk of guild members is received (all members come from the same guild)
 * @event Client#guildMembersChunk
 * @param {Collection<Snowflake, GuildMember>} members The members in the chunk
 * @param {Guild} guild The guild related to the member chunk
 */

module.exports = GuildMembersChunkHandler;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class GuildRoleCreateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildRoleCreate.handle(data);
  }
}

module.exports = GuildRoleCreateHandler;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class GuildRoleDeleteHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildRoleDelete.handle(data);
  }
}

module.exports = GuildRoleDeleteHandler;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class GuildRoleUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildRoleUpdate.handle(data);
  }
}

module.exports = GuildRoleUpdateHandler;


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class GuildSyncHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildSync.handle(data);
  }
}

module.exports = GuildSyncHandler;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class GuildUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildUpdate.handle(data);
  }
}

module.exports = GuildUpdateHandler;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const Constants = __webpack_require__(0);

class MessageCreateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const response = client.actions.MessageCreate.handle(data);
    if (response.message) client.emit(Constants.Events.MESSAGE_CREATE, response.message);
  }
}

/**
 * Emitted whenever a message is created
 * @event Client#message
 * @param {Message} message The created message
 */

module.exports = MessageCreateHandler;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const Constants = __webpack_require__(0);

class MessageDeleteHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const response = client.actions.MessageDelete.handle(data);
    if (response.message) client.emit(Constants.Events.MESSAGE_DELETE, response.message);
  }
}

/**
 * Emitted whenever a message is deleted
 * @event Client#messageDelete
 * @param {Message} message The deleted message
 */

module.exports = MessageDeleteHandler;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class MessageDeleteBulkHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.MessageDeleteBulk.handle(data);
  }
}

/**
 * Emitted whenever messages are deleted in bulk
 * @event Client#messageDeleteBulk
 * @param {Collection<Snowflake, Message>} messages The deleted messages, mapped by their ID
 */

module.exports = MessageDeleteBulkHandler;


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class MessageReactionAddHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.MessageReactionAdd.handle(data);
  }
}

module.exports = MessageReactionAddHandler;


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class MessageReactionRemove extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.MessageReactionRemove.handle(data);
  }
}

module.exports = MessageReactionRemove;


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class MessageReactionRemoveAll extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.MessageReactionRemoveAll.handle(data);
  }
}

module.exports = MessageReactionRemoveAll;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class MessageUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.MessageUpdate.handle(data);
  }
}

module.exports = MessageUpdateHandler;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const Constants = __webpack_require__(0);
const Util = __webpack_require__(4);

class PresenceUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    let user = client.users.get(data.user.id);
    const guild = client.guilds.get(data.guild_id);

    // Step 1
    if (!user) {
      if (data.user.username) {
        user = client.dataManager.newUser(data.user);
      } else {
        return;
      }
    }

    const oldUser = Util.cloneObject(user);
    user.patch(data.user);
    if (!user.equals(oldUser)) {
      client.emit(Constants.Events.USER_UPDATE, oldUser, user);
    }

    if (guild) {
      let member = guild.members.get(user.id);
      if (!member && data.status !== 'offline') {
        member = guild._addMember({
          user,
          roles: data.roles,
          deaf: false,
          mute: false,
        }, false);
        client.emit(Constants.Events.GUILD_MEMBER_AVAILABLE, member);
      }
      if (member) {
        if (client.listenerCount(Constants.Events.PRESENCE_UPDATE) === 0) {
          guild._setPresence(user.id, data);
          return;
        }
        const oldMember = Util.cloneObject(member);
        if (member.presence) {
          oldMember.frozenPresence = Util.cloneObject(member.presence);
        }
        guild._setPresence(user.id, data);
        client.emit(Constants.Events.PRESENCE_UPDATE, oldMember, member);
      } else {
        guild._setPresence(user.id, data);
      }
    }
  }
}

/**
 * Emitted whenever a guild member's presence changes, or they change one of their details.
 * @event Client#presenceUpdate
 * @param {GuildMember} oldMember The member before the presence update
 * @param {GuildMember} newMember The member after the presence update
 */

/**
 * Emitted whenever a user's details (e.g. username) are changed.
 * @event Client#userUpdate
 * @param {User} oldUser The user before the update
 * @param {User} newUser The user after the update
 */

/**
 * Emitted whenever a member becomes available in a large guild
 * @event Client#guildMemberAvailable
 * @param {GuildMember} member The member that became available
 */

module.exports = PresenceUpdateHandler;


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

const ClientUser = __webpack_require__(29);

class ReadyHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    client.ws.heartbeat();

    const clientUser = new ClientUser(client, data.user);
    clientUser.settings = data.user_settings;
    client.user = clientUser;
    client.readyAt = new Date();
    client.users.set(clientUser.id, clientUser);

    for (const guild of data.guilds) client.dataManager.newGuild(guild);
    for (const privateDM of data.private_channels) client.dataManager.newChannel(privateDM);

    for (const relation of data.relationships) {
      const user = client.dataManager.newUser(relation.user);
      if (relation.type === 1) {
        client.user.friends.set(user.id, user);
      } else if (relation.type === 2) {
        client.user.blocked.set(user.id, user);
      }
    }

    data.presences = data.presences || [];
    for (const presence of data.presences) {
      client.dataManager.newUser(presence.user);
      client._setPresence(presence.user.id, presence);
    }

    if (data.notes) {
      for (const user in data.notes) {
        let note = data.notes[user];
        if (!note.length) note = null;

        client.user.notes.set(user, note);
      }
    }

    if (!client.user.bot && client.options.sync) client.setInterval(client.syncGuilds.bind(client), 30000);
    client.once('ready', client.syncGuilds.bind(client));

    if (!client.users.has('1')) {
      client.dataManager.newUser({
        id: '1',
        username: 'Clyde',
        discriminator: '0000',
        avatar: 'https://discordapp.com/assets/f78426a064bc9dd24847519259bc42af.png',
        bot: true,
        status: 'online',
        game: null,
        verified: true,
      });
    }

    client.setTimeout(() => {
      if (!client.ws.normalReady) client.ws._emitReady(false);
    }, 1200 * data.guilds.length);

    this.packetManager.ws.sessionID = data.session_id;
    this.packetManager.ws.checkIfReady();
  }
}

module.exports = ReadyHandler;


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class RelationshipAddHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    if (data.type === 1) {
      client.fetchUser(data.id).then(user => {
        client.user.friends.set(user.id, user);
      });
    } else if (data.type === 2) {
      client.fetchUser(data.id).then(user => {
        client.user.blocked.set(user.id, user);
      });
    }
  }
}

module.exports = RelationshipAddHandler;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class RelationshipRemoveHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    if (data.type === 2) {
      if (client.user.blocked.has(data.id)) {
        client.user.blocked.delete(data.id);
      }
    } else if (data.type === 1) {
      if (client.user.friends.has(data.id)) {
        client.user.friends.delete(data.id);
      }
    }
  }
}

module.exports = RelationshipRemoveHandler;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const Constants = __webpack_require__(0);

class TypingStartHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const channel = client.channels.get(data.channel_id);
    const user = client.users.get(data.user_id);
    const timestamp = new Date(data.timestamp * 1000);

    if (channel && user) {
      if (channel.type === 'voice') {
        client.emit(Constants.Events.WARN, `Discord sent a typing packet to voice channel ${channel.id}`);
        return;
      }
      if (channel._typing.has(user.id)) {
        const typing = channel._typing.get(user.id);
        typing.lastTimestamp = timestamp;
        typing.resetTimeout(tooLate(channel, user));
      } else {
        channel._typing.set(user.id, new TypingData(client, timestamp, timestamp, tooLate(channel, user)));
        client.emit(Constants.Events.TYPING_START, channel, user);
      }
    }
  }
}

class TypingData {
  constructor(client, since, lastTimestamp, _timeout) {
    this.client = client;
    this.since = since;
    this.lastTimestamp = lastTimestamp;
    this._timeout = _timeout;
  }

  resetTimeout(_timeout) {
    this.client.clearTimeout(this._timeout);
    this._timeout = _timeout;
  }

  get elapsedTime() {
    return Date.now() - this.since;
  }
}

function tooLate(channel, user) {
  return channel.client.setTimeout(() => {
    channel.client.emit(Constants.Events.TYPING_STOP, channel, user, channel._typing.get(user.id));
    channel._typing.delete(user.id);
  }, 6000);
}

/**
 * Emitted whenever a user starts typing in a channel
 * @event Client#typingStart
 * @param {Channel} channel The channel the user started typing in
 * @param {User} user The user that started typing
 */

/**
 * Emitted whenever a user stops typing in a channel
 * @event Client#typingStop
 * @param {Channel} channel The channel the user stopped typing in
 * @param {User} user The user that stopped typing
 */

module.exports = TypingStartHandler;


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class UserNoteUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    client.actions.UserNoteUpdate.handle(data);
  }
}

module.exports = UserNoteUpdateHandler;


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class UserUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.UserUpdate.handle(data);
  }
}

module.exports = UserUpdateHandler;


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

/*
{
    "token": "my_token",
    "guild_id": "41771983423143937",
    "endpoint": "smart.loyal.discord.gg"
}
*/

class VoiceServerUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.emit('self.voiceServer', data);
  }
}

module.exports = VoiceServerUpdate;


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

const Constants = __webpack_require__(0);
const Util = __webpack_require__(4);

class VoiceStateUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const member = guild.members.get(data.user_id);
      if (member) {
        const oldVoiceChannelMember = Util.cloneObject(member);
        if (member.voiceChannel && member.voiceChannel.id !== data.channel_id) {
          member.voiceChannel.members.delete(oldVoiceChannelMember.id);
        }

        // If the member left the voice channel, unset their speaking property
        if (!data.channel_id) member.speaking = null;

        if (member.user.id === client.user.id && data.channel_id) {
          client.emit('self.voiceStateUpdate', data);
        }

        const newChannel = client.channels.get(data.channel_id);
        if (newChannel) newChannel.members.set(member.user.id, member);

        member.serverMute = data.mute;
        member.serverDeaf = data.deaf;
        member.selfMute = data.self_mute;
        member.selfDeaf = data.self_deaf;
        member.voiceSessionID = data.session_id;
        member.voiceChannelID = data.channel_id;
        client.emit(Constants.Events.VOICE_STATE_UPDATE, oldVoiceChannelMember, member);
      }
    }
  }
}

/**
 * Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
 * @event Client#voiceStateUpdate
 * @param {GuildMember} oldMember The member before the voice state update
 * @param {GuildMember} newMember The member after the voice state update
 */

module.exports = VoiceStateUpdateHandler;


/***/ }),
/* 136 */
/***/ (function(module, exports) {

/**
 * Represents a user connection (or "platform identity")
 */
class UserConnection {
  constructor(user, data) {
    /**
     * The user that owns the Connection
     * @type {User}
     */
    this.user = user;

    this.setup(data);
  }

  setup(data) {
    /**
     * The type of the Connection
     * @type {string}
     */
    this.type = data.type;

    /**
     * The username of the connection account
     * @type {string}
     */
    this.name = data.name;

    /**
     * The id of the connection account
     * @type {string}
     */
    this.id = data.id;

    /**
     * Whether the connection is revoked
     * @type {boolean}
     */
    this.revoked = data.revoked;

    /**
     * Partial server integrations (not yet implemented)
     * @type {Object[]}
     */
    this.integrations = data.integrations;
  }
}

module.exports = UserConnection;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(3);
const UserConnection = __webpack_require__(136);

/**
 * Represents a user's profile on Discord.
 */
class UserProfile {
  constructor(user, data) {
    /**
     * The owner of the profile
     * @type {User}
     */
    this.user = user;

    /**
     * The Client that created the instance of the the UserProfile.
     * @name UserProfile#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: user.client });

    /**
     * Guilds that the client user and the user share
     * @type {Collection<Snowflake, Guild>}
     */
    this.mutualGuilds = new Collection();

    /**
     * The user's connections
     * @type {Collection<String, UserConnection>}
     */
    this.connections = new Collection();

    this.setup(data);
  }

  setup(data) {
    /**
     * If the user has Discord Premium
     * @type {boolean}
     */
    this.premium = data.premium;

    /**
     * The date since which the user has had Discord Premium
     * @type {?Date}
     */
    this.premiumSince = data.premium_since ? new Date(data.premium_since) : null;

    for (const guild of data.mutual_guilds) {
      if (this.client.guilds.has(guild.id)) {
        this.mutualGuilds.set(guild.id, this.client.guilds.get(guild.id));
      }
    }
    for (const connection of data.connected_accounts) {
      this.connections.set(connection.id, new UserConnection(this.user, connection));
    }
  }
}

module.exports = UserProfile;


/***/ }),
/* 138 */
/***/ (function(module, exports) {

/**
 * Represents a Discord voice region for guilds
 */
class VoiceRegion {
  constructor(data) {
    /**
     * ID of the region
     * @type {string}
     */
    this.id = data.id;

    /**
     * Name of the region
     * @type {string}
     */
    this.name = data.name;

    /**
     * Whether the region is VIP-only
     * @type {boolean}
     */
    this.vip = data.vip;

    /**
     * Whether the region is deprecated
     * @type {boolean}
     */
    this.deprecated = data.deprecated;

    /**
     * Whether the region is optimal
     * @type {boolean}
     */
    this.optimal = data.optimal;

    /**
     * Whether the region is custom
     * @type {boolean}
     */
    this.custom = data.custom;

    /**
     * A sample hostname for what a connection might look like
     * @type {string}
     */
    this.sampleHostname = data.sample_hostname;
  }
}

module.exports = VoiceRegion;


/***/ }),
/* 139 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 140 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 141 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 142 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 143 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 144 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(4);

module.exports = {
  // "Root" classes (starting points)
  Client: __webpack_require__(46),
  Shard: __webpack_require__(49),
  ShardClientUtil: __webpack_require__(50),
  ShardingManager: __webpack_require__(51),
  WebhookClient: __webpack_require__(47),

  // Utilities
  Collection: __webpack_require__(3),
  Constants: __webpack_require__(0),
  EvaluatedPermissions: __webpack_require__(6),
  Permissions: __webpack_require__(6),
  Snowflake: __webpack_require__(5),
  SnowflakeUtil: __webpack_require__(5),
  Util: Util,
  util: Util,
  version: __webpack_require__(28).version,

  // Shortcuts to Util methods
  escapeMarkdown: Util.escapeMarkdown,
  fetchRecommendedShards: Util.fetchRecommendedShards,
  splitMessage: Util.splitMessage,

  // Structures
  Channel: __webpack_require__(8),
  ClientUser: __webpack_require__(29),
  DMChannel: __webpack_require__(30),
  Emoji: __webpack_require__(12),
  Game: __webpack_require__(7).Game,
  GroupDMChannel: __webpack_require__(19),
  Guild: __webpack_require__(16),
  GuildChannel: __webpack_require__(17),
  GuildMember: __webpack_require__(13),
  Invite: __webpack_require__(31),
  Message: __webpack_require__(9),
  MessageAttachment: __webpack_require__(32),
  MessageCollector: __webpack_require__(33),
  MessageEmbed: __webpack_require__(34),
  MessageReaction: __webpack_require__(35),
  OAuth2Application: __webpack_require__(36),
  PartialGuild: __webpack_require__(37),
  PartialGuildChannel: __webpack_require__(38),
  PermissionOverwrites: __webpack_require__(39),
  Presence: __webpack_require__(7).Presence,
  ReactionEmoji: __webpack_require__(20),
  RichEmbed: __webpack_require__(48),
  Role: __webpack_require__(10),
  TextChannel: __webpack_require__(40),
  User: __webpack_require__(11),
  VoiceChannel: __webpack_require__(41),
  Webhook: __webpack_require__(21),
};

if (__webpack_require__(15).platform() === 'browser') window.Discord = module.exports; // eslint-disable-line no-undef


/***/ })
/******/ ]);