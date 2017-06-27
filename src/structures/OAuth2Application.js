const Snowflake = require('../util/Snowflake');
const Constants = require('../util/Constants');
const Base = require('./Base');

/**
 * Represents an OAuth2 Application.
 */
class OAuth2Application extends Base {
  constructor(client, data) {
    super(client);

    this._patch(data);
  }

  _patch(data) {
    super._patch(data);
    /**
     * The ID of the app
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of the app
     * @type {string}
     */
    this.name = data.name;

    /**
     * The app's description
     * @type {string}
     */
    this.description = data.description;

    /**
     * The app's icon hash
     * @type {string}
     */
    this.icon = data.icon;

    /**
     * The app's RPC origins
     * @type {?string[]}
     */
    this.rpcOrigins = data.rpc_origins;

    /**
     * The app's redirect URIs
     * @type {string[]}
     */
    this.redirectURIs = data.redirect_uris;

    /**
     * If this app's bot requires a code grant when using the OAuth2 flow
     * @type {boolean}
     */
    this.botRequireCodeGrant = data.bot_require_code_grant;

    /**
     * If this app's bot is public
     * @type {boolean}
     */
    this.botPublic = data.bot_public;

    /**
     * If this app can use rpc
     * @type {boolean}
     */
    this.rpcApplicationState = data.rpc_application_state;

    /**
     * Object containing basic info about this app's bot
     * @type {Object}
     */
    this.bot = data.bot;

    /**
     * The flags for the app
     * @type {number}
     */
    this.flags = data.flags;

    /**
     * OAuth2 secret for the application
     * @type {boolean}
     */
    this.secret = data.secret;

    if (data.owner) {
      /**
       * The owner of this OAuth application
       * @type {?User}
       */
      this.owner = this.client.users.create(data.owner);
    }
  }

  /**
   * The timestamp the app was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the app was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * A link to the application's icon
   * @param {string} [format='webp'] One of `webp`, `png`, `jpg`, `gif`.
   * @param {number} [size=128] One of `128`, '256', `512`, `1024`, `2048`
   * @returns {?string} URL to the icon
   */
  iconURL(format, size) {
    if (!this.icon) return null;
    if (typeof format === 'number') {
      size = format;
      format = 'default';
    }
    return Constants.Endpoints.CDN(this.client.options.http.cdn).AppIcon(this.id, this.icon, format, size);
  }

  /**
   * Reset the app's secret.
   * <warn>This is only available when using a user account.</warn>
   * @returns {OAuth2Application}
   */
  resetSecret() {
    return this.client.api.oauth2.applications(this.id).reset.post()
      .then(app => new OAuth2Application(this.client, app));
  }

  /**
   * Reset the app's bot token.
   * <warn>This is only available when using a user account.</warn>
   * @returns {OAuth2Application}
   */
  resetToken() {
    return this.client.api.oauth2.applications(this.id).bot().reset.post()
      .then(app => new OAuth2Application(this.client, Object.assign({}, this, { bot: app })));
  }

  /**
   * When concatenated with a string, this automatically concatenates the app name rather than the app object.
   * @returns {string}
   */
  toString() {
    return this.name;
  }
}

module.exports = OAuth2Application;
