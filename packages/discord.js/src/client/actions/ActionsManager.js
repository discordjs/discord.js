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

    this.register(require('./ChannelCreate').ChannelCreateAction);
    this.register(require('./ChannelDelete').ChannelDeleteAction);
    this.register(require('./ChannelUpdate').ChannelUpdateAction);
    this.register(require('./GuildChannelsPositionUpdate').GuildChannelsPositionUpdateAction);
    this.register(require('./GuildEmojiCreate').GuildEmojiCreateAction);
    this.register(require('./GuildEmojiDelete').GuildEmojiDeleteAction);
    this.register(require('./GuildEmojiUpdate').GuildEmojiUpdateAction);
    this.register(require('./GuildEmojiUpdate').GuildEmojiUpdateAction);
    this.register(require('./GuildEmojisUpdate').GuildEmojisUpdateAction);
    this.register(require('./GuildMemberRemove').GuildMemberRemoveAction);
    this.register(require('./GuildMemberUpdate').GuildMemberUpdateAction);
    this.register(require('./GuildRoleCreate').GuildRoleCreateAction);
    this.register(require('./GuildRoleDelete').GuildRoleDeleteAction);
    this.register(require('./GuildRolesPositionUpdate').GuildRolesPositionUpdateAction);
    this.register(require('./GuildScheduledEventDelete').GuildScheduledEventDeleteAction);
    this.register(require('./GuildScheduledEventUserAdd').GuildScheduledEventUserAddAction);
    this.register(require('./GuildScheduledEventUserRemove').GuildScheduledEventUserRemoveAction);
    this.register(require('./GuildStickerCreate').GuildStickerCreateAction);
    this.register(require('./GuildStickerDelete').GuildStickerDeleteAction);
    this.register(require('./GuildStickerUpdate').GuildStickerUpdateAction);
    this.register(require('./GuildStickerUpdate').GuildStickerUpdateAction);
    this.register(require('./GuildStickersUpdate').GuildStickersUpdateAction);
    this.register(require('./GuildUpdate').GuildUpdateAction);
    this.register(require('./InteractionCreate').InteractionCreateAction);
    this.register(require('./MessageCreate').MessageCreateAction);
    this.register(require('./MessageDelete').MessageDeleteAction);
    this.register(require('./MessageDeleteBulk').MessageDeleteBulkAction);
    this.register(require('./MessagePollVoteAdd').MessagePollVoteAddAction);
    this.register(require('./MessagePollVoteRemove').MessagePollVoteRemoveAction);
    this.register(require('./MessageReactionAdd').MessageReactionAddAction);
    this.register(require('./MessageReactionRemove').MessageReactionRemoveAction);
    this.register(require('./MessageReactionRemoveAll').MessageReactionRemoveAllAction);
    this.register(require('./MessageReactionRemoveEmoji').MessageReactionRemoveEmojiAction);
    this.register(require('./MessageUpdate').MessageUpdateAction);
    this.register(require('./StageInstanceCreate').StageInstanceCreateAction);
    this.register(require('./StageInstanceDelete').StageInstanceDeleteAction);
    this.register(require('./StageInstanceUpdate').StageInstanceUpdateAction);
    this.register(require('./ThreadCreate').ThreadCreateAction);
    this.register(require('./ThreadMembersUpdate').ThreadMembersUpdateAction);
    this.register(require('./TypingStart').TypingStartAction);
    this.register(require('./UserUpdate').UserUpdateAction);
  }

  register(Action) {
    this[Action.name.replace(/Action$/, '')] = new Action(this.client);
  }
}

exports.ActionsManager = ActionsManager;
