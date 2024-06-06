'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class EntitlementUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const oldEntitlement = client.application.entitlements.cache.get(data.id)?._clone() ?? null;
    const newEntitlement = client.application.entitlements._add(data);

    /**
     * Emitted whenever an entitlement is updated - i.e. when a user's subscription renews.
     * @event Client#entitlementUpdate
     * @param {?Entitlement} oldEntitlement The entitlement before the update
     * @param {Entitlement} newEntitlement The entitlement after the update
     */
    client.emit(Events.EntitlementUpdate, oldEntitlement, newEntitlement);

    return {};
  }
}

module.exports = EntitlementUpdateAction;
