const { Events } = require('../../../util/Constants');

module.exports = (client, packet, shard) => {
  client.emit(Events.RESUMED, shard.id);
};
