'use strict';

const { Events } = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  if (data.user) {
    client.users._add(data.user);
  }

  client.relationships.cache.set(data.id, data.type);
  client.relationships.friendNicknames.set(data.id, data.nickname);
  client.relationships.sinceCache.set(data.id, new Date(data.since || 0));

  /**
   * Emitted when a relationship is added (friend, block, or pending request).
   *
   * @event Client#relationshipAdd
   * @param {Snowflake} userId The user id
   * @param {boolean} shouldNotify Whether this should trigger a notification
   */
  client.emit(Events.RelationshipAdd, data.id, Boolean(data.should_notify));
};
