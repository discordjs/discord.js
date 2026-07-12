'use strict';

const { roleMention } = require('@discordjs/formatters');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const { Base } = require('./Base.js');

/**
 * The base role class.
 *
 * @extends {Base}
 */
class BaseRole extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The icon hash of the role
     *
     * @type {?string}
     */
    this.icon = null;

    /**
     * The unicode emoji for the role
     *
     * @type {?string}
     */
    this.unicodeEmoji = null;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The role's id (unique to the guild it is part of)
     *
     * @type {Snowflake}
     */
    this.id = data.id;
    if ('name' in data) {
      /**
       * The name of the role
       *
       * @type {string}
       */
      this.name = data.name;
    }

    /**
     * @typedef {Object} RoleColors
     * @property {number} primaryColor The primary color of the role
     * @property {?number} secondaryColor The secondary color of the role.
     * This will make the role a gradient between the other provided colors
     * @property {?number} tertiaryColor The tertiary color of the role.
     * When sending `tertiaryColor` the API enforces the role color to be a holographic style with values of `primaryColor = 11127295`, `secondaryColor = 16759788`, and `tertiaryColor = 16761760`.
     * These values are available as a constant: `Constants.HolographicStyle`
     */

    if ('colors' in data) {
      /**
       * The colors of the role
       *
       * @type {RoleColors}
       */
      this.colors = {
        primaryColor: data.colors.primary_color,
        secondaryColor: data.colors.secondary_color,
        tertiaryColor: data.colors.tertiary_color,
      };
    }

    if ('position' in data) {
      /**
       * The raw position of the role from the API
       *
       * @type {number}
       */
      this.rawPosition = data.position;
    }

    if ('icon' in data) this.icon = data.icon;

    if ('unicode_emoji' in data) this.unicodeEmoji = data.unicode_emoji;
  }

  /**
   * The timestamp the role was created at
   *
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return DiscordSnowflake.timestampFrom(this.id);
  }

  /**
   * The time the role was created at
   *
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The hexadecimal version of the role color, with a leading hashtag
   *
   * @type {string}
   * @readonly
   */
  get hexColor() {
    return `#${this.colors.primaryColor.toString(16).padStart(6, '0')}`;
  }

  /**
   * A link to the role's icon
   *
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  iconURL(options = {}) {
    return this.icon && this.client.rest.cdn.roleIcon(this.id, this.icon, options);
  }

  /**
   * When concatenated with a string, this automatically returns the role's mention instead of the Role object.
   *
   * @returns {string}
   * @example
   * // Logs: Role: <@&123456789012345678>
   * console.log(`Role: ${role}`);
   */
  toString() {
    if (this.id === this.guild.id) return '@everyone';
    return roleMention(this.id);
  }

  toJSON() {
    return super.toJSON({ createdTimestamp: true });
  }
}

exports.BaseRole = BaseRole;
