import { ChannelCreateAction } from './ChannelCreate.js';
import { ChannelDeleteAction } from './ChannelDelete.js';
import { ChannelUpdateAction } from './ChannelUpdate.js';
import { GuildChannelsPositionUpdateAction } from './GuildChannelsPositionUpdate.js';
import { GuildEmojiCreateAction } from './GuildEmojiCreate.js';
import { GuildEmojiDeleteAction } from './GuildEmojiDelete.js';
import { GuildEmojiUpdateAction } from './GuildEmojiUpdate.js';
import { GuildEmojisUpdateAction } from './GuildEmojisUpdate.js';
import { GuildMemberRemoveAction } from './GuildMemberRemove.js';
import { GuildMemberUpdateAction } from './GuildMemberUpdate.js';
import { GuildRoleCreateAction } from './GuildRoleCreate.js';
import { GuildRoleDeleteAction } from './GuildRoleDelete.js';
import { GuildRolesPositionUpdateAction } from './GuildRolesPositionUpdate.js';
import { GuildScheduledEventDeleteAction } from './GuildScheduledEventDelete.js';
import { GuildScheduledEventUserAddAction } from './GuildScheduledEventUserAdd.js';
import { GuildScheduledEventUserRemoveAction } from './GuildScheduledEventUserRemove.js';
import { GuildSoundboardSoundDeleteAction } from './GuildSoundboardSoundDelete.js';
import { GuildStickerCreateAction } from './GuildStickerCreate.js';
import { GuildStickerDeleteAction } from './GuildStickerDelete.js';
import { GuildStickerUpdateAction } from './GuildStickerUpdate.js';
import { GuildStickersUpdateAction } from './GuildStickersUpdate.js';
import { GuildUpdateAction } from './GuildUpdate.js';
import { InteractionCreateAction } from './InteractionCreate.js';
import { MessageCreateAction } from './MessageCreate.js';
import { MessageDeleteAction } from './MessageDelete.js';
import { MessageDeleteBulkAction } from './MessageDeleteBulk.js';
import { MessagePollVoteAddAction } from './MessagePollVoteAdd.js';
import { MessagePollVoteRemoveAction } from './MessagePollVoteRemove.js';
import { MessageReactionAddAction } from './MessageReactionAdd.js';
import { MessageReactionRemoveAction } from './MessageReactionRemove.js';
import { MessageReactionRemoveAllAction } from './MessageReactionRemoveAll.js';
import { MessageReactionRemoveEmojiAction } from './MessageReactionRemoveEmoji.js';
import { MessageUpdateAction } from './MessageUpdate.js';
import { StageInstanceCreateAction } from './StageInstanceCreate.js';
import { StageInstanceDeleteAction } from './StageInstanceDelete.js';
import { StageInstanceUpdateAction } from './StageInstanceUpdate.js';
import { ThreadCreateAction } from './ThreadCreate.js';
import { ThreadMembersUpdateAction } from './ThreadMembersUpdate.js';
import { TypingStartAction } from './TypingStart.js';
import { UserUpdateAction } from './UserUpdate.js';

export class ActionsManager {
  // These symbols represent fully built data that we inject at times when calling actions manually.
  // Action#getUser, for example, will return the injected data (which is assumed to be a built structure)
  // instead of trying to make it from provided data
  injectedUser = Symbol('djs.actions.injectedUser');

  injectedChannel = Symbol('djs.actions.injectedChannel');

  injectedMessage = Symbol('djs.actions.injectedMessage');

  constructor(client) {
    this.client = client;

    this.ChannelCreate = this.load(ChannelCreateAction);
    this.ChannelDelete = this.load(ChannelDeleteAction);
    this.ChannelUpdate = this.load(ChannelUpdateAction);
    this.GuildChannelsPositionUpdate = this.load(GuildChannelsPositionUpdateAction);
    this.GuildEmojiCreate = this.load(GuildEmojiCreateAction);
    this.GuildEmojiDelete = this.load(GuildEmojiDeleteAction);
    this.GuildEmojiUpdate = this.load(GuildEmojiUpdateAction);
    this.GuildEmojisUpdate = this.load(GuildEmojisUpdateAction);
    this.GuildMemberRemove = this.load(GuildMemberRemoveAction);
    this.GuildMemberUpdate = this.load(GuildMemberUpdateAction);
    this.GuildRoleCreate = this.load(GuildRoleCreateAction);
    this.GuildRoleDelete = this.load(GuildRoleDeleteAction);
    this.GuildRolesPositionUpdate = this.load(GuildRolesPositionUpdateAction);
    this.GuildScheduledEventDelete = this.load(GuildScheduledEventDeleteAction);
    this.GuildScheduledEventUserAdd = this.load(GuildScheduledEventUserAddAction);
    this.GuildScheduledEventUserRemove = this.load(GuildScheduledEventUserRemoveAction);
    this.GuildSoundboardSoundDelete = this.load(GuildSoundboardSoundDeleteAction);
    this.GuildStickerCreate = this.load(GuildStickerCreateAction);
    this.GuildStickerDelete = this.load(GuildStickerDeleteAction);
    this.GuildStickerUpdate = this.load(GuildStickerUpdateAction);
    this.GuildStickersUpdate = this.load(GuildStickersUpdateAction);
    this.GuildUpdate = this.load(GuildUpdateAction);
    this.InteractionCreate = this.load(InteractionCreateAction);
    this.MessageCreate = this.load(MessageCreateAction);
    this.MessageDelete = this.load(MessageDeleteAction);
    this.MessageDeleteBulk = this.load(MessageDeleteBulkAction);
    this.MessagePollVoteAdd = this.load(MessagePollVoteAddAction);
    this.MessagePollVoteRemove = this.load(MessagePollVoteRemoveAction);
    this.MessageReactionAdd = this.load(MessageReactionAddAction);
    this.MessageReactionRemove = this.load(MessageReactionRemoveAction);
    this.MessageReactionRemoveAll = this.load(MessageReactionRemoveAllAction);
    this.MessageReactionRemoveEmoji = this.load(MessageReactionRemoveEmojiAction);
    this.MessageUpdate = this.load(MessageUpdateAction);
    this.StageInstanceCreate = this.load(StageInstanceCreateAction);
    this.StageInstanceDelete = this.load(StageInstanceDeleteAction);
    this.StageInstanceUpdate = this.load(StageInstanceUpdateAction);
    this.ThreadCreate = this.load(ThreadCreateAction);
    this.ThreadMembersUpdate = this.load(ThreadMembersUpdateAction);
    this.TypingStart = this.load(TypingStartAction);
    this.UserUpdate = this.load(UserUpdateAction);
  }

  load(Action) {
    return new Action(this.client);
  }
}
