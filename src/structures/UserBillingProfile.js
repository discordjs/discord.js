class UserBillingProfile {
  constructor(data) {
    /**
     * The payment gateway used for billing
     * @type {string}
     */
    this.paymentGateway = data.payment_gateway;

    /**
     * The payment source used for billing
     * @type {?PaymentSource}
     */
    this.paymentSource = new PaymentSource(data.payment_source);

    /**
     * The premium subscription
     * @type {?PremiumSubscription}
     */
    this.premiumSubscription = new PremiumSubscription(data.premium_subscription);
  }
}

class PaymentSource {
  constructor(data) {
    /**
     * Payment source type
     * @type {string}
     */
    this.type = data.type;

    /**
     * Brand of the payment source
     * @type {string}
     */
    this.brand = data.brand;

    /**
     * Month the card expires
     * @type {number}
     */
    this.expiresMonth = data.expires_month;

    /**
     * Year the card expires
     * @type {number}
     */
    this.expiresYear = data.expires_year;

    /**
     * Whether the payment source is invalid
     * @type {boolean}
     */
    this.invalid = data.invalid;

    /**
     * The last four digits of the card (if the type is card)
     * @type {?number}
     */
    this.last4 = data.last_4;
  }
}

class PremiumSubscription {
  constructor(data) {
    /**
     * Status of the subscription
     * @type {number}
     */
    this.status = data.status;

    /**
     * Plan for the subscription
     * @type {string}
     */
    this.plan = data.plan;

    /**
     * When the subscription ended, if it did
     * @type {?date}
     */
    this.endedAt = data.ended_at ? new Date(data.ended_at) : null;

    /**
     * When the subscription ended, if it did
     * @type {?number}
     */
    this.endedTimestamp = this.endedAt ? this.endedAt.getTime() : null;

    /**
     * When the subscription was canceled, if it was
     * @type {?date}
     */
    this.canceledAt = data.canceled_at ? new Date(data.canceled_at) : null;

    /**
     * When the subscription ended, if it did
     * @type {?number}
     */
    this.canceledTimestamp = this.canceledAt ? this.canceledAt.getTime() : null;

    /**
     * When the subscription billing period starts, if one exists
     * @type {?date}
     */
    this.currentPeriodStartAt = data.current_period_start ? new Date(data.current_period_start) : null;

    /**
     * When the subscription billing period starts, if one exists
     * @type {?number}
     */
    this.currentPeriotStartTimestamp = this.currentPeriodStartAt ? this.currentPeriodStartAt.getTime() : null;

    /**
     * When the subscription billing period ends, if one exists
     * @type {?date}
     */
    this.currentPeriodEndAt = data.current_period_end ? new Date(data.current_period_end) : null;

    /**
     * When the subscription billing period ends, if one exists
     * @type {?number}
     */
    this.currentPeriotEndTimestamp = this.currentPeriodEndAt ? this.currentPeriodEndAt.getTime() : null;
  }
}

module.exports = UserBillingProfile;
