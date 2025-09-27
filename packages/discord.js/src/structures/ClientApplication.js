'use strict';

const { Collection } = require('@discordjs/collection');
const { Routes } = require('discord-api-types/v10');
const { ApplicationRoleConnectionMetadata } = require('./ApplicationRoleConnectionMetadata');
const { SKU } = require('./SKU');
const Team = require('./Team');
const Application = require('./interfaces/Application');
const ApplicationCommandManager = require('../managers/ApplicationCommandManager');
const ApplicationEmojiManager = require('../managers/ApplicationEmojiManager');
const { EntitlementManager } = require('../managers/EntitlementManager');
const { SubscriptionManager } = require('../managers/SubscriptionManager');
const ApplicationFlagsBitField = require('../util/ApplicationFlagsBitField');
const { resolveImage } = require('../util/DataResolver');
const PermissionsBitField = require('../util/PermissionsBitField');

/**
 * @typedef {Object} ClientApplicationInstallParams
 * @property {OAuth2Scopes[]} scopes Scopes that will be set upon adding this application
 * @property {Readonly<PermissionsBitField>} permissions Permissions that will be requested for the integrated role
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

    /**
     * The application emoji manager for this application
     * @type {ApplicationEmojiManager}
     */
    this.emojis = new ApplicationEmojiManager(this);

    /**
     * The entitlement manager for this application
     * @type {EntitlementManager}
     */
    this.entitlements = new EntitlementManager(this.client);

    /**
     * The subscription manager for this application
     * @type {SubscriptionManager}
     */
    this.subscriptions = new SubscriptionManager(this.client);
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

    /**
     * OAuth2 installation parameters.
     * @typedef {Object} IntegrationTypesConfigurationParameters
     * @property {OAuth2Scopes[]} scopes Scopes that will be set upon adding this application
     * @property {Readonly<PermissionsBitField>} permissions Permissions that will be requested for the integrated role
     */

    /**
     * The application's supported installation context data.
     * @typedef {Object} IntegrationTypesConfigurationContext
     * @property {?IntegrationTypesConfigurationParameters} oauth2InstallParams
     * Scopes and permissions regarding the installation context
     */

    /**
     * The application's supported installation context data.
     * @typedef {Object} IntegrationTypesConfiguration
     * @property {IntegrationTypesConfigurationContext} [0] Scopes and permissions
     * regarding the guild-installation context
     * @property {IntegrationTypesConfigurationContext} [1] Scopes and permissions
     * regarding the user-installation context
     */

    if ('integration_types_config' in data) {
      /**
       * Default scopes and permissions for each supported installation context.
       * The keys are stringified variants of {@link ApplicationIntegrationType}.
       * @type {?IntegrationTypesConfiguration}
       */
      this.integrationTypesConfig = Object.fromEntries(
        Object.entries(data.integration_types_config).map(([key, config]) => {
          let oauth2InstallParams = null;
          if (config.oauth2_install_params) {
            oauth2InstallParams = {
              scopes: config.oauth2_install_params.scopes,
              permissions: new PermissionsBitField(config.oauth2_install_params.permissions).freeze(),
            };
          }

          const context = {
            oauth2InstallParams,
          };

          return [key, context];
        }),
      );
    } else {
      this.integrationTypesConfig ??= null;
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

    if ('approximate_user_install_count' in data) {
      /**
       * An approximate amount of users that have installed this application.
       * @type {?number}
       */
      this.approximateUserInstallCount = data.approximate_user_install_count;
    } else {
      this.approximateUserInstallCount ??= null;
    }

    if ('approximate_user_authorization_count' in data) {
      /**
       * An approximate amount of users that have OAuth2 authorizations for this application.
       *
       * @type {?number}
       */
      this.approximateUserAuthorizationCount = data.approximate_user_authorization_count;
    } else {
      this.approximateUserAuthorizationCount ??= null;
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

    if ('event_webhooks_url' in data) {
      /**
       * This application's URL to receive event webhooks
       * @type {?string}
       */
      this.eventWebhooksURL = data.event_webhooks_url;
    } else {
      this.eventWebhooksURL ??= null;
    }

    if ('event_webhooks_status' in data) {
      /**
       * This application's event webhooks status
       * @type {?ApplicationWebhookEventStatus}
       */
      this.eventWebhooksStatus = data.event_webhooks_status;
    } else {
      this.eventWebhooksStatus ??= null;
    }

    if ('event_webhooks_types' in data) {
      /**
       * List of event webhooks types this application subscribes to
       * @type {?ApplicationWebhookEventType[]}
       */
      this.eventWebhooksTypes = data.event_webhooks_types;
    } else {
      this.eventWebhooksTypes ??= null;
    }

    /**
     * The owner of this OAuth application
     * @type {?(User|Team)}
     */
    this.owner = data.team
      ? new Team(this.client, data.team)
      : data.owner
        ? this.client.users._add(data.owner)
        : (this.owner ?? null);
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
   * @property {string} [eventWebhooksURL] The application's event webhooks URL
   * @property {ApplicationWebhookEventStatus.Enabled|ApplicationWebhookEventStatus.Disabled} [eventWebhooksStatus]
   * The application's event webhooks status.
   * @property {ApplicationWebhookEventType[]} [eventWebhooksTypes] The application's event webhooks types
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
    eventWebhooksURL,
    eventWebhooksStatus,
    eventWebhooksTypes,
    tags,
  } = {}) {
    const data = await this.client.rest.patch(Routes.currentApplication(), {
      body: {
        custom_install_url: customInstallURL,
        description,
        role_connections_verification_url: roleConnectionsVerificationURL,
        install_params: installParams,
        flags: flags === undefined ? undefined : ApplicationFlagsBitField.resolve(flags),
        icon: icon && (await resolveImage(icon)),
        cover_image: coverImage && (await resolveImage(coverImage)),
        interactions_endpoint_url: interactionsEndpointURL,
        event_webhooks_url: eventWebhooksURL,
        event_webhooks_status: eventWebhooksStatus,
        event_webhooks_types: eventWebhooksTypes,
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
   * @property {?LocalizationMap} [nameLocalizations] The name localizations for the metadata field
   * @property {string} description The description of the metadata field
   * @property {?LocalizationMap} [descriptionLocalizations] The description localizations for the metadata field
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

  /**
   * Gets this application's SKUs
   * @returns {Promise<Collection<Snowflake, SKU>>}
   */
  async fetchSKUs() {
    const skus = await this.client.rest.get(Routes.skus(this.id));
    return skus.reduce((coll, sku) => coll.set(sku.id, new SKU(this.client, sku)), new Collection());
  }
}

module.exports = ClientApplication;
