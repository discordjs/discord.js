'use strict';

const EventEmitter = require('node:events');
const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const { setTimeout: sleep } = require('node:timers/promises');
const { Collection } = require('@discordjs/collection');
const Shard = require('./Shard');
const { DiscordjsError, DiscordjsTypeError, DiscordjsRangeError, ErrorCodes } = require('../errors');
const { fetchRecommendedShardCount } = require('../util/Util');

/**
 * This is a utility class that makes multi-process sharding of a bot an easy and painless experience.
 * It works by spawning a self-contained {@link ChildProcess} or {@link Worker} for each individual shard, each
 * containing its own instance of your bot's {@link Client}. They all have a line of communication with the master
 * process, and there are several useful methods that utilize it in order to simplify tasks that are normally difficult
 * with sharding. It can spawn a specific number of shards or the amount that Discord suggests for the bot, and takes a
 * path to your main bot script to launch for each one.
 * @extends {EventEmitter}
 */
class ShardingManager extends EventEmitter {
  /**
   * The mode to spawn shards with for a {@link ShardingManager}. Can be either one of:
   * * 'process' to use child processes
   * * 'worker' to use {@link Worker} threads
   * @typedef {string} ShardingManagerMode
   */

  /**
   * The options to spawn shards with for a {@link ShardingManager}.
   * @typedef {Object} ShardingManagerOptions
   * @property {string|number} [totalShards='auto'] Number of total shards of all shard managers or "auto"
   * @property {string|number[]} [shardList='auto'] List of shards to spawn or "auto"
   * @property {ShardingManagerMode} [mode='process'] Which mode to use for shards
   * @property {boolean} [respawn=true] Whether shards should automatically respawn upon exiting
   * @property {boolean} [silent=false] Whether to pass the silent flag to child process
   * (only available when mode is set to 'process')
   * @property {string[]} [shardArgs=[]] Arguments to pass to the shard script when spawning
   * @property {string[]} [execArgv=[]] Arguments to pass to the shard script executable when spawning
   * @property {string} [token] Token to use for automatic shard count and passing to shards
   */

  /**
   * @param {string} file Path to your shard script file
   * @param {ShardingManagerOptions} [options] Options for the sharding manager
   */
  constructor(file, options) {
    super();
    const _options = {
      totalShards: 'auto',
      mode: 'process',
      respawn: true,
      silent: false,
      shardArgs: [],
      execArgv: [],
      token: process.env.DISCORD_TOKEN,
      ...options,
    };

    /**
     * Path to the shard script file
     * @type {string}
     */
    this.file = file;
    if (!file) throw new DiscordjsError(ErrorCodes.ClientInvalidOption, 'File', 'specified.');
    if (!path.isAbsolute(file)) this.file = path.resolve(process.cwd(), file);
    const stats = fs.statSync(this.file);
    if (!stats.isFile()) throw new DiscordjsError(ErrorCodes.ClientInvalidOption, 'File', 'a file');

    /**
     * List of shards this sharding manager spawns
     * @type {string|number[]}
     */
    this.shardList = _options.shardList ?? 'auto';
    if (this.shardList !== 'auto') {
      if (!Array.isArray(this.shardList)) {
        throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'shardList', 'an array.');
      }
      this.shardList = [...new Set(this.shardList)];
      if (this.shardList.length < 1) {
        throw new DiscordjsRangeError(ErrorCodes.ClientInvalidOption, 'shardList', 'at least 1 id.');
      }
      if (
        this.shardList.some(
          shardId => typeof shardId !== 'number' || isNaN(shardId) || !Number.isInteger(shardId) || shardId < 0,
        )
      ) {
        throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'shardList', 'an array of positive integers.');
      }
    }

    /**
     * Amount of shards that all sharding managers spawn in total
     * @type {number}
     */
    this.totalShards = _options.totalShards || 'auto';
    if (this.totalShards !== 'auto') {
      if (typeof this.totalShards !== 'number' || isNaN(this.totalShards)) {
        throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'Amount of shards', 'a number.');
      }
      if (this.totalShards < 1) {
        throw new DiscordjsRangeError(ErrorCodes.ClientInvalidOption, 'Amount of shards', 'at least 1.');
      }
      if (!Number.isInteger(this.totalShards)) {
        throw new DiscordjsRangeError(ErrorCodes.ClientInvalidOption, 'Amount of shards', 'an integer.');
      }
    }

    /**
     * Mode for shards to spawn with
     * @type {ShardingManagerMode}
     */
    this.mode = _options.mode;
    if (this.mode !== 'process' && this.mode !== 'worker') {
      throw new DiscordjsRangeError(ErrorCodes.ClientInvalidOption, 'Sharding mode', '"process" or "worker"');
    }

    /**
     * Whether shards should automatically respawn upon exiting
     * @type {boolean}
     */
    this.respawn = _options.respawn;

    /**
     * Whether to pass the silent flag to child process (only when {@link ShardingManager#mode} is `process`)
     * @type {boolean}
     */
    this.silent = _options.silent;

    /**
     * An array of arguments to pass to shards (only when {@link ShardingManager#mode} is `process`)
     * @type {string[]}
     */
    this.shardArgs = _options.shardArgs;

    /**
     * An array of arguments to pass to the executable (only when {@link ShardingManager#mode} is `process`)
     * @type {string[]}
     */
    this.execArgv = _options.execArgv;

    /**
     * Token to use for obtaining the automatic shard count, and passing to shards
     * @type {?string}
     */
    this.token = _options.token?.replace(/^Bot\s*/i, '') ?? null;

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
   * @param {number} [id=this.shards.size] Id of the shard to create
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
   * Options used to spawn multiple shards.
   * @typedef {Object} MultipleShardSpawnOptions
   * @property {number|string} [amount=this.totalShards] Number of shards to spawn
   * @property {number} [delay=5500] How long to wait in between spawning each shard (in milliseconds)
   * @property {number} [timeout=30000] The amount in milliseconds to wait until the {@link Client} has become ready
   */

  /**
   * Spawns multiple shards.
   * @param {MultipleShardSpawnOptions} [options] Options for spawning shards
   * @returns {Promise<Collection<number, Shard>>}
   */
  async spawn({ amount = this.totalShards, delay = 5500, timeout = 30_000 } = {}) {
    // Obtain/verify the number of shards to spawn
    if (amount === 'auto') {
      amount = await fetchRecommendedShardCount(this.token);
    } else {
      if (typeof amount !== 'number' || isNaN(amount)) {
        throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'Amount of shards', 'a number.');
      }
      if (amount < 1) throw new DiscordjsRangeError(ErrorCodes.ClientInvalidOption, 'Amount of shards', 'at least 1.');
      if (!Number.isInteger(amount)) {
        throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'Amount of shards', 'an integer.');
      }
    }

    // Make sure this many shards haven't already been spawned
    if (this.shards.size >= amount) throw new DiscordjsError(ErrorCodes.ShardingAlreadySpawned, this.shards.size);
    if (this.shardList === 'auto' || this.totalShards === 'auto' || this.totalShards !== amount) {
      this.shardList = [...Array(amount).keys()];
    }
    if (this.totalShards === 'auto' || this.totalShards !== amount) {
      this.totalShards = amount;
    }

    if (this.shardList.some(shardId => shardId >= amount)) {
      throw new DiscordjsRangeError(
        ErrorCodes.ClientInvalidOption,
        'Amount of shards',
        'bigger than the highest shardId in the shardList option.',
      );
    }

    // Spawn the shards
    for (const shardId of this.shardList) {
      const promises = [];
      const shard = this.createShard(shardId);
      promises.push(shard.spawn(timeout));
      if (delay > 0 && this.shards.size !== this.shardList.length) promises.push(sleep(delay));
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
   * Options for {@link ShardingManager#broadcastEval} and {@link ShardClientUtil#broadcastEval}.
   * @typedef {Object} BroadcastEvalOptions
   * @property {number} [shard] Shard to run script on, all if undefined
   * @property {*} [context] The JSON-serializable values to call the script with
   */

  /**
   * Evaluates a script on all shards, or a given shard, in the context of the {@link Client}s.
   * @param {Function} script JavaScript to run on each shard
   * @param {BroadcastEvalOptions} [options={}] The options for the broadcast
   * @returns {Promise<*|Array<*>>} Results of the script execution
   */
  async broadcastEval(script, options = {}) {
    if (typeof script !== 'function') {
      throw new DiscordjsTypeError(ErrorCodes.ShardingInvalidEvalBroadcast);
    }
    return this._performOnShards('eval', [`(${script})(this, ${JSON.stringify(options.context)})`], options.shard);
  }

  /**
   * Fetches a client property value of each shard, or a given shard.
   * @param {string} prop Name of the client property to get, using periods for nesting
   * @param {number} [shard] Shard to fetch property from, all if undefined
   * @returns {Promise<*|Array<*>>}
   * @example
   * manager.fetchClientValues('guilds.cache.size')
   *   .then(results => console.log(`${results.reduce((prev, val) => prev + val, 0)} total guilds`))
   *   .catch(console.error);
   */
  fetchClientValues(prop, shard) {
    return this._performOnShards('fetchClientValue', [prop], shard);
  }

  /**
   * Runs a method with given arguments on all shards, or a given shard.
   * @param {string} method Method name to run on each shard
   * @param {Array<*>} args Arguments to pass through to the method call
   * @param {number} [shard] Shard to run on, all if undefined
   * @returns {Promise<*|Array<*>>} Results of the method execution
   * @private
   */
  async _performOnShards(method, args, shard) {
    if (this.shards.size === 0) throw new DiscordjsError(ErrorCodes.ShardingNoShards);

    if (typeof shard === 'number') {
      if (this.shards.has(shard)) return this.shards.get(shard)[method](...args);
      throw new DiscordjsError(ErrorCodes.ShardingShardNotFound, shard);
    }

    if (this.shards.size !== this.shardList.length) {
      throw new DiscordjsError(ErrorCodes.ShardingInProcess);
    }

    const promises = [];
    for (const sh of this.shards.values()) promises.push(sh[method](...args));
    return Promise.all(promises);
  }

  /**
   * Options used to respawn all shards.
   * @typedef {Object} MultipleShardRespawnOptions
   * @property {number} [shardDelay=5000] How long to wait between shards (in milliseconds)
   * @property {number} [respawnDelay=500] How long to wait between killing a shard's process and restarting it
   * (in milliseconds)
   * @property {number} [timeout=30000] The amount in milliseconds to wait for a shard to become ready before
   * continuing to another (`-1` or `Infinity` for no wait)
   */

  /**
   * Kills all running shards and respawns them.
   * @param {MultipleShardRespawnOptions} [options] Options for respawning shards
   * @returns {Promise<Collection<number, Shard>>}
   */
  async respawnAll({ shardDelay = 5_000, respawnDelay = 500, timeout = 30_000 } = {}) {
    let s = 0;
    for (const shard of this.shards.values()) {
      const promises = [shard.respawn({ delay: respawnDelay, timeout })];
      if (++s < this.shards.size && shardDelay > 0) promises.push(sleep(shardDelay));
      await Promise.all(promises); // eslint-disable-line no-await-in-loop
    }
    return this.shards;
  }
}

module.exports = ShardingManager;
