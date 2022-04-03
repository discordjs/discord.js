'use strict';

const { Collection } = require('@discordjs/collection');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const { Routes } = require('discord-api-types/v10');
const Base = require('./Base');
const GuildPreviewEmoji = require('./GuildPreviewEmoji');
const { Sticker } = require('./Sticker');

/**
 * Represents the data about the guild any bot can preview, connected to the specified guild.
 * @extends {Base}
 */
class GuildPreview extends Base {
  constructor(client, data) {
    super(client);

    if (!data) return;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The id of this guild
     * @type {string}
     */
    this.id = data.id;

    if ('name' in data) {
      /**
       * The name of this guild
       * @type {string}
       */
      this.name = data.name;
    }

    if ('icon' in data) {
      /**
       * The icon of this guild
       * @type {?string}
       */
      this.icon = data.icon;
    }

    if ('splash' in data) {
      /**
       * The splash icon of this guild
       * @type {?string}
       */
      this.splash = data.splash;
    }

    if ('discovery_splash' in data) {
      /**
       * The discovery splash icon of this guild
       * @type {?string}
       */
      this.discoverySplash = data.discovery_splash;
    }

    if ('features' in data) {
      /**
       * An array of enabled guild features
       * @type {GuildFeature[]}
       */
      this.features = data.features;
    }

    if ('approximate_member_count' in data) {
      /**
       * The approximate count of members in this guild
       * @type {number}
       */
      this.approximateMemberCount = data.approximate_member_count;
    }

    if ('approximate_presence_count' in data) {
      /**
       * The approximate count of online members in this guild
       * @type {number}
       */
      this.approximatePresenceCount = data.approximate_presence_count;
    }

    if ('description' in data) {
      /**
       * The description for this guild
       * @type {?string}
       */
      this.description = data.description;
    } else {
      this.description ??= null;
    }

    if (!this.emojis) {
      /**
       * Collection of emojis belonging to this guild
       * @type {Collection<Snowflake, GuildPreviewEmoji>}
       */
      this.emojis = new Collection();
    } else {
      this.emojis.clear();
    }
    for (const emoji of data.emojis) {
      this.emojis.set(emoji.id, new GuildPreviewEmoji(this.client, emoji, this));
    }

    /**
     * Collection of stickers belonging to this guild
     * @type {Collection<Snowflake, Sticker>}
     */
    this.stickers = data.stickers.reduce(
      (stickers, sticker) => stickers.set(sticker.id, new Sticker(this.client, sticker)),
      new Collection(),
    );
  }

  /**
   * The timestamp this guild was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return DiscordSnowflake.timestampFrom(this.id);
  }

  /**
   * The time this guild was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The URL to this guild's splash.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  splashURL(options = {}) {
    return this.splash && this.client.rest.cdn.splash(this.id, this.splash, options);
  }

  /**
   * The URL to this guild's discovery splash.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  discoverySplashURL(options = {}) {
    return this.discoverySplash && this.client.rest.cdn.discoverySplash(this.id, this.discoverySplash, options);
  }

  /**
   * The URL to this guild's icon.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  iconURL(options = {}) {
    return this.icon && this.client.rest.cdn.icon(this.id, this.icon, options);
  }

  /**
   * Fetches this guild.
   * @returns {Promise<GuildPreview>}
   */
  async fetch() {
    const data = await this.client.rest.get(Routes.guildPreview(this.id));
    this._patch(data);
    return this;
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
    return json;
  }
}

module.exports = GuildPreview;
