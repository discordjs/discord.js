const Constants = require('../util/Constants');

/**
 * Manages the State and Background Tasks of the Client
 * @private
 */
class ClientManager {
  constructor(client) {
    /**
     * The Client that instantiated this Manager
     * @type {Client}
     */
    this.client = client;

    /**
     * The heartbeat interval, null if not yet set
     * @type {?number}
     */
    this.heartbeatInterval = null;
  }

  /**
   * Connects the Client to the WebSocket
   * @param {string} token The authorization token
   * @param {Function} resolve Function to run when connection is successful
   * @param {Function} reject Function to run when connection fails
   */
  connectToWebSocket(token, resolve, reject) {
    this.client.emit(Constants.Events.DEBUG, `Authenticated using token ${token}`);
    this.client.token = token;
    const timeout = this.client.setTimeout(() => reject(new Error(Constants.Errors.TOOK_TOO_LONG)), 1000 * 300);
    this.client.rest.methods.getGateway().then(gateway => {
      this.client.emit(Constants.Events.DEBUG, `Using gateway ${gateway}`);
      this.client.ws.connect(gateway);
      this.client.ws.once('close', event => {
        if (event.code === 4004) reject(new Error(Constants.Errors.BAD_LOGIN));
        if (event.code === 4010) reject(new Error(Constants.Errors.INVALID_SHARD));
      });
      this.client.once(Constants.Events.READY, () => {
        resolve(token);
        this.client.clearTimeout(timeout);
      });
    }, reject);
  }

  /**
   * Sets up a keep-alive interval to keep the Client's connection valid
   * @param {number} time The interval in milliseconds at which heartbeat packets should be sent
   */
  setupKeepAlive(time) {
    this.heartbeatInterval = this.client.setInterval(() => this.client.ws.heartbeat(true), time);
  }

  destroy() {
    this.client.ws.destroy();
    if (this.client.user.bot) {
      this.client.token = null;
      return Promise.resolve();
    } else {
      return this.client.rest.methods.logout().then(() => {
        this.client.token = null;
      });
    }
  }
}

module.exports = ClientManager;
