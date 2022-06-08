'use strict';

/**
 * @typedef {Object} Events
 * @property {string} ApplicationCommandPermissionsUpdate applicationCommandPermissionsUpdate
 * @property {string} CacheSweep cacheSweep
 * @property {string} ChannelCreate channelCreate
 * @property {string} ChannelDelete channelDelete
 * @property {string} ChannelPinsUpdate channelPinsUpdate
 * @property {string} ChannelUpdate channelUpdate
 * @property {string} ClientReady ready
 * @property {string} Debug debug
 * @property {string} Error error
 * @property {string} GuildBanAdd guildBanAdd
 * @property {string} GuildBanRemove guildBanRemove
 * @property {string} GuildCreate guildCreate
 * @property {string} GuildDelete guildDelete
 * @property {string} GuildEmojiCreate emojiCreate
 * @property {string} GuildEmojiDelete emojiDelete
 * @property {string} GuildEmojiUpdate emojiUpdate
 * @property {string} GuildIntegrationsUpdate guildIntegrationsUpdate
 * @property {string} GuildMemberAdd guildMemberAdd
 * @property {string} GuildMemberAvailable guildMemberAvailable
 * @property {string} GuildMemberRemove guildMemberRemove
 * @property {string} GuildMembersChunk guildMembersChunk
 * @property {string} GuildMemberUpdate guildMemberUpdate
 * @property {string} GuildRoleCreate roleCreate
 * @property {string} GuildRoleDelete roleDelete
 * @property {string} GuildRoleUpdate roleUpdate
 * @property {string} GuildScheduledEventCreate guildScheduledEventCreate
 * @property {string} GuildScheduledEventDelete guildScheduledEventDelete
 * @property {string} GuildScheduledEventUpdate guildScheduledEventUpdate
 * @property {string} GuildScheduledEventUserAdd guildScheduledEventUserAdd
 * @property {string} GuildScheduledEventUserRemove guildScheduledEventUserRemove
 * @property {string} GuildStickerCreate stickerCreate
 * @property {string} GuildStickerDelete stickerDelete
 * @property {string} GuildStickerUpdate stickerUpdate
 * @property {string} GuildUnavailable guildUnavailable
 * @property {string} GuildUpdate guildUpdate
 * @property {string} InteractionCreate interactionCreate
 * @property {string} Invalidated invalidated
 * @property {string} InviteCreate inviteCreate
 * @property {string} InviteDelete inviteDelete
 * @property {string} MessageBulkDelete messageDeleteBulk
 * @property {string} MessageCreate messageCreate
 * @property {string} MessageDelete messageDelete
 * @property {string} MessageReactionAdd messageReactionAdd
 * @property {string} MessageReactionRemove messageReactionRemove
 * @property {string} MessageReactionRemoveAll messageReactionRemoveAll
 * @property {string} MessageReactionRemoveEmoji messageReactionRemoveEmoji
 * @property {string} MessageUpdate messageUpdate
 * @property {string} PresenceUpdate presenceUpdate
 * @property {string} ShardDisconnect shardDisconnect
 * @property {string} ShardError shardError
 * @property {string} ShardReady shardReady
 * @property {string} ShardReconnecting shardReconnecting
 * @property {string} ShardResume shardResume
 * @property {string} StageInstanceCreate stageInstanceCreate
 * @property {string} StageInstanceDelete stageInstanceDelete
 * @property {string} StageInstanceUpdate stageInstanceUpdate
 * @property {string} ThreadCreate threadCreate
 * @property {string} ThreadDelete threadDelete
 * @property {string} ThreadListSync threadListSync
 * @property {string} ThreadMembersUpdate threadMembersUpdate
 * @property {string} ThreadMemberUpdate threadMemberUpdate
 * @property {string} ThreadUpdate threadUpdate
 * @property {string} TypingStart typingStart
 * @property {string} UserUpdate userUpdate
 * @property {string} VoiceServerUpdate voiceServerUpdate
 * @property {string} VoiceStateUpdate voiceStateUpdate
 * @property {string} Warn warn
 * @property {string} WebhooksUpdate webhookUpdate
 */

// JSDoc for IntelliSense purposes
/**
 * @type {Events}
 * @ignore
 */
module.exports = {
  ApplicationCommandPermissionsUpdate: 'applicationCommandPermissionsUpdate',
  AutoModerationActionExecution: 'autoModerationActionExecution',
  AutoModerationRuleCreate: 'autoModerationRuleCreate',
  AutoModerationRuleDelete: 'autoModerationRuleDelete',
  AutoModerationRuleUpdate: 'autoModerationRuleUpdate',
  CacheSweep: 'cacheSweep',
  ChannelCreate: 'channelCreate',
  ChannelDelete: 'channelDelete',
  ChannelPinsUpdate: 'channelPinsUpdate',
  ChannelUpdate: 'channelUpdate',
  ClientReady: 'ready',
  Debug: 'debug',
  Error: 'error',
  GuildBanAdd: 'guildBanAdd',
  GuildBanRemove: 'guildBanRemove',
  GuildCreate: 'guildCreate',
  GuildDelete: 'guildDelete',
  GuildEmojiCreate: 'emojiCreate',
  GuildEmojiDelete: 'emojiDelete',
  GuildEmojiUpdate: 'emojiUpdate',
  GuildIntegrationsUpdate: 'guildIntegrationsUpdate',
  GuildMemberAdd: 'guildMemberAdd',
  GuildMemberAvailable: 'guildMemberAvailable',
  GuildMemberRemove: 'guildMemberRemove',
  GuildMembersChunk: 'guildMembersChunk',
  GuildMemberUpdate: 'guildMemberUpdate',
  GuildRoleCreate: 'roleCreate',
  GuildRoleDelete: 'roleDelete',
  GuildRoleUpdate: 'roleUpdate',
  GuildScheduledEventCreate: 'guildScheduledEventCreate',
  GuildScheduledEventDelete: 'guildScheduledEventDelete',
  GuildScheduledEventUpdate: 'guildScheduledEventUpdate',
  GuildScheduledEventUserAdd: 'guildScheduledEventUserAdd',
  GuildScheduledEventUserRemove: 'guildScheduledEventUserRemove',
  GuildStickerCreate: 'stickerCreate',
  GuildStickerDelete: 'stickerDelete',
  GuildStickerUpdate: 'stickerUpdate',
  GuildUnavailable: 'guildUnavailable',
  GuildUpdate: 'guildUpdate',
  InteractionCreate: 'interactionCreate',
  Invalidated: 'invalidated',
  InviteCreate: 'inviteCreate',
  InviteDelete: 'inviteDelete',
  MessageBulkDelete: 'messageDeleteBulk',
  MessageCreate: 'messageCreate',
  MessageDelete: 'messageDelete',
  MessageReactionAdd: 'messageReactionAdd',
  MessageReactionRemove: 'messageReactionRemove',
  MessageReactionRemoveAll: 'messageReactionRemoveAll',
  MessageReactionRemoveEmoji: 'messageReactionRemoveEmoji',
  MessageUpdate: 'messageUpdate',
  PresenceUpdate: 'presenceUpdate',
  Raw: 'raw',
  ShardDisconnect: 'shardDisconnect',
  ShardError: 'shardError',
  ShardReady: 'shardReady',
  ShardReconnecting: 'shardReconnecting',
  ShardResume: 'shardResume',
  StageInstanceCreate: 'stageInstanceCreate',
  StageInstanceDelete: 'stageInstanceDelete',
  StageInstanceUpdate: 'stageInstanceUpdate',
  ThreadCreate: 'threadCreate',
  ThreadDelete: 'threadDelete',
  ThreadListSync: 'threadListSync',
  ThreadMembersUpdate: 'threadMembersUpdate',
  ThreadMemberUpdate: 'threadMemberUpdate',
  ThreadUpdate: 'threadUpdate',
  TypingStart: 'typingStart',
  UserUpdate: 'userUpdate',
  VoiceServerUpdate: 'voiceServerUpdate',
  VoiceStateUpdate: 'voiceStateUpdate',
  Warn: 'warn',
  WebhooksUpdate: 'webhookUpdate',
};
