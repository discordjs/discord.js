const childProcess = require('child_process');
const EventEmitter = require('events');
const path = require('path');
const Util = require('../util/Util');
const { Error } = require('../errors');

/**
 * A self-contained shard created by the {@link ShardingManager}. Each one has a {@link ChildProcess} that contains
 * an instance of the bot and its {@link Client}. When its child process exits for any reason, the shard will spawn a
 * new one to replace it as necessary.
 * @extends EventEmitter
 */
class Shard extends EventEmitter {
  /**
   * @param {ShardingManager} manager Manager that is spawning this shard
   * @param {number} id ID of this shard
   * @param {string[]} [args=[]] Command line arguments to pass to the script
   */
  constructor(manager, id, args = []) {
    super();

    /**
     * Manager that created the shard
     * @type {ShardingManager}
     */
    this.manager = manager;

    /**
     * ID of the shard
     * @type {number}
     */
    this.id = id;

    /**
     * Arguments for the shard's process
     * @type {string[]}
     */
    this.args = args;

    /**
     * Environment variables for the shard's process
     * @type {Object}
     */
    this.env = Object.assign({}, process.env, {
      SHARD_ID: this.id,
      SHARD_COUNT: this.manager.totalShards,
      CLIENT_TOKEN: this.manager.token,
    });

    /**
     * Whether the shard's {@link Client} is ready
     * @type {boolean}
     */
    this.ready = false;

    /**
     * Process of the shard
     * @type {?ChildProcess}
     */
    this.process = null;

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
   * Forks a child process for the shard.
   * <warn>You should not need to call this manually.</warn>
   * @param {boolean} [waitForReady=true] Whether to wait until the {@link Client} has become ready before resolving
   * @returns {Promise<ChildProcess>}
   */
  async spawn(waitForReady = true) {
    if (this.process) throw new Error('SHARDING_PROCESS_EXISTS', this.id);

    this.process = childProcess.fork(path.resolve(this.manager.file), this.args, { env: this.env })
      .on('message', this._handleMessage.bind(this))
      .on('exit', this._exitListener);

    /**
     * Emitted upon the creation of the shard's child process.
     * @event Shard#spawn
     * @param {ChildProcess} process Child process that was created
     */
    this.emit('spawn', this.process);

    if (!waitForReady) return this.process;
    await new Promise((resolve, reject) => {
      this.once('ready', resolve);
      this.once('disconnect', () => reject(new Error('SHARDING_READY_DISCONNECTED', this.id)));
      this.once('death', () => reject(new Error('SHARDING_READY_DIED', this.id)));
      setTimeout(() => reject(new Error('SHARDING_READY_TIMEOUT', this.id)), 30000);
    });
    return this.process;
  }

  /**
   * Kills and restarts the shard's process.
   * @param {number} [delay=500] How long to wait between killing the process and restarting it (in milliseconds)
   * @param {boolean} [waitForReady=true] Whether to wait the {@link Client} has become ready before resolving
   * @returns {Promise<ChildProcess>}
   */
  async respawn(delay = 500, waitForReady = true) {
    this.process.removeListener('exit', this._exitListener);
    this.process.kill();
    this._handleExit(false);
    if (delay > 0) await Util.delayFor(delay);
    return this.spawn(waitForReady);
  }

  /**
   * Sends a message to the shard's process.
   * @param {*} message Message to send to the shard
   * @returns {Promise<Shard>}
   */
  send(message) {
    return new Promise((resolve, reject) => {
      const sent = this.process.send(message, err => {
        if (err) reject(err); else resolve(this);
      });
      if (!sent) throw new Error('SHARDING_CHILD_CONNECTION');
    });
  }

  /**
   * Fetches a client property value of the shard.
   * @param {string} prop Name of the client property to get, using periods for nesting
   * @returns {Promise<*>}
   * @example
   * shard.fetchClientValue('guilds.size')
   *   .then(count => {
   *     console.log(`${count} guilds in shard ${shard.id}`);
   *   })
   *   .catch(console.error);
   */
  fetchClientValue(prop) {
    if (this._fetches.has(prop)) return this._fetches.get(prop);

    const promise = new Promise((resolve, reject) => {
      const listener = message => {
        if (!message || message._fetchProp !== prop) return;
        this.process.removeListener('message', listener);
        this._fetches.delete(prop);
        resolve(message._result);
      };
      this.process.on('message', listener);

      this.send({ _fetchProp: prop }).catch(err => {
        this.process.removeListener('message', listener);
        this._fetches.delete(prop);
        reject(err);
      });
    });

    this._fetches.set(prop, promise);
    return promise;
  }

  /**
   * Evaluates a script on the shard, in the context of the {@link Client}.
   * @param {string} script JavaScript to run on the shard
   * @returns {Promise<*>} Result of the script execution
   */
  eval(script) {
    if (this._evals.has(script)) return this._evals.get(script);

    const promise = new Promise((resolve, reject) => {
      const listener = message => {
        if (!message || message._eval !== script) return;
        this.process.removeListener('message', listener);
        this._evals.delete(script);
        if (!message._error) resolve(message._result); else reject(Util.makeError(message._error));
      };
      this.process.on('message', listener);

      this.send({ _eval: script }).catch(err => {
        this.process.removeListener('message', listener);
        this._evals.delete(script);
        reject(err);
      });
    });

    this._evals.set(script, promise);
    return promise;
  }

  /**
   * Handles an IPC message.
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
        this.manager.fetchClientValues(message._sFetchProp).then(
          results => this.send({ _sFetchProp: message._sFetchProp, _result: results }),
          err => this.send({ _sFetchProp: message._sFetchProp, _error: Util.makePlainError(err) })
        );
        return;
      }

      // Shard is requesting an eval broadcast
      if (message._sEval) {
        this.manager.broadcastEval(message._sEval).then(
          results => this.send({ _sEval: message._sEval, _result: results }),
          err => this.send({ _sEval: message._sEval, _error: Util.makePlainError(err) })
        );
        return;
      }

      // Shard is requesting a respawn of all shards
      if (message._sRespawnAll) {
        const { shardDelay, respawnDelay, waitForReady } = message._sRespawnAll;
        this.manager.respawnAll(shardDelay, respawnDelay, waitForReady).catch(() => {
          // Do nothing
        });
        return;
      }
    }

    /**
     * Emitted upon recieving a message from the child process.
     * @event Shard#message
     * @param {*} message Message that was received
     */
    this.emit('message', message);
  }

  /**
   * Handles the shard's process exiting.
   * @param {boolean} [respawn=this.manager.respawn] Whether to spawn the shard again
   * @private
   */
  _handleExit(respawn = this.manager.respawn) {
    /**
     * Emitted upon the shard's child process exiting.
     * @event Shard#death
     * @param {ChildProcess} process Child process that exited
     */
    this.emit('death', this.process);

    this.ready = false;
    this.process = null;
    this._evals.clear();
    this._fetches.clear();

    if (respawn) this.spawn().catch(err => this.emit('error', err));
  }
}

module.exports = Shard;
