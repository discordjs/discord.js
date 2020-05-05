'use strict';

const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const Shard = require('./Shard');
const { Error, TypeError, RangeError } = require('../errors');
const Collection = require('../util/Collection');
const Util = require('../util/Util');

/**
 * This is a utility class that makes multi-process sharding of a bot an easy and painless experience.
 * It works by spawning a self-contained {@link ChildProcess} or {@link Worker} for each individual shard, each
 * containing its own instance of your bot's {@link Client}. They all have a line of communication with the master
 * process, and there are several useful methods that utilise it in order to simplify tasks that are normally difficult
 * with sharding. It can spawn a specific number of shards or the amount that Discord suggests for the bot, and takes a
 * path to your main bot script to launch for each one.
 * @extends {EventEmitter}
 */
class ShardingManager extends EventEmitter {
  /**
   * The mode to spawn shards with for a {@link ShardingManager}: either "process" to use child processes, or
   * "worker" to use [Worker threads](https://nodejs.org/api/worker_threads.html).
   * @typedef {Object} ShardingManagerMode
   */

  /**
   * @param {string} file Path to your shard script file
   * @param {Object} [options] Options for the sharding manager
   * @param {string|number} [options.totalShards='auto'] Number of total shards of all shard managers or "auto"
   * @param {string|number[]} [options.shardList='auto'] List of shards to spawn or "auto"
   * @param {ShardingManagerMode} [options.mode='process'] Which mode to use for shards
   * @param {boolean} [options.respawn=true] Whether shards should automatically respawn upon exiting
   * @param {string[]} [options.shardArgs=[]] Arguments to pass to the shard script when spawning
   * (only available when using the `process` mode)
   * @param {string[]} [options.execArgv=[]] Arguments to pass to the shard script executable when spawning
   * (only available when using the `process` mode)
   * @param {string} [options.token] Token to use for automatic shard count and passing to shards
   */
  constructor(file, options = {}) {
    super();
    options = Util.mergeDefault(
      {
        totalShards: 'auto',
        mode: 'process',
        respawn: true,
        shardArgs: [],
        execArgv: [],
        token: process.env.DISCORD_TOKEN,
      },
      options,
    );

    /**
     * Path to the shard script file
     * @type {string}
     */
    this.file = file;
    if (!file) throw new Error('CLIENT_INVALID_OPTION', 'File', 'specified.');
    if (!path.isAbsolute(file)) this.file = path.resolve(process.cwd(), file);
    const stats = fs.statSync(this.file);
    if (!stats.isFile()) throw new Error('CLIENT_INVALID_OPTION', 'File', 'a file');

    /**
     * List of shards this sharding manager spawns
     * @type {string|number[]}
     */
    this.shardList = options.shardList || 'auto';
    if (this.shardList !== 'auto') {
      if (!Array.isArray(this.shardList)) {
        throw new TypeError('CLIENT_INVALID_OPTION', 'shardList', 'an array.');
      }
      this.shardList = [...new Set(this.shardList)];
      if (this.shardList.length < 1) throw new RangeError('CLIENT_INVALID_OPTION', 'shardList', 'at least 1 ID.');
      if (
        this.shardList.some(
          shardID => typeof shardID !== 'number' || isNaN(shardID) || !Number.isInteger(shardID) || shardID < 0,
        )
      ) {
        throw new TypeError('CLIENT_INVALID_OPTION', 'shardList', 'an array of positive integers.');
      }
    }

    /**
     * Amount of shards that all sharding managers spawn in total
     * @type {number}
     */
    this.totalShards = options.totalShards || 'auto';
    if (this.totalShards !== 'auto') {
      if (typeof this.totalShards !== 'number' || isNaN(this.totalShards)) {
        throw new TypeError('CLIENT_INVALID_OPTION', 'Amount of shards', 'a number.');
      }
      if (this.totalShards < 1) throw new RangeError('CLIENT_INVALID_OPTION', 'Amount of shards', 'at least 1.');
      if (!Number.isInteger(this.totalShards)) {
        throw new RangeError('CLIENT_INVALID_OPTION', 'Amount of shards', 'an integer.');
      }
    }

    /**
     * Mode for shards to spawn with
     * @type {ShardingManagerMode}
     */
    this.mode = options.mode;
    if (this.mode !== 'process' && this.mode !== 'worker') {
      throw new RangeError('CLIENT_INVALID_OPTION', 'Sharding mode', '"process" or "worker"');
    }

    /**
     * Whether shards should automatically respawn upon exiting
     * @type {boolean}
     */
    this.respawn = options.respawn;

    /**
     * An array of arguments to pass to shards (only when {@link ShardingManager#mode} is `process`)
     * @type {string[]}
     */
    this.shardArgs = options.shardArgs;

    /**
     * An array of arguments to pass to the executable (only when {@link ShardingManager#mode} is `process`)
     * @type {string[]}
     */
    this.execArgv = options.execArgv;

    /**
     * Token to use for obtaining the automatic shard count, and passing to shards
     * @type {?string}
     */
    this.token = options.token ? options.token.replace(/^Bot\s*/i, '') : null;

    /**
     * A collection of shards that this manager has spawned
     * @type {Collection<number, Shard>}
     */
    this.shards = new Collection();

    process.env.SHARDING_MANAGER = true;
    process.env.SHARDING_MANAGER_MODE = this.mode;
    process.env.DISCORD_TOKEN = this.token;
  }

  /**
   * Creates a single shard.
   * <warn>Using this method is usually not necessary if you use the spawn method.</warn>
   * @param {number} [id=this.shards.size] ID of the shard to create
   * <info>This is usually not necessary to manually specify.</info>
   * @returns {Shard} Note that the created shard needs to be explicitly spawned using its spawn method.
   */
  createShard(id = this.shards.size) {
    const shard = new Shard(this, id);
    this.shards.set(id, shard);
    /**
     * Emitted upon creating a shard.
     * @event ShardingManager#shardCreate
     * @param {Shard} shard Shard that was created
     */
    this.emit('shardCreate', shard);
    return shard;
  }

  /**
   * Spawns multiple shards.
   * @param {number|string} [amount=this.totalShards] Number of shards to spawn
   * @param {number} [delay=5500] How long to wait in between spawning each shard (in milliseconds)
   * @param {number} [spawnTimeout=30000] The amount in milliseconds to wait until the {@link Client} has become ready
   * before resolving. (-1 or Infinity for no wait)
   * @returns {Promise<Collection<number, Shard>>}
   */
  async spawn(amount = this.totalShards, delay = 5500, spawnTimeout) {
    // Obtain/verify the number of shards to spawn
    if (amount === 'auto') {
      amount = await Util.fetchRecommendedShards(this.token);
    } else {
      if (typeof amount !== 'number' || isNaN(amount)) {
        throw new TypeError('CLIENT_INVALID_OPTION', 'Amount of shards', 'a number.');
      }
      if (amount < 1) throw new RangeError('CLIENT_INVALID_OPTION', 'Amount of shards', 'at least 1.');
      if (!Number.isInteger(amount)) {
        throw new TypeError('CLIENT_INVALID_OPTION', 'Amount of shards', 'an integer.');
      }
    }

    // Make sure this many shards haven't already been spawned
    if (this.shards.size >= amount) throw new Error('SHARDING_ALREADY_SPAWNED', this.shards.size);
    if (this.shardList === 'auto' || this.totalShards === 'auto' || this.totalShards !== amount) {
      this.shardList = [...Array(amount).keys()];
    }
    if (this.totalShards === 'auto' || this.totalShards !== amount) {
      this.totalShards = amount;
    }

    if (this.shardList.some(shardID => shardID >= amount)) {
      throw new RangeError(
        'CLIENT_INVALID_OPTION',
        'Amount of shards',
        'bigger than the highest shardID in the shardList option.',
      );
    }

    // Spawn the shards
    for (const shardID of this.shardList) {
      const promises = [];
      const shard = this.createShard(shardID);
      promises.push(shard.spawn(spawnTimeout));
      if (delay > 0 && this.shards.size !== this.shardList.length) promises.push(Util.delayFor(delay));
      await Promise.all(promises); // eslint-disable-line no-await-in-loop
    }

    return this.shards;
  }

  /**
   * Sends a message to all shards.
   * @param {*} message Message to be sent to the shards
   * @returns {Promise<Shard[]>}
   */
  broadcast(message) {
    const promises = [];
    for (const shard of this.shards.values()) promises.push(shard.send(message));
    return Promise.all(promises);
  }

  /**
   * Evaluates a script on all shards, in the context of the {@link Client}s.
   * @param {string} script JavaScript to run on each shard
   * @returns {Promise<Array<*>>} Results of the script execution
   */
  broadcastEval(script) {
    const promises = [];
    for (const shard of this.shards.values()) promises.push(shard.eval(script));
    return Promise.all(promises);
  }

  /**
   * Fetches a client property value of each shard.
   * @param {string} prop Name of the client property to get, using periods for nesting
   * @returns {Promise<Array<*>>}
   * @example
   * manager.fetchClientValues('guilds.cache.size')
   *   .then(results => console.log(`${results.reduce((prev, val) => prev + val, 0)} total guilds`))
   *   .catch(console.error);
   */
  fetchClientValues(prop) {
    if (this.shards.size === 0) return Promise.reject(new Error('SHARDING_NO_SHARDS'));
    if (this.shards.size !== this.shardList.length) return Promise.reject(new Error('SHARDING_IN_PROCESS'));
    const promises = [];
    for (const shard of this.shards.values()) promises.push(shard.fetchClientValue(prop));
    return Promise.all(promises);
  }

  /**
   * Kills all running shards and respawns them.
   * @param {number} [shardDelay=5000] How long to wait between shards (in milliseconds)
   * @param {number} [respawnDelay=500] How long to wait between killing a shard's process and restarting it
   * (in milliseconds)
   * @param {number} [spawnTimeout=30000] The amount in milliseconds to wait for a shard to become ready before
   * continuing to another. (-1 or Infinity for no wait)
   * @returns {Promise<Collection<string, Shard>>}
   */
  async respawnAll(shardDelay = 5000, respawnDelay = 500, spawnTimeout) {
    let s = 0;
    for (const shard of this.shards.values()) {
      const promises = [shard.respawn(respawnDelay, spawnTimeout)];
      if (++s < this.shards.size && shardDelay > 0) promises.push(Util.delayFor(shardDelay));
      await Promise.all(promises); // eslint-disable-line no-await-in-loop
    }
    return this.shards;
  }
}

module.exports = ShardingManager;
