'use strict';

import Client from './client/Client';

// Managers
import BaseGuildEmojiManager from './managers/BaseGuildEmojiManager';
import ChannelManager from './managers/ChannelManager';
import GuildChannelManager from './managers/GuildChannelManager';
import GuildEmojiManager from './managers/GuildEmojiManager';
import GuildEmojiRoleManager from './managers/GuildEmojiRoleManager';
import GuildManager from './managers/GuildManager';
import GuildMemberManager from './managers/GuildMemberManager';
import GuildMemberRoleManager from './managers/GuildMemberRoleManager';
import MessageManager from './managers/MessageManager';
import PresenceManager from './managers/PresenceManager';
import ReactionManager from './managers/ReactionManager';
import ReactionUserManager from './managers/ReactionUserManager';
import RoleManager from './managers/RoleManager';
import UserManager from './managers/UserManager';
import VoiceStateManager from './managers/VoiceStateManager';

// Shortcuts to Util methods

// Structures
import Application from './structures/interfaces/Application';
import Collector from './structures/interfaces/Collector';
import APIMessage from './structures/APIMessage';
import Base from './structures/Base';
import BaseGuildEmoji from './structures/BaseGuildEmoji';
import CategoryChannel from './structures/CategoryChannel';
import ClientPresence from './structures/ClientPresence';
import Channel from './structures/Channel';
import ClientApplication from './structures/ClientApplication';
import DMChannel from './structures/DMChannel';
import Emoji from './structures/Emoji';
import Guild from './structures/Guild';
import GuildChannel from './structures/GuildChannel';
import GuildEmoji from './structures/GuildEmoji';
import GuildMember from './structures/GuildMember';
import GuildPreview from './structures/GuildPreview';
import GuildTemplate from './structures/GuildTemplate';
import Integration from './structures/Integration';
import Invite from './structures/Invite';
import Message from './structures/Message';
import MessageAttachment from './structures/MessageAttachment';
import MessageCollector from './structures/MessageCollector';
import MessageEmbed from './structures/MessageEmbed';
import MessageMentions from './structures/MessageMentions';
import MessageReaction from './structures/MessageReaction';
import NewsChannel from './structures/NewsChannel';
import PermissionOverwrites from './structures/PermissionOverwrites';
import { Activity, Presence, RichPresenceAssets } from './structures/Presence';
import ReactionCollector from './structures/ReactionCollector';
import ReactionEmoji from './structures/ReactionEmoji';
import Role from './structures/Role';
import StoreChannel from './structures/StoreChannel';
import Team from './structures/Team';
import TeamMember from './structures/TeamMember';
import TextChannel from './structures/TextChannel';
import User from './structures/User';
import VoiceChannel from './structures/VoiceChannel';
import VoiceRegion from './structures/VoiceRegion';
import VoiceState from './structures/VoiceState';
import Webhook from './structures/Webhook';

import * as WebSocket from './WebSocket';

export {
  Client,

  // Managers
  BaseGuildEmojiManager,
  ChannelManager,
  GuildChannelManager,
  GuildEmojiManager,
  GuildEmojiRoleManager,
  GuildManager,
  GuildMemberManager,
  GuildMemberRoleManager,
  MessageManager,
  PresenceManager,
  ReactionManager,
  ReactionUserManager,
  RoleManager,
  UserManager,
  VoiceStateManager,

  // Structures
  APIMessage,
  Application,
  Base,
  BaseGuildEmoji,
  CategoryChannel,
  Channel,
  ClientApplication,
  ClientPresence,
  Collector,
  DMChannel,
  Emoji,
  Guild,
  // GuildAuditLogs: require('./structures/GuildAuditLogs'),
  GuildChannel,
  GuildEmoji,
  GuildMember,
  GuildPreview,
  GuildTemplate,
  Integration,
  Invite,
  Message,
  MessageAttachment,
  MessageCollector,
  MessageEmbed,
  MessageMentions,
  MessageReaction,
  NewsChannel,
  PermissionOverwrites,
  Presence,
  ReactionCollector,
  ReactionEmoji,
  RichPresenceAssets,
  Role,
  StoreChannel,
  Team,
  TeamMember,
  TextChannel,
  User,
  VoiceChannel,
  VoiceRegion,
  VoiceState,
  Webhook,

  WebSocket
};

const UtilLib = require('./util/Util');

const Discord = {
  // "Root" classes (starting points)
  BaseClient: require('./client/BaseClient'),
  Client,
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
  BaseGuildEmojiManager,
  ChannelManager,
  GuildChannelManager,
  GuildEmojiManager,
  GuildEmojiRoleManager,
  GuildMemberManager,
  GuildMemberRoleManager,
  GuildManager,
  ReactionManager,
  ReactionUserManager,
  MessageManager,
  PresenceManager,
  RoleManager,
  UserManager,

  // Shortcuts to Util methods
  discordSort: UtilLib.discordSort,
  escapeMarkdown: UtilLib.escapeMarkdown,
  fetchRecommendedShards: UtilLib.fetchRecommendedShards,
  resolveColor: UtilLib.resolveColor,
  resolveString: UtilLib.resolveString,
  splitMessage: UtilLib.splitMessage,

  // Structures
  Activity,
  APIMessage,
  Application,
  Base,
  BaseGuildEmoji,
  CategoryChannel,
  Channel,
  ClientApplication,
  ClientPresence,
  Collector,
  DMChannel,
  Emoji,
  get ClientUser() {
    // This is a getter so that it properly extends any custom User class
    return require('./structures/ClientUser');
  },
  Guild,
  GuildAuditLogs: require('./structures/GuildAuditLogs'),
  GuildChannel,
  GuildEmoji,
  GuildMember,
  GuildPreview,
  GuildTemplate,
  Integration,
  Invite,
  Message,
  MessageAttachment,
  MessageCollector,
  MessageEmbed,
  MessageMentions,
  MessageReaction,
  NewsChannel,
  PermissionOverwrites,
  Presence,
  ReactionCollector,
  ReactionEmoji,
  RichPresenceAssets,
  Role,
  StoreChannel,
  Team,
  TeamMember,
  TextChannel,
  User,
  VoiceChannel,
  VoiceRegion,
  VoiceState,
  Webhook,

  WebSocket,
};

export default Discord;
export const { BaseClient } = Discord;

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
export const { discordSort } = Discord;
export const { escapeMarkdown } = Discord;
export const { fetchRecommendedShards } = Discord;
export const { resolveColor } = Discord;
export const { resolveString } = Discord;
export const { splitMessage } = Discord;
export const { ClientUser } = Discord;
export const { GuildAuditLogs } = Discord;

