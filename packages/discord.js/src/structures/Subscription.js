'use strict';

const Base = require('./Base');

/**
 * Represents a Subscription
 * @extends {Base}
 */
class Subscription extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The id of the subscription
     * @type {Snowflake}
     */
    this.id = data.id;

    this._patch(data);
  }

  _patch(data) {
    if ('sku_ids' in data) {
      /**
       * The SKU ids subscribed to
       * @type {Snowflake[]}
       */
      this.skuIds = data.sku_ids;
    }

    if ('entitlement_ids' in data) {
      /**
       * The entitlement ids granted for this subscription
       * @type {Snowflake[]}
       */
      this.entitlementIds = data.entitlement_ids;
    }

    if ('current_period_start' in data) {
      /**
       * The start of the current subscription period
       * @type {Date}
       */
      this.currentPeriodStart = new Date(data.current_period_start);
    }

    if ('current_period_end' in data) {
      /**
       * The end of the current subscription period
       * @type {Date}
       */
      this.currentPeriodEnd = new Date(data.current_period_end);
    }

    if ('status' in data) {
      /**
       * The current status of the subscription
       * @type {SubscriptionStatus}
       */
      this.status = data.status;
    }

    if ('canceled_at' in data) {
      /**
       * The timestamp of when the subscription was canceled
       * @type {?number}
       */
      this.canceledTimestamp = data.canceled_at ? Date.parse(data.canceled_at) : null;
    } else {
      this.canceledTimestamp ??= null;
    }

    if ('country' in data) {
      /**
       * ISO3166-1 alpha-2 country code of the payment source used to purchase the subscription.
       * Missing unless queried with a private OAuth scope.
       * @type {string|undefined}
       */
      this.country = data.country;
    }
  }

  /**
   * The date at which this subscription was canceled
   * @type {?Date}
   */
  get canceledAt() {
    return this.canceledTimestamp && new Date(this.canceledTimestamp);
  }
}

exports.Subscription = Subscription;
