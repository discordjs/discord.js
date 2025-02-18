import { BranchCoverage } from '../../BranchCoverage.js';
const bc = new BranchCoverage('guild.js:patch');

const updateName = (obj, data) => {
  if ('name' in data) {
    obj.name = data.name;
  }
};

const updateIcon = (obj, data) => {
  if ('icon' in data) {
    obj.icon = data.icon;
  }
};

const updateAvailable = (obj, data) => {
  if ('unavailable' in data) {
    obj.available = !data.unavailable;
  } else {
    obj.available ??= true;
  }
};

const updateDiscoverySplash = (obj, data) => {
  if ('discovery_splash' in data) {
    obj.discoverySplash = data.discovery_splash;
  }
};

const updateMemberCount = (obj, data) => {
  if ('member_count' in data) {
    obj.memberCount = data.member_count;
  }
};

const updateLarge = (obj, data) => {
  if ('large' in data) {
    obj.large = Boolean(data.large);
  }
};

const updatePremiumProgressBarEnabled = (obj, data) => {
  if ('premium_progress_bar_enabled' in data) {
    obj.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
  }
};

const updateApplicationId = (obj, data) => {
  if ('application_id' in data) {
    obj.applicationId = data.application_id;
  }
};

const updateAfkTimeout = (obj, data) => {
  if ('afk_timeout' in data) {
    obj.afkTimeout = data.afk_timeout;
  }
};

const updateAfkChannelId = (obj, data) => {
  if ('afk_channel_id' in data) {
    obj.afkChannelId = data.afk_channel_id;
  }
};

const updateSystemChannelId = (obj, data) => {
  if ('system_channel_id' in data) {
    obj.systemChannelId = data.system_channel_id;
  }
};

const updatePremiumTier = (obj, data) => {
  if ('premium_tier' in data) {
    obj.premiumTier = data.premium_tier;
  }
};

const updateWidgetEnabled = (obj, data) => {
  if ('widget_enabled' in data) {
    obj.widgetEnabled = data.widget_enabled;
  } else {
    obj.widgetEnabled ??= null;
  }
};

const updateWidgetChannelId = (obj, data) => {
  if ('widget_channel_id' in data) {
    obj.widgetChannelId = data.widget_channel_id;
  } else {
    obj.widgetChannelId ??= null;
  }
};

const updateExplicitContentFilter = (obj, data) => {
  if ('explicit_content_filter' in data) {
    obj.explicitContentFilter = data.explicit_content_filter;
  }
};

const updateMfaLevel = (obj, data) => {
  if ('mfa_level' in data) {
    obj.mfaLevel = data.mfa_level;
  }
};

const updateJoinedAt = (obj, data) => {
  if ('joined_at' in data) {
    obj.joinedTimestamp = Date.parse(data.joined_at);
  }
};

const updateDefaultMessageNotifications = (obj, data) => {
  if ('default_message_notifications' in data) {
    obj.defaultMessageNotifications = data.default_message_notifications;
  }
};

const updateSystemChannelFlags = (obj, data) => {
  if ('system_channel_flags' in data) {
    obj.systemChannelFlags = new SystemChannelFlagsBitField(data.system_channel_flags).freeze();
  }
};

const updateMaximumMembers = (obj, data) => {
  if ('max_members' in data) {
    obj.maximumMembers = data.max_members;
  } else {
    obj.maximumMembers ??= null;
  }
};

const updateMaximumPresences = (obj, data) => {
  if ('max_presences' in data) {
    obj.maximumPresences = data.max_presences;
  } else {
    obj.maximumPresences ??= null;
  }
};

const updateMaximumVideoChannelUsers = (obj, data) => {
  if ('max_video_channel_users' in data) {
    obj.maxVideoChannelUsers = data.max_video_channel_users;
  } else {
    obj.maxVideoChannelUsers ??= null;
  }
};

const updateMaximumStageVideoChannelUsers = (obj, data) => {
  if ('max_stage_video_channel_users' in data) {
    obj.maxStageVideoChannelUsers = data.max_stage_video_channel_users;
  } else {
    obj.maxStageVideoChannelUsers ??= null;
  }
};

const updateApproximateMemberCount = (obj, data) => {
  if ('approximate_member_count' in data) {
    obj.approximateMemberCount = data.approximate_member_count;
  } else {
    obj.approximateMemberCount ??= null;
  }
};

const updateApproximatePresenceCount = (obj, data) => {
  if ('approximate_presence_count' in data) {
    obj.approximatePresenceCount = data.approximate_presence_count;
  } else {
    obj.approximatePresenceCount ??= null;
  }
};

const updateRulesChannelId = (obj, data) => {
  if ('rules_channel_id' in data) {
    obj.rulesChannelId = data.rules_channel_id;
  }
};

const updatePublicUpdatesChannelId = (obj, data) => {
  if ('public_updates_channel_id' in data) {
    obj.publicUpdatesChannelId = data.public_updates_channel_id;
  }
};

const updatePreferredLocale = (obj, data) => {
  if ('preferred_locale' in data) {
    obj.preferredLocale = data.preferred_locale;
  }
};

const updateSafetyAlertsChannelId = (obj, data) => {
  if ('safety_alerts_channel_id' in data) {
    obj.safetyAlertsChannelId = data.safety_alerts_channel_id;
  } else {
    obj.safetyAlertsChannelId ??= null;
  }
};

const updateClientChannelsIfDataExists = (obj, data) => {
  if (data.channels) {
    obj.channels.cache.clear();
    for (const rawChannel of data.channels) {
      obj.client.channels._add(rawChannel, obj);
    }
  }
};

const updateClientChannelsIfThreadsExists = (obj, data) => {
  if (obj.threads) {
    obj.threads.cache.clear();
    for (const rawThread of data.threads) {
      obj.client.channels._add(rawThread, obj);
    }
  }
};

const updateRoles = (obj, data) => {
  if (data.roles) {
    obj.roles.cache.clear();
    for (const role of data.roles) obj.roles._add(role);
  }
};

const updateMembers = (obj, data) => {
  if (data.members) {
    obj.members.cache.clear();
    for (const guildUser of data.members) obj.members._add(guildUser);
  }
};

const updateOwnerId = (obj, data) => {
  if ('owner_id' in data) {
    obj.ownerId = data.owner_id;
  }
};

const updatePresences = (obj, data) => {
  if (data.presences) {
    obj.presences.cache.clear();
    for (const presence of data.presences) obj.presences._add(presence);
  }
};

const updateStageInstances = (obj, data) => {
  if (data.stage_instances) {
    obj.stageInstances.cache.clear();
    for (const stageInstance of data.stage_instances) obj.stageInstances._add(stageInstance);
  }
};

const updateScheduledEvents = (obj, data) => {
  if (data.guild_scheduled_events) {
    obj.scheduledEvents.cache.clear();
    for (const scheduledEvent of data.guild_scheduled_events) obj.scheduledEvents._add(scheduledEvent);
  }
};

const updateVoiceStates = (obj, data) => {
  if (data.voice_states) {
    obj.voiceStates.cache.clear();
    for (const voiceState of data.voice_states) obj.voiceStates._add(voiceState);
  }
};

const updateIncidentsData = (obj, data) => {
  if ('incidents_data' in data) {
    obj.incidentsData = _transformAPIIncidentsData(data.incidents_data);
  } else {
    obj.incidentsData ??= null;
  }
};

class Guild {
  constructor() {}

  _patch(data) {
    bc.cover(1);
    //   super._patch(data);
    this.id = data.id;
    updateName(this, data);
    updateIcon(this, data);
    updateAvailable(this, data);
    updateDiscoverySplash(this, data);
    updateMemberCount(this, data);
    updateLarge(this, data);
    updatePremiumProgressBarEnabled(this, data);
    updateApplicationId(this, data);
    updateAfkTimeout(this, data);
    updateAfkChannelId(this, data);
    updateSystemChannelId(this, data);
    updatePremiumTier(this, data);
    updateWidgetEnabled(this, data);
    updateWidgetChannelId(this, data);
    updateExplicitContentFilter(this, data);
    updateMfaLevel(this, data);
    updateJoinedAt(this, data);
    updateDefaultMessageNotifications(this, data);
    updateSystemChannelFlags(this, data);
    updateMaximumMembers(this, data);
    updateMaximumPresences(this, data);
    updateMaximumVideoChannelUsers(this, data);
    updateMaximumStageVideoChannelUsers(this, data);
    updateApproximateMemberCount(this, data);
    updateApproximatePresenceCount(this, data);

    /**
     * The use count of the vanity URL code of the guild, if any
     * <info>You will need to fetch this parameter using {@link Guild#fetchVanityData} if you want to receive it</info>
     * @type {?number}
     */
    this.vanityURLUses ??= null;

    updateRulesChannelId(this, data);
    updatePublicUpdatesChannelId(this, data);
    updatePreferredLocale(this, data);
    updateSafetyAlertsChannelId(this, data);
    updateClientChannelsIfDataExists(this, data);
    updateClientChannelsIfThreadsExists(this, data);
    updateRoles(this, data);
    updateMembers(this, data);
    updateOwnerId(this, data);
    updatePresences(this, data);
    updateStageInstances(this, data);
    updateScheduledEvents(this, data);
    updateVoiceStates(this, data);

    if (!this.emojis) {
      bc.cover(49);
      /**
       * A manager of the emojis belonging to this guild
       * @type {GuildEmojiManager}
       */
      // this.emojis = new GuildEmojiManager(this);
      this.emojis = [];
      if (data.emojis) for (const emoji of data.emojis) this.emojis._add(emoji);
    } else if (data.emojis) {
      bc.cover(50);
      this.client.actions.GuildEmojisUpdate.handle({
        guild_id: this.id,
        emojis: data.emojis,
      });
    }

    if (!this.stickers) {
      bc.cover(51);
      /**
       * A manager of the stickers belonging to this guild
       * @type {GuildStickerManager}
       */
      // this.stickers = new GuildStickerManager(this);
      this.stickers = [];
      if (data.stickers) for (const sticker of data.stickers) this.stickers._add(sticker);
    } else if (data.stickers) {
      bc.cover(52);
      this.client.actions.GuildStickersUpdate.handle({
        guild_id: this.id,
        stickers: data.stickers,
      });
    }

    updateIncidentsData(this, data);
  }
}

const guild = new Guild(null, {});
bc.setTotal(54);
guild._patch({});
bc.report();
