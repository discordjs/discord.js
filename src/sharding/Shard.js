'use strict';

const ChildProcess = require('child_process');
const EventEmitter = require('events');
const path = require('path');
const Worker = require('worker_threads');
const { Error } = require('../errors');
const Util = require('../util/Util');

let childProcess = null;
let workerThread = null;

/**
 * A self-contained shard created by the {@link ShardingManager}. Each one has a {@link ChildProcess} that contains
 * an instance of the bot and its {@link Client}. When its child process/worker exits for any reason, the shard will
 * spawn a new one to replace it as necessary.
 * @extends EventEmitter
 */
class Shard extends EventEmitter {
  /**
   * @param {ShardingManager} manager Manager that is creating this shard
   * @param {number} id ID of this shard
   */
  constructor(manager, id) {
    super();

    if (manager.mode === 'process') childProcess = ChildProcess;
    else if (manager.mode === 'worker') workerThread = Worker.Worker;

    /**
     * Manager that created the shard
     * @type {ShardingManager}
     */
    this.manager = manager;

    /**
     * ID of the shard in the manager
     * @type {number}
     */
    this.id = id;

    /**
     * Arguments for the shard's process (only when {@link ShardingManager#mode} is `process`)
     * @type {string[]}
     */
    this.args = manager.shardArgs || [];

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
    this._exitListener = this._handleExit.bind(this, undefined);
  }

  /**
   * Process of the shard (if {@link ShardingManager#mode} is `process`)
   * @type {?ChildProcess}
   * @readonly
   */
  get process() {
    return childProcess;
  }

  /**
   * Worker of the shard (if {@link ShardingManager#mode} is `worker`)
   * @type {?Worker}
   * @readonly
   */
  get worker() {
    return workerThread;
  }

  /**
   * Parent port of the worker threads (if {@link ShardingManager#mode} is `worker`)
   * @type {?MessagePort}
   * @readonly
   */
  get parentPort() {
    return Worker.parentPort ?? null;
  }

  /**
   * Process ID of the child process (if {@link ShardingManager#mode} is `process`)
   * @type {?number}
   * @readonly
   */
  get pid() {
    return childProcess.pid ?? null;
  }

  /**
   * The process ID of the parent process (this will never be null, unless the parent process is no longer alive)
   * @type {?number}
   * @readonly
   */
  get ppid() {
    return this.manager.process.pid ?? null;
  }

  /**
   * Forks a child process or creates a worker thread for the shard.
   * <warn>You should not need to call this manually.</warn>
   * @param {number} [timeout=30000] The amount in milliseconds to wait until the {@link Client} has become ready
   * before resolving. (-1 or Infinity for no wait)
   * @returns {Promise<ChildProcess|Worker>}
   */
  async spawn(timeout = 30000) {
    if (childProcess) throw new Error('SHARDING_PROCESS_EXISTS', this.id);
    if (workerThread) throw new Error('SHARDING_WORKER_EXISTS', this.id);

    if (this.manager.mode === 'process') {
      childProcess = ChildProcess.fork(path.resolve(this.manager.file), this.args, {
        env: this.env,
        execArgv: this.execArgv,
      })
        .on('message', this._handleMessage.bind(this))
        .on('exit', this._exitListener)
        .on('disconnect', this._handleDisconnect.bind(this, { parentProcessDisconnect: true }));
    } else if (this.manager.mode === 'worker') {
      workerThread = new Worker(path.resolve(this.manager.file), { workerData: this.env })
        .on('message', this._handleMessage.bind(this))
        .on('exit', this._exitListener);

      setInterval(() => {
        if (!Worker.parentPort) {
          this._handleDisconnect({ parentThreadDisconnect: true });
        }
      }, this.manager.timeout);
    }

    this._evals.clear();
    this._fetches.clear();

    /**
     * Emitted upon the creation of the shard's child process/worker.
     * @event Shard#spawn
     * @param {ChildProcess|Worker} process Child process/worker that was created
     */
    this.emit('spawn', childProcess || workerThread);

    if (timeout === -1 || timeout === Infinity) return childProcess || workerThread;
    await new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(spawnTimeoutTimer);
        this.off('ready', onReady);
        this.off('disconnect', onDisconnect);
        this.off('death', onDeath);
        this.off('parentDeath', onParentDeath);
      };

      const onReady = () => {
        cleanup();
        resolve();
      };

      const onDisconnect = () => {
        cleanup();
        reject(new Error('SHARDING_READY_DISCONNECTED', this.id));
      };

      const onDeath = () => {
        cleanup();
        reject(new Error('SHARDING_READY_DIED', this.id));
      };

      const onParentDeath = () => {
        cleanup();
        reject(new Error('SHARDING_READY_PARENT_DIED', this.id));
      };

      const onTimeout = () => {
        cleanup();
        reject(new Error('SHARDING_READY_TIMEOUT', this.id));
      };

      const spawnTimeoutTimer = setTimeout(onTimeout, timeout);
      this.once('ready', onReady);
      this.once('disconnect', onDisconnect);
      this.once('death', onDeath);
      this.once('parentDeath', onParentDeath);
    });
    return childProcess || workerThread;
  }

  /**
   * Immediately kills the shard's process/worker and does not restart it.
   */
  kill() {
    if (childProcess) {
      childProcess.removeListener('exit', this._exitListener);
      childProcess.kill();
    } else {
      workerThread.removeListener('exit', this._exitListener);
      workerThread.terminate();
    }

    this._handleExit(false);
  }

  /**
   * Kills and restarts the shard's process/worker.
   * @param {number} [delay=500] How long to wait between killing the process/worker and restarting it (in milliseconds)
   * @param {number} [timeout=30000] The amount in milliseconds to wait until the {@link Client} has become ready
   * before resolving. (-1 or Infinity for no wait)
   * @returns {Promise<ChildProcess|Worker>}
   */
  async respawn(delay = 500, timeout) {
    this.kill();
    if (delay > 0) await Util.delayFor(delay);
    return this.spawn(timeout);
  }

  /**
   * Sends a message to the shard's process/worker.
   * @param {*} message Message to send to the shard
   * @returns {Promise<Shard>}
   */
  send(message) {
    return new Promise((resolve, reject) => {
      if (childProcess) {
        childProcess.send(message, err => {
          if (err) reject(err);
          else resolve(this);
        });
      } else {
        workerThread.postMessage(message);
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
    if (!childProcess && !workerThread) return Promise.reject(new Error('SHARDING_NO_CHILD_EXISTS', this.id));

    // Cached promise from previous call
    if (this._fetches.has(prop)) return this._fetches.get(prop);

    const promise = new Promise((resolve, reject) => {
      const child = childProcess || workerThread;

      const listener = message => {
        if (!message || message._fetchProp !== prop) return;
        child.removeListener('message', listener);
        this._fetches.delete(prop);
        resolve(message._result);
      };
      child.on('message', listener);

      this.send({ _fetchProp: prop }).catch(err => {
        child.removeListener('message', listener);
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
   * @returns {Promise<*>} Result of the script execution
   */
  eval(script) {
    // Shard is dead (maybe respawning), don't cache anything and error immediately
    if (!childProcess && !workerThread) return Promise.reject(new Error('SHARDING_NO_CHILD_EXISTS', this.id));

    // Cached promise from previous call
    if (this._evals.has(script)) return this._evals.get(script);

    const promise = new Promise((resolve, reject) => {
      const child = childProcess || workerThread;

      const listener = message => {
        if (!message || message._eval !== script) return;
        child.removeListener('message', listener);
        this._evals.delete(script);
        if (!message._error) resolve(message._result);
        else reject(Util.makeError(message._error));
      };
      child.on('message', listener);

      const _eval = typeof script === 'function' ? `(${script})(this)` : script;
      this.send({ _eval }).catch(err => {
        child.removeListener('message', listener);
        this._evals.delete(script);
        reject(err);
      });
    });

    this._evals.set(script, promise);
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
         * Emitted upon the shard's {@link Client#ready} event.
         * @event Shard#ready
         */
        this.emit('ready');
        return;
      }

      // Shard has disconnected
      if (message._disconnect) {
        this.ready = false;
        /**
         * Emitted upon the shard's {@link Client#disconnect} event.
         * @event Shard#disconnect
         */
        this.emit('disconnect');
        return;
      }

      // Shard is attempting to reconnect
      if (message._reconnecting) {
        this.ready = false;
        /**
         * Emitted upon the shard's {@link Client#reconnecting} event.
         * @event Shard#reconnecting
         */
        this.emit('reconnecting');
        return;
      }

      // Shard is requesting a property fetch
      if (message._sFetchProp) {
        const resp = { _sFetchProp: message._sFetchProp, _sFetchPropShard: message._sFetchPropShard };
        this.manager.fetchClientValues(message._sFetchProp, message._sFetchPropShard).then(
          results => this.send({ ...resp, _result: results }),
          err => this.send({ ...resp, _error: Util.makePlainError(err) }),
        );
        return;
      }

      // Shard is requesting an eval broadcast
      if (message._sEval) {
        const resp = { _sEval: message._sEval, _sEvalShard: message._sEvalShard };
        this.manager.broadcastEval(message._sEval, message._sEvalShard).then(
          results => this.send({ ...resp, _result: results }),
          err => this.send({ ...resp, _error: Util.makePlainError(err) }),
        );
        return;
      }

      // Shard is requesting a respawn of all shards
      if (message._sRespawnAll) {
        const { shardDelay, respawnDelay, timeout } = message._sRespawnAll;
        this.manager.respawnAll(shardDelay, respawnDelay, timeout).catch(() => {
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
    this.emit('message', message);
  }

  /**
   * Handles the shard's process/worker exiting.
   * @param {boolean} [respawn=this.manager.respawn] Whether to spawn the shard again
   * @private
   */
  _handleExit(respawn = this.manager.respawn) {
    /**
     * Emitted upon the shard's child process/worker exiting.
     * @event Shard#death
     * @param {ChildProcess|Worker} process Child process/worker that exited
     */
    this.emit('death', childProcess || workerThread);

    this.ready = false;
    childProcess = null;
    workerThread = null;
    this._evals.clear();
    this._fetches.clear();

    if (respawn) this.spawn().catch(err => this.emit('error', err));
  }

  _handleDisconnect(message) {
    /**
     * Emitted upon the shard's heartbeat to the process returning no response (parent death).
     * @event Shard#parentDeath
     * @param {ChildProcess|Worker} process Child process/worker that exited
     */
    if (!message) return;

    if (childProcess) {
      if (message.parentProcessDisconnect && childProcess.ppid === 1) {
        this.emit('parentDeath', childProcess);
        this.kill();
      }
    }

    if (workerThread) {
      if (message.parentThreadDisconnect && !Worker.parentPort) {
        this.emit('parentDeath', workerThread);
        this.kill();
      }
    }
  }
}

module.exports = Shard;
