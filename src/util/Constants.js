/**
 * Options that can be passed to a client:
 * ```js
 * {
 *   ws: {
 *     large_threshold: 250,
 *     compress: true,
 *     properties: {
 *       $os: process ? process.platform : 'discord.js',
 *       $browser: 'discord.js',
 *       $device: 'discord.js',
 *       $referrer: '',
 *       $referring_domain: '',
 *     },
 *   },
 *   protocol_version: 6,
 *   max_message_cache: 200,
 *   rest_ws_bridge_timeout: 5000,
 *   api_request_method: 'sequential',
 *   shard_id: 0,
 *   shard_count: 0,
 *   fetch_all_members: false,
 * };
 * ```
 * @typedef {Object} ClientOptions
 */
exports.DefaultOptions = {
  ws: {
    large_threshold: 250,
    compress: true,
    properties: {
      $os: process ? process.platform : 'discord.js',
      $browser: 'discord.js',
      $device: 'discord.js',
      $referrer: '',
      $referring_domain: '',
    },
  },
  protocol_version: 6,
  max_message_cache: 800,
  rest_ws_bridge_timeout: 5000,
  api_request_method: 'sequential',
  shard_id: 0,
  shard_count: 0,
  fetch_all_members: false,
};

exports.Status = {
  READY: 0,
  CONNECTING: 1,
  RECONNECTING: 2,
  IDLE: 3,
  NEARLY: 4,
};

exports.ChannelTypes = {
  text: 0,
  DM: 1,
  voice: 2,
  groupDM: 3,
};

exports.Package = require('../../package.json');

exports.Errors = {
  NO_TOKEN: 'request to use token, but token was unavailable to the client',
  NO_BOT_ACCOUNT: 'you should ideally be using a bot account!',
  BAD_WS_MESSAGE: 'a bad message was received from the websocket - bad compression or not json',
  TOOK_TOO_LONG: 'something took too long to do',
  NOT_A_PERMISSION: 'that is not a valid permission string or number',
  INVALID_RATE_LIMIT_METHOD: 'unknown rate limiting method',
  BAD_LOGIN: 'incorrect login details were provided',
};

const API = `https://discordapp.com/api/v${exports.DefaultOptions.protocol_version}`;

const Endpoints = exports.Endpoints = {
  // general endpoints
  login: `${API}/auth/login`,
  logout: `${API}/auth/logout`,
  gateway: `${API}/gateway`,
  invite: (id) => `${API}/invite/${id}`,
  CDN: 'https://cdn.discordapp.com',

  // users
  user: (userID) => `${API}/users/${userID}`,
  userChannels: (userID) => `${Endpoints.user(userID)}/channels`,
  avatar: (userID, avatar) => `${Endpoints.user(userID)}/avatars/${avatar}.jpg`,
  me: `${API}/users/@me`,
  meGuild: (guildID) => `${Endpoints.me}/guilds/${guildID}`,

  // guilds
  guilds: `${API}/guilds`,
  guild: (guildID) => `${Endpoints.guilds}/${guildID}`,
  guildIcon: (guildID, hash) => `${Endpoints.guild(guildID)}/icons/${hash}.jpg`,
  guildPrune: (guildID) => `${Endpoints.guild(guildID)}/prune`,
  guildEmbed: (guildID) => `${Endpoints.guild(guildID)}/embed`,
  guildInvites: (guildID) => `${Endpoints.guild(guildID)}/invites`,
  guildRoles: (guildID) => `${Endpoints.guild(guildID)}/roles`,
  guildRole: (guildID, roleID) => `${Endpoints.guildRoles(guildID)}/${roleID}`,
  guildBans: (guildID) => `${Endpoints.guild(guildID)}/bans`,
  guildIntegrations: (guildID) => `${Endpoints.guild(guildID)}/integrations`,
  guildMembers: (guildID) => `${Endpoints.guild(guildID)}/members`,
  guildMember: (guildID, memberID) => `${Endpoints.guildMembers(guildID)}/${memberID}`,
  stupidInconsistentGuildEndpoint: (guildID) => `${Endpoints.guildMember(guildID, '@me')}/nick`,
  guildChannels: (guildID) => `${Endpoints.guild(guildID)}/channels`,

  // channels
  channels: `${API}/channels`,
  channel: (channelID) => `${Endpoints.channels}/${channelID}`,
  channelMessages: (channelID) => `${Endpoints.channel(channelID)}/messages`,
  channelInvites: (channelID) => `${Endpoints.channel(channelID)}/invites`,
  channelTyping: (channelID) => `${Endpoints.channel(channelID)}/typing`,
  channelPermissions: (channelID) => `${Endpoints.channel(channelID)}/permissions`,
  channelMessage: (channelID, messageID) => `${Endpoints.channelMessages(channelID)}/${messageID}`,
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
  GUILD_UNAVAILABLE: 'guildUnavailable',
  GUILD_AVAILABLE: 'guildAvailable',
  GUILD_UPDATE: 'guildUpdate',
  GUILD_BAN_ADD: 'guildBanAdd',
  GUILD_BAN_REMOVE: 'guildBanRemove',
  GUILD_MEMBER_ADD: 'guildMemberAdd',
  GUILD_MEMBER_REMOVE: 'guildMemberRemove',
  GUILD_MEMBER_UPDATE: 'guildMemberUpdate',
  GUILD_ROLE_CREATE: 'guildRoleCreate',
  GUILD_ROLE_DELETE: 'guildRoleDelete',
  GUILD_ROLE_UPDATE: 'guildRoleUpdate',
  GUILD_MEMBER_AVAILABLE: 'guildMemberAvailable',
  CHANNEL_CREATE: 'channelCreate',
  CHANNEL_DELETE: 'channelDelete',
  CHANNEL_UPDATE: 'channelUpdate',
  PRESENCE_UPDATE: 'presenceUpdate',
  USER_UPDATE: 'userUpdate',
  VOICE_STATE_UPDATE: 'voiceStateUpdate',
  TYPING_START: 'typingStart',
  TYPING_STOP: 'typingStop',
  WARN: 'warn',
  GUILD_MEMBERS_CHUNK: 'guildMembersChunk',
  MESSAGE_CREATE: 'message',
  MESSAGE_DELETE: 'messageDelete',
  MESSAGE_UPDATE: 'messageUpdate',
  RECONNECTING: 'reconnecting',
  GUILD_MEMBER_SPEAKING: 'guildMemberSpeaking',
  MESSAGE_BULK_DELETE: 'messageDeleteBulk',
  CHANNEL_PINS_UPDATE: 'channelPinsUpdate',
};

exports.WSEvents = {
  CHANNEL_CREATE: 'CHANNEL_CREATE',
  CHANNEL_DELETE: 'CHANNEL_DELETE',
  CHANNEL_UPDATE: 'CHANNEL_UPDATE',
  MESSAGE_CREATE: 'MESSAGE_CREATE',
  MESSAGE_DELETE: 'MESSAGE_DELETE',
  MESSAGE_UPDATE: 'MESSAGE_UPDATE',
  PRESENCE_UPDATE: 'PRESENCE_UPDATE',
  READY: 'READY',
  GUILD_BAN_ADD: 'GUILD_BAN_ADD',
  GUILD_BAN_REMOVE: 'GUILD_BAN_REMOVE',
  GUILD_CREATE: 'GUILD_CREATE',
  GUILD_DELETE: 'GUILD_DELETE',
  GUILD_MEMBER_ADD: 'GUILD_MEMBER_ADD',
  GUILD_MEMBER_REMOVE: 'GUILD_MEMBER_REMOVE',
  GUILD_MEMBER_UPDATE: 'GUILD_MEMBER_UPDATE',
  GUILD_MEMBERS_CHUNK: 'GUILD_MEMBERS_CHUNK',
  GUILD_ROLE_CREATE: 'GUILD_ROLE_CREATE',
  GUILD_ROLE_DELETE: 'GUILD_ROLE_DELETE',
  GUILD_ROLE_UPDATE: 'GUILD_ROLE_UPDATE',
  GUILD_UPDATE: 'GUILD_UPDATE',
  TYPING_START: 'TYPING_START',
  USER_UPDATE: 'USER_UPDATE',
  VOICE_STATE_UPDATE: 'VOICE_STATE_UPDATE',
  FRIEND_ADD: 'RELATIONSHIP_ADD',
  FRIEND_REMOVE: 'RELATIONSHIP_REMOVE',
  VOICE_SERVER_UPDATE: 'VOICE_SERVER_UPDATE',
  MESSAGE_DELETE_BULK: 'MESSAGE_DELETE_BULK',
  CHANNEL_PINS_UPDATE: 'CHANNEL_PINS_UPDATE',
  GUILD_SYNC: 'GUILD_SYNC',
};

const PermissionFlags = exports.PermissionFlags = {
  CREATE_INSTANT_INVITE: 1 << 0,
  KICK_MEMBERS: 1 << 1,
  BAN_MEMBERS: 1 << 2,
  ADMINISTRATOR: 1 << 3,
  MANAGE_CHANNELS: 1 << 4,
  MANAGE_GUILD: 1 << 5,

  READ_MESSAGES: 1 << 10,
  SEND_MESSAGES: 1 << 11,
  SEND_TTS_MESSAGES: 1 << 12,
  MANAGE_MESSAGES: 1 << 13,
  EMBED_LINKS: 1 << 14,
  ATTACH_FILES: 1 << 15,
  READ_MESSAGE_HISTORY: 1 << 16,
  MENTION_EVERYONE: 1 << 17,
  EXTERNAL_EMOJIS: 1 << 18,

  CONNECT: 1 << 20,
  SPEAK: 1 << 21,
  MUTE_MEMBERS: 1 << 22,
  DEAFEN_MEMBERS: 1 << 23,
  MOVE_MEMBERS: 1 << 24,
  USE_VAD: 1 << 25,

  CHANGE_NICKNAME: 1 << 26,
  MANAGE_NICKNAMES: 1 << 27,
  MANAGE_ROLES_OR_PERMISSIONS: 1 << 28,
};

let _ALL_PERMISSIONS = 0;
for (const key in PermissionFlags) _ALL_PERMISSIONS |= PermissionFlags[key];

exports.ALL_PERMISSIONS = _ALL_PERMISSIONS;

exports.DEFAULT_PERMISSIONS = 36953089;
