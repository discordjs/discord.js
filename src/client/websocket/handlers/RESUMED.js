const { Events } = require('../../../util/Constants');

module.exports = (client, packet, shard) => {
  /**
   * Emitted when the client gateway resumes.
   * @event Client#resume
   * @param {number} shardID The ID of the shard that resumed
   */
  client.emit(Events.RESUMED, shard.id);
};
