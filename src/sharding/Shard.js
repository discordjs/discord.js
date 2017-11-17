const childProcess = require('child_process');
const EventEmitter = require('events');
const path = require('path');
const Util = require('../util/Util');
const { Error } = require('../errors');

/**
 * Represents a Shard spawned by the ShardingManager.
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
     * Environment variables for the shard's process
     * @type {Object}
     */
    this.env = Object.assign({}, process.env, {
      SHARD_ID: this.id,
      SHARD_COUNT: this.manager.totalShards,
      CLIENT_TOKEN: this.manager.token,
    });

    /**
     * Process of the shard
     * @type {ChildProcess}
     */
    this.process = childProcess.fork(path.resolve(this.manager.file), args, {
      env: this.env,
    }).on('message', this._handleMessage.bind(this));

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

    // Handle the death of the process
    this.process.once('exit', () => {
      this.ready = false;
      if (this.manager.respawn) this.manager.createShard(this.id).catch(err => { this.manager.emit('error', err); });
    });
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
  }
}

module.exports = Shard;
