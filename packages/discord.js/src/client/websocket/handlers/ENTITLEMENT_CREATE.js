'use strict';

const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const entitlement = client.application.entitlements._add(data);

  /**
   * Emitted whenever an entitlement is created.
   * @event Client#entitlementCreate
   * @param {Entitlement} entitlement The entitlement that was created
   */
  client.emit(Events.EntitlementCreate, entitlement);
};
