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

    this.register(require('./ChannelCreate.js').ChannelCreateAction);
    this.register(require('./ChannelDelete.js').ChannelDeleteAction);
    this.register(require('./ChannelUpdate.js').ChannelUpdateAction);
    this.register(require('./GuildChannelsPositionUpdate.js').GuildChannelsPositionUpdateAction);
    this.register(require('./GuildEmojiCreate.js').GuildEmojiCreateAction);
    this.register(require('./GuildEmojiDelete.js').GuildEmojiDeleteAction);
    this.register(require('./GuildEmojiUpdate.js').GuildEmojiUpdateAction);
    this.register(require('./GuildEmojisUpdate.js').GuildEmojisUpdateAction);
    this.register(require('./GuildMemberRemove.js').GuildMemberRemoveAction);
    this.register(require('./GuildMemberUpdate.js').GuildMemberUpdateAction);
    this.register(require('./GuildRoleCreate.js').GuildRoleCreateAction);
    this.register(require('./GuildRoleDelete.js').GuildRoleDeleteAction);
    this.register(require('./GuildRolesPositionUpdate.js').GuildRolesPositionUpdateAction);
    this.register(require('./GuildScheduledEventDelete.js').GuildScheduledEventDeleteAction);
    this.register(require('./GuildScheduledEventUserAdd.js').GuildScheduledEventUserAddAction);
    this.register(require('./GuildScheduledEventUserRemove.js').GuildScheduledEventUserRemoveAction);
    this.register(require('./GuildStickerCreate.js').GuildStickerCreateAction);
    this.register(require('./GuildStickerDelete.js').GuildStickerDeleteAction);
    this.register(require('./GuildStickerUpdate.js').GuildStickerUpdateAction);
    this.register(require('./GuildStickersUpdate.js').GuildStickersUpdateAction);
    this.register(require('./GuildUpdate.js').GuildUpdateAction);
    this.register(require('./InteractionCreate.js').InteractionCreateAction);
    this.register(require('./MessageCreate.js').MessageCreateAction);
    this.register(require('./MessageDelete.js').MessageDeleteAction);
    this.register(require('./MessageDeleteBulk.js').MessageDeleteBulkAction);
    this.register(require('./MessagePollVoteAdd.js').MessagePollVoteAddAction);
    this.register(require('./MessagePollVoteRemove.js').MessagePollVoteRemoveAction);
    this.register(require('./MessageReactionAdd.js').MessageReactionAddAction);
    this.register(require('./MessageReactionRemove.js').MessageReactionRemoveAction);
    this.register(require('./MessageReactionRemoveAll.js').MessageReactionRemoveAllAction);
    this.register(require('./MessageReactionRemoveEmoji.js').MessageReactionRemoveEmojiAction);
    this.register(require('./MessageUpdate.js').MessageUpdateAction);
    this.register(require('./StageInstanceCreate.js').StageInstanceCreateAction);
    this.register(require('./StageInstanceDelete.js').StageInstanceDeleteAction);
    this.register(require('./StageInstanceUpdate.js').StageInstanceUpdateAction);
    this.register(require('./ThreadCreate.js').ThreadCreateAction);
    this.register(require('./ThreadMembersUpdate.js').ThreadMembersUpdateAction);
    this.register(require('./TypingStart.js').TypingStartAction);
    this.register(require('./UserUpdate.js').UserUpdateAction);
  }

  register(Action) {
    this[Action.name.replace(/Action$/, '')] = new Action(this.client);
  }
}

exports.ActionsManager = ActionsManager;
