'use strict';

const Events = require('../../../util/Events');

module.exports = (client, { d: data }) => {
  const oldSubscription = client.application.subscriptions.cache.get(data.id)?._clone() ?? null;
  const newSubscription = client.application.subscriptions._add(data);

  /**
   * Emitted whenever a subscription is updated - i.e. when a user's subscription renews.
   * @event Client#subscriptionUpdate
   * @param {?Subscription} oldSubscription The subscription before the update
   * @param {Subscription} newSubscription The subscription after the update
   */
  client.emit(Events.SubscriptionUpdate, oldSubscription, newSubscription);
};
