import { Events } from '../../../util/Events.js';

export default (client, { d: data }) => {
  const subscription = client.application.subscriptions._add(data);

  /**
   * Emitted whenever a subscription is created.
   *
   * @event Client#subscriptionCreate
   * @param {Subscription} subscription The subscription that was created
   */
  client.emit(Events.SubscriptionCreate, subscription);
};
