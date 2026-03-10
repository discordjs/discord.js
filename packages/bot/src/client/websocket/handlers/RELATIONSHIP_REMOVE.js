'use strict';

const { Events } = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  client.relationships.cache.delete(data.id);
  client.relationships.friendNicknames.delete(data.id);
  client.relationships.sinceCache.delete(data.id);

  /**
   * Emitted when a relationship is removed (unfriend, unblock, or request cancelled).
   *
   * @event Client#relationshipRemove
   * @param {Snowflake} userId The user id
   * @param {number} type The previous relationship type
   * @param {?string} nickname The previous nickname
   */
  client.emit(Events.RelationshipRemove, data.id, data.type, data.nickname);
};
