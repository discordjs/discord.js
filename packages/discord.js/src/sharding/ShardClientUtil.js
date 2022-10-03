'use strict';

const process = require('node:process');
const { DiscordjsError, DiscordjsTypeError, ErrorCodes } = require('../errors');
const Events = require('../util/Events');
const { makeError, makePlainError } = require('../util/Util');

/**
 * Helper class for sharded clients spawned as a child process/worker, such as from a {@link ShardingManager}.
 * Utilises IPC to send and receive data to/from the master process and other shards.
 */
class ShardClientUtil {
  constructor(client, mode) {
    /**
     * Client for the shard
     * @type {Client}
     */
    this.client = client;

    /**
     * Mode the shard was spawned with
     * @type {ShardingManagerMode}
     */
    this.mode = mode;

    /**
     * Message port for the master process (only when {@link ShardClientUtil#mode} is `worker`)
     * @type {?MessagePort}
     */
    this.parentPort = null;

    if (mode === 'process') {
      process.on('message', this._handleMessage.bind(this));
      client.on('ready', () => {
        process.send({ _ready: true });
      });
      client.on('disconnect', () => {
        process.send({ _disconnect: true });
      });
      client.on('reconnecting', () => {
        process.send({ _reconnecting: true });
      });
    } else if (mode === 'worker') {
      this.parentPort = require('node:worker_threads').parentPort;
      this.parentPort.on('message', this._handleMessage.bind(this));
      client.on('ready', () => {
        this.parentPort.postMessage({ _ready: true });
      });
      client.on('disconnect', () => {
        this.parentPort.postMessage({ _disconnect: true });
      });
      client.on('reconnecting', () => {
        this.parentPort.postMessage({ _reconnecting: true });
      });
    }
  }

  /**
   * Array of shard ids of this client
   * @type {number[]}
   * @readonly
   */
  get ids() {
    return this.client.options.shards;
  }

  /**
   * Total number of shards
   * @type {number}
   * @readonly
   */
  get count() {
    return this.client.options.shardCount;
  }

  /**
   * Sends a message to the master process.
   * @param {*} message Message to send
   * @returns {Promise<void>}
   * @emits Shard#message
   */
  send(message) {
    return new Promise((resolve, reject) => {
      if (this.mode === 'process') {
        process.send(message, err => {
          if (err) reject(err);
          else resolve();
        });
      } else if (this.mode === 'worker') {
        this.parentPort.postMessage(message);
        resolve();
      }
    });
  }

  /**
   * Fetches a client property value of each shard, or a given shard.
   * @param {string} prop Name of the client property to get, using periods for nesting
   * @param {number} [shard] Shard to fetch property from, all if undefined
   * @returns {Promise<*|Array<*>>}
   * @example
   * client.shard.fetchClientValues('guilds.cache.size')
   *   .then(results => console.log(`${results.reduce((prev, val) => prev + val, 0)} total guilds`))
   *   .catch(console.error);
   * @see {@link ShardingManager#fetchClientValues}
   */
  fetchClientValues(prop, shard) {
    return new Promise((resolve, reject) => {
      const parent = this.parentPort ?? process;

      const listener = message => {
        if (message?._sFetchProp !== prop || message._sFetchPropShard !== shard) return;
        parent.removeListener('message', listener);
        this.decrementMaxListeners(parent);
        if (!message._error) resolve(message._result);
        else reject(makeError(message._error));
      };
      this.incrementMaxListeners(parent);
      parent.on('message', listener);

      this.send({ _sFetchProp: prop, _sFetchPropShard: shard }).catch(err => {
        parent.removeListener('message', listener);
        this.decrementMaxListeners(parent);
        reject(err);
      });
    });
  }

  /**
   * Evaluates a script or function on all shards, or a given shard, in the context of the {@link Client}s.
   * @param {Function} script JavaScript to run on each shard
   * @param {BroadcastEvalOptions} [options={}] The options for the broadcast
   * @returns {Promise<*|Array<*>>} Results of the script execution
   * @example
   * client.shard.broadcastEval(client => client.guilds.cache.size)
   *   .then(results => console.log(`${results.reduce((prev, val) => prev + val, 0)} total guilds`))
   *   .catch(console.error);
   * @see {@link ShardingManager#broadcastEval}
   */
  broadcastEval(script, options = {}) {
    return new Promise((resolve, reject) => {
      const parent = this.parentPort ?? process;
      if (typeof script !== 'function') {
        reject(new DiscordjsTypeError(ErrorCodes.ShardingInvalidEvalBroadcast));
        return;
      }
      script = `(${script})(this, ${JSON.stringify(options.context)})`;

      const listener = message => {
        if (message?._sEval !== script || message._sEvalShard !== options.shard) return;
        parent.removeListener('message', listener);
        this.decrementMaxListeners(parent);
        if (!message._error) resolve(message._result);
        else reject(makeError(message._error));
      };
      this.incrementMaxListeners(parent);
      parent.on('message', listener);
      this.send({ _sEval: script, _sEvalShard: options.shard }).catch(err => {
        parent.removeListener('message', listener);
        this.decrementMaxListeners(parent);
        reject(err);
      });
    });
  }

  /**
   * Requests a respawn of all shards.
   * @param {MultipleShardRespawnOptions} [options] Options for respawning shards
   * @returns {Promise<void>} Resolves upon the message being sent
   * @see {@link ShardingManager#respawnAll}
   */
  respawnAll({ shardDelay = 5_000, respawnDelay = 500, timeout = 30_000 } = {}) {
    return this.send({ _sRespawnAll: { shardDelay, respawnDelay, timeout } });
  }

  /**
   * Handles an IPC message.
   * @param {*} message Message received
   * @private
   */
  async _handleMessage(message) {
    if (!message) return;
    if (message._fetchProp) {
      try {
        const props = message._fetchProp.split('.');
        let value = this.client;
        for (const prop of props) value = value[prop];
        this._respond('fetchProp', { _fetchProp: message._fetchProp, _result: value });
      } catch (err) {
        this._respond('fetchProp', { _fetchProp: message._fetchProp, _error: makePlainError(err) });
      }
    } else if (message._eval) {
      try {
        this._respond('eval', { _eval: message._eval, _result: await this.client._eval(message._eval) });
      } catch (err) {
        this._respond('eval', { _eval: message._eval, _error: makePlainError(err) });
      }
    }
  }

  /**
   * Sends a message to the master process, emitting an error from the client upon failure.
   * @param {string} type Type of response to send
   * @param {*} message Message to send
   * @private
   */
  _respond(type, message) {
    this.send(message).catch(err => {
      const error = new globalThis.Error(`Error when sending ${type} response to master process: ${err.message}`);
      error.stack = err.stack;
      /**
       * Emitted when the client encounters an error.
       * <warn>Errors thrown within this event do not have a catch handler, it is
       * recommended to not use async functions as `error` event handlers. See the
       * [Node.js docs](https://nodejs.org/api/events.html#capture-rejections-of-promises) for details.</warn>
       * @event Client#error
       * @param {Error} error The error encountered
       */
      this.client.emit(Events.Error, error);
    });
  }

  /**
   * Creates/gets the singleton of this class.
   * @param {Client} client The client to use
   * @param {ShardingManagerMode} mode Mode the shard was spawned with
   * @returns {ShardClientUtil}
   */
  static singleton(client, mode) {
    if (!this._singleton) {
      this._singleton = new this(client, mode);
    } else {
      client.emit(
        Events.Warn,
        'Multiple clients created in child process/worker; only the first will handle sharding helpers.',
      );
    }
    return this._singleton;
  }

  /**
   * Get the shard id for a given guild id.
   * @param {Snowflake} guildId Snowflake guild id to get shard id for
   * @param {number} shardCount Number of shards
   * @returns {number}
   */
  static shardIdForGuildId(guildId, shardCount) {
    const shard = Number(BigInt(guildId) >> 22n) % shardCount;
    if (shard < 0) throw new DiscordjsError(ErrorCodes.ShardingShardMiscalculation, shard, guildId, shardCount);
    return shard;
  }

  /**
   * Increments max listeners by one for a given emitter, if they are not zero.
   * @param {EventEmitter|process} emitter The emitter that emits the events.
   * @private
   */
  incrementMaxListeners(emitter) {
    const maxListeners = emitter.getMaxListeners();
    if (maxListeners !== 0) {
      emitter.setMaxListeners(maxListeners + 1);
    }
  }

  /**
   * Decrements max listeners by one for a given emitter, if they are not zero.
   * @param {EventEmitter|process} emitter The emitter that emits the events.
   * @private
   */
  decrementMaxListeners(emitter) {
    const maxListeners = emitter.getMaxListeners();
    if (maxListeners !== 0) {
      emitter.setMaxListeners(maxListeners - 1);
    }
  }
}

module.exports = ShardClientUtil;
