const path = require('path');
const EventEmitter = require('events').EventEmitter;
const Collection = require('../util/Collection');
const Shard = require('./Shard');

/**
 * This is a utility class that can be used to help you spawn shards of your Client. Each shard is completely separate
 * from the other. The Shard Manager takes a path to a file and spawns it under the specified amount of shards safely.
 * <warn>The Sharding Manager is still experimental</warn>
 * @extends {EventEmitter}
 */
class ShardingManager extends EventEmitter {
  /**
   * Creates an instance of ShardingManager.
   * @param {string} file the path to your file
   * @param {number} totalShards the number of shards you would like to spawn
   */
  constructor(file, totalShards) {
    super();
    this.file = file;
    if (!path.isAbsolute(file)) {
      this.file = path.resolve(`${process.cwd()}${file}`);
    }
    /**
     * The amount of shards that this manager is going to spawn
     * @type {number}
     */
    this.totalShards = totalShards;
    /**
     * A collection of shards that this manager has spawned.
     * @type {Collection<number, Shard>}
     */
    this.shards = new Collection();
    this.waiting = new Collection();
  }

  createShard() {
    const id = this.shards.size;
    const shard = new Shard(this, id);
    this.shards.set(id, shard);
    this.emit('launch', id, shard);
  }

  spawn(amount) {
    this.totalShards = amount;
    this.createShard();
    const interval = setInterval(() => {
      if (this.shards.size === this.totalShards) {
        return clearInterval(interval);
      }
      return this.createShard();
    }, 5500);
  }
}

module.exports = ShardingManager;
