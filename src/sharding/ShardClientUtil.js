'use strict';

const Util = require('../util/Util');
const { Events } = require('../util/Constants');

/**
 * Helper class for sharded clients spawned as a child process/worker, such as from a {@link ShardingManager}.
 * Utilises IPC to send and receive data to/from the master process and other shards.
 */
class ShardClientUtil {
  /**
   * @param {Client} client Client of the current shard
   * @param {ShardingManagerMode} mode Mode the shard was spawned with
   */
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
      client.on('ready', () => { process.send({ _ready: true }); });
      client.on('disconnect', () => { process.send({ _disconnect: true }); });
      client.on('reconnecting', () => { process.send({ _reconnecting: true }); });
    } else if (mode === 'worker') {
      this.parentPort = require('worker_threads').parentPort;
      this.parentPort.on('message', this._handleMessage.bind(this));
      client.on('ready', () => { this.parentPort.postMessage({ _ready: true }); });
      client.on('disconnect', () => { this.parentPort.postMessage({ _disconnect: true }); });
      client.on('reconnecting', () => { this.parentPort.postMessage({ _reconnecting: true }); });
    }
  }

  /**
   * Shard ID or array of shard IDs of this client
   * @type {number|number[]}
   * @readonly
   */
  get id() {
    return this.client.options.shards;
  }

  /**
   * Total number of shards
   * @type {number}
   * @readonly
   */
  get count() {
    return this.client.options.totalShardCount;
  }

  /**
   * Sends a message to the master process.
   * @param {*} message Message to send
   * @returns {Promise<void>}
   */
  send(message) {
    return new Promise((resolve, reject) => {
      if (this.mode === 'process') {
        process.send(message, err => {
          if (err) reject(err); else resolve();
        });
      } else if (this.mode === 'worker') {
        this.parentPort.postMessage(message);
        resolve();
      }
    });
  }

  /**
   * Fetches a client property value of each shard.
   * @param {string} prop Name of the client property to get, using periods for nesting
   * @returns {Promise<Array<*>>}
   * @example
   * client.shard.fetchClientValues('guilds.size')
   *   .then(results => console.log(`${results.reduce((prev, val) => prev + val, 0)} total guilds`))
   *   .catch(console.error);
   * @see {@link ShardingManager#fetchClientValues}
   */
  fetchClientValues(prop) {
    return new Promise((resolve, reject) => {
      const parent = this.parentPort || process;

      const listener = message => {
        if (!message || message._sFetchProp !== prop) return;
        parent.removeListener('message', listener);
        if (!message._error) resolve(message._result); else reject(Util.makeError(message._error));
      };
      parent.on('message', listener);

      this.send({ _sFetchProp: prop }).catch(err => {
        parent.removeListener('message', listener);
        reject(err);
      });
    });
  }

  /**
   * Evaluates a script or function on all shards, in the context of the {@link Clients}.
   * @param {string|Function} script JavaScript to run on each shard
   * @returns {Promise<Array<*>>} Results of the script execution
   * @example
   * client.shard.broadcastEval('this.guilds.size')
   *   .then(results => console.log(`${results.reduce((prev, val) => prev + val, 0)} total guilds`))
   *   .catch(console.error);
   * @see {@link ShardingManager#broadcastEval}
   */
  broadcastEval(script) {
    return new Promise((resolve, reject) => {
      const parent = this.parentPort || process;
      script = typeof script === 'function' ? `(${script})(this)` : script;

      const listener = message => {
        if (!message || message._sEval !== script) return;
        parent.removeListener('message', listener);
        if (!message._error) resolve(message._result); else reject(Util.makeError(message._error));
      };
      parent.on('message', listener);

      this.send({ _sEval: script }).catch(err => {
        parent.removeListener('message', listener);
        reject(err);
      });
    });
  }

  /**
   * Requests a respawn of all shards.
   * @param {number} [shardDelay=5000] How long to wait between shards (in milliseconds)
   * @param {number} [respawnDelay=500] How long to wait between killing a shard's process/worker and restarting it
   * (in milliseconds)
   * @param {boolean} [waitForReady=true] Whether to wait for a shard to become ready before continuing to another
   * @returns {Promise<void>} Resolves upon the message being sent
   * @see {@link ShardingManager#respawnAll}
   */
  respawnAll(shardDelay = 5000, respawnDelay = 500, waitForReady = true) {
    return this.send({ _sRespawnAll: { shardDelay, respawnDelay, waitForReady } });
  }

  /**
   * Handles an IPC message.
   * @param {*} message Message received
   * @private
   */
  async _handleMessage(message) {
    if (!message) return;
    if (message._fetchProp) {
      const props = message._fetchProp.split('.');
      let value = this.client;
      for (const prop of props) value = value[prop];
      this._respond('fetchProp', { _fetchProp: message._fetchProp, _result: value });
    } else if (message._eval) {
      try {
        this._respond('eval', { _eval: message._eval, _result: await this.client._eval(message._eval) });
      } catch (err) {
        this._respond('eval', { _eval: message._eval, _error: Util.makePlainError(err) });
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
      err.message = `Error when sending ${type} response to master process: ${err.message}`;
      this.client.emit(Events.ERROR, err);
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
      client.emit(Events.WARN,
        'Multiple clients created in child process/worker; only the first will handle sharding helpers.');
    }
    return this._singleton;
  }
}

module.exports = ShardClientUtil;
