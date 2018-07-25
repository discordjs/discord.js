const childProcess = require('child_process');
const EventEmitter = require('events');
const path = require('path');
const Util = require('../util/Util');

/**
 * Represents a Shard spawned by the ShardingManager.
 */
class Shard extends EventEmitter {
  /**
   * @param {ShardingManager} manager The sharding manager
   * @param {number} id The ID of this shard
   * @param {Array} [args=[]] Command line arguments to pass to the script
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
     * The environment variables for the shard
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

    this._evals = new Map();
    this._fetches = new Map();

    /**
     * Listener function for the {@link ChildProcess}' `exit` event
     * @type {Function}
     * @private
     */
    this._exitListener = this._handleExit.bind(this, undefined);

    /**
     * Process of the shard
     * @type {ChildProcess}
     */
    this.process = null;

    this.spawn(args);
  }

  /**
   * Forks a child process for the shard.
   * <warn>You should not need to call this manually.</warn>
   * @param {Array} [args=this.manager.args] Command line arguments to pass to the script
   * @param {Array} [execArgv=this.manager.execArgv] Command line arguments to pass to the process executable
   * @returns {ChildProcess}
   */
  spawn(args = this.manager.args, execArgv = this.manager.execArgv) {
    this.process = childProcess.fork(path.resolve(this.manager.file), args, {
      env: this.env, execArgv,
    })
      .on('exit', this._exitListener)
      .on('message', this._handleMessage.bind(this));

    /**
     * Emitted upon the creation of the shard's child process.
     * @event Shard#spawn
     * @param {ChildProcess} process Child process that was created
     */
    this.emit('spawn', this.process);

    return new Promise((resolve, reject) => {
      this.once('ready', resolve);
      this.once('disconnect', () => reject(new Error(`Shard ${this.id}'s Client disconnected before becoming ready.`)));
      this.once('death', () => reject(new Error(`Shard ${this.id}'s process exited before its Client became ready.`)));
      setTimeout(() => reject(new Error(`Shard ${this.id}'s Client took too long to become ready.`)), 30000);
    }).then(() => this.process);
  }

  /**
   * Immediately kills the shard's process and does not restart it.
   */
  kill() {
    this.process.removeListener('exit', this._exitListener);
    this.process.kill();
    this._handleExit(false);
  }

  /**
   * Kills and restarts the shard's process.
   * @param {number} [delay=500] How long to wait between killing the process and restarting it (in milliseconds)
   * @returns {Promise<ChildProcess>}
   */
  respawn(delay = 500) {
    this.kill();
    if (delay > 0) return Util.delayFor(delay).then(() => this.spawn());
    return this.spawn();
  }

  /**
   * Sends a message to the shard's process.
   * @param {*} message Message to send to the shard
   * @returns {Promise<Shard>}
   */
  send(message) {
    return new Promise((resolve, reject) => {
      this.process.send(message, err => {
        if (err) reject(err); else resolve(this);
      });
    });
  }

  /**
   * Fetches a client property value of the shard.
   * @param {string} prop Name of the client property to get, using periods for nesting
   * @returns {Promise<*>}
   * @example
   * shard.fetchClientValue('guilds.size')
   *   .then(count => console.log(`${count} guilds in shard ${shard.id}`))
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
   * Evaluates a script on the shard, in the context of the client.
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
    }

    /**
     * Emitted upon recieving a message from a shard.
     * @event ShardingManager#message
     * @param {Shard} shard Shard that sent the message
     * @param {*} message Message that was received
     */
    this.manager.emit('message', this, message);

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

    this.process = null;
    this._evals.clear();
    this._fetches.clear();

    if (respawn) this.manager.createShard(this.id);
  }
}

module.exports = Shard;
