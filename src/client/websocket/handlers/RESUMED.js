'use strict';

const { Events } = require('../../../util/Constants');

module.exports = (client, packet, shard) => {
  const replayed = shard.sequence - shard.closeSequence;
  /**
   * Emitted when a shard resumes successfully.
   * @event Client#shardResumed
   * @param {number} id The shard ID that resumed
   * @param {number} replayedEvents The amount of replayed events
   */
  client.emit(Events.SHARD_RESUMED, shard.id, replayed);
};
