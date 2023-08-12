'use strict';

const { ApplicationRoleConnectionMetadata } = require('./ApplicationRoleConnectionMetadata');
const Team = require('./Team');
const Application = require('./interfaces/Application');
const ApplicationCommandManager = require('../managers/ApplicationCommandManager');
const ApplicationFlags = require('../util/ApplicationFlags');
const { ApplicationRoleConnectionMetadataTypes } = require('../util/Constants');
const Permissions = require('../util/Permissions');

/**
 * @typedef {Object} ClientApplicationInstallParams
 * @property {InviteScope[]} scopes The scopes to add the application to the server with
 * @property {Readonly<Permissions>} permissions The permissions this bot will request upon joining
 */

/**
 * Represents a client application.
 * @extends {Application}
 */
class ClientApplication extends Application {
  constructor(client, data) {
    super(client, data);

    /**
     * The application command manager for this application
     * @type {ApplicationCommandManager}
     */
    this.commands = new ApplicationCommandManager(this.client);
  }

  _patch(data) {
    super._patch(data);

    /**
     * The tags this application has (max of 5)
     * @type {string[]}
     */
    this.tags = data.tags ?? [];

    if ('install_params' in data) {
      /**
       * Settings for this application's default in-app authorization
       * @type {?ClientApplicationInstallParams}
       */
      this.installParams = {
        scopes: data.install_params.scopes,
        permissions: new Permissions(data.install_params.permissions).freeze(),
      };
    } else {
      this.installParams ??= null;
    }

    if ('custom_install_url' in data) {
      /**
       * This application's custom installation URL
       * @type {?string}
       */
      this.customInstallURL = data.custom_install_url;
    } else {
      this.customInstallURL = null;
    }

    if ('flags' in data) {
      /**
       * The flags this application has
       * @type {ApplicationFlags}
       */
      this.flags = new ApplicationFlags(data.flags).freeze();
    }

    if ('approximate_guild_count' in data) {
      /**
       * An approximate amount of guilds this application is in.
       * @type {?number}
       */
      this.approximateGuildCount = data.approximate_guild_count;
    } else {
      this.approximateGuildCount ??= null;
    }

    if ('guild_id' in data) {
      /**
       * The id of the guild associated with this application.
       * @type {?Snowflake}
       */
      this.guildId = data.guild_id;
    } else {
      this.guildId ??= null;
    }

    if ('cover_image' in data) {
      /**
       * The hash of the application's cover image
       * @type {?string}
       */
      this.cover = data.cover_image;
    } else {
      this.cover ??= null;
    }

    if ('rpc_origins' in data) {
      /**
       * The application's RPC origins, if enabled
       * @type {string[]}
       */
      this.rpcOrigins = data.rpc_origins;
    } else {
      this.rpcOrigins ??= [];
    }

    if ('bot_require_code_grant' in data) {
      /**
       * If this application's bot requires a code grant when using the OAuth2 flow
       * @type {?boolean}
       */
      this.botRequireCodeGrant = data.bot_require_code_grant;
    } else {
      this.botRequireCodeGrant ??= null;
    }

    if ('bot_public' in data) {
      /**
       * If this application's bot is public
       * @type {?boolean}
       */
      this.botPublic = data.bot_public;
    } else {
      this.botPublic ??= null;
    }

    /**
     * The owner of this OAuth application
     * @type {?(User|Team)}
     */
    this.owner = data.team
      ? new Team(this.client, data.team)
      : data.owner
      ? this.client.users._add(data.owner)
      : this.owner ?? null;
  }

  /**
   * The guild associated with this application.
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.cache.get(this.guildId) ?? null;
  }

  /**
   * Whether this application is partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return !this.name;
  }

  /**
   * Obtains this application from Discord.
   * @returns {Promise<ClientApplication>}
   */
  async fetch() {
    const data = await this.client.api.applications('@me').get();
    this._patch(data);
    return this;
  }

  /**
   * Gets this application's role connection metadata records
   * @returns {Promise<ApplicationRoleConnectionMetadata[]>}
   */
  async fetchRoleConnectionMetadataRecords() {
    const metadata = await this.client.api.applications(this.client.user.id)('role-connections').metadata.get();
    return metadata.map(data => new ApplicationRoleConnectionMetadata(data));
  }

  /**
   * Data for creating or editing an application role connection metadata.
   * @typedef {Object} ApplicationRoleConnectionMetadataEditOptions
   * @property {string} name The name of the metadata field
   * @property {?Object<Locale, string>} [nameLocalizations] The name localizations for the metadata field
   * @property {string} description The description of the metadata field
   * @property {?Object<Locale, string>} [descriptionLocalizations] The description localizations for the metadata field
   * @property {string} key The dictionary key of the metadata field
   * @property {ApplicationRoleConnectionMetadataType} type The type of the metadata field
   */

  /**
   * Updates this application's role connection metadata records
   * @param {ApplicationRoleConnectionMetadataEditOptions[]} records The new role connection metadata records
   * @returns {Promise<ApplicationRoleConnectionMetadata[]>}
   */
  async editRoleConnectionMetadataRecords(records) {
    const newRecords = await this.client.api
      .applications(this.client.user.id)('role-connections')
      .metadata.put({
        data: records.map(record => ({
          type: typeof record.type === 'string' ? ApplicationRoleConnectionMetadataTypes[record.type] : record.type,
          key: record.key,
          name: record.name,
          name_localizations: record.nameLocalizations,
          description: record.description,
          description_localizations: record.descriptionLocalizations,
        })),
      });

    return newRecords.map(data => new ApplicationRoleConnectionMetadata(data));
  }
}

module.exports = ClientApplication;
