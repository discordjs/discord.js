'use strict';

const Util = require('./util/Util');

module.exports = {
  // "Root" classes (starting points)
  BaseClient: require('./client/BaseClient'),
  Client: require('./client/Client'),
  Shard: require('./sharding/Shard'),
  ShardClientUtil: require('./sharding/ShardClientUtil'),
  ShardingManager: require('./sharding/ShardingManager'),
  WebhookClient: require('./client/WebhookClient'),

  // Utilities
  ActivityFlags: require('./util/ActivityFlags'),
  BitField: require('./util/BitField'),
  Collection: require('./util/Collection'),
  Constants: require('./util/Constants'),
  DataResolver: require('./util/DataResolver'),
  DataStore: require('./stores/DataStore'),
  DiscordAPIError: require('./rest/DiscordAPIError'),
  HTTPError: require('./rest/HTTPError'),
  Permissions: require('./util/Permissions'),
  Speaking: require('./util/Speaking'),
  Snowflake: require('./util/Snowflake'),
  SnowflakeUtil: require('./util/Snowflake'),
  Structures: require('./util/Structures'),
  Util: Util,
  util: Util,
  version: require('../package.json').version,

  // Stores
  ChannelStore: require('./stores/ChannelStore'),
  GuildChannelStore: require('./stores/GuildChannelStore'),
  GuildEmojiStore: require('./stores/GuildEmojiStore'),
  GuildEmojiRoleStore: require('./stores/GuildEmojiRoleStore'),
  GuildMemberStore: require('./stores/GuildMemberStore'),
  GuildMemberRoleStore: require('./stores/GuildMemberRoleStore'),
  GuildStore: require('./stores/GuildStore'),
  ReactionUserStore: require('./stores/ReactionUserStore'),
  MessageStore: require('./stores/MessageStore'),
  PresenceStore: require('./stores/PresenceStore'),
  RoleStore: require('./stores/RoleStore'),
  UserStore: require('./stores/UserStore'),

  // Shortcuts to Util methods
  discordSort: Util.discordSort,
  escapeMarkdown: Util.escapeMarkdown,
  fetchRecommendedShards: Util.fetchRecommendedShards,
  resolveColor: Util.resolveColor,
  resolveString: Util.resolveString,
  splitMessage: Util.splitMessage,

  // Structures
  Base: require('./structures/Base'),
  Activity: require('./structures/Presence').Activity,
  APIMessage: require('./structures/APIMessage'),
  CategoryChannel: require('./structures/CategoryChannel'),
  Channel: require('./structures/Channel'),
  ClientApplication: require('./structures/ClientApplication'),
  get ClientUser() {
    // This is a getter so that it properly extends any custom User class
    return require('./structures/ClientUser');
  },
  Collector: require('./structures/interfaces/Collector'),
  DMChannel: require('./structures/DMChannel'),
  Emoji: require('./structures/Emoji'),
  Guild: require('./structures/Guild'),
  GuildAuditLogs: require('./structures/GuildAuditLogs'),
  GuildChannel: require('./structures/GuildChannel'),
  GuildEmoji: require('./structures/GuildEmoji'),
  GuildMember: require('./structures/GuildMember'),
  Integration: require('./structures/Integration'),
  Invite: require('./structures/Invite'),
  Message: require('./structures/Message'),
  MessageAttachment: require('./structures/MessageAttachment'),
  MessageCollector: require('./structures/MessageCollector'),
  MessageEmbed: require('./structures/MessageEmbed'),
  MessageMentions: require('./structures/MessageMentions'),
  MessageReaction: require('./structures/MessageReaction'),
  PermissionOverwrites: require('./structures/PermissionOverwrites'),
  Presence: require('./structures/Presence').Presence,
  ClientPresence: require('./structures/ClientPresence'),
  ReactionCollector: require('./structures/ReactionCollector'),
  ReactionEmoji: require('./structures/ReactionEmoji'),
  RichPresenceAssets: require('./structures/Presence').RichPresenceAssets,
  Role: require('./structures/Role'),
  TextChannel: require('./structures/TextChannel'),
  User: require('./structures/User'),
  VoiceChannel: require('./structures/VoiceChannel'),
  VoiceRegion: require('./structures/VoiceRegion'),
  VoiceState: require('./structures/VoiceState'),
  Webhook: require('./structures/Webhook'),

  WebSocket: require('./WebSocket'),
};
