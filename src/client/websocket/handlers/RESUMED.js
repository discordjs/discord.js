const { Events } = require('../../../util/Constants');

module.exports = (client, packet, shard) => {
  /**
   * Emitted when the client gateway resumes.
   * @event Client#resume
   */
  client.emit(Events.RESUMED);

  /**
   * Emitted when the client gateway resumes.
   * @event Client#shardResume
   * @param {number} shardID The ID of the shard that resumed
   */
  shard.manager.emit(Events.SHARD_RESUMED, shard.id);
};
