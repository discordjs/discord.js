const childProcess = require('child_process');
const path = require('path');

/**
 * Represents a Shard spawned by the ShardingManager.
 */
class Shard {
  constructor(manager, id) {
    /**
     * The manager of the spawned shard
     * @type {ShardingManager}
     */
    this.manager = manager;
    /**
     * The shard id
     * @type {number}
     */
    this.id = id;
    /**
     * The process of the shard
     * @type {process}
     */
    this.process = childProcess.fork(path.resolve(this.manager.file), [id, this.manager.shards.size]);
  }
}

module.exports = Shard;
