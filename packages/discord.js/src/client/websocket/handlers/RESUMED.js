'use strict';

const Events = require('../../../util/Events');

module.exports = (client, packet, shard) => {
  const replayed = shard.sessionInfo.sequence - shard.closeSequence;
  /**
   * Emitted when a shard resumes successfully.
   * @event Client#shardResume
   * @param {number} id The shard id that resumed
   * @param {number} replayedEvents The amount of replayed events
   */
  client.emit(Events.ShardResume, shard.id, replayed);
};
