'use strict';

const { polyfillDispose } = require('@discordjs/util');
const { __exportStar } = require('tslib');

polyfillDispose();

// "Root" classes (starting points)
exports.BaseClient = require('./client/BaseClient').BaseClient;
exports.Client = require('./client/Client').Client;
exports.Shard = require('./sharding/Shard').Shard;
exports.ShardClientUtil = require('./sharding/ShardClientUtil').ShardClientUtil;
exports.ShardingManager = require('./sharding/ShardingManager').ShardingManager;
exports.WebhookClient = require('./client/WebhookClient').WebhookClient;

// Errors
exports.DiscordjsError = require('./errors/DJSError').DiscordjsError;
exports.DiscordjsTypeError = require('./errors/DJSError').DiscordjsTypeError;
exports.DiscordjsRangeError = require('./errors/DJSError').DiscordjsRangeError;
exports.DiscordjsErrorCodes = require('./errors/ErrorCodes').ErrorCodes;

// Utilities
exports.ActivityFlagsBitField = require('./util/ActivityFlagsBitField').ActivityFlagsBitField;
exports.ApplicationFlagsBitField = require('./util/ApplicationFlagsBitField').ApplicationFlagsBitField;
exports.AttachmentFlagsBitField = require('./util/AttachmentFlagsBitField').AttachmentFlagsBitField;
exports.BaseManager = require('./managers/BaseManager').BaseManager;
exports.BitField = require('./util/BitField').BitField;
exports.ChannelFlagsBitField = require('./util/ChannelFlagsBitField').ChannelFlagsBitField;
exports.Collection = require('@discordjs/collection').Collection;
exports.Colors = require('./util/Colors').Colors;
exports.Constants = require('./util/Constants');
exports.Events = require('./util/Events').Events;
exports.GuildMemberFlagsBitField = require('./util/GuildMemberFlagsBitField').GuildMemberFlagsBitField;
exports.IntentsBitField = require('./util/IntentsBitField').IntentsBitField;
exports.LimitedCollection = require('./util/LimitedCollection').LimitedCollection;
exports.MessageFlagsBitField = require('./util/MessageFlagsBitField').MessageFlagsBitField;
exports.Options = require('./util/Options').Options;
exports.Partials = require('./util/Partials').Partials;
exports.PermissionsBitField = require('./util/PermissionsBitField').PermissionsBitField;
exports.RoleFlagsBitField = require('./util/RoleFlagsBitField').RoleFlagsBitField;
exports.ShardEvents = require('./util/ShardEvents').ShardEvents;
exports.SKUFlagsBitField = require('./util/SKUFlagsBitField').SKUFlagsBitField;
exports.SnowflakeUtil = require('@sapphire/snowflake').DiscordSnowflake;
exports.Status = require('./util/Status').Status;
exports.Sweepers = require('./util/Sweepers').Sweepers;
exports.SystemChannelFlagsBitField = require('./util/SystemChannelFlagsBitField').SystemChannelFlagsBitField;
exports.ThreadMemberFlagsBitField = require('./util/ThreadMemberFlagsBitField').ThreadMemberFlagsBitField;
exports.UserFlagsBitField = require('./util/UserFlagsBitField').UserFlagsBitField;

__exportStar(require('./util/DataResolver.js'), exports);
__exportStar(require('./util/Util.js'), exports);

exports.version = require('../package.json').version;

// Managers
exports.ApplicationCommandManager = require('./managers/ApplicationCommandManager').ApplicationCommandManager;
exports.ApplicationCommandPermissionsManager =
  require('./managers/ApplicationCommandPermissionsManager').ApplicationCommandPermissionsManager;
exports.ApplicationEmojiManager = require('./managers/ApplicationEmojiManager').ApplicationEmojiManager;
exports.AutoModerationRuleManager = require('./managers/AutoModerationRuleManager').AutoModerationRuleManager;
exports.BaseGuildEmojiManager = require('./managers/BaseGuildEmojiManager').BaseGuildEmojiManager;
exports.CachedManager = require('./managers/CachedManager').CachedManager;
exports.ChannelManager = require('./managers/ChannelManager').ChannelManager;
exports.ClientVoiceManager = require('./client/voice/ClientVoiceManager').ClientVoiceManager;
exports.DataManager = require('./managers/DataManager').DataManager;
exports.DMMessageManager = require('./managers/DMMessageManager').DMMessageManager;
exports.EntitlementManager = require('./managers/EntitlementManager').EntitlementManager;
exports.GuildApplicationCommandManager =
  require('./managers/GuildApplicationCommandManager').GuildApplicationCommandManager;
exports.GuildBanManager = require('./managers/GuildBanManager').GuildBanManager;
exports.GuildChannelManager = require('./managers/GuildChannelManager').GuildChannelManager;
exports.GuildEmojiManager = require('./managers/GuildEmojiManager').GuildEmojiManager;
exports.GuildEmojiRoleManager = require('./managers/GuildEmojiRoleManager').GuildEmojiRoleManager;
exports.GuildForumThreadManager = require('./managers/GuildForumThreadManager').GuildForumThreadManager;
exports.GuildInviteManager = require('./managers/GuildInviteManager').GuildInviteManager;
exports.GuildManager = require('./managers/GuildManager').GuildManager;
exports.GuildMemberManager = require('./managers/GuildMemberManager').GuildMemberManager;
exports.GuildMemberRoleManager = require('./managers/GuildMemberRoleManager').GuildMemberRoleManager;
exports.GuildMessageManager = require('./managers/GuildMessageManager').GuildMessageManager;
exports.GuildScheduledEventManager = require('./managers/GuildScheduledEventManager').GuildScheduledEventManager;
exports.GuildStickerManager = require('./managers/GuildStickerManager').GuildStickerManager;
exports.GuildTextThreadManager = require('./managers/GuildTextThreadManager').GuildTextThreadManager;
exports.MessageManager = require('./managers/MessageManager').MessageManager;
exports.PermissionOverwriteManager = require('./managers/PermissionOverwriteManager').PermissionOverwriteManager;
exports.PresenceManager = require('./managers/PresenceManager').PresenceManager;
exports.ReactionManager = require('./managers/ReactionManager').ReactionManager;
exports.ReactionUserManager = require('./managers/ReactionUserManager').ReactionUserManager;
exports.RoleManager = require('./managers/RoleManager').RoleManager;
exports.StageInstanceManager = require('./managers/StageInstanceManager').StageInstanceManager;
exports.SubscriptionManager = require('./managers/SubscriptionManager').SubscriptionManager;
exports.ThreadManager = require('./managers/ThreadManager').ThreadManager;
exports.ThreadMemberManager = require('./managers/ThreadMemberManager').ThreadMemberManager;
exports.UserManager = require('./managers/UserManager').UserManager;
exports.VoiceStateManager = require('./managers/VoiceStateManager').VoiceStateManager;

// Structures
exports.ActionRow = require('./structures/ActionRow').ActionRow;
exports.ActionRowBuilder = require('./structures/ActionRowBuilder').ActionRowBuilder;
exports.Activity = require('./structures/Presence').Activity;
exports.AnnouncementChannel = require('./structures/AnnouncementChannel.js').AnnouncementChannel;
exports.AnonymousGuild = require('./structures/AnonymousGuild').AnonymousGuild;
exports.Application = require('./structures/interfaces/Application').Application;
exports.ApplicationCommand = require('./structures/ApplicationCommand').ApplicationCommand;
exports.ApplicationEmoji = require('./structures/ApplicationEmoji').ApplicationEmoji;
exports.ApplicationRoleConnectionMetadata =
  require('./structures/ApplicationRoleConnectionMetadata').ApplicationRoleConnectionMetadata;
exports.Attachment = require('./structures/Attachment').Attachment;
exports.AttachmentBuilder = require('./structures/AttachmentBuilder').AttachmentBuilder;
exports.AutocompleteInteraction = require('./structures/AutocompleteInteraction').AutocompleteInteraction;
exports.AutoModerationActionExecution =
  require('./structures/AutoModerationActionExecution').AutoModerationActionExecution;
exports.AutoModerationRule = require('./structures/AutoModerationRule').AutoModerationRule;
exports.Base = require('./structures/Base').Base;
exports.BaseChannel = require('./structures/BaseChannel').BaseChannel;
exports.BaseGuild = require('./structures/BaseGuild').BaseGuild;
exports.BaseGuildEmoji = require('./structures/BaseGuildEmoji').BaseGuildEmoji;
exports.BaseGuildTextChannel = require('./structures/BaseGuildTextChannel').BaseGuildTextChannel;
exports.BaseGuildVoiceChannel = require('./structures/BaseGuildVoiceChannel').BaseGuildVoiceChannel;
exports.BaseInteraction = require('./structures/BaseInteraction').BaseInteraction;
exports.BaseSelectMenuComponent = require('./structures/BaseSelectMenuComponent').BaseSelectMenuComponent;
exports.ButtonBuilder = require('./structures/ButtonBuilder').ButtonBuilder;
exports.ButtonComponent = require('./structures/ButtonComponent').ButtonComponent;
exports.ButtonInteraction = require('./structures/ButtonInteraction').ButtonInteraction;
exports.CategoryChannel = require('./structures/CategoryChannel').CategoryChannel;
exports.ChannelSelectMenuBuilder = require('./structures/ChannelSelectMenuBuilder').ChannelSelectMenuBuilder;
exports.ChannelSelectMenuComponent = require('./structures/ChannelSelectMenuComponent').ChannelSelectMenuComponent;
exports.ChannelSelectMenuInteraction =
  require('./structures/ChannelSelectMenuInteraction').ChannelSelectMenuInteraction;
exports.ChatInputCommandInteraction = require('./structures/ChatInputCommandInteraction').ChatInputCommandInteraction;
exports.ClientApplication = require('./structures/ClientApplication').ClientApplication;
exports.ClientPresence = require('./structures/ClientPresence').ClientPresence;
exports.ClientUser = require('./structures/ClientUser').ClientUser;
exports.Collector = require('./structures/interfaces/Collector').Collector;
exports.CommandInteraction = require('./structures/CommandInteraction').CommandInteraction;
exports.CommandInteractionOptionResolver =
  require('./structures/CommandInteractionOptionResolver').CommandInteractionOptionResolver;
exports.Component = require('./structures/Component').Component;
exports.ContextMenuCommandInteraction =
  require('./structures/ContextMenuCommandInteraction').ContextMenuCommandInteraction;
exports.DMChannel = require('./structures/DMChannel').DMChannel;
exports.Embed = require('./structures/Embed').Embed;
exports.EmbedBuilder = require('./structures/EmbedBuilder').EmbedBuilder;
exports.Emoji = require('./structures/Emoji').Emoji;
exports.Entitlement = require('./structures/Entitlement').Entitlement;
exports.ForumChannel = require('./structures/ForumChannel').ForumChannel;
exports.Guild = require('./structures/Guild').Guild;
exports.GuildAuditLogs = require('./structures/GuildAuditLogs').GuildAuditLogs;
exports.GuildAuditLogsEntry = require('./structures/GuildAuditLogsEntry').GuildAuditLogsEntry;
exports.GuildBan = require('./structures/GuildBan').GuildBan;
exports.GuildChannel = require('./structures/GuildChannel').GuildChannel;
exports.GuildEmoji = require('./structures/GuildEmoji').GuildEmoji;
exports.GuildMember = require('./structures/GuildMember').GuildMember;
exports.GuildOnboarding = require('./structures/GuildOnboarding').GuildOnboarding;
exports.GuildOnboardingPrompt = require('./structures/GuildOnboardingPrompt').GuildOnboardingPrompt;
exports.GuildOnboardingPromptOption = require('./structures/GuildOnboardingPromptOption').GuildOnboardingPromptOption;
exports.GuildPreview = require('./structures/GuildPreview').GuildPreview;
exports.GuildPreviewEmoji = require('./structures/GuildPreviewEmoji').GuildPreviewEmoji;
exports.GuildScheduledEvent = require('./structures/GuildScheduledEvent').GuildScheduledEvent;
exports.GuildTemplate = require('./structures/GuildTemplate').GuildTemplate;
exports.Integration = require('./structures/Integration').Integration;
exports.IntegrationApplication = require('./structures/IntegrationApplication').IntegrationApplication;
exports.InteractionCallback = require('./structures/InteractionCallback').InteractionCallback;
exports.InteractionCallbackResource = require('./structures/InteractionCallbackResource').InteractionCallbackResource;
exports.InteractionCallbackResponse = require('./structures/InteractionCallbackResponse').InteractionCallbackResponse;
exports.InteractionCollector = require('./structures/InteractionCollector').InteractionCollector;
exports.InteractionWebhook = require('./structures/InteractionWebhook').InteractionWebhook;
exports.Invite = require('./structures/Invite').Invite;
exports.InviteGuild = require('./structures/InviteGuild').InviteGuild;
exports.MediaChannel = require('./structures/MediaChannel').MediaChannel;
exports.MentionableSelectMenuBuilder =
  require('./structures/MentionableSelectMenuBuilder').MentionableSelectMenuBuilder;
exports.MentionableSelectMenuComponent =
  require('./structures/MentionableSelectMenuComponent').MentionableSelectMenuComponent;
exports.MentionableSelectMenuInteraction =
  require('./structures/MentionableSelectMenuInteraction').MentionableSelectMenuInteraction;
exports.MentionableSelectMenuInteraction =
  require('./structures/MentionableSelectMenuInteraction').MentionableSelectMenuInteraction;
exports.Message = require('./structures/Message').Message;
exports.MessageCollector = require('./structures/MessageCollector').MessageCollector;
exports.MessageComponentInteraction = require('./structures/MessageComponentInteraction').MessageComponentInteraction;
exports.MessageContextMenuCommandInteraction =
  require('./structures/MessageContextMenuCommandInteraction').MessageContextMenuCommandInteraction;
exports.MessageMentions = require('./structures/MessageMentions').MessageMentions;
exports.MessagePayload = require('./structures/MessagePayload').MessagePayload;
exports.MessageReaction = require('./structures/MessageReaction').MessageReaction;
exports.ModalBuilder = require('./structures/ModalBuilder').ModalBuilder;
exports.ModalSubmitFields = require('./structures/ModalSubmitFields').ModalSubmitFields;
exports.ModalSubmitInteraction = require('./structures/ModalSubmitInteraction').ModalSubmitInteraction;
exports.OAuth2Guild = require('./structures/OAuth2Guild').OAuth2Guild;
exports.PartialGroupDMChannel = require('./structures/PartialGroupDMChannel').PartialGroupDMChannel;
exports.PermissionOverwrites = require('./structures/PermissionOverwrites').PermissionOverwrites;
exports.Poll = require('./structures/Poll').Poll;
exports.PollAnswer = require('./structures/PollAnswer').PollAnswer;
exports.Presence = require('./structures/Presence').Presence;
exports.ReactionCollector = require('./structures/ReactionCollector').ReactionCollector;
exports.ReactionEmoji = require('./structures/ReactionEmoji').ReactionEmoji;
exports.RichPresenceAssets = require('./structures/Presence').RichPresenceAssets;
exports.Role = require('./structures/Role').Role;
exports.RoleSelectMenuBuilder = require('./structures/RoleSelectMenuBuilder').RoleSelectMenuBuilder;
exports.RoleSelectMenuComponent = require('./structures/RoleSelectMenuComponent').RoleSelectMenuComponent;
exports.RoleSelectMenuInteraction = require('./structures/RoleSelectMenuInteraction').RoleSelectMenuInteraction;
exports.SKU = require('./structures/SKU').SKU;
exports.StageChannel = require('./structures/StageChannel').StageChannel;
exports.StageInstance = require('./structures/StageInstance').StageInstance;
exports.Sticker = require('./structures/Sticker').Sticker;
exports.StickerPack = require('./structures/StickerPack').StickerPack;
exports.StringSelectMenuBuilder = require('./structures/StringSelectMenuBuilder').StringSelectMenuBuilder;
exports.StringSelectMenuComponent = require('./structures/StringSelectMenuComponent').StringSelectMenuComponent;
exports.StringSelectMenuInteraction = require('./structures/StringSelectMenuInteraction').StringSelectMenuInteraction;
exports.StringSelectMenuOptionBuilder =
  require('./structures/StringSelectMenuOptionBuilder').StringSelectMenuOptionBuilder;
exports.Subscription = require('./structures/Subscription').Subscription;
exports.Team = require('./structures/Team').Team;
exports.TeamMember = require('./structures/TeamMember').TeamMember;
exports.TextChannel = require('./structures/TextChannel').TextChannel;
exports.TextInputBuilder = require('./structures/TextInputBuilder').TextInputBuilder;
exports.TextInputComponent = require('./structures/TextInputComponent').TextInputComponent;
exports.ThreadChannel = require('./structures/ThreadChannel').ThreadChannel;
exports.ThreadMember = require('./structures/ThreadMember').ThreadMember;
exports.ThreadOnlyChannel = require('./structures/ThreadOnlyChannel').ThreadOnlyChannel;
exports.Typing = require('./structures/Typing').Typing;
exports.User = require('./structures/User').User;
exports.UserContextMenuCommandInteraction =
  require('./structures/UserContextMenuCommandInteraction').UserContextMenuCommandInteraction;
exports.UserSelectMenuBuilder = require('./structures/UserSelectMenuBuilder').UserSelectMenuBuilder;
exports.UserSelectMenuComponent = require('./structures/UserSelectMenuComponent').UserSelectMenuComponent;
exports.UserSelectMenuInteraction = require('./structures/UserSelectMenuInteraction').UserSelectMenuInteraction;
exports.VoiceChannel = require('./structures/VoiceChannel').VoiceChannel;
exports.VoiceChannelEffect = require('./structures/VoiceChannelEffect').VoiceChannelEffect;
exports.VoiceRegion = require('./structures/VoiceRegion').VoiceRegion;
exports.VoiceState = require('./structures/VoiceState').VoiceState;
exports.Webhook = require('./structures/Webhook').Webhook;
exports.WelcomeChannel = require('./structures/WelcomeChannel').WelcomeChannel;
exports.WelcomeScreen = require('./structures/WelcomeScreen').WelcomeScreen;
exports.Widget = require('./structures/Widget').Widget;
exports.WidgetMember = require('./structures/WidgetMember').WidgetMember;

// External
__exportStar(require('discord-api-types/v10'), exports);
__exportStar(require('@discordjs/builders'), exports);
__exportStar(require('@discordjs/formatters'), exports);
__exportStar(require('@discordjs/rest'), exports);
__exportStar(require('@discordjs/util'), exports);
__exportStar(require('@discordjs/ws'), exports);
