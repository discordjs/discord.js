const Util = require('./util/Util');

class Index {

  constructor() {
    // "Root" classes (starting points)
    this.BaseClient = require('./client/BaseClient');
    this.Client = require('./client/Client');
    this.Shard = require('./sharding/Shard');
    this.ShardClientUtil = require('./sharding/ShardClientUtil');
    this.ShardingManager = require('./sharding/ShardingManager');
    this.WebhookClient = require('./client/WebhookClient');

    // Utilities
    this.Collection = require('./util/Collection');
    this.Constants = require('./util/Constants');
    this.DataResolver = require('./util/DataResolver');
    this.DataStore = require('./stores/DataStore');
    this.DiscordAPIError = require('./rest/DiscordAPIError');
    this.Permissions = require('./util/Permissions');
    this.Snowflake = require('./util/Snowflake');
    this.SnowflakeUtil = require('./util/Snowflake');
    this.Util = Util;
    this.util = this.Util;
    this.version = require('../package.json').version;

    // Stores
    this.ChannelStore = require('./stores/ChannelStore');
    this.ClientPresenceStore = require('./stores/ClientPresenceStore');
    this.EmojiStore = require('./stores/EmojiStore');
    this.GuildChannelStore = require('./stores/GuildChannelStore');
    this.GuildMemberStore = require('./stores/GuildMemberStore');
    this.GuildStore = require('./stores/GuildStore');
    this.ReactionUserStore = require('./stores/ReactionUserStore');
    this.MessageStore = require('./stores/MessageStore');
    this.PresenceStore = require('./stores/PresenceStore');
    this.RoleStore = require('./stores/RoleStore');
    this.UserStore = require('./stores/UserStore');

    // Shortcuts to Util methods
    this.escapeMarkdown = Util.escapeMarkdown;
    this.fetchRecommendedShards = Util.fetchRecommendedShards;
    this.splitMessage = Util.splitMessage;

    // Structures
    this.Base = require('./structures/Base');
    this.Activity = require('./structures/Presence').Activity;
    this.CategoryChannel = require('./structures/CategoryChannel');
    this.Channel = require('./structures/Channel');
    this.ClientApplication = require('./structures/ClientApplication');
    this.ClientUser = require('./structures/ClientUser');
    this.ClientUserChannelOverride = require('./structures/ClientUserChannelOverride');
    this.ClientUserGuildSettings = require('./structures/ClientUserGuildSettings');
    this.ClientUserSettings = require('./structures/ClientUserSettings');
    this.Collector = require('./structures/interfaces/Collector');
    this.DMChannel = require('./structures/DMChannel');
    this.Emoji = require('./structures/Emoji');
    this.GroupDMChannel = require('./structures/GroupDMChannel');
    this.Guild = require('./structures/Guild');
    this.GuildAuditLogs = require('./structures/GuildAuditLogs');
    this.GuildChannel = require('./structures/GuildChannel');
    this.GuildMember = require('./structures/GuildMember');
    this.Invite = require('./structures/Invite');
    this.Message = require('./structures/Message');
    this.MessageAttachment = require('./structures/MessageAttachment');
    this.MessageCollector = require('./structures/MessageCollector');
    this.MessageEmbed = require('./structures/MessageEmbed');
    this.MessageMentions = require('./structures/MessageMentions');
    this.MessageReaction = require('./structures/MessageReaction');
    this.PermissionOverwrites = require('./structures/PermissionOverwrites');
    this.Presence = require('./structures/Presence').Presence;
    this.ReactionCollector = require('./structures/ReactionCollector');
    this.ReactionEmoji = require('./structures/ReactionEmoji');
    this.RichPresenceAssets = require('./structures/Presence').RichPresenceAssets;
    this.Role = require('./structures/Role');
    this.TextChannel = require('./structures/TextChannel');
    this.User = require('./structures/User');
    this.UserConnection = require('./structures/UserConnection');
    this.VoiceChannel = require('./structures/VoiceChannel');
    this.VoiceRegion = require('./structures/VoiceRegion');
    this.Webhook = require('./structures/Webhook');

    this.WebSocket = require('./WebSocket');
  }

  getStructure(key) {
    return this[key];
  }

  registerStructures(classes) {
    for (const key of classes) if (key in this) this[key] = classes[key];
  }
}

module.exports = new Index();
