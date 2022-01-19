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
} = require('discord-api-types/v9');

function unknownKeyStrategy(val) {
  throw new Error(`Could not resolve enum value for ${val}`);
}

class EnumResolvers extends null {
  /**
   * Resolves enum key to `ChannelType` enum value
   * @param {string|ChannelType} key The key to resolve
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
   * Resolves enum key to `InteractionType` enum value
   * @param {string|InteractionType} key The key to resolve
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
   * Resolves enum key to `ApplicationCommandType` enum value
   * @param {string|ApplicationCommandType} key The key to resolve
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
   * Resolves enum key to `ApplicationCommandOptionType` enum value
   * @param {string|ApplicationCommandOptionType} key The key to resolve
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
   * Resolves enum key to `ApplicationCommandPermissionType` enum value
   * @param {string|ApplicationCommandPermissionType} key The key to resolve
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
   * Resolves enum key to `ComponentType` enum value
   * @param {string|ComponentType} key The key to resolve
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
   * Resolves enum key to `ButtonStyle` enum value
   * @param {string|ButtonStyle} key The key to resolve
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
   * Resolves enum key to `MessageType` enum value
   * @param {string|MessageType} key The key to lookup
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
