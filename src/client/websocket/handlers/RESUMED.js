'use strict';

const { Events } = require('../../../util/Constants');

module.exports = (client, packet, shard) => {
  const replayed = shard.sequence - shard.closeSequence;
  /**
   * Emitted when the client gateway resumes.
   * @event Client#resume
   * @param {number} replayed The number of events that were replayed
   * @param {number} shardID The ID of the shard that resumed
   */
  client.emit(Events.RESUMED, replayed, shard.id);
};
