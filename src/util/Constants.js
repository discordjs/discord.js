exports.Package = require('../../package.json');
const { Error, RangeError } = require('../errors');

/**
 * Options for a client.
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
 * @property {WebsocketOptions} [ws] Options for the WebSocket
 */
exports.DefaultOptions = {
  apiRequestMethod: 'sequential',
  shardId: 0,
  shardCount: 0,
  internalSharding: false,
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
   * WebSocket options (these are left as snake_case to match the API)
   * @typedef {Object} WebsocketOptions
   * @property {number} [large_threshold=250] Number of members in a guild to be considered large
   * @property {boolean} [compress=true] Whether to compress data sent on the connection
   * (defaults to `false` for browsers)
   */
  ws: {
    large_threshold: 250,
    compress: require('os').platform() !== 'browser',
    properties: {
      $os: process ? process.platform : 'discord.js',
      $browser: 'discord.js',
      $device: 'discord.js',
    },
    version: 6,
  },
  http: {
    version: 7,
    api: 'https://discordapp.com/api',
    cdn: 'https://cdn.discordapp.com',
    invite: 'https://discord.gg',
  },
};

exports.WSCodes = {
  1000: 'Connection gracefully closed',
  4004: 'Tried to identify with an invalid token',
  4010: 'Sharding data provided was invalid',
  4011: 'Shard would be on too many guilds if connected',
};

const AllowedImageFormats = [
  'webp',
  'png',
  'jpg',
  'gif',
];

const AllowedImageSizes = [
  128,
  256,
  512,
  1024,
  2048,
];

function checkImage({ size, format }) {
  if (format && !AllowedImageFormats.includes(format)) throw new Error('IMAGE_FORMAT', format);
  if (size && !AllowedImageSizes.includes(size)) throw new RangeError('IMAGE_SIZE', size);
}

exports.Endpoints = {
  CDN(root) {
    return {
      Emoji: emojiID => `${root}/emojis/${emojiID}.png`,
      Asset: name => `${root}/assets/${name}`,
      DefaultAvatar: number => `${root}/embed/avatars/${number}.png`,
      Avatar: (userID, hash, format = 'default', size) => {
        if (format === 'default') format = hash.startsWith('a_') ? 'gif' : 'webp';
        checkImage({ size, format });
        return `${root}/avatars/${userID}/${hash}.${format}${size ? `?size=${size}` : ''}`;
      },
      Icon: (guildID, hash, format = 'webp', size) => {
        checkImage({ size, format });
        return `${root}/icons/${guildID}/${hash}.${format}${size ? `?size=${size}` : ''}`;
      },
      AppIcon: (clientID, hash, format = 'webp', size) => {
        checkImage({ size, format });
        return `${root}/app-icons/${clientID}/${hash}.${format}${size ? `?size=${size}` : ''}`;
      },
      GDMIcon: (channelID, hash, format = 'webp', size) => {
        checkImage({ size, format });
        return `${root}/channel-icons/${channelID}/${hash}.${format}${size ? `?size=${size}` : ''}`;
      },
      Splash: (guildID, hash, format = 'webp', size) => {
        checkImage({ size, format });
        return `${root}/splashes/${guildID}/${hash}.${format}${size ? `?size=${size}` : ''}`;
      },
    };
  },
  invite: (root, code) => `${root}/${code}`,
  botGateway: '/gateway/bot',
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
  USER_SETTINGS_UPDATE: 'clientUserSettingsUpdate',
  USER_GUILD_SETTINGS_UPDATE: 'clientUserGuildSettingsUpdate',
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
 * - RESUMED
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
 * - USER_SETTINGS_UPDATE
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
  RESUMED: 'RESUMED',
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
  USER_SETTINGS_UPDATE: 'USER_SETTINGS_UPDATE',
  USER_GUILD_SETTINGS_UPDATE: 'USER_GUILD_SETTINGS_UPDATE',
  PRESENCE_UPDATE: 'PRESENCE_UPDATE',
  VOICE_STATE_UPDATE: 'VOICE_STATE_UPDATE',
  TYPING_START: 'TYPING_START',
  VOICE_SERVER_UPDATE: 'VOICE_SERVER_UPDATE',
  RELATIONSHIP_ADD: 'RELATIONSHIP_ADD',
  RELATIONSHIP_REMOVE: 'RELATIONSHIP_REMOVE',
};

/**
 * The type of a message, e.g. `DEFAULT`. Here are the available types:
 * - DEFAULT
 * - RECIPIENT_ADD
 * - RECIPIENT_REMOVE
 * - CALL
 * - CHANNEL_NAME_CHANGE
 * - CHANNEL_ICON_CHANGE
 * - PINS_ADD
 * - GUILD_MEMBER_JOIN
 * @typedef {string} MessageType
 */
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

exports.ExplicitContentFilterTypes = [
  'DISABLED',
  'NON_FRIENDS',
  'FRIENDS_AND_NON_FRIENDS',
];

exports.MessageNotificationTypes = [
  'EVERYTHING',
  'MENTIONS',
  'NOTHING',
  'INHERIT',
];

exports.UserSettingsMap = {
  /**
   * Automatically convert emoticons in your messages to emoji
   * For example, when you type `:-)` Discord will convert it to 😃
   * @name ClientUserSettings#convertEmoticons
   * @type {boolean}
   */
  convert_emoticons: 'convertEmoticons',

  /**
   * If new guilds should automatically disable DMs between you and its members
   * @name ClientUserSettings#defaultGuildsRestricted
   * @type {boolean}
   */
  default_guilds_restricted: 'defaultGuildsRestricted',

  /**
   * Automatically detect accounts from services like Steam and Blizzard when you open the Discord client
   * @name ClientUserSettings#detectPlatformAccounts
   * @type {boolean}
   */
  detect_platform_accounts: 'detectPlatformAccounts',

  /**
   * Developer Mode exposes context menu items helpful for people writing bots using the Discord API
   * @name ClientUserSettings#developerMode
   * @type {boolean}
   */
  developer_mode: 'developerMode',

  /**
   * Allow playback and usage of the `/tts` command
   * @name ClientUserSettings#enableTTSCommand
   * @type {boolean}
   */
  enable_tts_command: 'enableTTSCommand',

  /**
   * The theme of the client. Either `light` or `dark`
   * @name ClientUserSettings#theme
   * @type {string}
   */
  theme: 'theme',

  /**
   * Last status set in the client
   * @name ClientUserSettings#status
   * @type {PresenceStatus}
   */
  status: 'status',

  /**
   * Display currently running game as status message
   * @name ClientUserSettings#showCurrentGame
   * @type {boolean}
   */
  show_current_game: 'showCurrentGame',

  /**
   * Display images, videos, and lolcats when uploaded directly to Discord
   * @name ClientUserSettings#inlineAttachmentMedia
   * @type {boolean}
   */
  inline_attachment_media: 'inlineAttachmentMedia',

  /**
   * Display images, videos, and lolcats when uploaded posted as links in chat
   * @name ClientUserSettings#inlineEmbedMedia
   * @type {boolean}
   */
  inline_embed_media: 'inlineEmbedMedia',

  /**
   * Language the Discord client will use, as an RFC 3066 language identifier
   * @name ClientUserSettings#locale
   * @type {string}
   */
  locale: 'locale',

  /**
   * Display messages in compact mode
   * @name ClientUserSettings#messageDisplayCompact
   * @type {boolean}
   */
  message_display_compact: 'messageDisplayCompact',

  /**
   * Show emoji reactions on messages
   * @name ClientUserSettings#renderReactions
   * @type {boolean}
   */
  render_reactions: 'renderReactions',

  /**
   * Array of snowflake IDs for guilds, in the order they appear in the Discord client
   * @name ClientUserSettings#guildPositions
   * @type {Snowflake[]}
   */
  guild_positions: 'guildPositions',

  /**
   * Array of snowflake IDs for guilds which you will not recieve DMs from
   * @name ClientUserSettings#restrictedGuilds
   * @type {Snowflake[]}
   */
  restricted_guilds: 'restrictedGuilds',

  explicit_content_filter: function explicitContentFilter(type) { // eslint-disable-line func-name-matching
    /**
     * Safe direct messaging; force people's messages with images to be scanned before they are sent to you
     * one of `DISABLED`, `NON_FRIENDS`, `FRIENDS_AND_NON_FRIENDS`
     * @name ClientUserSettings#explicitContentFilter
     * @type {string}
     */
    return exports.ExplicitContentFilterTypes[type];
  },
  friend_source_flags: function friendSources(flags) { // eslint-disable-line func-name-matching
    /**
     * Who can add you as a friend
     * @name ClientUserSettings#friendSources
     * @type {Object}
     * @property {boolean} all Mutual friends and mutual guilds
     * @property {boolean} mutualGuilds Only mutual guilds
     * @property {boolean} mutualFriends Only mutual friends
     */
    return {
      all: flags.all || false,
      mutualGuilds: flags.all ? true : flags.mutual_guilds || false,
      mutualFriends: flags.all ? true : flags.mutualFriends || false,
    };
  },
};

exports.UserGuildSettingsMap = {
  message_notifications: function messageNotifications(type) { // eslint-disable-line func-name-matching
    /**
     * The type of message that should notify you
     * one of `EVERYTHING`, `MENTIONS`, `NOTHING`
     * @name ClientUserGuildSettings#messageNotifications
     * @type {string}
     */
    return exports.MessageNotificationTypes[type];
  },
  /**
   * Whether to receive mobile push notifications
   * @name ClientUserGuildSettings#mobilePush
   * @type {boolean}
   */
  mobile_push: 'mobilePush',
  /**
   * Whether the guild is muted or not
   * @name ClientUserGuildSettings#muted
   * @type {boolean}
   */
  muted: 'muted',
  /**
   * Whether to suppress everyone messages
   * @name ClientUserGuildSettings#suppressEveryone
   * @type {boolean}
   */
  suppress_everyone: 'suppressEveryone',
  /**
   * A collection containing all the channel overrides
   * @name ClientUserGuildSettings#channelOverrides
   * @type {Collection<ClientUserChannelOverride>}
   */
  channel_overrides: 'channelOverrides',
};

exports.UserChannelOverrideMap = {
  message_notifications: function messageNotifications(type) { // eslint-disable-line func-name-matching
    /**
     * The type of message that should notify you
     * one of `EVERYTHING`, `MENTIONS`, `NOTHING`, `INHERIT`
     * @name ClientUserChannelOverrides#messageNotifications
     * @type {string}
     */
    return exports.MessageNotificationTypes[type];
  },
  /**
   * Whether the guild is muted or not
   * @name ClientUserChannelOverrides#muted
   * @type {boolean}
   */
  muted: 'muted',
};

/**
 * All flags users can have:
 * - STAFF
 * - PARTNER
 * - HYPESQUAD
 * @typedef {string} UserFlags
 */
exports.UserFlags = {
  STAFF: 1 << 0,
  PARTNER: 1 << 1,
  HYPESQUAD: 1 << 2,
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

/**
 * An error encountered while performing an API request. Here are the potential errors:
 * - UNKNOWN_ACCOUNT
 * - UNKNOWN_APPLICATION
 * - UNKNOWN_CHANNEL
 * - UNKNOWN_GUILD
 * - UNKNOWN_INTEGRATION
 * - UNKNOWN_INVITE
 * - UNKNOWN_MEMBER
 * - UNKNOWN_MESSAGE
 * - UNKNOWN_OVERWRITE
 * - UNKNOWN_PROVIDER
 * - UNKNOWN_ROLE
 * - UNKNOWN_TOKEN
 * - UNKNOWN_USER
 * - UNKNOWN_EMOJI
 * - BOT_PROHIBITED_ENDPOINT
 * - BOT_ONLY_ENDPOINT
 * - MAXIMUM_GUILDS
 * - MAXIMUM_FRIENDS
 * - MAXIMUM_PINS
 * - MAXIMUM_ROLES
 * - MAXIMUM_REACTIONS
 * - UNAUTHORIZED
 * - MISSING_ACCESS
 * - INVALID_ACCOUNT_TYPE
 * - CANNOT_EXECUTE_ON_DM
 * - EMBED_DISABLED
 * - CANNOT_EDIT_MESSAGE_BY_OTHER
 * - CANNOT_SEND_EMPTY_MESSAGE
 * - CANNOT_MESSAGE_USER
 * - CANNOT_SEND_MESSAGES_IN_VOICE_CHANNEL
 * - CHANNEL_VERIFICATION_LEVEL_TOO_HIGH
 * - OAUTH2_APPLICATION_BOT_ABSENT
 * - MAXIMUM_OAUTH2_APPLICATIONS
 * - INVALID_OAUTH_STATE
 * - MISSING_PERMISSIONS
 * - INVALID_AUTHENTICATION_TOKEN
 * - NOTE_TOO_LONG
 * - INVALID_BULK_DELETE_QUANTITY
 * - CANNOT_PIN_MESSAGE_IN_OTHER_CHANNEL
 * - CANNOT_EXECUTE_ON_SYSTEM_MESSAGE
 * - BULK_DELETE_MESSAGE_TOO_OLD
 * - INVITE_ACCEPTED_TO_GUILD_NOT_CONTANING_BOT
 * - REACTION_BLOCKED
 * @typedef {string} APIError
 */
exports.APIErrors = {
  UNKNOWN_ACCOUNT: 10001,
  UNKNOWN_APPLICATION: 10002,
  UNKNOWN_CHANNEL: 10003,
  UNKNOWN_GUILD: 10004,
  UNKNOWN_INTEGRATION: 10005,
  UNKNOWN_INVITE: 10006,
  UNKNOWN_MEMBER: 10007,
  UNKNOWN_MESSAGE: 10008,
  UNKNOWN_OVERWRITE: 10009,
  UNKNOWN_PROVIDER: 10010,
  UNKNOWN_ROLE: 10011,
  UNKNOWN_TOKEN: 10012,
  UNKNOWN_USER: 10013,
  UNKNOWN_EMOJI: 10014,
  BOT_PROHIBITED_ENDPOINT: 20001,
  BOT_ONLY_ENDPOINT: 20002,
  MAXIMUM_GUILDS: 30001,
  MAXIMUM_FRIENDS: 30002,
  MAXIMUM_PINS: 30003,
  MAXIMUM_ROLES: 30005,
  MAXIMUM_REACTIONS: 30010,
  UNAUTHORIZED: 40001,
  MISSING_ACCESS: 50001,
  INVALID_ACCOUNT_TYPE: 50002,
  CANNOT_EXECUTE_ON_DM: 50003,
  EMBED_DISABLED: 50004,
  CANNOT_EDIT_MESSAGE_BY_OTHER: 50005,
  CANNOT_SEND_EMPTY_MESSAGE: 50006,
  CANNOT_MESSAGE_USER: 50007,
  CANNOT_SEND_MESSAGES_IN_VOICE_CHANNEL: 50008,
  CHANNEL_VERIFICATION_LEVEL_TOO_HIGH: 50009,
  OAUTH2_APPLICATION_BOT_ABSENT: 50010,
  MAXIMUM_OAUTH2_APPLICATIONS: 50011,
  INVALID_OAUTH_STATE: 50012,
  MISSING_PERMISSIONS: 50013,
  INVALID_AUTHENTICATION_TOKEN: 50014,
  NOTE_TOO_LONG: 50015,
  INVALID_BULK_DELETE_QUANTITY: 50016,
  CANNOT_PIN_MESSAGE_IN_OTHER_CHANNEL: 50019,
  CANNOT_EXECUTE_ON_SYSTEM_MESSAGE: 50021,
  BULK_DELETE_MESSAGE_TOO_OLD: 50034,
  INVITE_ACCEPTED_TO_GUILD_NOT_CONTANING_BOT: 50036,
  REACTION_BLOCKED: 90001,
};
