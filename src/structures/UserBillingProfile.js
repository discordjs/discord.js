const Util = require('../util/Util');

/**
 * Billing profile containing information about the premium subscription and payment source
 */
class UserBillingProfile {
  constructor(data) {
    /**
     * @type {PremiumSubscription}
     */
    this.premiumSubscription = new PremiumSubscription(data.premium_subscription);

    /**
     * @type {PaymentSource}
     */
    this.paymentSource = new PaymentSource(data.payment_source);

    /**
     * @type {string}
     * The gateway used for making the payment
     */
    this.paymentGateway = data.payment_gateway;
  }
}

/**
 * Information about a user's premium subscription
 */
class PremiumSubscription {
  constructor(data) {
    /**
     * @type {number}
     * Status of the subscription
     */
    this.status = data.status;

    /**
     * @type {string}
     * Subscription plan
     */
    this.plan = data.plan;

    /**
     * @type {?Date}
     * Date the subscription ended, it it ended
     */
    this.endedAt = data.ended_at ? new Date(data.ended_at) : null;

    /**
     * @type {?number}
     * Timestamp of the subscription's end, it it ended
     */
    this.endedTimestamp = this.endedAt ? this.endedAt.getTime() : null;

    /**
     * @type {?Date}
     * When the subscription was cancelled, if it was
     */
    this.canceledAt = data.canceled_at ? new Date(data.canceled_at) : null;

    /**
     * @type {?number}
     * When the subscription was cancelled, if it was
     */
    this.canceledTimestamp = this.canceledAt ? this.canceledAt.getTime() : null;

    /**
     * @type {Date}
     * When the subscription was created
     */
    this.createdAt = data.created_at ? new Date(data.created_at) : null;

    /**
     * @type {?number}
     * When the subscription was created
     */
    this.createdTimestamp = this.createdAt ? this.createdAt.getTime() : null;

    const curPerStart = new Date(data.current_period_start);
    const curPerEnd = new Date(data.current_period_end);

    /**
     * @typedef PremiumSubscriptionCurrentPeriod
     * @prop {Date} startedAt Date the period started at
     * @prop {number} startedTimestamp Date the period started at
     * @prop {Date} endsAt Date the period started at
     * @prop {number} endsTimestamp Date the period started at
     */

    /**
     * @type {PremiumSubscriptionCurrentPeriod}
     */
    this.currentPeriod = {
      startedAt: curPerStart,
      startedTimetamp: curPerStart.getTime(),
      endsAt: curPerEnd,
      endsTimestamp: curPerEnd.getTime(),
    };
  }
}

/**
 * Information about a user's billing payment source
 */
class PaymentSource {
  constructor(data) {
    /**
     * @type {string}
     * Type of this payment source
     */
    this.type = data.type;

    /**
     * @type {string}
     * Brand of this payment source
     */
    this.brand = data.brand;

    /**
     * @type {boolean}
     * If this payment source is currently invalid
     */
    this.invalid = data.invalid;

    /**
     * @type {?String}
     * Last four digits of card, if payment source is a card
     */
    this.last4 = data.last_4 ? Util.padStart(data.last_4.toString(), 4, '0') : null;

    /**
     * @type {number}
     * Month the card expires, if the payment source is a card
     */
    this.expiresMonth = data.expires_month;
  }
}

module.exports = UserBillingProfile;
module.exports.PremiumSubscription = PremiumSubscription;
