'use strict';

const Base = require('./Base');
const ServerPreviewEmoji = require('./ServerPreviewEmoji');
const Collection = require('../util/Collection');

/**
 * Represents the data about the server any bot can preview, connected to the specified server.
 * @extends {Base}
 */
class ServerPreview extends Base {
  constructor(client, data) {
    super(client);

    if (!data) return;

    this._patch(data);
  }

  /**
   * Builds the server with the provided data.
   * @param {*} data The raw data of the server
   * @private
   */
  _patch(data) {
    /**
     * The id of this server
     * @type {string}
     */
    this.id = data.id;

    /**
     * The name of this server
     * @type {string}
     */
    this.name = data.name;

    /**
     * The icon of this server
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * The splash icon of this server
     * @type {?string}
     */
    this.splash = data.splash;

    /**
     * The discovery splash icon of this server
     * @type {?string}
     */
    this.discoverySplash = data.discovery_splash;

    /**
     * An array of enabled server features
     * @type {Features[]}
     */
    this.features = data.features;

    /**
     * The approximate count of members in this server
     * @type {number}
     */
    this.approximateMemberCount = data.approximate_member_count;

    /**
     * The approximate count of online members in this server
     * @type {number}
     */
    this.approximatePresenceCount = data.approximate_presence_count;

    /**
     * The description for this server
     * @type {?string}
     */
    this.description = data.description || null;

    if (!this.emojis) {
      /**
       * Collection of emojis belonging to this server
       * @type {Collection<Snowflake, ServerPreviewEmoji>}
       */
      this.emojis = new Collection();
    } else {
      this.emojis.clear();
    }
    for (const emoji of data.emojis) {
      this.emojis.set(emoji.id, new ServerPreviewEmoji(this.client, emoji, this));
    }
  }

  /**
   * The URL to this server's splash.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  splashURL({ format, size } = {}) {
    if (!this.splash) return null;
    return this.client.rest.cdn.Splash(this.id, this.splash, format, size);
  }

  /**
   * The URL to this server's discovery splash.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  discoverySplashURL({ format, size } = {}) {
    if (!this.discoverySplash) return null;
    return this.client.rest.cdn.DiscoverySplash(this.id, this.discoverySplash, format, size);
  }

  /**
   * The URL to this server's icon.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  iconURL({ format, size, dynamic } = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.Icon(this.id, this.icon, format, size, dynamic);
  }

  /**
   * Fetches this server.
   * @returns {Promise<ServerPreview>}
   */
  fetch() {
    return this.client.api
      .servers(this.id)
      .preview.get()
      .then(data => {
        this._patch(data);
        return this;
      });
  }

  /**
   * When concatenated with a string, this automatically returns the server's name instead of the Server object.
   * @returns {string}
   * @example
   * // Logs: Hello from My Server!
   * console.log(`Hello from ${previewServer}!`);
   */
  toString() {
    return this.name;
  }

  toJSON() {
    const json = super.toJSON();
    json.iconURL = this.iconURL();
    json.splashURL = this.splashURL();
    return json;
  }
}

module.exports = ServerPreview;
