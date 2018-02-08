const { Events, Status } = require('../util/Constants');
const { Error } = require('../errors');

/**
 * Manages the state and background tasks of the client.
 * @private
 */
class ClientManager {
  constructor(client) {
    /**
     * The client that instantiated this Manager
     * @type {Client}
     */
    this.client = client;

    /**
     * The heartbeat interval
     * @type {?number}
     */
    this.heartbeatInterval = null;
  }

  /**
   * The status of the client
   * @readonly
   * @type {number}
   */
  get status() {
    return this.connection ? this.connection.status : Status.IDLE;
  }

  /**
   * Connects the client to the WebSocket.
   * @param {string} token The authorization token
   * @param {Function} resolve Function to run when all shards are connected
   * @param {Function} reject Function to run when a shard fails
   */
  connectToWebSocket(token, resolve, reject) {
    if (this.client.options.internalSharding && this.client.shard) {
      reject(new Error('SHARDING_CANNOT_USE_BOTH_METHODS'));
      return;
    }
    this.client.emit(Events.DEBUG, `Authenticated using token ${token}`);
    this.client.token = token;
    let timeout;
    if (!this.client.options.internalSharding) {
      timeout = this.client.setTimeout(() => reject(new Error('WS_CONNECTION_TIMEOUT')), 1000 * 300);
    }
    let endpoint = this.client.api.gateway;
    if (this.client.options.internalSharding) endpoint = endpoint.bot;
    endpoint.get({ forceBot: this.client.options.internalSharding }).then(async res => {
      if (this.client.options.presence != null) { // eslint-disable-line eqeqeq
        this.client.options.ws.presence = await this.client.presences._parse(this.client.options.presence);
      }
      if (res.shards) {
        this.client.emit(Events.DEBUG, `Using recommended shard count: ${res.shards}`);
        this.client.options.shardCount = res.shards;
      }
      const gateway = `${res.url}/`;
      this.client.emit(Events.DEBUG, `Using gateway ${gateway}`);
      this.client.ws.spawn(gateway, resolve, reject);
      this.client.once(Events.READY, () => {
        resolve(token);
        this.client.clearTimeout(timeout);
      });
    }, reject);
  }

  destroy() {
    this.client.ws.destroy();
    if (!this.client.user) return Promise.resolve();
    if (this.client.user.bot) {
      this.client.token = null;
      return Promise.resolve();
    } else {
      return this.client.api.logout.post().then(() => {
        this.client.token = null;
      });
    }
  }
}

module.exports = ClientManager;
