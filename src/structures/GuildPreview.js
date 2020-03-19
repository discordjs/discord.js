'use strict';

const Base = require('./Base');
const GuildEmojiManager = require('../managers/GuildEmojiManager');

/**
 * Represents the data about the guild any bot can preivew, connected to the specified public guild
 */
class GuildPreview extends Base {
  constructor(client, data) {
    super(client);

    if (!data) return;
    this._patch(data);
  }

  /**
   * Builds the public guild with the provided data
   * @param {*} data The raw data of the public guild
   * @private
   */
  _patch(data) {
    /**
     * The id of this public guild
     * @type {string}
     */
    this.id = data.id;

    /**
     * The name of this public guild
     * @type {string}
     */
    this.name = data.name;

    /**
     * The icon of this public guild
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * The splash icon of this public guild
     * @type {?string}
     */
    this.splash = data.splash;

    /**
     * The discovery splash icon of this public guild
     * @type {?string}
     */
    this.discoverySplash = data.discovery_splash;

    /**
     * An array of enabled guild features, here are the possible values:
     * * ANIMATED_ICON
     * * BANNER
     * * COMMERCE
     * * DISCOVERABLE
     * * FEATURABLE
     * * INVITE_SPLASH
     * * PUBLIC
     * * NEWS
     * * PARTNERED
     * * VANITY_URL
     * * VERIFIED
     * * VIP_REGIONS
     * @typedef {string} Features
     */

    /**
     * An array of enabled guild features
     * @type {Features[]}
     */
    this.features = data.features;

    /**
     * The approximate count of members in this public guild
     * @type {number}
     */
    this.approximateMemberCount = data.approximate_member_count;

    /**
     * The approximate count of online members in this public guild
     * @type {number}
     */
    this.approximatePresenceCount = data.approximate_presence_count;

    /**
     * The description for this public guild
     * @type {?string}
     */
    this.description = data.description;

    if (!this.emojis) {
      /**
       * A manager of the emojis belonging to this public guild
       * @type {GuildEmojiManager}
       */
      this.emojis = new GuildEmojiManager(this);
      if (data.emojis) for (const emoji of data.emojis) this.emojis.add(emoji);
    } else if (data.emojis) {
      this.client.actions.GuildemojisUpdate.handle({
        guild_id: this.id,
        emojis: data.emojis,
      });
    }
  }

  /**
   * The URL to this public guild's splash
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  splashURL({ format, size } = {}) {
    if (!this.splash) return null;
    return this.client.rest.cdn.Splash(this.id, this.splash, format, size);
  }

  /**
   * The URL to this public guild's discovery splash
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  discoverySplashURL({ format, size } = {}) {
    if (!this.discoverySplash) return null;
    return this.client.rest.cdn.Splash(this.id, this.discoverySplash, format, size, 'discovery');
  }

  /**
   * The URL to this public guild's icon
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  iconURL({ format, size, dynamic } = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.Icon(this.id, this.icon, format, size, dynamic);
  }

  /**
   * Fetches this public guild.
   * @returns {Promise<GuildPreview>}
   */
  fetch() {
    return this.client.api
      .guilds(this.id, 'preview')
      .get()
      .then(data => {
        this._patch(data);
        return this;
      });
  }

  /**
   * When concatenated with a string, this automatically returns the guild's name instead of the Guild object.
   * @returns {string}
   * @example
   * // Logs: Hello from My Guild!
   * console.log(`Hello from ${previewGuild}!`);
   */
  toString() {
    return this.name;
  }

  toJSON() {
    const json = super.toJSON();
    json.iconURL = this.iconURL();
    json.splashURL = this.splashURL();
  }
}

module.exports = GuildPreview;
