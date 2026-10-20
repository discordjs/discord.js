import { Events } from '../../../util/Events.js';

export default (client, { d: data }) => {
  const subscription = client.application.subscriptions._add(data, false);

  client.application.subscriptions.cache.delete(subscription.id);

  /**
   * Emitted whenever a subscription is deleted.
   *
   * @event Client#subscriptionDelete
   * @param {Subscription} subscription The subscription that was deleted
   */
  client.emit(Events.SubscriptionDelete, subscription);
};
