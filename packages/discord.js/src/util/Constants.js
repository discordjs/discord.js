'use strict';

const { ChannelType, MessageType, ComponentType, ImageFormat, StickerFormatType } = require('discord-api-types/v10');

/**
 * Max bulk deletable message age
 *
 * @typedef {number} MaxBulkDeletableMessageAge
 */
exports.MaxBulkDeletableMessageAge = 1_209_600_000;

/**
 * The name of an item to be swept in Sweepers
 * - `autoModerationRules`
 * - `applicationCommands` - both global and guild commands
 * - `bans`
 * - `emojis`
 * - `entitlements`
 * - `invites` - accepts the `lifetime` property, using it will sweep based on expires timestamp
 * - `guildMembers`
 * - `messages` - accepts the `lifetime` property, using it will sweep based on edited or created timestamp
 * - `presences`
 * - `reactions`
 * - `stageInstances`
 * - `stickers`
 * - `threadMembers`
 * - `threads` - accepts the `lifetime` property, using it will sweep archived threads based on archived timestamp
 * - `users`
 * - `voiceStates`
 *
 * @typedef {string} SweeperKey
 */
exports.SweeperKeys = [
  'autoModerationRules',
  'applicationCommands',
  'bans',
  'emojis',
  'entitlements',
  'invites',
  'guildMembers',
  'messages',
  'presences',
  'reactions',
  'stageInstances',
  'stickers',
  'threadMembers',
  'threads',
  'users',
  'voiceStates',
];

/**
 * The types of messages that are not `System`. The available types are:
 * - {@link MessageType.Default}
 * - {@link MessageType.Reply}
 * - {@link MessageType.ChatInputCommand}
 * - {@link MessageType.ContextMenuCommand}
 *
 * @typedef {MessageType[]} NonSystemMessageTypes
 */
exports.NonSystemMessageTypes = [
  MessageType.Default,
  MessageType.Reply,
  MessageType.ChatInputCommand,
  MessageType.ContextMenuCommand,
];

/**
 * The guild channels that are text-based.
 * - TextChannel
 * - AnnouncementChannel
 * - ThreadChannel
 * - VoiceChannel
 * - StageChannel
 *
 * @typedef {TextChannel|AnnouncementChannel|ThreadChannel|VoiceChannel|StageChannel} GuildTextBasedChannel
 */

/**
 * The types of guild channels that are text-based. The available types are:
 * - {@link ChannelType.GuildText}
 * - {@link ChannelType.GuildAnnouncement}
 * - {@link ChannelType.AnnouncementThread}
 * - {@link ChannelType.PublicThread}
 * - {@link ChannelType.PrivateThread}
 * - {@link ChannelType.GuildVoice}
 * - {@link ChannelType.GuildStageVoice}
 *
 * @typedef {ChannelType[]} GuildTextBasedChannelTypes
 */
exports.GuildTextBasedChannelTypes = [
  ChannelType.GuildText,
  ChannelType.GuildAnnouncement,
  ChannelType.AnnouncementThread,
  ChannelType.PublicThread,
  ChannelType.PrivateThread,
  ChannelType.GuildVoice,
  ChannelType.GuildStageVoice,
];

/**
 * The channels that are text-based.
 * - {@link DMChannel}
 * - {@link GuildTextBasedChannel}
 *
 * @typedef {DMChannel|GuildTextBasedChannel} TextBasedChannels
 */

/**
 * Data that resolves to give a text-based channel. This can be:
 * - A {@link TextBasedChannel}
 * - A {@link Snowflake}
 *
 * @typedef {TextBasedChannels|Snowflake} TextBasedChannelsResolvable
 */

/**
 * The types of channels that are text-based. The available types are:
 * - {@link ChannelType.DM}
 * - {@link ChannelType.GuildText}
 * - {@link ChannelType.GuildAnnouncement}
 * - {@link ChannelType.AnnouncementThread}
 * - {@link ChannelType.PublicThread}
 * - {@link ChannelType.PrivateThread}
 * - {@link ChannelType.GuildVoice}
 * - {@link ChannelType.GuildStageVoice}
 * - {@link ChannelType.GroupDM}
 *
 * @typedef {ChannelType[]} TextBasedChannelTypes
 */
exports.TextBasedChannelTypes = [...exports.GuildTextBasedChannelTypes, ChannelType.DM, ChannelType.GroupDM];

/**
 * The types of channels that are text-based and can have messages sent into. The available types are:
 * - {@link ChannelType.DM}
 * - {@link ChannelType.GuildText}
 * - {@link ChannelType.GuildAnnouncement}
 * - {@link ChannelType.AnnouncementThread}
 * - {@link ChannelType.PublicThread}
 * - {@link ChannelType.PrivateThread}
 * - {@link ChannelType.GuildVoice}
 * - {@link ChannelType.GuildStageVoice}
 *
 * @typedef {ChannelType[]} SendableChannels
 */
exports.SendableChannels = [...exports.GuildTextBasedChannelTypes, ChannelType.DM];

/**
 * The types of channels that are threads. The available types are:
 * - {@link ChannelType.AnnouncementThread}
 * - {@link ChannelType.PublicThread}
 * - {@link ChannelType.PrivateThread}
 *
 * @typedef {ChannelType[]} ThreadChannelTypes
 */
exports.ThreadChannelTypes = [ChannelType.AnnouncementThread, ChannelType.PublicThread, ChannelType.PrivateThread];

/**
 * The types of channels that are voice-based. The available types are:
 * - {@link ChannelType.GuildVoice}
 * - {@link ChannelType.GuildStageVoice}
 *
 * @typedef {ChannelType[]} VoiceBasedChannelTypes
 */
exports.VoiceBasedChannelTypes = [ChannelType.GuildVoice, ChannelType.GuildStageVoice];

/**
 * The types of select menus. The available types are:
 * - {@link ComponentType.StringSelect}
 * - {@link ComponentType.UserSelect}
 * - {@link ComponentType.RoleSelect}
 * - {@link ComponentType.MentionableSelect}
 * - {@link ComponentType.ChannelSelect}
 *
 * @typedef {ComponentType[]} SelectMenuTypes
 */
exports.SelectMenuTypes = [
  ComponentType.StringSelect,
  ComponentType.UserSelect,
  ComponentType.RoleSelect,
  ComponentType.MentionableSelect,
  ComponentType.ChannelSelect,
];

/**
 * The types of messages that cannot be deleted. The available types are:
 * - {@link MessageType.RecipientAdd}
 * - {@link MessageType.RecipientRemove}
 * - {@link MessageType.Call}
 * - {@link MessageType.ChannelNameChange}
 * - {@link MessageType.ChannelIconChange}
 * - {@link MessageType.ThreadStarterMessage}
 *
 * @typedef {MessageType[]} UndeletableMessageTypes
 */
exports.UndeletableMessageTypes = [
  MessageType.RecipientAdd,
  MessageType.RecipientRemove,
  MessageType.Call,
  MessageType.ChannelNameChange,
  MessageType.ChannelIconChange,
  MessageType.ThreadStarterMessage,
];

/**
 * A mapping between sticker formats and their respective image formats.
 * - {@link StickerFormatType.PNG} -> {@link ImageFormat.PNG}
 * - {@link StickerFormatType.APNG} -> {@link ImageFormat.PNG}
 * - {@link StickerFormatType.Lottie} -> {@link ImageFormat.Lottie}
 * - {@link StickerFormatType.GIF} -> {@link ImageFormat.GIF}
 *
 * @typedef {Object} StickerFormatExtensionMap
 * @property {"png"} 1 PNG
 * @property {"png"} 2 APNG
 * @property {"json"} 3 Lottie
 * @property {"gif"} 4 GIF
 */
exports.StickerFormatExtensionMap = {
  [StickerFormatType.PNG]: ImageFormat.PNG,
  [StickerFormatType.APNG]: ImageFormat.PNG,
  [StickerFormatType.Lottie]: ImageFormat.Lottie,
  [StickerFormatType.GIF]: ImageFormat.GIF,
};

/**
 * @typedef {Object} Constants Constants that can be used in an enum or object-like way.
 * @property {number} MaxBulkDeletableMessageAge Max bulk deletable message age
 * @property {SweeperKey[]} SweeperKeys The possible names of items that can be swept in sweepers
 * @property {NonSystemMessageTypes} NonSystemMessageTypes The types of messages that are not deemed a system type
 * @property {TextBasedChannelTypes} TextBasedChannelTypes The types of channels that are text-based
 * @property {ThreadChannelTypes} ThreadChannelTypes The types of channels that are threads
 * @property {VoiceBasedChannelTypes} VoiceBasedChannelTypes The types of channels that are voice-based
 * @property {SelectMenuTypes} SelectMenuTypes The types of components that are select menus.
 * @property {Object} StickerFormatExtensionMap A mapping between sticker formats and their respective image formats.
 */
