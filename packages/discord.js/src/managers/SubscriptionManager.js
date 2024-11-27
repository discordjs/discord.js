'use strict';

const { Collection } = require('@discordjs/collection');
const { makeURLSearchParams } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const { DiscordjsTypeError, ErrorCodes } = require('../errors/index');
const { Subscription } = require('../structures/Subscription');
const { resolveSKUId } = require('../util/Util');

/**
 * Manages API methods for subscriptions and stores their cache.
 * @extends {CachedManager}
 */
class SubscriptionManager extends CachedManager {
  constructor(client, iterable) {
    super(client, Subscription, iterable);
  }

  /**
   * The cache of this manager
   * @type {Collection<Snowflake, Subscription>}
   * @name SubscriptionManager#cache
   */

  /**
   * Options used to fetch a subscription
   * @typedef {BaseFetchOptions} FetchSubscriptionOptions
   * @property {SKUResolvable} sku The SKU to fetch the subscription for
   * @property {Snowflake} subscriptionId The id of the subscription to fetch
   */

  /**
   * Options used to fetch subscriptions
   * @typedef {Object} FetchSubscriptionsOptions
   * @property {Snowflake} [after] Consider only subscriptions after this subscription id
   * @property {Snowflake} [before] Consider only subscriptions before this subscription id
   * @property {number} [limit] The maximum number of subscriptions to fetch
   * @property {SKUResolvable} sku The SKU to fetch subscriptions for
   * @property {UserResolvable} user The user to fetch entitlements for
   * <warn>If both `before` and `after` are provided, only `before` is respected</warn>
   */

  /**
   * Fetches subscriptions for this application
   * @param {FetchSubscriptionOptions|FetchSubscriptionsOptions} [options={}] Options for fetching the subscriptions
   * @returns {Promise<Subscription|Collection<Snowflake, Subscription>>}
   */
  async fetch(options = {}) {
    if (typeof options !== 'object') throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'options', 'object', true);

    const { after, before, cache, limit, sku, subscriptionId, user } = options;

    const skuId = resolveSKUId(sku);

    if (!skuId) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'sku', 'SKUResolvable');

    if (subscriptionId) {
      const subscription = await this.client.rest.get(Routes.skuSubscription(skuId, subscriptionId));

      return this._add(subscription, cache);
    }

    const query = makeURLSearchParams({
      limit,
      user_id: this.client.users.resolveId(user) ?? undefined,
      sku_id: skuId,
      before,
      after,
    });

    const subscriptions = await this.client.rest.get(Routes.skuSubscriptions(skuId), { query });

    return subscriptions.reduce(
      (coll, subscription) => coll.set(subscription.id, this._add(subscription, cache)),
      new Collection(),
    );
  }
}

exports.SubscriptionManager = SubscriptionManager;
