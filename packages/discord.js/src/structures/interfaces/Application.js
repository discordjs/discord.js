'use strict';

const { DiscordSnowflake } = require('@sapphire/snowflake');
const Base = require('../Base');

/**
 * Represents an OAuth2 Application.
 * @extends {Base}
 * @abstract
 */
class Application extends Base {
  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  _patch(data) {
    /**
     * The application's id
     * @type {Snowflake}
     */
    this.id = data.id;

    if ('name' in data) {
      /**
       * The name of the application
       * @type {?string}
       */
      this.name = data.name;
    } else {
      this.name ??= null;
    }

    if ('description' in data) {
      /**
       * The application's description
       * @type {?string}
       */
      this.description = data.description;
    } else {
      this.description ??= null;
    }

    if ('icon' in data) {
      /**
       * The application's icon hash
       * @type {?string}
       */
      this.icon = data.icon;
    } else {
      this.icon ??= null;
    }

    if ('role_connections_verification_url' in data) {
      /**
       * This application's role connection verification entry point URL
       * @type {?string}
       */
      this.roleConnectionsVerificationURL = data.role_connections_verification_url;
    } else {
      this.roleConnectionsVerificationURL ??= null;
    }
  }

  /**
   * The timestamp the application was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return DiscordSnowflake.timestampFrom(this.id);
  }

  /**
   * The time the application was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * A link to the application's icon.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  iconURL(options = {}) {
    return this.icon && this.client.rest.cdn.appIcon(this.id, this.icon, options);
  }

  /**
   * A link to this application's cover image.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  coverURL(options = {}) {
    return this.cover && this.client.rest.cdn.appIcon(this.id, this.cover, options);
  }

  /**
   * When concatenated with a string, this automatically returns the application's name instead of the
   * Application object.
   * @returns {?string}
   * @example
   * // Logs: Application name: My App
   * console.log(`Application name: ${application}`);
   */
  toString() {
    return this.name;
  }

  toJSON() {
    return super.toJSON({ createdTimestamp: true });
  }
}

module.exports = Application;
