const Util = require('../util/Util');
const { Events } = require('../util/Constants');
const { Error } = require('../errors');

/**
 * Helper class for sharded clients spawned as a child process, such as from a {@link ShardingManager}.
 * Utilises IPC to send and receive data to/from the master process and other shards.
 */
class ShardClientUtil {
  /**
   * @param {Client} client Client of the current shard
   */
  constructor(client) {
    this.client = client;
    process.on('message', this._handleMessage.bind(this));
    client.on('ready', () => { process.send({ _ready: true }); });
    client.on('disconnect', () => { process.send({ _disconnect: true }); });
    client.on('reconnecting', () => { process.send({ _reconnecting: true }); });
  }

  /**
   * ID of this shard
   * @type {number}
   * @readonly
   */
  get id() {
    return this.client.options.shardId;
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
   */
  send(message) {
    return new Promise((resolve, reject) => {
      const sent = process.send(message, err => {
        if (err) reject(err); else resolve();
      });
      if (!sent) throw new Error('SHARDING_PARENT_CONNECTION');
    });
  }

  /**
   * Fetches a client property value of each shard.
   * @param {string} prop Name of the client property to get, using periods for nesting
   * @returns {Promise<Array<*>>}
   * @example
   * client.shard.fetchClientValues('guilds.size')
   *   .then(results => {
   *     console.log(`${results.reduce((prev, val) => prev + val, 0)} total guilds`);
   *   })
   *   .catch(console.error);
   * @see {@link ShardingManager#fetchClientValues}
   */
  fetchClientValues(prop) {
    return new Promise((resolve, reject) => {
      const listener = message => {
        if (!message || message._sFetchProp !== prop) return;
        process.removeListener('message', listener);
        if (!message._error) resolve(message._result); else reject(Util.makeError(message._error));
      };
      process.on('message', listener);

      this.send({ _sFetchProp: prop }).catch(err => {
        process.removeListener('message', listener);
        reject(err);
      });
    });
  }

  /**
   * Evaluates a script on all shards, in the context of the {@link Clients}.
   * @param {string} script JavaScript to run on each shard
   * @returns {Promise<Array<*>>} Results of the script execution
   * @see {@link ShardingManager#broadcastEval}
   */
  broadcastEval(script) {
    return new Promise((resolve, reject) => {
      const listener = message => {
        if (!message || message._sEval !== script) return;
        process.removeListener('message', listener);
        if (!message._error) resolve(message._result); else reject(Util.makeError(message._error));
      };
      process.on('message', listener);

      this.send({ _sEval: script }).catch(err => {
        process.removeListener('message', listener);
        reject(err);
      });
    });
  }

  /**
   * Requests a respawn of all shards.
   * @param {number} [shardDelay=5000] How long to wait between shards (in milliseconds)
   * @param {number} [respawnDelay=500] How long to wait between killing a shard's process and restarting it
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
  _handleMessage(message) {
    if (!message) return;
    if (message._fetchProp) {
      const props = message._fetchProp.split('.');
      let value = this.client;
      for (const prop of props) value = value[prop];
      this._respond('fetchProp', { _fetchProp: message._fetchProp, _result: value });
    } else if (message._eval) {
      try {
        this._respond('eval', { _eval: message._eval, _result: this.client._eval(message._eval) });
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
   * @returns {ShardClientUtil}
   */
  static singleton(client) {
    if (!this._singleton) {
      this._singleton = new this(client);
    } else {
      client.emit(Events.WARN,
        'Multiple clients created in child process; only the first will handle sharding helpers.');
    }
    return this._singleton;
  }
}

module.exports = ShardClientUtil;
