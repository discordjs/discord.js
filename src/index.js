const path = require('path');

let version;

module.exports = {
  Client: require('./client/Client'),
  Shard: require('./sharding/Shard'),
  ShardingManager: require('./sharding/ShardingManager'),
  Collection: require('./util/Collection'),

  get version() {
    if (!version) version = require(path.join(__dirname, '..', 'package.json')).version;
    return version;
  },
};
