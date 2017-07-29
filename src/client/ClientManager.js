const Constants = require('../util/Constants');
const WebSocketConnection = require('./websocket/WebSocketConnection');
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
   * @type {number}
   */
  get status() {
    return this.connection ? this.connection.status : Constants.Status.IDLE;
  }

  /**
   * Connects the client to the WebSocket.
   * @param {string} token The authorization token
   * @param {Function} resolve Function to run when connection is successful
   * @param {Function} reject Function to run when connection fails
   */
  connectToWebSocket(token, resolve, reject) {
    this.client.emit(Constants.Events.DEBUG, `Authenticated using token ${token}`);
    this.client.token = token;
    const timeout = this.client.setTimeout(() => reject(new Error('TOKEN_INVALID')), 1000 * 300);
    this.client.api.gateway.get().then(res => {
      const protocolVersion = Constants.DefaultOptions.ws.version;
      const gateway = `${res.url}/?v=${protocolVersion}&encoding=${WebSocketConnection.ENCODING}`;
      this.client.emit(Constants.Events.DEBUG, `Using gateway ${gateway}`);
      this.client.ws.connect(gateway);
      this.client.ws.connection.once('close', event => {
        if (event.code === 4004) reject(new Error('TOKEN_INVALID'));
        if (event.code === 4010) reject(new Error('SHARDING_INVALID'));
        if (event.code === 4011) reject(new Error('SHARDING_REQUIRED'));
      });
      this.client.once(Constants.Events.READY, () => {
        resolve(token);
        this.client.clearTimeout(timeout);
      });
    }, reject);
  }

  destroy() {
    this.client.ws.destroy();
    this.client.rest.destroy();
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
