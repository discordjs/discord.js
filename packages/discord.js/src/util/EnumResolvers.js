'use strict';

const {
  ApplicationCommandType,
  InteractionType,
  ComponentType,
  ButtonStyle,
  ApplicationCommandOptionType,
  ChannelType,
  ApplicationCommandPermissionType,
  MessageType,
  GuildNSFWLevel,
  GuildVerificationLevel,
  GuildDefaultMessageNotifications,
  GuildExplicitContentFilter,
  GuildPremiumTier,
  GuildScheduledEventStatus,
  StageInstancePrivacyLevel,
  GuildMFALevel,
  TeamMemberMembershipState,
  GuildScheduledEventEntityType,
  IntegrationExpireBehavior,
} = require('discord-api-types/v9');

function unknownKeyStrategy(val) {
  throw new Error(`Could not resolve enum value for ${val}`);
}

/**
 * Holds a bunch of methods to resolve enum values to readable strings.
 */
class EnumResolvers extends null {
  /**
   * A string that can be resolved to a {@link ChannelType} enum value. Here are the available types:
   * * GUILD_TEXT
   * * DM
   * * GUILD_VOICE
   * * GROUP_DM
   * * GUILD_CATEGORY
   * * GUILD_NEWS
   * * GUILD_NEWS_THREAD
   * * GUILD_PUBLIC_THREAD
   * * GUILD_PRIVATE_THREAD
   * * GUILD_STAGE_VOICE
   * @typedef {string} ChannelTypeEnumResolvable
   */

  /**
   * Resolves enum key to {@link ChannelType} enum value
   * @param {ChannelTypeEnumResolvable|ChannelType} key The key to resolve
   * @returns {ChannelType}
   */
  static resolveChannelType(key) {
    switch (key) {
      case 'GUILD_TEXT':
        return ChannelType.GuildText;
      case 'DM':
        return ChannelType.DM;
      case 'GUILD_VOICE':
        return ChannelType.GuildVoice;
      case 'GROUP_DM':
        return ChannelType.GroupDM;
      case 'GUILD_CATEGORY':
        return ChannelType.GuildCategory;
      case 'GUILD_NEWS':
        return ChannelType.GuildNews;
      case 'GUILD_NEWS_THREAD':
        return ChannelType.GuildNewsThread;
      case 'GUILD_PUBLIC_THREAD':
        return ChannelType.GuildPublicThread;
      case 'GUILD_PRIVATE_THREAD':
        return ChannelType.GuildPrivateThread;
      case 'GUILD_STAGE_VOICE':
        return ChannelType.GuildStageVoice;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to an {@link InteractionType} enum value. Here are the available types:
   * * PING
   * * APPLICATION_COMMAND
   * * MESSAGE_COMPONENT
   * * APPLICATION_COMMAND_AUTOCOMPLETE
   * @typedef {string} InteractionTypeEnumResolvable
   */

  /**
   * Resolves enum key to {@link InteractionType} enum value
   * @param {InteractionTypeEnumResolvable|InteractionType} key The key to resolve
   * @returns {InteractionType}
   */
  static resolveInteractionType(key) {
    switch (key) {
      case 'PING':
        return InteractionType.Ping;
      case 'APPLICATION_COMMAND':
        return InteractionType.ApplicationCommand;
      case 'MESSAGE_COMPONENT':
        return InteractionType.MessageComponent;
      case 'APPLICATION_COMMAND_AUTOCOMPLETE':
        return InteractionType.ApplicationCommandAutocomplete;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to an {@link ApplicationCommandType} enum value. Here are the available types:
   * * CHAT_INPUT
   * * USER
   * * MESSAGE
   * @typedef {string} ApplicationCommandTypeEnumResolvable
   */

  /**
   * Resolves enum key to {@link ApplicationCommandType} enum value
   * @param {ApplicationCommandTypeEnumResolvable|ApplicationCommandType} key The key to resolve
   * @returns {ApplicationCommandType}
   */
  static resolveApplicationCommandType(key) {
    switch (key) {
      case 'CHAT_INPUT':
        return ApplicationCommandType.ChatInput;
      case 'USER':
        return ApplicationCommandType.User;
      case 'MESSAGE':
        return ApplicationCommandType.Message;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to an {@link ApplicationCommandOptionType} enum value. Here are the available types:
   * * SUB_COMMAND
   * * SUB_COMMAND_GROUP
   * * STRING
   * * INTEGER
   * * BOOLEAN
   * * USER
   * * CHANNEL
   * * ROLE
   * * NUMBER
   * * MENTIONABLE
   * @typedef {string} ApplicationCommandOptionTypeEnumResolvable
   */

  /**
   * Resolves enum key to {@link ApplicationCommandOptionType} enum value
   * @param {ApplicationCommandOptionTypeEnumResolvable|ApplicationCommandOptionType} key The key to resolve
   * @returns {ApplicationCommandOptionType}
   */
  static resolveApplicationCommandOptionType(key) {
    switch (key) {
      case 'SUB_COMMAND':
        return ApplicationCommandOptionType.Subcommand;
      case 'SUB_COMMAND_GROUP':
        return ApplicationCommandOptionType.SubcommandGroup;
      case 'STRING':
        return ApplicationCommandOptionType.String;
      case 'INTEGER':
        return ApplicationCommandOptionType.Integer;
      case 'BOOLEAN':
        return ApplicationCommandOptionType.Boolean;
      case 'USER':
        return ApplicationCommandOptionType.User;
      case 'CHANNEL':
        return ApplicationCommandOptionType.Channel;
      case 'ROLE':
        return ApplicationCommandOptionType.Role;
      case 'NUMBER':
        return ApplicationCommandOptionType.Number;
      case 'MENTIONABLE':
        return ApplicationCommandOptionType.Mentionable;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to an {@link ApplicationCommandPermissionType} enum value.
   * Here are the available types:
   * * ROLE
   * * USER
   * @typedef {string} ApplicationCommandPermissionTypeEnumResolvable
   */

  /**
   * Resolves enum key to {@link ApplicationCommandPermissionType} enum value
   * @param {ApplicationCommandPermissionTypeEnumResolvable|ApplicationCommandPermissionType} key The key to resolve
   * @returns {ApplicationCommandPermissionType}
   */
  static resolveApplicationCommandPermissionType(key) {
    switch (key) {
      case 'ROLE':
        return ApplicationCommandPermissionType.Role;
      case 'USER':
        return ApplicationCommandPermissionType.User;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to a {@link ComponentType} enum value. Here are the available types:
   * * ACTION_ROW
   * * BUTTON
   * * SELECT_MENU
   * @typedef {string} ComponentTypeEnumResolvable
   */

  /**
   * Resolves enum key to {@link ComponentType} enum value
   * @param {ComponentTypeEnumResolvable|ComponentType} key The key to resolve
   * @returns {ComponentType}
   */
  static resolveComponentType(key) {
    switch (key) {
      case 'ACTION_ROW':
        return ComponentType.ActionRow;
      case 'BUTTON':
        return ComponentType.Button;
      case 'SELECT_MENU':
        return ComponentType.SelectMenu;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to a {@link ButtonStyle} enum value. Here are the available types:
   * * PRIMARY
   * * SECONDARY
   * * SUCCESS
   * * DANGER
   * * LINK
   * @typedef {string} ButtonStyleEnumResolvable
   */

  /**
   * Resolves enum key to {@link ButtonStyle} enum value
   * @param {ButtonStyleEnumResolvable|ButtonStyle} key The key to resolve
   * @returns {ButtonStyle}
   */
  static resolveButtonStyle(key) {
    switch (key) {
      case 'PRIMARY':
        return ButtonStyle.Primary;
      case 'SECONDARY':
        return ButtonStyle.Secondary;
      case 'SUCCESS':
        return ButtonStyle.Success;
      case 'DANGER':
        return ButtonStyle.Danger;
      case 'LINK':
        return ButtonStyle.Link;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to a {@link MessageType} enum value. Here are the available types:
   * * DEFAULT
   * * RECIPIENT_ADD
   * * RECIPIENT_REMOVE
   * * CALL
   * * CHANNEL_NAME_CHANGE
   * * CHANNEL_ICON_CHANGE
   * * CHANNEL_PINNED_MESSAGE
   * * GUILD_MEMBER_JOIN
   * * USER_PREMIUM_GUILD_SUBSCRIPTION
   * * USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1
   * * USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2
   * * USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3
   * * CHANNEL_FOLLOW_ADD
   * * GUILD_DISCOVERY_DISQUALIFIED
   * * GUILD_DISCOVERY_REQUALIFIED
   * * GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING
   * * GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING
   * * THREAD_CREATED
   * * REPLY
   * * CHAT_INPUT_COMMAND
   * * THREAD_STARTER_MESSAGE
   * * GUILD_INVITE_REMINDER
   * * CONTEXT_MENU_COMMAND
   * @typedef {string} MessageTypeEnumResolvable
   */

  /**
   * Resolves enum key to {@link MessageType} enum value
   * @param {MessageTypeEnumResolvable|MessageType} key The key to lookup
   * @returns {MessageType}
   */
  static resolveMessageType(key) {
    switch (key) {
      case 'DEFAULT':
        return MessageType.Default;
      case 'RECIPIENT_ADD':
        return MessageType.RecipientAdd;
      case 'RECIPIENT_REMOVE':
        return MessageType.RecipientRemove;
      case 'CALL':
        return MessageType.Call;
      case 'CHANNEL_NAME_CHANGE':
        return MessageType.ChannelNameChange;
      case 'CHANNEL_ICON_CHANGE':
        return MessageType.ChannelIconChange;
      case 'CHANNEL_PINNED_MESSAGE':
        return MessageType.ChannelPinnedMessage;
      case 'GUILD_MEMBER_JOIN':
        return MessageType.GuildMemberJoin;
      case 'USER_PREMIUM_GUILD_SUBSCRIPTION':
        return MessageType.UserPremiumGuildSubscription;
      case 'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1':
        return MessageType.UserPremiumGuildSubscriptionTier1;
      case 'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2':
        return MessageType.UserPremiumGuildSubscriptionTier2;
      case 'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3':
        return MessageType.UserPremiumGuildSubscriptionTier3;
      case 'CHANNEL_FOLLOW_ADD':
        return MessageType.ChannelFollowAdd;
      case 'GUILD_DISCOVERY_DISQUALIFIED':
        return MessageType.GuildDiscoveryDisqualified;
      case 'GUILD_DISCOVERY_REQUALIFIED':
        return MessageType.GuildDiscoveryRequalified;
      case 'GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING':
        return MessageType.GuildDiscoveryGracePeriodInitialWarning;
      case 'GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING':
        return MessageType.GuildDiscoveryGracePeriodFinalWarning;
      case 'THREAD_CREATED':
        return MessageType.ThreadCreated;
      case 'REPLY':
        return MessageType.Reply;
      case 'CHAT_INPUT_COMMAND':
        return MessageType.ChatInputCommand;
      case 'THREAD_STARTER_MESSAGE':
        return MessageType.ThreadStarterMessage;
      case 'GUILD_INVITE_REMINDER':
        return MessageType.GuildInviteReminder;
      case 'CONTEXT_MENU_COMMAND':
        return MessageType.ContextMenuCommand;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to a {@link GuildNSFWLevel} enum value. Here are the available types:
   * * DEFAULT
   * * EXPLICIT
   * * SAFE
   * * AGE_RESTRICTED
   * @typedef {string} GuildNSFWLevelEnumResolvable
   */

  /**
   * Resolves enum key to {@link GuildNSFWLevel} enum value
   * @param {GuildNSFWLevelEnumResolvable|GuildNSFWLevel} key The key to lookup
   * @returns {GuildNSFWLevel}
   */
  static resolveGuildNSFWLevel(key) {
    switch (key) {
      case 'DEFAULT':
        return GuildNSFWLevel.Default;
      case 'EXPLICIT':
        return GuildNSFWLevel.Explicit;
      case 'SAFE':
        return GuildNSFWLevel.Safe;
      case 'AGE_RESTRICTED':
        return GuildNSFWLevel.AgeRestricted;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to a {@link GuildVerificationLevel} enum value. Here are the available types:
   * * NONE
   * * LOW
   * * MEDIUM
   * * HIGH
   * * VERY_HIGH
   * @typedef {string} GuildVerificationLevelEnumResolvable
   */

  /**
   * Resolves enum key to {@link GuildVerificationLevel} enum value
   * @param {GuildVerificationLevelEnumResolvable|GuildVerificationLevel} key The key to lookup
   * @returns {GuildVerificationLevel}
   */
  static resolveGuildVerificationLevel(key) {
    switch (key) {
      case 'NONE':
        return GuildVerificationLevel.None;
      case 'LOW':
        return GuildVerificationLevel.Low;
      case 'MEDIUM':
        return GuildVerificationLevel.Medium;
      case 'HIGH':
        return GuildVerificationLevel.High;
      case 'VERY_HIGH':
        return GuildVerificationLevel.VeryHigh;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to a {@link GuildDefaultMessageNotifications} enum value.
   * Here are the available types:
   * * ALL_MESSAGES
   * * ONLY_MENTIONS
   * @typedef {string} GuildDefaultMessageNotificationsEnumResolvable
   */

  /**
   * Resolves enum key to {@link GuildDefaultMessageNotifications} enum value
   * @param {GuildDefaultMessageNotificationsEnumResolvable|GuildDefaultMessageNotifications} key The key to lookup
   * @returns {GuildDefaultMessageNotifications}
   */
  static resolveGuildDefaultMessageNotifications(key) {
    switch (key) {
      case 'ALL_MESSAGES':
        return GuildDefaultMessageNotifications.AllMessages;
      case 'ONLY_MENTIONS':
        return GuildDefaultMessageNotifications.OnlyMentions;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to a {@link GuildExplicitContentFilter} enum value. Here are the available types:
   * * DISABLED
   * * MEMBERS_WITHOUT_ROLES
   * * ALL_MEMBERS
   * @typedef {string} GuildExplicitContentFilterEnumResolvable
   */

  /**
   * Resolves enum key to {@link GuildExplicitContentFilter} enum value
   * @param {GuildExplicitContentFilterEnumResolvable|GuildExplicitContentFilter} key The key to lookup
   * @returns {GuildExplicitContentFilter}
   */
  static resolveGuildExplicitContentFilter(key) {
    switch (key) {
      case 'DISABLED':
        return GuildExplicitContentFilter.Disabled;
      case 'MEMBERS_WITHOUT_ROLES':
        return GuildExplicitContentFilter.MembersWithoutRoles;
      case 'ALL_MEMBERS':
        return GuildExplicitContentFilter.AllMembers;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to a {@link GuildPremiumTier} enum value. Here are the available types:
   * * NONE
   * * TIER_1
   * * TIER_2
   * * TIER_3
   * @typedef {string} GuildPremiumTierEnumResolvable
   */

  /**
   * Resolves enum key to {@link GuildPremiumTier} enum value
   * @param {GuildPremiumTierEnumResolvable|GuildPremiumTier} key The key to lookup
   * @returns {GuildPremiumTier}
   */
  static resolveGuildPremiumTier(key) {
    switch (key) {
      case 'NONE':
        return GuildPremiumTier.None;
      case 'TIER_1':
        return GuildPremiumTier.Tier1;
      case 'TIER_2':
        return GuildPremiumTier.Tier2;
      case 'TIER_3':
        return GuildPremiumTier.Tier3;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to a {@link GuildScheduledEventStatus} enum value. Here are the available types:
   * * SCHEDULED
   * * ACTIVE
   * * COMPLETED
   * * CANCELED
   * @typedef {string} GuildScheduledEventStatusEnumResolvable
   */

  /**
   * Resolves enum key to {@link GuildScheduledEventStatus} enum value
   * @param {GuildScheduledEventStatusEnumResolvable|GuildScheduledEventStatus} key The key to lookup
   * @returns {GuildScheduledEventStatus}
   */
  static resolveGuildScheduledEventStatus(key) {
    switch (key) {
      case 'SCHEDULED':
        return GuildScheduledEventStatus.Scheduled;
      case 'ACTIVE':
        return GuildScheduledEventStatus.Active;
      case 'COMPLETED':
        return GuildScheduledEventStatus.Completed;
      case 'CANCELED':
        return GuildScheduledEventStatus.Canceled;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to a {@link StageInstancePrivacyLevel} enum value. Here are the available types:
   * * PUBLIC
   * * GUILD_ONLY
   * @typedef {string} StageInstancePrivacyLevelEnumResolvable
   */

  /**
   * Resolves enum key to {@link StageInstancePrivacyLevel} enum value
   * @param {StageInstancePrivacyLevelEnumResolvable|StageInstancePrivacyLevel} key The key to lookup
   * @returns {StageInstancePrivacyLevel}
   */
  static resolveStageInstancePrivacyLevel(key) {
    switch (key) {
      case 'PUBLIC':
        return StageInstancePrivacyLevel.Public;
      case 'GUILD_ONLY':
        return StageInstancePrivacyLevel.GuildOnly;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to a {@link GuildMFALevel} enum value. Here are the available types:
   * * NONE
   * * ELEVATED
   * @typedef {string} GuildMFALevelEnumResolvable
   */

  /**
   * Resolves enum key to {@link GuildMFALevel} enum value
   * @param {GuildMFALevelEnumResolvable|GuildMFALevel} key The key to lookup
   * @returns {GuildMFALevel}
   */
  static resolveGuildMFALevel(key) {
    switch (key) {
      case 'NONE':
        return GuildMFALevel.None;
      case 'ELEVATED':
        return GuildMFALevel.Elevated;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to a {@link TeamMemberMembershipState} enum value. Here are the available types:
   * * INVITED
   * * ACCEPTED
   * @typedef {string} TeamMemberMembershipStateEnumResolvable
   */

  /**
   * Resolves enum key to {@link TeamMemberMembershipState} enum value
   * @param {TeamMemberMembershipStateEnumResolvable|TeamMemberMembershipState} key The key to lookup
   * @returns {TeamMemberMembershipState}
   */
  static resolveTeamMemberMembershipState(key) {
    switch (key) {
      case 'INVITED':
        return TeamMemberMembershipState.Invited;
      case 'ACCEPTED':
        return TeamMemberMembershipState.Accepted;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to a {@link GuildScheduledEventEntityType} enum value. Here are the available types:
   * * STAGE_INSTANCE
   * * VOICE
   * * EXTERNAL
   * @typedef {string} GuildScheduledEventEntityTypeEnumResolvable
   */

  /**
   * Resolves enum key to {@link GuildScheduledEventEntityType} enum value
   * @param {GuildScheduledEventEntityTypeEnumResolvable|GuildScheduledEventEntityType} key The key to lookup
   * @returns {GuildScheduledEventEntityType}
   */
  static resolveGuildScheduledEventEntityType(key) {
    switch (key) {
      case 'STAGE_INSTANCE':
        return GuildScheduledEventEntityType.StageInstance;
      case 'VOICE':
        return GuildScheduledEventEntityType.Voice;
      case 'EXTERNAL':
        return GuildScheduledEventEntityType.External;
      default:
        return unknownKeyStrategy(key);
    }
  }

  /**
   * A string that can be resolved to a {@link IntegrationExpireBehavior} enum value. Here are the available types:
   * * REMOVE_ROLE
   * * KICK
   * @typedef {string} IntegrationExpireBehaviorEnumResolvable
   */

  /**
   * Resolves enum key to {@link IntegrationExpireBehavior} enum value
   * @param {IntegrationExpireBehaviorEnumResolvable|IntegrationExpireBehavior} key The key to lookup
   * @returns {IntegrationExpireBehavior}
   */
  static resolveIntegrationExpireBehavior(key) {
    switch (key) {
      case 'REMOVE_ROLE':
        return IntegrationExpireBehavior.RemoveRole;
      case 'KICK':
        return IntegrationExpireBehavior.Kick;
      default:
        return unknownKeyStrategy(key);
    }
  }
}

// Precondition logic wrapper
function preconditioner(func) {
  return key => {
    if (typeof key !== 'string' && typeof key !== 'number') {
      throw new Error('Enum value must be string or number');
    }

    if (typeof key === 'number') {
      return key;
    }

    return func(key);
  };
}

// Injects wrapper into class static methods.
function applyPreconditioner(obj) {
  for (const name in Object.getOwnPropertyNames(obj)) {
    if (typeof obj[name] !== 'function') {
      return;
    }

    obj[name] = preconditioner(obj[name]);
  }
}

// Apply precondition logic
applyPreconditioner(EnumResolvers);

module.exports = EnumResolvers;
