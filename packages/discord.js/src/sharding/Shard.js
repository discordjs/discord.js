'use strict';

const EventEmitter = require('node:events');
const path = require('node:path');
const process = require('node:process');
const { setTimeout, clearTimeout } = require('node:timers');
const { setTimeout: sleep } = require('node:timers/promises');
const { Error, ErrorCodes } = require('../errors');
const ShardEvents = require('../util/ShardEvents');
const { makeError, makePlainError } = require('../util/Util');
let childProcess = null;
let Worker = null;

/**
 * A self-contained shard created by the {@link ShardingManager}. Each one has a {@link ChildProcess} that contains
 * an instance of the bot and its {@link Client}. When its child process/worker exits for any reason, the shard will
 * spawn a new one to replace it as necessary.
 * @extends {EventEmitter}
 */
class Shard extends EventEmitter {
  constructor(manager, id) {
    super();

    if (manager.mode === 'process') childProcess = require('node:child_process');
    else if (manager.mode === 'worker') Worker = require('node:worker_threads').Worker;

    /**
     * Manager that created the shard
     * @type {ShardingManager}
     */
    this.manager = manager;

    /**
     * The shard's id in the manager
     * @type {number}
     */
    this.id = id;

    /**
     * Arguments for the shard's process (only when {@link ShardingManager#mode} is `process`)
     * @type {string[]}
     */
    this.args = manager.shardArgs ?? [];

    /**
     * Arguments for the shard's process executable (only when {@link ShardingManager#mode} is `process`)
     * @type {string[]}
     */
    this.execArgv = manager.execArgv;

    /**
     * Environment variables for the shard's process, or workerData for the shard's worker
     * @type {Object}
     */
    this.env = Object.assign({}, process.env, {
      SHARDING_MANAGER: true,
      SHARDS: this.id,
      SHARD_COUNT: this.manager.totalShards,
      DISCORD_TOKEN: this.manager.token,
    });

    /**
     * Whether the shard's {@link Client} is ready
     * @type {boolean}
     */
    this.ready = false;

    /**
     * Process of the shard (if {@link ShardingManager#mode} is `process`)
     * @type {?ChildProcess}
     */
    this.process = null;

    /**
     * Worker of the shard (if {@link ShardingManager#mode} is `worker`)
     * @type {?Worker}
     */
    this.worker = null;

    /**
     * Ongoing promises for calls to {@link Shard#eval}, mapped by the `script` they were called with
     * @type {Map<string, Promise>}
     * @private
     */
    this._evals = new Map();

    /**
     * Ongoing promises for calls to {@link Shard#fetchClientValue}, mapped by the `prop` they were called with
     * @type {Map<string, Promise>}
     * @private
     */
    this._fetches = new Map();

    /**
     * Listener function for the {@link ChildProcess}' `exit` event
     * @type {Function}
     * @private
     */
    this._exitListener = null;
  }

  /**
   * Forks a child process or creates a worker thread for the shard.
   * <warn>You should not need to call this manually.</warn>
   * @param {number} [timeout=30000] The amount in milliseconds to wait until the {@link Client} has become ready
   * before resolving (`-1` or `Infinity` for no wait)
   * @returns {Promise<ChildProcess>}
   */
  spawn(timeout = 30_000) {
    if (this.process) throw new Error(ErrorCodes.ShardingProcessExists, this.id);
    if (this.worker) throw new Error(ErrorCodes.ShardingWorkerExists, this.id);

    this._exitListener = this._handleExit.bind(this, undefined, timeout);

    if (this.manager.mode === 'process') {
      this.process = childProcess
        .fork(path.resolve(this.manager.file), this.args, {
          env: this.env,
          execArgv: this.execArgv,
        })
        .on('message', this._handleMessage.bind(this))
        .on('exit', this._exitListener);
    } else if (this.manager.mode === 'worker') {
      this.worker = new Worker(path.resolve(this.manager.file), { workerData: this.env })
        .on('message', this._handleMessage.bind(this))
        .on('exit', this._exitListener);
    }

    this._evals.clear();
    this._fetches.clear();

    const child = this.process ?? this.worker;

    /**
     * Emitted upon the creation of the shard's child process/worker.
     * @event Shard#spawn
     * @param {ChildProcess|Worker} process Child process/worker that was created
     */
    this.emit(ShardEvents.Spawn, child);

    if (timeout === -1 || timeout === Infinity) return Promise.resolve(child);
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(spawnTimeoutTimer);
        this.off('ready', onReady);
        this.off('disconnect', onDisconnect);
        this.off('death', onDeath);
      };

      const onReady = () => {
        cleanup();
        resolve(child);
      };

      const onDisconnect = () => {
        cleanup();
        reject(new Error(ErrorCodes.ShardingReadyDisconnected, this.id));
      };

      const onDeath = () => {
        cleanup();
        reject(new Error(ErrorCodes.ShardingReadyDied, this.id));
      };

      const onTimeout = () => {
        cleanup();
        reject(new Error(ErrorCodes.ShardingReadyTimeout, this.id));
      };

      const spawnTimeoutTimer = setTimeout(onTimeout, timeout);
      this.once('ready', onReady);
      this.once('disconnect', onDisconnect);
      this.once('death', onDeath);
    });
  }

  /**
   * Immediately kills the shard's process/worker and does not restart it.
   */
  kill() {
    if (this.process) {
      this.process.removeListener('exit', this._exitListener);
      this.process.kill();
    } else {
      this.worker.removeListener('exit', this._exitListener);
      this.worker.terminate();
    }

    this._handleExit(false);
  }

  /**
   * Options used to respawn a shard.
   * @typedef {Object} ShardRespawnOptions
   * @property {number} [delay=500] How long to wait between killing the process/worker and
   * restarting it (in milliseconds)
   * @property {number} [timeout=30000] The amount in milliseconds to wait until the {@link Client}
   * has become ready before resolving (`-1` or `Infinity` for no wait)
   */

  /**
   * Kills and restarts the shard's process/worker.
   * @param {ShardRespawnOptions} [options] Options for respawning the shard
   * @returns {Promise<ChildProcess>}
   */
  async respawn({ delay = 500, timeout = 30_000 } = {}) {
    this.kill();
    if (delay > 0) await sleep(delay);
    return this.spawn(timeout);
  }

  /**
   * Sends a message to the shard's process/worker.
   * @param {*} message Message to send to the shard
   * @returns {Promise<Shard>}
   */
  send(message) {
    return new Promise((resolve, reject) => {
      if (this.process) {
        this.process.send(message, err => {
          if (err) reject(err);
          else resolve(this);
        });
      } else {
        this.worker.postMessage(message);
        resolve(this);
      }
    });
  }

  /**
   * Fetches a client property value of the shard.
   * @param {string} prop Name of the client property to get, using periods for nesting
   * @returns {Promise<*>}
   * @example
   * shard.fetchClientValue('guilds.cache.size')
   *   .then(count => console.log(`${count} guilds in shard ${shard.id}`))
   *   .catch(console.error);
   */
  fetchClientValue(prop) {
    // Shard is dead (maybe respawning), don't cache anything and error immediately
    if (!this.process && !this.worker) return Promise.reject(new Error(ErrorCodes.ShardingNoChildExists, this.id));

    // Cached promise from previous call
    if (this._fetches.has(prop)) return this._fetches.get(prop);

    const promise = new Promise((resolve, reject) => {
      const child = this.process ?? this.worker;

      const listener = message => {
        if (message?._fetchProp !== prop) return;
        child.removeListener('message', listener);
        this.decrementMaxListeners(child);
        this._fetches.delete(prop);
        if (!message._error) resolve(message._result);
        else reject(makeError(message._error));
      };

      this.incrementMaxListeners(child);
      child.on('message', listener);

      this.send({ _fetchProp: prop }).catch(err => {
        child.removeListener('message', listener);
        this.decrementMaxListeners(child);
        this._fetches.delete(prop);
        reject(err);
      });
    });

    this._fetches.set(prop, promise);
    return promise;
  }

  /**
   * Evaluates a script or function on the shard, in the context of the {@link Client}.
   * @param {string|Function} script JavaScript to run on the shard
   * @param {*} [context] The context for the eval
   * @returns {Promise<*>} Result of the script execution
   */
  eval(script, context) {
    // Stringify the script if it's a Function
    const _eval = typeof script === 'function' ? `(${script})(this, ${JSON.stringify(context)})` : script;

    // Shard is dead (maybe respawning), don't cache anything and error immediately
    if (!this.process && !this.worker) return Promise.reject(new Error(ErrorCodes.ShardingNoChildExists, this.id));

    // Cached promise from previous call
    if (this._evals.has(_eval)) return this._evals.get(_eval);

    const promise = new Promise((resolve, reject) => {
      const child = this.process ?? this.worker;

      const listener = message => {
        if (message?._eval !== _eval) return;
        child.removeListener('message', listener);
        this.decrementMaxListeners(child);
        this._evals.delete(_eval);
        if (!message._error) resolve(message._result);
        else reject(makeError(message._error));
      };

      this.incrementMaxListeners(child);
      child.on('message', listener);

      this.send({ _eval }).catch(err => {
        child.removeListener('message', listener);
        this.decrementMaxListeners(child);
        this._evals.delete(_eval);
        reject(err);
      });
    });

    this._evals.set(_eval, promise);
    return promise;
  }

  /**
   * Handles a message received from the child process/worker.
   * @param {*} message Message received
   * @private
   */
  _handleMessage(message) {
    if (message) {
      // Shard is ready
      if (message._ready) {
        this.ready = true;
        /**
         * Emitted upon the shard's {@link Client#event:shardReady} event.
         * @event Shard#ready
         */
        this.emit(ShardEvents.Ready);
        return;
      }

      // Shard has disconnected
      if (message._disconnect) {
        this.ready = false;
        /**
         * Emitted upon the shard's {@link Client#event:shardDisconnect} event.
         * @event Shard#disconnect
         */
        this.emit(ShardEvents.Disconnect);
        return;
      }

      // Shard is attempting to reconnect
      if (message._reconnecting) {
        this.ready = false;
        /**
         * Emitted upon the shard's {@link Client#event:shardReconnecting} event.
         * @event Shard#reconnecting
         */
        this.emit(ShardEvents.Reconnecting);
        return;
      }

      // Shard is requesting a property fetch
      if (message._sFetchProp) {
        const resp = { _sFetchProp: message._sFetchProp, _sFetchPropShard: message._sFetchPropShard };
        this.manager.fetchClientValues(message._sFetchProp, message._sFetchPropShard).then(
          results => this.send({ ...resp, _result: results }),
          err => this.send({ ...resp, _error: makePlainError(err) }),
        );
        return;
      }

      // Shard is requesting an eval broadcast
      if (message._sEval) {
        const resp = { _sEval: message._sEval, _sEvalShard: message._sEvalShard };
        this.manager._performOnShards('eval', [message._sEval], message._sEvalShard).then(
          results => this.send({ ...resp, _result: results }),
          err => this.send({ ...resp, _error: makePlainError(err) }),
        );
        return;
      }

      // Shard is requesting a respawn of all shards
      if (message._sRespawnAll) {
        const { shardDelay, respawnDelay, timeout } = message._sRespawnAll;
        this.manager.respawnAll({ shardDelay, respawnDelay, timeout }).catch(() => {
          // Do nothing
        });
        return;
      }
    }

    /**
     * Emitted upon receiving a message from the child process/worker.
     * @event Shard#message
     * @param {*} message Message that was received
     */
    this.emit(ShardEvents.Message, message);
  }

  /**
   * Handles the shard's process/worker exiting.
   * @param {boolean} [respawn=this.manager.respawn] Whether to spawn the shard again
   * @param {number} [timeout] The amount in milliseconds to wait until the {@link Client}
   * has become ready (`-1` or `Infinity` for no wait)
   * @private
   */
  _handleExit(respawn = this.manager.respawn, timeout) {
    /**
     * Emitted upon the shard's child process/worker exiting.
     * @event Shard#death
     * @param {ChildProcess|Worker} process Child process/worker that exited
     */
    this.emit(ShardEvents.Death, this.process ?? this.worker);

    this.ready = false;
    this.process = null;
    this.worker = null;
    this._evals.clear();
    this._fetches.clear();

    if (respawn) this.spawn(timeout).catch(err => this.emit(ShardEvents.Error, err));
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

module.exports = Shard;
