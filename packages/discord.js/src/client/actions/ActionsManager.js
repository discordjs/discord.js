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

    this.register(require('./ApplicationCommandPermissionsUpdate'));
    this.register(require('./AutoModerationActionExecution'));
    this.register(require('./AutoModerationRuleCreate'));
    this.register(require('./AutoModerationRuleDelete'));
    this.register(require('./AutoModerationRuleUpdate'));
    this.register(require('./ChannelCreate'));
    this.register(require('./ChannelDelete'));
    this.register(require('./ChannelUpdate'));
    this.register(require('./EntitlementCreate'));
    this.register(require('./EntitlementDelete'));
    this.register(require('./EntitlementUpdate'));
    this.register(require('./GuildAuditLogEntryCreate'));
    this.register(require('./GuildBanAdd'));
    this.register(require('./GuildBanRemove'));
    this.register(require('./GuildChannelsPositionUpdate'));
    this.register(require('./GuildDelete'));
    this.register(require('./GuildEmojiCreate'));
    this.register(require('./GuildEmojiDelete'));
    this.register(require('./GuildEmojiUpdate'));
    this.register(require('./GuildEmojisUpdate'));
    this.register(require('./GuildIntegrationsUpdate'));
    this.register(require('./GuildMemberRemove'));
    this.register(require('./GuildMemberUpdate'));
    this.register(require('./GuildRoleCreate'));
    this.register(require('./GuildRoleDelete'));
    this.register(require('./GuildRoleUpdate'));
    this.register(require('./GuildRolesPositionUpdate'));
    this.register(require('./GuildScheduledEventCreate'));
    this.register(require('./GuildScheduledEventDelete'));
    this.register(require('./GuildScheduledEventUpdate'));
    this.register(require('./GuildScheduledEventUserAdd'));
    this.register(require('./GuildScheduledEventUserRemove'));
    this.register(require('./GuildStickerCreate'));
    this.register(require('./GuildStickerDelete'));
    this.register(require('./GuildStickerUpdate'));
    this.register(require('./GuildStickersUpdate'));
    this.register(require('./GuildUpdate'));
    this.register(require('./InteractionCreate'));
    this.register(require('./InviteCreate'));
    this.register(require('./InviteDelete'));
    this.register(require('./MessageCreate'));
    this.register(require('./MessageDelete'));
    this.register(require('./MessageDeleteBulk'));
    this.register(require('./MessagePollVoteAdd'));
    this.register(require('./MessagePollVoteRemove'));
    this.register(require('./MessageReactionAdd'));
    this.register(require('./MessageReactionRemove'));
    this.register(require('./MessageReactionRemoveAll'));
    this.register(require('./MessageReactionRemoveEmoji'));
    this.register(require('./MessageUpdate'));
    this.register(require('./PresenceUpdate'));
    this.register(require('./StageInstanceCreate'));
    this.register(require('./StageInstanceDelete'));
    this.register(require('./StageInstanceUpdate'));
    this.register(require('./ThreadCreate'));
    this.register(require('./ThreadDelete'));
    this.register(require('./ThreadListSync'));
    this.register(require('./ThreadMemberUpdate'));
    this.register(require('./ThreadMembersUpdate'));
    this.register(require('./TypingStart'));
    this.register(require('./UserUpdate'));
    this.register(require('./VoiceStateUpdate'));
    this.register(require('./WebhooksUpdate'));
  }

  register(Action) {
    this[Action.name.replace(/Action$/, '')] = new Action(this.client);
  }
}

module.exports = ActionsManager;
