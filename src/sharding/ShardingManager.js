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
   * @param {boolean} [respawn=true] Respawn a shard when it dies
   */
  constructor(file, totalShards = 1, respawn = true) {
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
    this.totalShards = totalShards;
    if (typeof totalShards !== 'number' || isNaN(totalShards)) {
      throw new TypeError('Amount of shards must be a number.');
    }
    if (totalShards < 1) throw new RangeError('Amount of shards must be at least 1.');
    if (totalShards !== Math.floor(totalShards)) throw new RangeError('Amount of shards must be an integer.');

    this.respawn = respawn;

    /**
     * A collection of shards that this manager has spawned
     * @type {Collection<number, Shard>}
     */
    this.shards = new Collection();
  }

  /**
   * Spawns a single shard.
   * @param {number} id The ID of the shard to spawn. THIS IS NOT NEEDED IN ANY NORMAL CASE!
   * @returns {Promise<Shard>}
   */
  createShard(id = this.shards.size) {
    const shard = new Shard(this, id);
    this.shards.set(id, shard);
    /**
     * Emitted upon launching a shard
     * @event ShardingManager#launch
     * @param {Shard} shard Shard that was launched
     */
    this.emit('launch', shard);
    return Promise.resolve(shard);
  }

  /**
   * Spawns multiple shards.
   * @param {number} [amount=this.totalShards] Number of shards to spawn
   * @param {number} [delay=5500] How long to wait in between spawning each shard (in milliseconds)
   * @returns {Promise<Collection<number, Shard>>}
   */
  spawn(amount = this.totalShards, delay = 5500) {
    if (typeof amount !== 'number' || isNaN(amount)) throw new TypeError('Amount of shards must be a number.');
    if (amount < 1) throw new RangeError('Amount of shards must be at least 1.');
    if (amount !== Math.floor(amount)) throw new RangeError('Amount of shards must be an integer.');

    return new Promise(resolve => {
      if (this.shards.size >= amount) throw new Error(`Already spawned ${this.shards.size} shards.`);
      this.totalShards = amount;

      this.createShard();
      if (this.shards.size >= this.totalShards) {
        resolve(this.shards);
        return;
      }

      if (delay <= 0) {
        while (this.shards.size < this.totalShards) this.createShard();
        resolve(this.shards);
      } else {
        const interval = setInterval(() => {
          this.createShard();
          if (this.shards.size >= this.totalShards) {
            clearInterval(interval);
            resolve(this.shards);
          }
        }, delay);
      }
    });
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
   * Evaluates a script on all shards, in the context of the Clients.
   * @param {string} script JavaScript to run on each shard
   * @returns {Promise<Array>} Results of the script execution
   */
  broadcastEval(script) {
    const promises = [];
    for (const shard of this.shards.values()) promises.push(shard.eval(script));
    return Promise.all(promises);
  }

  /**
   * Fetches a Client property value of each shard.
   * @param {string} prop Name of the Client property to get, using periods for nesting
   * @returns {Promise<Array>}
   * @example
   * manager.fetchClientValues('guilds.size').then(results => {
   *   console.log(`${results.reduce((prev, val) => prev + val, 0)} total guilds`);
   * }).catch(console.error);
   */
  fetchClientValues(prop) {
    if (this.shards.size === 0) return Promise.reject(new Error('No shards have been spawned.'));
    if (this.shards.size !== this.totalShards) return Promise.reject(new Error('Still spawning shards.'));
    const promises = [];
    for (const shard of this.shards.values()) promises.push(shard.fetchClientValue(prop));
    return Promise.all(promises);
  }
}

module.exports = ShardingManager;
