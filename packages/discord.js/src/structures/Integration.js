'use strict';

const { Routes } = require('discord-api-types/v10');
const Base = require('./Base');
const IntegrationApplication = require('./IntegrationApplication');

/**
 * The information account for an integration
 * @typedef {Object} IntegrationAccount
 * @property {Snowflake|string} id The id of the account
 * @property {string} name The name of the account
 */

/**
 * The type of an {@link Integration}. This can be:
 * * `twitch`
 * * `youtube`
 * * `discord`
 * @typedef {string} IntegrationType
 */

/**
 * Represents a guild integration.
 * @extends {Base}
 */
class Integration extends Base {
  constructor(client, data, guild) {
    super(client);

    /**
     * The guild this integration belongs to
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The integration id
     * @type {Snowflake|string}
     */
    this.id = data.id;

    /**
     * The integration name
     * @type {string}
     */
    this.name = data.name;

    /**
     * The integration type
     * @type {IntegrationType}
     */
    this.type = data.type;

    /**
     * Whether this integration is enabled
     * @type {?boolean}
     */
    this.enabled = data.enabled ?? null;

    if ('syncing' in data) {
      /**
       * Whether this integration is syncing
       * @type {?boolean}
       */
      this.syncing = data.syncing;
    } else {
      this.syncing ??= null;
    }

    /**
     * The role that this integration uses for subscribers
     * @type {?Role}
     */
    this.role = this.guild.roles.resolve(data.role_id);

    if ('enable_emoticons' in data) {
      /**
       * Whether emoticons should be synced for this integration (twitch only currently)
       * @type {?boolean}
       */
      this.enableEmoticons = data.enable_emoticons;
    } else {
      this.enableEmoticons ??= null;
    }

    if (data.user) {
      /**
       * The user for this integration
       * @type {?User}
       */
      this.user = this.client.users._add(data.user);
    } else {
      this.user ??= null;
    }

    /**
     * The account integration information
     * @type {IntegrationAccount}
     */
    this.account = data.account;

    if ('synced_at' in data) {
      /**
       * The timestamp at which this integration was last synced at
       * @type {?number}
       */
      this.syncedTimestamp = Date.parse(data.synced_at);
    } else {
      this.syncedTimestamp ??= null;
    }

    if ('subscriber_count' in data) {
      /**
       * How many subscribers this integration has
       * @type {?number}
       */
      this.subscriberCount = data.subscriber_count;
    } else {
      this.subscriberCount ??= null;
    }

    if ('revoked' in data) {
      /**
       * Whether this integration has been revoked
       * @type {?boolean}
       */
      this.revoked = data.revoked;
    } else {
      this.revoked ??= null;
    }

    this._patch(data);
  }

  /**
   * The date at which this integration was last synced at
   * @type {?Date}
   * @readonly
   */
  get syncedAt() {
    return this.syncedTimestamp && new Date(this.syncedTimestamp);
  }

  /**
   * All roles that are managed by this integration
   * @type {Collection<Snowflake, Role>}
   * @readonly
   */
  get roles() {
    const roles = this.guild.roles.cache;
    return roles.filter(role => role.tags?.integrationId === this.id);
  }

  _patch(data) {
    if ('expire_behavior' in data) {
      /**
       * The behavior of expiring subscribers
       * @type {?IntegrationExpireBehavior}
       */
      this.expireBehavior = data.expire_behavior;
    } else {
      this.expireBehavior ??= null;
    }

    if ('expire_grace_period' in data) {
      /**
       * The grace period (in days) before expiring subscribers
       * @type {?number}
       */
      this.expireGracePeriod = data.expire_grace_period;
    } else {
      this.expireGracePeriod ??= null;
    }

    if ('application' in data) {
      if (this.application) {
        this.application._patch(data.application);
      } else {
        /**
         * The application for this integration
         * @type {?IntegrationApplication}
         */
        this.application = new IntegrationApplication(this.client, data.application);
      }
    } else {
      this.application ??= null;
    }

    if ('scopes' in data) {
      /**
       * The scopes this application has been authorized for
       * @type {OAuth2Scopes[]}
       */
      this.scopes = data.scopes;
    } else {
      this.scopes ??= [];
    }
  }

  /**
   * Deletes this integration.
   * @returns {Promise<Integration>}
   * @param {string} [reason] Reason for deleting this integration
   */
  async delete(reason) {
    await this.client.rest.delete(Routes.guildIntegration(this.guild.id, this.id), { reason });
    return this;
  }

  toJSON() {
    return super.toJSON({
      role: 'roleId',
      guild: 'guildId',
      user: 'userId',
    });
  }
}

module.exports = Integration;
