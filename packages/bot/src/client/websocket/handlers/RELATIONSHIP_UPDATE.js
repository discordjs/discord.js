'use strict';

const { Events } = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const oldType = client.relationships.cache.get(data.id);
  const oldNickname = client.relationships.friendNicknames.get(data.id);
  const oldSince = client.relationships.sinceCache.get(data.id);

  if (data.type) client.relationships.cache.set(data.id, data.type);
  if (data.nickname !== undefined) client.relationships.friendNicknames.set(data.id, data.nickname);
  if (data.since) client.relationships.sinceCache.set(data.id, new Date(data.since || 0));

  /**
   * Emitted when a relationship is updated (e.g. nickname change, type change).
   *
   * @event Client#relationshipUpdate
   * @param {Snowflake} userId The user id
   * @param {Object} oldData The old relationship data
   * @param {Object} newData The new relationship data
   */
  client.emit(
    Events.RelationshipUpdate,
    data.id,
    { type: oldType, nickname: oldNickname, since: oldSince },
    { type: data.type, nickname: data.nickname, since: data.since ? new Date(data.since) : oldSince },
  );
};
