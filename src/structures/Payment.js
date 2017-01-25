class Payment {
  constructor(data) {
    /**
     * Status of the payment
     * @type {string}
     */
    this.status = { 1: 'SUCCEEDED', 2: 'FAILED' }[data.status];

    /**
     * A description of the payment
     * @type {string}
     */
    this.description = data.description;

    /**
     * Currency of the payment
     * @type {string}
     */
    this.currency = data.currency;

    /**
     * Amount charged, if any
     * @type {number}
     */
    this.amount = data.amount;

    /**
     * Amount refunded, if any
     * @type {number}
     */
    this.amountRefunded = data.amount_refunded;

    /**
     * Time the payment was created
     * @type {Date}
     */
    this.createdAt = new Date(data.created_at);

    /**
     * Time the payment was created
     * @type {number}
     */
    this.createdTimestamp = this.createdAt.getTime();
  }
}

module.exports = Payment;
