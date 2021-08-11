// These are enums that are used in the typings file but do not exist as actual exported values. To prevent them from
// showing up in an editor, they are imported from here instead of exporting them there directly.

export enum ActivityTypes {
  PLAYING = 0,
  STREAMING = 1,
  LISTENING = 2,
  WATCHING = 3,
  CUSTOM = 4,
  COMPETING = 5,
}

export enum ApplicationCommandTypes {
  CHAT_INPUT = 1,
  USER = 2,
  MESSAGE = 3,
}

export enum ApplicationCommandOptionTypes {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
  NUMBER = 10,
}

export enum ApplicationCommandPermissionTypes {
  ROLE = 1,
  USER = 2,
}

export enum ChannelTypes {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_NEWS = 5,
  GUILD_STORE = 6,
  UNKNOWN = 7,
  GUILD_NEWS_THREAD = 10,
  GUILD_PUBLIC_THREAD = 11,
  GUILD_PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13,
}

export enum DefaultMessageNotificationLevels {
  ALL_MESSAGES = 0,
  ONLY_MENTIONS = 1,
}

export enum ExplicitContentFilterLevels {
  DISABLED = 0,
  MEMBERS_WITHOUT_ROLES = 1,
  ALL_MEMBERS = 2,
}

export enum InteractionResponseTypes {
  PONG = 1,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
  DEFERRED_MESSAGE_UPDATE = 6,
  UPDATE_MESSAGE = 7,
}

export enum InteractionTypes {
  PING = 1,
  APPLICATION_COMMAND = 2,
  MESSAGE_COMPONENT = 3,
}

export enum InviteTargetType {
  STREAM = 1,
  EMBEDDED_APPLICATION = 2,
}

export enum MembershipStates {
  INVITED = 1,
  ACCEPTED = 2,
}

export enum MessageButtonStyles {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5,
}

export enum MessageComponentTypes {
  ACTION_ROW = 1,
  BUTTON = 2,
  SELECT_MENU = 3,
}

export enum MFALevels {
  NONE = 0,
  ELEVATED = 1,
}

export enum NSFWLevels {
  DEFAULT = 0,
  EXPLICIT = 1,
  SAFE = 2,
  AGE_RESTRICTED = 3,
}

export enum OverwriteTypes {
  role = 0,
  member = 1,
}

export enum PremiumTiers {
  NONE = 0,
  TIER_1 = 1,
  TIER_2 = 2,
  TIER_3 = 3,
}

export enum PrivacyLevels {
  PUBLIC = 1,
  GUILD_ONLY = 2,
}

export enum StickerFormatTypes {
  PNG = 1,
  APNG = 2,
  LOTTIE = 3,
}

export enum StickerTypes {
  STANDARD = 1,
  GUILD = 2,
}

export enum VerificationLevels {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4,
}

export enum WebhookTypes {
  Incoming = 1,
  'Channel Follower' = 2,
  Application = 3,
}
