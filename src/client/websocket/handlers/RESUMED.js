const { Events } = require('../../../util/Constants');

module.exports = (client, packet, shard) => {
  const replayed = shard.sequence - shard.closeSequence;
  /**
   * Emitted when a shard resumes its gateway.
   * @event WebSocketShard#resumed
   * @param {number} replayed The number of events that were replayed
   */
  shard.emit(Events.RESUMED, replayed);

  /**
   * Emitted when the client gateway resumes.
   * @event Client#resumed
   * @param {number} replayed The number of events that were replayed
   * @param {number} shardID The ID of the shard
   */
  client.emit(Events.SHARD_RESUMED, replayed, shard.id);
};
