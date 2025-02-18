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

    if ('public_updates_channel_id' in data) {
      bc.cover(36);
      /**
       * The community updates channel's id for the guild
       * @type {?Snowflake}
       */
      this.publicUpdatesChannelId = data.public_updates_channel_id;
    }

    if ('preferred_locale' in data) {
      bc.cover(37);
      /**
       * The preferred locale of the guild, defaults to `en-US`
       * @type {Locale}
       */
      this.preferredLocale = data.preferred_locale;
    }

    if ('safety_alerts_channel_id' in data) {
      bc.cover(38);
      /**
       * The safety alerts channel's id for the guild
       * @type {?Snowflake}
       */
      this.safetyAlertsChannelId = data.safety_alerts_channel_id;
    } else {
      bc.cover(39);
      this.safetyAlertsChannelId ??= null;
    }

    if (data.channels) {
      bc.cover(40);
      this.channels.cache.clear();
      for (const rawChannel of data.channels) {
        this.client.channels._add(rawChannel, this);
      }
    }

    if (data.threads) {
      bc.cover(41);
      for (const rawThread of data.threads) {
        this.client.channels._add(rawThread, this);
      }
    }

    if (data.roles) {
      bc.cover(42);
      this.roles.cache.clear();
      for (const role of data.roles) this.roles._add(role);
    }

    if (data.members) {
      bc.cover(43);
      this.members.cache.clear();
      for (const guildUser of data.members) this.members._add(guildUser);
    }

    if ('owner_id' in data) {
      bc.cover(44);
      /**
       * The user id of this guild's owner
       * @type {Snowflake}
       */
      this.ownerId = data.owner_id;
    }

    if (data.presences) {
      bc.cover(45);
      for (const presence of data.presences) {
        this.presences._add(Object.assign(presence, { guild: this }));
      }
    }

    if (data.stage_instances) {
      bc.cover(46);
      this.stageInstances.cache.clear();
      for (const stageInstance of data.stage_instances) {
        this.stageInstances._add(stageInstance);
      }
    }

    if (data.guild_scheduled_events) {
      bc.cover(47);
      this.scheduledEvents.cache.clear();
      for (const scheduledEvent of data.guild_scheduled_events) {
        this.scheduledEvents._add(scheduledEvent);
      }
    }

    if (data.voice_states) {
      bc.cover(48);
      this.voiceStates.cache.clear();
      for (const voiceState of data.voice_states) {
        this.voiceStates._add(voiceState);
      }
    }

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

    if ('incidents_data' in data) {
      bc.cover(53);
      /**
       * Incident actions of a guild.
       * @typedef {Object} IncidentActions
       * @property {?Date} invitesDisabledUntil When invites would be enabled again
       * @property {?Date} dmsDisabledUntil When direct messages would be enabled again
       * @property {?Date} dmSpamDetectedAt When direct message spam was detected
       * @property {?Date} raidDetectedAt When a raid was detected
       */

      /**
       * The incidents data of this guild.
       * <info>You will need to fetch the guild using {@link BaseGuild#fetch} if you want to receive
       * this property.</info>
       * @type {?IncidentActions}
       */
      this.incidentsData = data.incidents_data && _transformAPIIncidentsData(data.incidents_data);
    } else {
      bc.cover(54);
      this.incidentsData ??= null;
    }
  }
}

const guild = new Guild(null, {});
bc.setTotal(54);
guild._patch({});
bc.report();
