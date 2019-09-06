'use strict';

const Snowflake = require('../util/Snowflake');
const { ClientApplicationAssetTypes, Endpoints } = require('../util/Constants');
const Base = require('./Base');
const Team = require('./Team');

const AssetTypes = Object.keys(ClientApplicationAssetTypes);

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
     * The app's cover image
     * @type {?string}
     */
    this.cover = data.cover_image || null;

    /**
     * The app's RPC origins, if enabled
     * @type {string[]}
     */
    this.rpcOrigins = data.rpc_origins || [];

    /**
     * If this app's bot requires a code grant when using the OAuth2 flow
     * @type {?boolean}
     */
    this.botRequireCodeGrant = typeof data.bot_require_code_grant !== 'undefined' ? data.bot_require_code_grant : null;

    /**
     * If this app's bot is public
     * @type {?boolean}
     */
    this.botPublic = typeof data.bot_public !== 'undefined' ? data.bot_public : null;

    /**
     * The owner of this OAuth application
     * @type {?User|Team}
     */
    this.owner = data.team ?
      new Team(this.client, data.team) :
      data.owner ?
        this.client.users.add(data.owner) :
        null;
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
   * The time the app was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * A link to the application's icon.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string} URL to the icon
   */
  iconURL({ format, size } = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.AppIcon(this.id, this.icon, { format, size });
  }

  /**
   * A link to this application's cover image.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string} URL to the cover image
   */
  coverImage({ format, size } = {}) {
    if (!this.cover) return null;
    return Endpoints
      .CDN(this.client.options.http.cdn)
      .AppIcon(this.id, this.cover, { format, size });
  }

  /**
   * Asset data.
   * @typedef {Object} ClientAsset
   * @property {Snowflake} id The asset ID
   * @property {string} name The asset name
   * @property {string} type The asset type
   */

  /**
   * Gets the clients rich presence assets.
   * @returns {Promise<Array<ClientAsset>>}
   */
  fetchAssets() {
    return this.client.api.oauth2.applications(this.id).assets.get()
      .then(assets => assets.map(a => ({
        id: a.id,
        name: a.name,
        type: AssetTypes[a.type - 1],
      })));
  }

  /**
   * When concatenated with a string, this automatically returns the application's name instead of the
   * ClientApplication object.
   * @returns {string}
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

module.exports = ClientApplication;
