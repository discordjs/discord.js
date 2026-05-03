'use strict';

const actionFiles = {
  ChannelCreate: './ChannelCreate.js',
  ChannelDelete: './ChannelDelete.js',
  ChannelUpdate: './ChannelUpdate.js',
  GuildChannelsPositionUpdate: './GuildChannelsPositionUpdate.js',
  GuildEmojiCreate: './GuildEmojiCreate.js',
  GuildEmojiDelete: './GuildEmojiDelete.js',
  GuildEmojiUpdate: './GuildEmojiUpdate.js',
  GuildEmojisUpdate: './GuildEmojisUpdate.js',
  GuildMemberRemove: './GuildMemberRemove.js',
  GuildMemberUpdate: './GuildMemberUpdate.js',
  GuildRoleCreate: './GuildRoleCreate.js',
  GuildRoleDelete: './GuildRoleDelete.js',
  GuildRolesPositionUpdate: './GuildRolesPositionUpdate.js',
  GuildScheduledEventDelete: './GuildScheduledEventDelete.js',
  GuildScheduledEventUserAdd: './GuildScheduledEventUserAdd.js',
  GuildScheduledEventUserRemove: './GuildScheduledEventUserRemove.js',
  GuildSoundboardSoundDelete: './GuildSoundboardSoundDelete.js',
  GuildStickerCreate: './GuildStickerCreate.js',
  GuildStickerDelete: './GuildStickerDelete.js',
  GuildStickerUpdate: './GuildStickerUpdate.js',
  GuildStickersUpdate: './GuildStickersUpdate.js',
  GuildUpdate: './GuildUpdate.js',
  InteractionCreate: './InteractionCreate.js',
  MessageCreate: './MessageCreate.js',
  MessageDelete: './MessageDelete.js',
  MessageDeleteBulk: './MessageDeleteBulk.js',
  MessagePollVoteAdd: './MessagePollVoteAdd.js',
  MessagePollVoteRemove: './MessagePollVoteRemove.js',
  MessageReactionAdd: './MessageReactionAdd.js',
  MessageReactionRemove: './MessageReactionRemove.js',
  MessageReactionRemoveAll: './MessageReactionRemoveAll.js',
  MessageReactionRemoveEmoji: './MessageReactionRemoveEmoji.js',
  MessageUpdate: './MessageUpdate.js',
  StageInstanceCreate: './StageInstanceCreate.js',
  StageInstanceDelete: './StageInstanceDelete.js',
  StageInstanceUpdate: './StageInstanceUpdate.js',
  ThreadCreate: './ThreadCreate.js',
  ThreadMembersUpdate: './ThreadMembersUpdate.js',
  TypingStart: './TypingStart.js',
  UserUpdate: './UserUpdate.js',
};

class ActionsManager {
  // These symbols represent fully built data that we inject at times when calling actions manually.
  // Action#getUser, for example, will return the injected data (which is assumed to be a built structure)
  // instead of trying to make it from provided data
  injectedUser = Symbol('djs.actions.injectedUser');

  injectedChannel = Symbol('djs.actions.injectedChannel');

  injectedMessage = Symbol('djs.actions.injectedMessage');

  constructor(client) {
    this.client = client;

    for (const [name, file] of Object.entries(actionFiles)) {
      Object.defineProperty(this, name, {
        get() {
          const cacheKey = `_${name}`;
          if (!this[cacheKey]) {
            const Action = require(file)[`${name}Action`];
            this[cacheKey] = new Action(this.client);
          }
          return this[cacheKey];
        },
        enumerable: true,
        configurable: true,
      });
    }
  }
}

exports.ActionsManager = ActionsManager;
