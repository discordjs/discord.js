const path = require('path');
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

const Shard = require('./Shard');
const Collection = require('../util/Collection');

/**
 * This is a utility class that can be used to help you spawn shards of your Client. Each shard is completely separate
 * from the other. The Shard Manager takes a path to a file and spawns it under the specified amount of shards safely.
 * <warn>The Sharding Manager is still experimental</warn>
 * @extends {EventEmitter}
 */
class ShardingManager extends EventEmitter {
  /**
   * @param {string} file Path to your shard script file
   * @param {number} [totalShards=1] Number of shards to default to spawning
   */
  constructor(file, totalShards) {
    super();

    /**
     * Path to the shard script file
     * @type {string}
     */
    this.file = file;
    if (!file) throw new Error('File must be specified.');
    if (!path.isAbsolute(file)) this.file = path.resolve(process.cwd(), file);
    const stats = fs.statSync(this.file);
    if (!stats.isFile()) throw new Error('File path does not point to a file.');

    /**
     * The amount of shards that this manager is going to spawn
     * @type {number}
     */
    this.totalShards = typeof totalShards !== 'undefined' ? totalShards : 1;
    if (typeof this.totalShards !== 'number' || isNaN(this.totalShards)) {
      throw new TypeError('Amount of shards must be a number.');
    }
    if (this.totalShards < 1) throw new RangeError('Amount of shards must be at least 1.');

    /**
     * A collection of shards that this manager has spawned
     * @type {Collection<number, Shard>}
     */
    this.shards = new Collection();
  }

  /**
   * Spawns a single shard.
   */
  createShard() {
    const id = this.shards.size;
    const shard = new Shard(this, id);
    this.shards.set(id, shard);
    this.emit('launch', id, shard);
  }

  /**
   * Spawns multiple shards.
   * @param {number} [amount=this.totalShards] The number of shards to spawn
   */
  spawn(amount) {
    if (typeof amount !== 'undefined') {
      if (typeof amount !== 'number' || isNaN(amount)) throw new TypeError('Amount of shards must be a number.');
      if (amount < 1) throw new RangeError('Amount of shards must be at least 1.');
      this.totalShards = amount;
    }

    this.createShard();
    const interval = setInterval(() => {
      if (this.shards.size === this.totalShards) clearInterval(interval);
      else this.createShard();
    }, 5500);
  }
}

module.exports = ShardingManager;
