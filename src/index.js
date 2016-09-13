const path = require('path');

module.exports = {
  Client: require('./client/Client'),
  Shard: require('./sharding/Shard'),
  ShardingManager: require('./sharding/ShardingManager'),
  Collection: require('./util/Collection'),
  version: require(path.join(__dirname, '..', 'package.json')).version,
};
