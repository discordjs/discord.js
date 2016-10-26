exports.Package = require('../../package.json');

/**
 * Options for a Client.
 * @typedef {Object} ClientOptions
 * @property {string} [apiRequestMethod='sequential'] 'sequential' or 'burst'. Sequential executes all requests in
 * the order they are triggered, whereas burst runs multiple at a time, and doesn't guarantee a particular order.
 * @property {number} [shardId=0] The ID of this shard
 * @property {number} [shardCount=0] The number of shards
 * @property {number} [messageCacheMaxSize=200] Maximum number of messages to cache per channel
 * @property {boolean} [sync=false] Whether to periodically sync guilds
 * (-1 for unlimited - don't do this without message sweeping, otherwise memory usage will climb indefinitely)
 * @property {number} [messageCacheLifetime=0] How long until a message should be uncached by the message sweeping
 * (in seconds, 0 for forever)
 * @property {number} [messageSweepInterval=0] How frequently to remove messages from the cache that are older than
 * the message cache lifetime (in seconds, 0 for never)
 * @property {boolean} [fetchAllMembers=false] Whether to cache all guild members and users upon startup, as well as
 * upon joining a guild
 * @property {boolean} [disableEveryone=false] Default value for MessageOptions.disableEveryone
 * @property {number} [restWsBridgeTimeout=5000] Maximum time permitted between REST responses and their
 * corresponding websocket events
 * @property {string[]} [disabledEvents] An array of disabled websocket events. Events in this array will not be
 * processed. Disabling useless events such as 'TYPING_START' can result in significant performance increases on
 * large-scale bots.
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
  restWsBridgeTimeout: 5000,
  disabledEvents: [],
  sync: false,

  /**
   * Websocket options. These are left as snake_case to match the API.
   * @typedef {Object} WebsocketOptions
   * @property {number} [large_threshold=250] Number of members in a guild to be considered large
   * @property {boolean} [compress=true] Whether to compress data sent on the connection
   */
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
};

exports.Errors = {
  NO_TOKEN: 'Request to use token, but token was unavailable to the client.',
  NO_BOT_ACCOUNT: 'You ideally should be using a bot account!',
  BAD_WS_MESSAGE: 'A bad message was received from the websocket; either bad compression, or not JSON.',
  TOOK_TOO_LONG: 'Something took too long to do.',
  NOT_A_PERMISSION: 'Invalid permission string or number.',
  INVALID_RATE_LIMIT_METHOD: 'Unknown rate limiting method.',
  BAD_LOGIN: 'Incorrect login details were provided.',
  INVALID_SHARD: 'Invalid shard settings were provided.',
};

const PROTOCOL_VERSION = exports.PROTOCOL_VERSION = 6;
const API = exports.API = `https://discordapp.com/api/v${PROTOCOL_VERSION}`;
const Endpoints = exports.Endpoints = {
  // general
  login: `${API}/auth/login`,
  logout: `${API}/auth/logout`,
  gateway: `${API}/gateway`,
  botGateway: `${API}/gateway/bot`,
  invite: (id) => `${API}/invite/${id}`,
  inviteLink: (id) => `https://discord.gg/${id}`,
  CDN: 'https://cdn.discordapp.com',

  // users
  user: (userID) => `${API}/users/${userID}`,
  userChannels: (userID) => `${Endpoints.user(userID)}/channels`,
  userProfile: (userID) => `${Endpoints.user(userID)}/profile`,
  avatar: (userID, avatar) => userID === '1' ? avatar : `${Endpoints.user(userID)}/avatars/${avatar}.jpg`,
  me: `${API}/users/@me`,
  meGuild: (guildID) => `${Endpoints.me}/guilds/${guildID}`,
  relationships: (userID) => `${Endpoints.user(userID)}/relationships`,

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
  guildEmojis: (guildID) => `${Endpoints.guild(guildID)}/emojis`,

  // channels
  channels: `${API}/channels`,
  channel: (channelID) => `${Endpoints.channels}/${channelID}`,
  channelMessages: (channelID) => `${Endpoints.channel(channelID)}/messages`,
  channelInvites: (channelID) => `${Endpoints.channel(channelID)}/invites`,
  channelTyping: (channelID) => `${Endpoints.channel(channelID)}/typing`,
  channelPermissions: (channelID) => `${Endpoints.channel(channelID)}/permissions`,
  channelMessage: (channelID, messageID) => `${Endpoints.channelMessages(channelID)}/${messageID}`,
  channelWebhooks: (channelID) => `${Endpoints.channel(channelID)}/webhooks`,

  // webhooks
  webhook: (webhookID, token) => `${API}/webhooks/${webhookID}${token ? `/${token}` : ''}`,
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
  GUILD_EMOJI_CREATE: 'guildEmojiCreate',
  GUILD_EMOJI_DELETE: 'guildEmojiDelete',
  GUILD_EMOJI_UPDATE: 'guildEmojiUpdate',
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
  USER_UPDATE: 'userUpdate',
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
  CHANNEL_CREATE: 'CHANNEL_CREATE',
  CHANNEL_DELETE: 'CHANNEL_DELETE',
  CHANNEL_UPDATE: 'CHANNEL_UPDATE',
  CHANNEL_PINS_UPDATE: 'CHANNEL_PINS_UPDATE',
  MESSAGE_CREATE: 'MESSAGE_CREATE',
  MESSAGE_DELETE: 'MESSAGE_DELETE',
  MESSAGE_UPDATE: 'MESSAGE_UPDATE',
  MESSAGE_DELETE_BULK: 'MESSAGE_DELETE_BULK',
  USER_UPDATE: 'USER_UPDATE',
  PRESENCE_UPDATE: 'PRESENCE_UPDATE',
  VOICE_STATE_UPDATE: 'VOICE_STATE_UPDATE',
  TYPING_START: 'TYPING_START',
  FRIEND_ADD: 'RELATIONSHIP_ADD',
  FRIEND_REMOVE: 'RELATIONSHIP_REMOVE',
  VOICE_SERVER_UPDATE: 'VOICE_SERVER_UPDATE',
  RELATIONSHIP_ADD: 'RELATIONSHIP_ADD',
  RELATIONSHIP_REMOVE: 'RELATIONSHIP_REMOVE',
};

exports.MessageTypes = {
  0: 'DEFAULT',
  1: 'RECIPIENT_ADD',
  2: 'RECIPIENT_REMOVE',
  3: 'CALL',
  4: 'CHANNEL_NAME_CHANGE',
  5: 'CHANNEL_ICON_CHANGE',
  6: 'PINS_ADD',
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
  MANAGE_WEBHOOKS: 1 << 29,
  MANAGE_EMOJIS: 1 << 30,
};

let _ALL_PERMISSIONS = 0;
for (const key in PermissionFlags) _ALL_PERMISSIONS |= PermissionFlags[key];
exports.ALL_PERMISSIONS = _ALL_PERMISSIONS;
exports.DEFAULT_PERMISSIONS = 104324097;
