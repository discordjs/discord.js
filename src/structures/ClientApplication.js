const Snowflake = require('../util/Snowflake');
const { ClientApplicationAssetTypes, Endpoints } = require('../util/Constants');
const DataResolver = require('../util/DataResolver');
const Base = require('./Base');

/**
 * Represents a Client OAuth2 Application.
 * @extends {Base}
 */
class ClientApplication extends Base {
  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  _patch(data) {
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
     * The app's cover image hash
     * @type {?string}
     */
    this.cover = data.cover_image;

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
     * @type {string}
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
   * A link to the application's icon.
   * @param {Object} [options={}] Options for the icon url
   * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`
   * @param {number} [options.size=128] One of `128`, `256`, `512`, `1024`, `2048`
   * @returns {?string} URL to the icon
   */
  iconURL({ format, size } = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.AppIcon(this.id, this.icon, { format, size });
  }

  /**
   * A link to this application's cover image.
   * @param {Object} [options={}] Options for the cover image url
   * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`
   * @param {number} [options.size=128] One of `128`, `256`, `512`, `1024`, `2048`
   * @returns {?string} URL to the cover image
   */
  coverImage({ format, size } = {}) {
    if (!this.cover) return null;
    return Endpoints
      .CDN(this.client.options.http.cdn)
      .AppIcon(this.id, this.cover, { format, size });
  }

  /**
   * Get rich presence assets.
   * @returns {Promise<Object>}
   */
  fetchAssets() {
    return this.client.api.applications(this.id).assets.get()
      .then(assets => assets.map(a => ({
        id: a.id,
        name: a.name,
        type: Object.keys(ClientApplicationAssetTypes)[a.type - 1],
      })));
  }

  /**
   * Create a rich presence asset.
   * @param {string} name Name of the asset
   * @param {Base64Resolvable} data Data of the asset
   * @param {string} type Type of the asset. `big`, or `small`
   * @returns {Promise}
   */
  createAsset(name, data, type) {
    return DataResolver.resolveBase64(data).then(b64 =>
      this.client.api.applications(this.id).assets.post({ data: {
        name,
        data: b64,
        type: ClientApplicationAssetTypes[type.toUpperCase()],
      } }));
  }

  /**
   * Reset the app's secret.
   * <warn>This is only available when using a user account.</warn>
   * @returns {ClientApplication}
   */
  resetSecret() {
    return this.client.api.oauth2.applications[this.id].reset.post()
      .then(app => new ClientApplication(this.client, app));
  }

  /**
   * Reset the app's bot token.
   * <warn>This is only available when using a user account.</warn>
   * @returns {ClientApplication}
   */
  resetToken() {
    return this.client.api.oauth2.applications[this.id].bot.reset.post()
      .then(app => new ClientApplication(this.client, Object.assign({}, this, { bot: app })));
  }

  /**
   * When concatenated with a string, this automatically concatenates the app name rather than the app object.
   * @returns {string}
   */
  toString() {
    return this.name;
  }
}

module.exports = ClientApplication;
