'use strict';

const { Events } = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const entitlement = client.application.entitlements._add(data, false);

  client.application.entitlements.cache.delete(entitlement.id);

  /**
   * Emitted whenever an entitlement is deleted.
   * <warn>Entitlements are not deleted when they expire.
   * This is only triggered when Discord issues a refund or deletes the entitlement manually.</warn>
   *
   * @event Client#entitlementDelete
   * @param {Entitlement} entitlement The entitlement that was deleted
   */
  client.emit(Events.EntitlementDelete, entitlement);
};
