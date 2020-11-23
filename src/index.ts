'use strict';

const UtilLib = require('./util/Util');

const Discord = {
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
  BaseManager: require('./managers/BaseManager'),
  DiscordAPIError: require('./rest/DiscordAPIError'),
  HTTPError: require('./rest/HTTPError'),
  MessageFlags: require('./util/MessageFlags'),
  Intents: require('./util/Intents'),
  Permissions: require('./util/Permissions'),
  Speaking: require('./util/Speaking'),
  Snowflake: require('./util/Snowflake'),
  SnowflakeUtil: require('./util/Snowflake'),
  Structures: require('./util/Structures'),
  SystemChannelFlags: require('./util/SystemChannelFlags'),
  UserFlags: require('./util/UserFlags'),
  Util: UtilLib,
  version: require('../package.json').version,

  // Managers
  BaseGuildEmojiManager: require('./managers/BaseGuildEmojiManager'),
  ChannelManager: require('./managers/ChannelManager'),
  GuildChannelManager: require('./managers/GuildChannelManager'),
  GuildEmojiManager: require('./managers/GuildEmojiManager'),
  GuildEmojiRoleManager: require('./managers/GuildEmojiRoleManager'),
  GuildMemberManager: require('./managers/GuildMemberManager'),
  GuildMemberRoleManager: require('./managers/GuildMemberRoleManager'),
  GuildManager: require('./managers/GuildManager'),
  ReactionManager: require('./managers/ReactionManager'),
  ReactionUserManager: require('./managers/ReactionUserManager'),
  MessageManager: require('./managers/MessageManager'),
  PresenceManager: require('./managers/PresenceManager'),
  RoleManager: require('./managers/RoleManager'),
  UserManager: require('./managers/UserManager'),

  // Shortcuts to Util methods
  discordSort: UtilLib.discordSort,
  escapeMarkdown: UtilLib.escapeMarkdown,
  fetchRecommendedShards: UtilLib.fetchRecommendedShards,
  resolveColor: UtilLib.resolveColor,
  resolveString: UtilLib.resolveString,
  splitMessage: UtilLib.splitMessage,

  // Structures
  Application: require('./structures/interfaces/Application'),
  Base: require('./structures/Base'),
  Activity: require('./structures/Presence').Activity,
  APIMessage: require('./structures/APIMessage'),
  BaseGuildEmoji: require('./structures/BaseGuildEmoji'),
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
  GuildPreview: require('./structures/GuildPreview'),
  GuildTemplate: require('./structures/GuildTemplate'),
  Integration: require('./structures/Integration'),
  Invite: require('./structures/Invite'),
  Message: require('./structures/Message'),
  MessageAttachment: require('./structures/MessageAttachment'),
  MessageCollector: require('./structures/MessageCollector'),
  MessageEmbed: require('./structures/MessageEmbed'),
  MessageMentions: require('./structures/MessageMentions'),
  MessageReaction: require('./structures/MessageReaction'),
  NewsChannel: require('./structures/NewsChannel'),
  PermissionOverwrites: require('./structures/PermissionOverwrites'),
  Presence: require('./structures/Presence').Presence,
  ClientPresence: require('./structures/ClientPresence'),
  ReactionCollector: require('./structures/ReactionCollector'),
  ReactionEmoji: require('./structures/ReactionEmoji'),
  RichPresenceAssets: require('./structures/Presence').RichPresenceAssets,
  Role: require('./structures/Role'),
  StoreChannel: require('./structures/StoreChannel'),
  Team: require('./structures/Team'),
  TeamMember: require('./structures/TeamMember'),
  TextChannel: require('./structures/TextChannel'),
  User: require('./structures/User'),
  VoiceChannel: require('./structures/VoiceChannel'),
  VoiceRegion: require('./structures/VoiceRegion'),
  VoiceState: require('./structures/VoiceState'),
  Webhook: require('./structures/Webhook'),

  WebSocket: require('./WebSocket'),
};

export default Discord;
export const { BaseClient } = Discord;
export const { Client } = Discord;
export const { Shard } = Discord;
export const { ShardClientUtil } = Discord;
export const { ShardingManager } = Discord;
export const { WebhookClient } = Discord;
export const { ActivityFlags } = Discord;
export const { BitField } = Discord;
export const { Collection } = Discord;
export const { Constants } = Discord;
export const { DataResolver } = Discord;
export const { BaseManager } = Discord;
export const { DiscordAPIError } = Discord;
export const { HTTPError } = Discord;
export const { MessageFlags } = Discord;
export const { Intents } = Discord;
export const { Permissions } = Discord;
export const { Speaking } = Discord;
export const { Snowflake } = Discord;
export const { SnowflakeUtil } = Discord;
export const { Structures } = Discord;
export const { SystemChannelFlags } = Discord;
export const { UserFlags } = Discord;
export const { Util } = Discord;
export const { version } = Discord;
export const { BaseGuildEmojiManager } = Discord;
export const { ChannelManager } = Discord;
export const { GuildChannelManager } = Discord;
export const { GuildEmojiManager } = Discord;
export const { GuildEmojiRoleManager } = Discord;
export const { GuildMemberManager } = Discord;
export const { GuildMemberRoleManager } = Discord;
export const { GuildManager } = Discord;
export const { ReactionManager } = Discord;
export const { ReactionUserManager } = Discord;
export const { MessageManager } = Discord;
export const { PresenceManager } = Discord;
export const { RoleManager } = Discord;
export const { UserManager } = Discord;
export const { discordSort } = Discord;
export const { escapeMarkdown } = Discord;
export const { fetchRecommendedShards } = Discord;
export const { resolveColor } = Discord;
export const { resolveString } = Discord;
export const { splitMessage } = Discord;
export const { Application } = Discord;
export const { Base } = Discord;
export const { Activity } = Discord;
export const { APIMessage } = Discord;
export const { BaseGuildEmoji } = Discord;
export const { CategoryChannel } = Discord;
export const { Channel } = Discord;
export const { ClientApplication } = Discord;
export const { ClientUser } = Discord;
export const { Collector } = Discord;
export const { DMChannel } = Discord;
export const { Emoji } = Discord;
export const { Guild } = Discord;
export const { GuildAuditLogs } = Discord;
export const { GuildChannel } = Discord;
export const { GuildEmoji } = Discord;
export const { GuildMember } = Discord;
export const { GuildPreview } = Discord;
export const { GuildTemplate } = Discord;
export const { Integration } = Discord;
export const { Invite } = Discord;
export const { Message } = Discord;
export const { MessageAttachment } = Discord;
export const { MessageCollector } = Discord;
export const { MessageEmbed } = Discord;
export const { MessageMentions } = Discord;
export const { MessageReaction } = Discord;
export const { NewsChannel } = Discord;
export const { PermissionOverwrites } = Discord;
export const { Presence } = Discord;
export const { ClientPresence } = Discord;
export const { ReactionCollector } = Discord;
export const { ReactionEmoji } = Discord;
export const { RichPresenceAssets } = Discord;
export const { Role } = Discord;
export const { StoreChannel } = Discord;
export const { Team } = Discord;
export const { TeamMember } = Discord;
export const { TextChannel } = Discord;
export const { User } = Discord;
export const { VoiceChannel } = Discord;
export const { VoiceRegion } = Discord;
export const { VoiceState } = Discord;
export const { Webhook } = Discord;
export const { WebSocket } = Discord;
