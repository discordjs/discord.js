'use strict';

const Base = require('./Base');

/**
 * The information account for an integration
 * @typedef {Object} IntegrationAccount
 * @property {string} id The id of the account
 * @property {string} name The name of the account
 */

/**
 *  Represents a guild integration.
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
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The integration name
     * @type {string}
     */
    this.name = data.name;

    /**
     * The integration type (twitch, youtube, etc)
     * @type {string}
     */
    this.type = data.type;

    /**
     * Whether this integration is enabled
     * @type {boolean}
     */
    this.enabled = data.enabled;

    /**
     * Whether this integration is syncing
     * @type {boolean}
     */
    this.syncing = data.syncing;

    /**
     * The role that this integration uses for subscribers
     * @type {Role}
     */
    this.role = this.guild.roles.get(data.role_id);

    /**
     * The user for this integration
     * @type {User}
     */
    this.user = this.client.users.add(data.user);

    /**
     * The account integration information
     * @type {IntegrationAccount}
     */
    this.account = data.account;

    /**
     * The last time this integration was last synced
     * @type {number}
     */
    this.syncedAt = data.synced_at;
    this._patch(data);
  }

  _patch(data) {
    /**
     * The behavior of expiring subscribers
     * @type {number}
     */
    this.expireBehavior = data.expire_behavior;

    /**
     * The grace period before expiring subscribers
     * @type {number}
     */
    this.expireGracePeriod = data.expire_grace_period;
  }

  /**
   * Sync this integration
   * @returns {Promise<Integration>}
   */
  sync() {
    this.syncing = true;
    return this.client.api.guilds(this.guild.id).integrations(this.id).post()
      .then(() => {
        this.syncing = false;
        this.syncedAt = Date.now();
        return this;
      });
  }

  /**
   * The data for editing an integration.
   * @typedef {Object} IntegrationEditData
   * @property {number} [expireBehavior] The new behaviour of expiring subscribers
   * @property {number} [expireGracePeriod] The new grace period before expiring subscribers
   */

  /**
   * Edits this integration.
   * @param {IntegrationEditData} data The data to edit this integration with
   * @param {string} reason Reason for editing this integration
   * @returns {Promise<Integration>}
   */
  edit(data, reason) {
    if ('expireBehavior' in data) {
      data.expire_behavior = data.expireBehavior;
      data.expireBehavior = null;
    }
    if ('expireGracePeriod' in data) {
      data.expire_grace_period = data.expireGracePeriod;
      data.expireGracePeriod = null;
    }
    // The option enable_emoticons is only available for Twitch at this moment
    return this.client.api.guilds(this.guild.id).integrations(this.id).patch({ data, reason })
      .then(() => {
        this._patch(data);
        return this;
      });
  }

  /**
   * Deletes this integration.
   * @returns {Promise<Integration>}
   * @param {string} [reason] Reason for deleting this integration
   */
  delete(reason) {
    return this.client.api.guilds(this.guild.id).integrations(this.id).delete({ reason })
      .then(() => this);
  }

  toJSON() {
    return super.toJSON({
      role: 'roleID',
      guild: 'guildID',
      user: 'userID',
    });
  }
}

module.exports = Integration;
