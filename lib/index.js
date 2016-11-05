"use strict";

/**
 * Object containing user agent data required for API requests.
 * @typedef {(object)} UserAgent
 * @property {string} [url=https://github.com/hydrabolt/discord.js] URL to the repository/homepage of the creator.
 * @property {string} [version=6.0.0] version of your bot.
 * @property {string} full stringified user-agent that is generate automatically upon changes. Read-only.
*/

/**
 * Object containing properties that can be used to alter the client's functionality.
 * @typedef {(object)} ClientOptions
 * @property {boolean} [compress=true] whether or not large packets that are sent over WebSockets should be compressed.
 * @property {boolean} [autoReconnect=false] whether the Client should attempt to automatically reconnect if it is disconnected.
 * @property {boolean} [rateLimitAsError=false] whether rejections to API requests due to rate-limiting should be treated as errors.
 * @property {Number} [largeThreshold=250] an integer between 0 and 250. When a server has more users than `options.largeThreshold`, only the online/active users are cached.
*/

/**
 * Object containing properties that will be applied when deleting messages
 * @typedef {(object)} MessageDeletionOptions
 * @property {Number} [wait] If set, the message will be deleted after `options.wait` milliseconds.
 */

/**
 * Object containing properties that will be used when fetching channel logs. You cannot specify _both_ `options.before` and `options.after`
 * @typedef {(object)} ChannelLogsOptions
 * @property {MessageResolvable} [before] When fetching logs, it will fetch from messages before `options.before` but not including it.
 * @property {MessageResolvable} [after] When fetching logs, it will fetch from messages after `options.after` but not including it.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Client = require("./Client/Client");

var _Client2 = _interopRequireDefault(_Client);

var _Channel = require("./Structures/Channel");

var _Channel2 = _interopRequireDefault(_Channel);

var _ChannelPermissions = require("./Structures/ChannelPermissions");

var _ChannelPermissions2 = _interopRequireDefault(_ChannelPermissions);

var _Invite = require("./Structures/Invite");

var _Invite2 = _interopRequireDefault(_Invite);

var _Message = require("./Structures/Message");

var _Message2 = _interopRequireDefault(_Message);

var _PermissionOverwrite = require("./Structures/PermissionOverwrite");

var _PermissionOverwrite2 = _interopRequireDefault(_PermissionOverwrite);

var _PMChannel = require("./Structures/PMChannel");

var _PMChannel2 = _interopRequireDefault(_PMChannel);

var _Role = require("./Structures/Role");

var _Role2 = _interopRequireDefault(_Role);

var _Server = require("./Structures/Server");

var _Server2 = _interopRequireDefault(_Server);

var _ServerChannel = require("./Structures/ServerChannel");

var _ServerChannel2 = _interopRequireDefault(_ServerChannel);

var _TextChannel = require("./Structures/TextChannel");

var _TextChannel2 = _interopRequireDefault(_TextChannel);

var _User = require("./Structures/User");

var _User2 = _interopRequireDefault(_User);

var _VoiceChannel = require("./Structures/VoiceChannel");

var _VoiceChannel2 = _interopRequireDefault(_VoiceChannel);

var _Webhook = require("./Structures/Webhook");

var _Webhook2 = _interopRequireDefault(_Webhook);

var _Constants = require("./Constants");

var _Constants2 = _interopRequireDefault(_Constants);

var _Cache = require("./Util/Cache.js");

var _Cache2 = _interopRequireDefault(_Cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Client: _Client2.default,
  Channel: _Channel2.default,
  ChannelPermissions: _ChannelPermissions2.default,
  Invite: _Invite2.default,
  Message: _Message2.default,
  PermissionOverwrite: _PermissionOverwrite2.default,
  PMChannel: _PMChannel2.default,
  Role: _Role2.default,
  Server: _Server2.default,
  ServerChannel: _ServerChannel2.default,
  TextChannel: _TextChannel2.default,
  User: _User2.default,
  VoiceChannel: _VoiceChannel2.default,
  Webhook: _Webhook2.default,
  Constants: _Constants2.default,
  Cache: _Cache2.default
};
//# sourceMappingURL=index.js.map
