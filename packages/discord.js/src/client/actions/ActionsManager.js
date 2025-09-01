'use strict';

class ActionsManager {
  // These symbols represent fully built data that we inject at times when calling actions manually.
  // Action#getUser, for example, will return the injected data (which is assumed to be a built structure)
  // instead of trying to make it from provided data
  injectedUser = Symbol('djs.actions.injectedUser');
  injectedChannel = Symbol('djs.actions.injectedChannel');
  injectedMessage = Symbol('djs.actions.injectedMessage');

  constructor(client) {
    this.client = client;

    this.ApplicationCommandPermissionsUpdate = this.load(require('./ApplicationCommandPermissionsUpdate.js'));
    this.AutoModerationActionExecution = this.load(require('./AutoModerationActionExecution.js'));
    this.AutoModerationRuleCreate = this.load(require('./AutoModerationRuleCreate.js'));
    this.AutoModerationRuleDelete = this.load(require('./AutoModerationRuleDelete.js'));
    this.AutoModerationRuleUpdate = this.load(require('./AutoModerationRuleUpdate.js'));
    this.ChannelCreate = this.load(require('./ChannelCreate.js'));
    this.ChannelDelete = this.load(require('./ChannelDelete.js'));
    this.ChannelUpdate = this.load(require('./ChannelUpdate.js'));
    this.EntitlementCreate = this.load(require('./EntitlementCreate.js'));
    this.EntitlementDelete = this.load(require('./EntitlementDelete.js'));
    this.EntitlementUpdate = this.load(require('./EntitlementUpdate.js'));
    this.GuildAuditLogEntryCreate = this.load(require('./GuildAuditLogEntryCreate.js'));
    this.GuildBanAdd = this.load(require('./GuildBanAdd.js'));
    this.GuildBanRemove = this.load(require('./GuildBanRemove.js'));
    this.GuildChannelsPositionUpdate = this.load(require('./GuildChannelsPositionUpdate.js'));
    this.GuildDelete = this.load(require('./GuildDelete.js'));
    this.GuildEmojiCreate = this.load(require('./GuildEmojiCreate.js'));
    this.GuildEmojiDelete = this.load(require('./GuildEmojiDelete.js'));
    this.GuildEmojiUpdate = this.load(require('./GuildEmojiUpdate.js'));
    this.GuildEmojisUpdate = this.load(require('./GuildEmojisUpdate.js'));
    this.GuildIntegrationsUpdate = this.load(require('./GuildIntegrationsUpdate.js'));
    this.GuildMemberRemove = this.load(require('./GuildMemberRemove.js'));
    this.GuildMemberUpdate = this.load(require('./GuildMemberUpdate.js'));
    this.GuildRoleCreate = this.load(require('./GuildRoleCreate.js'));
    this.GuildRoleDelete = this.load(require('./GuildRoleDelete.js'));
    this.GuildRoleUpdate = this.load(require('./GuildRoleUpdate.js'));
    this.GuildRolesPositionUpdate = this.load(require('./GuildRolesPositionUpdate.js'));
    this.GuildScheduledEventCreate = this.load(require('./GuildScheduledEventCreate.js'));
    this.GuildScheduledEventDelete = this.load(require('./GuildScheduledEventDelete.js'));
    this.GuildScheduledEventUpdate = this.load(require('./GuildScheduledEventUpdate.js'));
    this.GuildScheduledEventUserAdd = this.load(require('./GuildScheduledEventUserAdd.js'));
    this.GuildScheduledEventUserRemove = this.load(require('./GuildScheduledEventUserRemove.js'));
    this.GuildSoundboardSoundDelete = this.load(require('./GuildSoundboardSoundDelete.js'));
    this.GuildStickerCreate = this.load(require('./GuildStickerCreate.js'));
    this.GuildStickerDelete = this.load(require('./GuildStickerDelete.js'));
    this.GuildStickerUpdate = this.load(require('./GuildStickerUpdate.js'));
    this.GuildStickersUpdate = this.load(require('./GuildStickersUpdate.js'));
    this.GuildUpdate = this.load(require('./GuildUpdate.js'));
    this.InteractionCreate = this.load(require('./InteractionCreate.js'));
    this.InviteCreate = this.load(require('./InviteCreate.js'));
    this.InviteDelete = this.load(require('./InviteDelete.js'));
    this.MessageCreate = this.load(require('./MessageCreate.js'));
    this.MessageDelete = this.load(require('./MessageDelete.js'));
    this.MessageDeleteBulk = this.load(require('./MessageDeleteBulk.js'));
    this.MessagePollVoteAdd = this.load(require('./MessagePollVoteAdd.js'));
    this.MessagePollVoteRemove = this.load(require('./MessagePollVoteRemove.js'));
    this.MessageReactionAdd = this.load(require('./MessageReactionAdd.js'));
    this.MessageReactionRemove = this.load(require('./MessageReactionRemove.js'));
    this.MessageReactionRemoveAll = this.load(require('./MessageReactionRemoveAll.js'));
    this.MessageReactionRemoveEmoji = this.load(require('./MessageReactionRemoveEmoji.js'));
    this.MessageUpdate = this.load(require('./MessageUpdate.js'));
    this.PresenceUpdate = this.load(require('./PresenceUpdate.js'));
    this.StageInstanceCreate = this.load(require('./StageInstanceCreate.js'));
    this.StageInstanceDelete = this.load(require('./StageInstanceDelete.js'));
    this.StageInstanceUpdate = this.load(require('./StageInstanceUpdate.js'));
    this.ThreadCreate = this.load(require('./ThreadCreate.js'));
    this.ThreadDelete = this.load(require('./ThreadDelete.js'));
    this.ThreadListSync = this.load(require('./ThreadListSync.js'));
    this.ThreadMemberUpdate = this.load(require('./ThreadMemberUpdate.js'));
    this.ThreadMembersUpdate = this.load(require('./ThreadMembersUpdate.js'));
    this.TypingStart = this.load(require('./TypingStart.js'));
    this.UserUpdate = this.load(require('./UserUpdate.js'));
    this.VoiceStateUpdate = this.load(require('./VoiceStateUpdate.js'));
    this.WebhooksUpdate = this.load(require('./WebhooksUpdate.js'));
  }

  load(Action) {
    return new Action(this.client);
  }
}

module.exports = ActionsManager;
