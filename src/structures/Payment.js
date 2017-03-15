const Constants = require('../util/Constants');

/**
 * Represents a single payment to Discord
 */
class Payment {
  constructor(data) {
    /**
     * Status of the payment
     * One of `PENDING`, `COMPLETED`, `FAILED`, `REVERSED`, `REFUNDED`
     * @type {string}
     */
    this.status = Constants.PaymentStatus[data.status];

    /**
     * @type {number}
     * Amount refunded in the lowest form of change in the currency specified
     */
    this.amountRefunded = data.amount_refunded;

    /**
     * @type {string}
     * Description of the payment
     */
    this.description = data.description;

    /**
     * @type {Date}
     * When the payment was created, __not paid__
     */
    this.createdAt = new Date(data.created_at);

    /**
     * @type {number}
     * When the payment was created, __not paid__
     */
    this.createdTimestamp = this.createdAt.getTime();

    /**
     * @type {string}
     * ISO 4217 currency
     */
    this.currency = data.currency;

    /**
     * @type {number}
     * Amount paid in the lowest form of change in the currency specified
     */
    this.amount = data.amount;
  }
}

module.exports = Payment;
