import { BranchCoverage } from '../BranchCoverage.js';
const bc = new BranchCoverage('guild.js:patch');

class Guild {
  constructor() {}

  _patch(data) {
    bc.cover(1);
    //   super._patch(data);
    this.id = data.id;
    if ('name' in data) {
      bc.cover(2);
      this.name = data.name;
    }
    if ('icon' in data) {
      bc.cover(3);
      this.icon = data.icon;
    }
    if ('unavailable' in data) {
      bc.cover(4);
      this.available = !data.unavailable;
    } else {
      bc.cover(5);
      this.available ??= true;
    }

    if ('discovery_splash' in data) {
      bc.cover(6);
      /**
       * The hash of the guild discovery splash image
       * @type {?string}
       */
      this.discoverySplash = data.discovery_splash;
    }

    if ('member_count' in data) {
      bc.cover(7);
      /**
       * The full amount of members in this guild
       * @type {number}
       */
      this.memberCount = data.member_count;
    }

    if ('large' in data) {
      bc.cover(8);
      /**
       * Whether the guild is "large" (has more than {@link WebSocketOptions large_threshold} members, 50 by default)
       * @type {boolean}
       */
      this.large = Boolean(data.large);
    }

    if ('premium_progress_bar_enabled' in data) {
      bc.cover(9);
      /**
       * Whether this guild has its premium (boost) progress bar enabled
       * @type {boolean}
       */
      this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
    }

    if ('application_id' in data) {
      bc.cover(10);
      /**
       * The id of the application that created this guild (if applicable)
       * @type {?Snowflake}
       */
      this.applicationId = data.application_id;
    }

    if ('afk_timeout' in data) {
      bc.cover(11);
      /**
       * The time in seconds before a user is counted as "away from keyboard"
       * @type {?number}
       */
      this.afkTimeout = data.afk_timeout;
    }

    if ('afk_channel_id' in data) {
      bc.cover(12);
      /**
       * The id of the voice channel where AFK members are moved
       * @type {?Snowflake}
       */
      this.afkChannelId = data.afk_channel_id;
    }

    if ('system_channel_id' in data) {
      bc.cover(13);
      /**
       * The system channel's id
       * @type {?Snowflake}
       */
      this.systemChannelId = data.system_channel_id;
    }

    if ('premium_tier' in data) {
      bc.cover(14);
      /**
       * The premium tier of this guild
       * @type {GuildPremiumTier}
       */
      this.premiumTier = data.premium_tier;
    }

    if ('widget_enabled' in data) {
      bc.cover(15);
      /**
       * Whether widget images are enabled on this guild
       * @type {?boolean}
       */
      this.widgetEnabled = data.widget_enabled;
    } else {
      bc.cover(16);
      this.widgetEnabled ??= null;
    }

    if ('widget_channel_id' in data) {
      bc.cover(16);
      /**
       * The widget channel's id, if enabled
       * @type {?string}
       */
      this.widgetChannelId = data.widget_channel_id;
    } else {
      bc.cover(17);
      this.widgetChannelId ??= null;
    }

    if ('explicit_content_filter' in data) {
      bc.cover(18);
      /**
       * The explicit content filter level of the guild
       * @type {GuildExplicitContentFilter}
       */
      this.explicitContentFilter = data.explicit_content_filter;
    }

    if ('mfa_level' in data) {
      bc.cover(19);
      /**
       * The required MFA level for this guild
       * @type {GuildMFALevel}
       */
      this.mfaLevel = data.mfa_level;
    }

    if ('joined_at' in data) {
      bc.cover(20);
      /**
       * The timestamp the client user joined the guild at
       * @type {number}
       */
      this.joinedTimestamp = Date.parse(data.joined_at);
    }

    if ('default_message_notifications' in data) {
      bc.cover(21);
      /**
       * The default message notification level of the guild
       * @type {GuildDefaultMessageNotifications}
       */
      this.defaultMessageNotifications = data.default_message_notifications;
    }

    if ('system_channel_flags' in data) {
      bc.cover(22);
      /**
       * The value set for the guild's system channel flags
       * @type {Readonly<SystemChannelFlagsBitField>}
       */
      this.systemChannelFlags = new SystemChannelFlagsBitField(data.system_channel_flags).freeze();
    }

    if ('max_members' in data) {
      bc.cover(23);
      /**
       * The maximum amount of members the guild can have
       * @type {?number}
       */
      this.maximumMembers = data.max_members;
    } else {
      bc.cover(24);
      this.maximumMembers ??= null;
    }

    if ('max_presences' in data) {
      bc.cover(25);
      /**
       * The maximum amount of presences the guild can have (this is `null` for all but the largest of guilds)
       * <info>You will need to fetch the guild using {@link BaseGuild#fetch} if you want to receive
       * this parameter</info>
       * @type {?number}
       */
      this.maximumPresences = data.max_presences;
    } else {
      bc.cover(26);
      this.maximumPresences ??= null;
    }

    if ('max_video_channel_users' in data) {
      bc.cover(27);
      /**
       * The maximum amount of users allowed in a video channel.
       * @type {?number}
       */
      this.maxVideoChannelUsers = data.max_video_channel_users;
    } else {
      bc.cover(28);
      this.maxVideoChannelUsers ??= null;
    }

    if ('max_stage_video_channel_users' in data) {
      bc.cover(29);
      /**
       * The maximum amount of users allowed in a stage video channel.
       * @type {?number}
       */
      this.maxStageVideoChannelUsers = data.max_stage_video_channel_users;
    } else {
      bc.cover(30);
      this.maxStageVideoChannelUsers ??= null;
    }

    if ('approximate_member_count' in data) {
      bc.cover(31);
      /**
       * The approximate amount of members the guild has
       * <info>You will need to fetch the guild using {@link BaseGuild#fetch} if you want to receive
       * this parameter</info>
       * @type {?number}
       */
      this.approximateMemberCount = data.approximate_member_count;
    } else {
      bc.cover(32);
      this.approximateMemberCount ??= null;
    }

    if ('approximate_presence_count' in data) {
      bc.cover(33);
      /**
       * The approximate amount of presences the guild has
       * <info>You will need to fetch the guild using {@link BaseGuild#fetch} if you want to receive
       * this parameter</info>
       * @type {?number}
       */
      this.approximatePresenceCount = data.approximate_presence_count;
    } else {
      bc.cover(34);
      this.approximatePresenceCount ??= null;
    }

    /**
     * The use count of the vanity URL code of the guild, if any
     * <info>You will need to fetch this parameter using {@link Guild#fetchVanityData} if you want to receive it</info>
     * @type {?number}
     */
    this.vanityURLUses ??= null;

    if ('rules_channel_id' in data) {
      bc.cover(35);
      /**
       * The rules channel's id for the guild
       * @type {?Snowflake}
       */
      this.rulesChannelId = data.rules_channel_id;
    }

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
guild._patch({});
bc.report();
