'use strict';

const { Routes } = require('discord-api-types/v10');
const { ApplicationRoleConnectionMetadata } = require('./ApplicationRoleConnectionMetadata');
const Team = require('./Team');
const Application = require('./interfaces/Application');
const ApplicationCommandManager = require('../managers/ApplicationCommandManager');
const ApplicationFlagsBitField = require('../util/ApplicationFlagsBitField');
const DataResolver = require('../util/DataResolver');
const PermissionsBitField = require('../util/PermissionsBitField');

/**
 * @typedef {Object} ClientApplicationInstallParams
 * @property {OAuth2Scopes[]} scopes The scopes to add the application to the server with
 * @property {Readonly<PermissionsBitField>} permissions The permissions this bot will request upon joining
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
        permissions: new PermissionsBitField(data.install_params.permissions).freeze(),
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
       * @type {ApplicationFlagsBitField}
       */
      this.flags = new ApplicationFlagsBitField(data.flags).freeze();
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

    if ('bot' in data) {
      /**
       * The bot associated with this application.
       * @type {?User}
       */
      this.bot = this.client.users._add(data.bot);
    } else {
      this.bot ??= null;
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

    if ('interactions_endpoint_url' in data) {
      /**
       * This application's interaction endpoint URL.
       * @type {?string}
       */
      this.interactionsEndpointURL = data.interactions_endpoint_url;
    } else {
      this.interactionsEndpointURL ??= null;
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
   * Options used for editing an application.
   * @typedef {Object} ClientApplicationEditOptions
   * @property {string} [customInstallURL] The application's custom installation URL
   * @property {string} [description] The application's description
   * @property {string} [roleConnectionsVerificationURL] The application's role connection verification URL
   * @property {ClientApplicationInstallParams} [installParams]
   * Settings for the application's default in-app authorization
   * @property {ApplicationFlagsResolvable} [flags] The flags for the application
   * @property {?(BufferResolvable|Base64Resolvable)} [icon] The application's icon
   * @property {?(BufferResolvable|Base64Resolvable)} [coverImage] The application's cover image
   * @property {string} [interactionsEndpointURL] The application's interaction endpoint URL
   * @property {string[]} [tags] The application's tags
   */

  /**
   * Edits this application.
   * @param {ClientApplicationEditOptions} [options] The options for editing this application
   * @returns {Promise<ClientApplication>}
   */
  async edit({
    customInstallURL,
    description,
    roleConnectionsVerificationURL,
    installParams,
    flags,
    icon,
    coverImage,
    interactionsEndpointURL,
    tags,
  } = {}) {
    const data = await this.client.rest.patch(Routes.currentApplication(), {
      body: {
        custom_install_url: customInstallURL,
        description,
        role_connections_verification_url: roleConnectionsVerificationURL,
        install_params: installParams,
        flags: flags === undefined ? undefined : ApplicationFlagsBitField.resolve(flags),
        icon: icon && (await DataResolver.resolveImage(icon)),
        cover_image: coverImage && (await DataResolver.resolveImage(coverImage)),
        interactions_endpoint_url: interactionsEndpointURL,
        tags,
      },
    });

    this._patch(data);
    return this;
  }

  /**
   * Obtains this application from Discord.
   * @returns {Promise<ClientApplication>}
   */
  async fetch() {
    const data = await this.client.rest.get(Routes.currentApplication());
    this._patch(data);
    return this;
  }

  /**
   * Gets this application's role connection metadata records
   * @returns {Promise<ApplicationRoleConnectionMetadata[]>}
   */
  async fetchRoleConnectionMetadataRecords() {
    const metadata = await this.client.rest.get(Routes.applicationRoleConnectionMetadata(this.client.user.id));
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
    const newRecords = await this.client.rest.put(Routes.applicationRoleConnectionMetadata(this.client.user.id), {
      body: records.map(record => ({
        type: record.type,
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
