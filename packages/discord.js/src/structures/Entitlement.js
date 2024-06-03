'use strict';

const Base = require('./Base');

/**
 * Represents an Entitlement
 * @extends {Base}
 */
class Entitlement extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The id of the entitlement
     * @type {Snowflake}
     */
    this.id = data.id;

    this._patch(data);
  }

  _patch(data) {
    if ('sku_id' in data) {
      /**
       * The id of the associated SKU
       * @type {Snowflake}
       */
      this.skuId = data.sku_id;
    }

    if ('user_id' in data) {
      /**
       * The id of the user that is granted access to this entitlement's SKU
       * @type {Snowflake}
       */
      this.userId = data.user_id;
    }

    if ('guild_id' in data) {
      /**
       * The id of the guild that is granted access to this entitlement's SKU
       * @type {?Snowflake}
       */
      this.guildId = data.guild_id;
    } else {
      this.guildId ??= null;
    }

    if ('application_id' in data) {
      /**
       * The id of the parent application
       * @type {Snowflake}
       */
      this.applicationId = data.application_id;
    }

    if ('type' in data) {
      /**
       * The type of this entitlement
       * @type {EntitlementType}
       */
      this.type = data.type;
    }

    if ('deleted' in data) {
      /**
       * Whether this entitlement was deleted
       * @type {boolean}
       */
      this.deleted = data.deleted;
    }

    if ('starts_at' in data) {
      /**
       * The timestamp at which this entitlement is valid
       * <info>This is only `null` for test entitlements</info>
       * @type {?number}
       */
      this.startsTimestamp = Date.parse(data.starts_at);
    } else {
      this.startsTimestamp ??= null;
    }

    if ('ends_at' in data) {
      /**
       * The timestamp at which this entitlement is no longer valid
       * <info>This is only `null` for test entitlements</info>
       * @type {?number}
       */
      this.endsTimestamp = Date.parse(data.ends_at);
    } else {
      this.endsTimestamp ??= null;
    }

    if ('consumed' in data) {
      /**
       * Whether this entitlement has been consumed
       * @type {boolean}
       */
      this.consumed = data.consumed;
    } else {
      this.consumed ??= false;
    }
  }

  /**
   * The guild that is granted access to this entitlement's SKU
   * @type {?Guild}
   */
  get guild() {
    if (!this.guildId) return null;
    return this.client.guilds.cache.get(this.guildId) ?? null;
  }

  /**
   * The start date at which this entitlement is valid
   * <info>This is only `null` for test entitlements</info>
   * @type {?Date}
   */
  get startsAt() {
    return this.startsTimestamp && new Date(this.startsTimestamp);
  }

  /**
   * The end date at which this entitlement is no longer valid
   * <info>This is only `null` for test entitlements</info>
   * @type {?Date}
   */
  get endsAt() {
    return this.endsTimestamp && new Date(this.endsTimestamp);
  }

  /**
   * Indicates whether this entitlement is active
   * @returns {boolean}
   */
  isActive() {
    return !this.deleted && (!this.endsTimestamp || this.endsTimestamp > Date.now());
  }

  /**
   * Indicates whether this entitlement is a test entitlement
   * @returns {boolean}
   */
  isTest() {
    return this.startsTimestamp === null;
  }

  /**
   * Indicates whether this entitlement is a user subscription
   * @returns {boolean}
   */
  isUserSubscription() {
    return this.guildId === null;
  }

  /**
   * Indicates whether this entitlement is a guild subscription
   * @returns {boolean}
   */
  isGuildSubscription() {
    return this.guildId !== null;
  }

  /**
   * Fetches the user that is granted access to this entitlement's SKU
   * @returns {Promise<User>}
   */
  fetchUser() {
    return this.client.users.fetch(this.userId);
  }

  /**
   * Marks this entitlement as consumed
   * <info>Only available for One-Time Purchase consumable SKUs.</info>
   * @returns {Promise<void>}
   */
  async consume() {
    await this.client.application.entitlements.consume(this.id);
  }
}

exports.Entitlement = Entitlement;
