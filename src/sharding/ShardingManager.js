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
     * Amount of shards that this manager is going to spawn
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
    /**
     * Emitted upon launching a shard
     * @event ShardingManager#launch
     * @param {Shard} shard Shard that was launched
     */
    this.emit('launch', shard);
  }

  /**
   * Spawns multiple shards.
   * @param {number} [amount=this.totalShards] Number of shards to spawn
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

  /**
   * Send a message to all shards.
   * @param {*} message Message to be sent to the shards
   * @returns {Promise<Shard[]>}
   */
  broadcast(message) {
    const promises = [];
    for (const shard of this.shards.values()) promises.push(shard.send(message));
    return Promise.all(promises);
  }

  /**
   * Obtains the total guild count across all shards.
   * @param {number} [timeout=3000] Time to automatically fail after (in milliseconds)
   * @returns {Promise<number>}
   */
  fetchGuildCount(timeout = 3000) {
    if (this._guildCountPromise) return Promise.reject(new Error('Already fetching guild count.'));
    if (this.shards.size !== this.totalShards) return Promise.reject(new Error('Still spawning shards.'));

    this._guildCountPromise = new Promise((resolve, reject) => {
      this._guildCount = 0;
      this._guildCountReplies = 0;

      const listener = message => {
        if (typeof message !== 'object' || !message._guildCount) return;

        this._guildCountReplies++;
        this._guildCount += message._guildCount;

        if (this._guildCountReplies >= this.shards.size) {
          clearTimeout(this._guildCountTimeout);
          process.removeListener('message', listener);
          this._guildCountTimeout = null;
          this._guildCountPromise = null;
          resolve(this._guildCount);
        }
      };
      process.on('message', listener);

      this._guildCountTimeout = setTimeout(() => {
        process.removeListener('message', listener);
        this._guildCountPromise = null;
        reject(new Error('Took too long to fetch the guild count.'));
      }, timeout);

      this.broadcast('_guildCount').catch(err => {
        process.removeListener('message', listener);
        this._guildCountPromise = null;
        reject(err);
      });
    });
    return this._guildCountPromise;
  }
}

module.exports = ShardingManager;
