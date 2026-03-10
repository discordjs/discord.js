'use strict';

const { Collection } = require('@discordjs/collection');
const { BaseManager } = require('./BaseManager.js');

/**
 * Manages the client user's settings.
 *
 * @extends {BaseManager}
 * @see {@link https://luna.gitlab.io/discord-unofficial-docs/user_settings.html}
 */
class ClientUserSettingManager extends BaseManager {
  #rawSetting = {};

  constructor(client) {
    super(client);

    /**
     * Friend source flags
     *
     * @type {?Object}
     */
    this.addFriendFrom = {
      all: null,
      mutual_friends: null,
      mutual_guilds: null,
    };
  }

  /**
   * Patch settings from USER_SETTINGS_UPDATE or READY payload
   *
   * @param {Object} data Raw settings data
   * @private
   */
  _patch(data = {}) {
    this.#rawSetting = Object.assign(this.#rawSetting, data);

    if ('locale' in data) {
      /** @type {?string} */
      this.locale = data.locale;
    }

    if ('show_current_game' in data) {
      /** @type {?boolean} */
      this.activityDisplay = data.show_current_game;
    }

    if ('default_guilds_restricted' in data) {
      /** @type {?boolean} */
      this.allowDMsFromGuild = data.default_guilds_restricted;
    }

    if ('inline_attachment_media' in data) {
      /** @type {?boolean} */
      this.displayImage = data.inline_attachment_media;
    }

    if ('inline_embed_media' in data) {
      /** @type {?boolean} */
      this.linkedImageDisplay = data.inline_embed_media;
    }

    if ('gif_auto_play' in data) {
      /** @type {?boolean} */
      this.autoplayGIF = data.gif_auto_play;
    }

    if ('render_embeds' in data) {
      /** @type {?boolean} */
      this.previewLink = data.render_embeds;
    }

    if ('animate_emoji' in data) {
      /** @type {?boolean} */
      this.animatedEmoji = data.animate_emoji;
    }

    if ('enable_tts_command' in data) {
      /** @type {?boolean} */
      this.allowTTS = data.enable_tts_command;
    }

    if ('message_display_compact' in data) {
      /** @type {?boolean} */
      this.compactMode = data.message_display_compact;
    }

    if ('convert_emoticons' in data) {
      /** @type {?boolean} */
      this.convertEmoticons = data.convert_emoticons;
    }

    if ('explicit_content_filter' in data) {
      /** @type {?number} - 0=off, 1=friends excluded, 2=scan everyone */
      this.DMScanLevel = data.explicit_content_filter;
    }

    if ('theme' in data) {
      /** @type {?string} - 'dark' or 'light' */
      this.theme = data.theme;
    }

    if ('developer_mode' in data) {
      /** @type {?boolean} */
      this.developerMode = data.developer_mode;
    }

    if ('afk_timeout' in data) {
      /** @type {?number} */
      this.afkTimeout = data.afk_timeout;
    }

    if ('animate_stickers' in data) {
      /** @type {?number} - 0=always, 1=on hover, 2=never */
      this.stickerAnimationMode = data.animate_stickers;
    }

    if ('render_reactions' in data) {
      /** @type {?boolean} */
      this.showEmojiReactions = data.render_reactions;
    }

    if ('status' in data) {
      /** @type {?string} */
      this.status = data.status;
    }

    if ('custom_status' in data) {
      /** @type {?Object} */
      this.customStatus = data.custom_status;
    }

    if ('restricted_guilds' in data) {
      /** @type {Collection<Snowflake, Guild>} */
      this.disableDMfromGuilds = new Collection(
        data.restricted_guilds.map(guildId => [guildId, this.client.guilds.cache.get(guildId)]),
      );
    }
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
   * Fetch settings from the API
   *
   * @returns {Promise<ClientUserSettingManager>}
   */
  async fetch() {
    const data = await this.client.rest.get('/users/@me/settings');
    this._patch(data);
    return this;
  }

  /**
   * Edit settings
   *
   * @param {Object} data Data to edit
   * @returns {Promise<ClientUserSettingManager>}
   */
  async edit(data) {
    const res = await this.client.rest.patch('/users/@me/settings', { body: data });
    this._patch(res);
    return this;
  }

  /**
   * Set theme
   *
   * @param {'dark'|'light'} value Theme to set
   * @returns {Promise<ClientUserSettingManager>}
   */
  setTheme(value) {
    if (!['dark', 'light'].includes(value)) {
      throw new TypeError('Theme must be "dark" or "light"');
    }

    return this.edit({ theme: value });
  }

  /**
   * Toggle compact mode
   *
   * @returns {Promise<ClientUserSettingManager>}
   */
  toggleCompactMode() {
    return this.edit({ message_display_compact: !this.compactMode });
  }
}

exports.ClientUserSettingManager = ClientUserSettingManager;
