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

    this.ChannelCreate = this.load(require('./ChannelCreate.js').ChannelCreateAction);
    this.ChannelDelete = this.load(require('./ChannelDelete.js').ChannelDeleteAction);
    this.ChannelUpdate = this.load(require('./ChannelUpdate.js').ChannelUpdateAction);
    this.GuildChannelsPositionUpdate = this.load(
      require('./GuildChannelsPositionUpdate.js').GuildChannelsPositionUpdateAction,
    );
    this.GuildEmojiCreate = this.load(require('./GuildEmojiCreate.js').GuildEmojiCreateAction);
    this.GuildEmojiDelete = this.load(require('./GuildEmojiDelete.js').GuildEmojiDeleteAction);
    this.GuildEmojiUpdate = this.load(require('./GuildEmojiUpdate.js').GuildEmojiUpdateAction);
    this.GuildEmojisUpdate = this.load(require('./GuildEmojisUpdate.js').GuildEmojisUpdateAction);
    this.GuildMemberRemove = this.load(require('./GuildMemberRemove.js').GuildMemberRemoveAction);
    this.GuildMemberUpdate = this.load(require('./GuildMemberUpdate.js').GuildMemberUpdateAction);
    this.GuildRoleCreate = this.load(require('./GuildRoleCreate.js').GuildRoleCreateAction);
    this.GuildRoleDelete = this.load(require('./GuildRoleDelete.js').GuildRoleDeleteAction);
    this.GuildRolesPositionUpdate = this.load(require('./GuildRolesPositionUpdate.js').GuildRolesPositionUpdateAction);
    this.GuildScheduledEventDelete = this.load(
      require('./GuildScheduledEventDelete.js').GuildScheduledEventDeleteAction,
    );
    this.GuildScheduledEventUserAdd = this.load(
      require('./GuildScheduledEventUserAdd.js').GuildScheduledEventUserAddAction,
    );
    this.GuildScheduledEventUserRemove = this.load(
      require('./GuildScheduledEventUserRemove.js').GuildScheduledEventUserRemoveAction,
    );
    this.GuildSoundboardSoundDelete = this.load(
      require('./GuildSoundboardSoundDelete.js').GuildSoundboardSoundDeleteAction,
    );
    this.GuildStickerCreate = this.load(require('./GuildStickerCreate.js').GuildStickerCreateAction);
    this.GuildStickerDelete = this.load(require('./GuildStickerDelete.js').GuildStickerDeleteAction);
    this.GuildStickerUpdate = this.load(require('./GuildStickerUpdate.js').GuildStickerUpdateAction);
    this.GuildStickersUpdate = this.load(require('./GuildStickersUpdate.js').GuildStickersUpdateAction);
    this.GuildUpdate = this.load(require('./GuildUpdate.js').GuildUpdateAction);
    this.InteractionCreate = this.load(require('./InteractionCreate.js').InteractionCreateAction);
    this.MessageCreate = this.load(require('./MessageCreate.js').MessageCreateAction);
    this.MessageDelete = this.load(require('./MessageDelete.js').MessageDeleteAction);
    this.MessageDeleteBulk = this.load(require('./MessageDeleteBulk.js').MessageDeleteBulkAction);
    this.MessagePollVoteAdd = this.load(require('./MessagePollVoteAdd.js').MessagePollVoteAddAction);
    this.MessagePollVoteRemove = this.load(require('./MessagePollVoteRemove.js').MessagePollVoteRemoveAction);
    this.MessageReactionAdd = this.load(require('./MessageReactionAdd.js').MessageReactionAddAction);
    this.MessageReactionRemove = this.load(require('./MessageReactionRemove.js').MessageReactionRemoveAction);
    this.MessageReactionRemoveAll = this.load(require('./MessageReactionRemoveAll.js').MessageReactionRemoveAllAction);
    this.MessageReactionRemoveEmoji = this.load(
      require('./MessageReactionRemoveEmoji.js').MessageReactionRemoveEmojiAction,
    );
    this.MessageUpdate = this.load(require('./MessageUpdate.js').MessageUpdateAction);
    this.StageInstanceCreate = this.load(require('./StageInstanceCreate.js').StageInstanceCreateAction);
    this.StageInstanceDelete = this.load(require('./StageInstanceDelete.js').StageInstanceDeleteAction);
    this.StageInstanceUpdate = this.load(require('./StageInstanceUpdate.js').StageInstanceUpdateAction);
    this.ThreadCreate = this.load(require('./ThreadCreate.js').ThreadCreateAction);
    this.ThreadMembersUpdate = this.load(require('./ThreadMembersUpdate.js').ThreadMembersUpdateAction);
    this.TypingStart = this.load(require('./TypingStart.js').TypingStartAction);
    this.UserUpdate = this.load(require('./UserUpdate.js').UserUpdateAction);
  }

  load(Action) {
    return new Action(this.client);
  }
}

exports.ActionsManager = ActionsManager;
