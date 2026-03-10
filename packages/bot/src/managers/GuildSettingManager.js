'use strict';

const { BaseManager } = require('./BaseManager.js');

/**
 * Manages per-guild notification settings for the client user.
 *
 * @extends {BaseManager}
 */
class GuildSettingManager extends BaseManager {
  #rawSetting = {};

  constructor(guild) {
    super(guild.client);

    /**
     * The guild id this manager is for
     *
     * @type {Snowflake}
     */
    this.guildId = guild.id;
  }

  /**
   * Raw settings data
   *
   * @type {Object}
   */
  get raw() {
    return this.#rawSetting;
  }

  /**
   * The guild this manager is for
   *
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.cache.get(this.guildId);
  }

  /**
   * Patch settings from READY or USER_GUILD_SETTINGS_UPDATE payload
   *
   * @param {Object} data Raw settings data
   * @private
   */
  _patch(data = {}) {
    this.#rawSetting = Object.assign(this.#rawSetting, data);

    if ('suppress_everyone' in data) {
      /** @type {?boolean} */
      this.suppressEveryone = data.suppress_everyone;
    }

    if ('suppress_roles' in data) {
      /** @type {?boolean} */
      this.suppressRoles = data.suppress_roles;
    }

    if ('mute_scheduled_events' in data) {
      /** @type {?boolean} */
      this.muteScheduledEvents = data.mute_scheduled_events;
    }

    if ('message_notifications' in data) {
      /** @type {?number} - 0=all, 1=mentions only, 2=nothing */
      this.messageNotifications = data.message_notifications;
    }

    if ('flags' in data) {
      /** @type {?number} */
      this.flags = data.flags;
    }

    if ('mobile_push' in data) {
      /** @type {?boolean} */
      this.mobilePush = data.mobile_push;
    }

    if ('muted' in data) {
      /** @type {?boolean} */
      this.muted = data.muted;
    }

    if ('mute_config' in data && data.mute_config !== null) {
      /** @type {?Object} */
      this.muteConfig = {
        endTime: new Date(data.mute_config.end_time),
        selectedTimeWindow: data.mute_config.selected_time_window,
      };
    } else if ('mute_config' in data) {
      this.muteConfig = null;
    }

    if ('hide_muted_channels' in data) {
      /** @type {?boolean} */
      this.hideMutedChannels = data.hide_muted_channels;
    }

    if ('channel_overrides' in data) {
      /** @type {?Array} */
      this.channelOverrides = data.channel_overrides;
    }

    if ('notify_highlights' in data) {
      /** @type {?number} - 0=unknown, 1=enable, 2=disable */
      this.notifyHighlights = data.notify_highlights;
    }

    if ('version' in data) {
      /** @type {?number} */
      this.version = data.version;
    }
  }

  /**
   * Edit guild settings
   *
   * @param {Object} data Data to edit
   * @returns {Promise<GuildSettingManager>}
   */
  async edit(data) {
    const res = await this.client.rest.patch(`/users/@me/guilds/${this.guildId}/settings`, { body: data });
    this._patch(res);
    return this;
  }
}

exports.GuildSettingManager = GuildSettingManager;
