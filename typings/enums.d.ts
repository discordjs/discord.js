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
}

export enum ApplicationCommandPermissionTypes {
  ROLE = 1,
  USER = 2,
}

export enum ChannelType {
  text = 0,
  dm = 1,
  voice = 2,
  group = 3,
  category = 4,
  news = 5,
  store = 6,
  unknown = 7,
  news_thread = 10,
  public_thread = 11,
  private_thread = 12,
  stage = 13,
}

export enum ChannelTypes {
  TEXT = 0,
  DM = 1,
  VOICE = 2,
  GROUP = 3,
  CATEGORY = 4,
  NEWS = 5,
  STORE = 6,
  NEWS_THREAD = 10,
  PUBLIC_THREAD = 11,
  PRIVATE_THREAD = 12,
  STAGE = 13,
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
}
