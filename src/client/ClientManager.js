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
   * @param {function} resolve Function to run when connection is successful
   * @param {function} reject Function to run when connection fails
   */
  connectToWebSocket(token, resolve, reject) {
    this.client.emit('debug', `authenticated using token ${token}`);
    this.client.token = token;
    this.client.rest.methods.getGateway().then(gateway => {
      this.client.emit('debug', `using gateway ${gateway}`);
      this.client.ws.connect(gateway);
      this.client.once(Constants.Events.READY, () => resolve(token));
    }).catch(reject);
    this.client.setTimeout(() => reject(new Error(Constants.Errors.TOOK_TOO_LONG)), 1000 * 300);
  }

  /**
   * Sets up a keep-alive interval to keep the Client's connection valid
   * @param {number} time The interval in milliseconds at which heartbeat packets should be sent
   */
  setupKeepAlive(time) {
    this.heartbeatInterval = this.client.setInterval(() => {
      this.client.ws.send({
        op: Constants.OPCodes.HEARTBEAT,
        d: Date.now(),
      }, true);
    }, time);
  }

  destroy() {
    return new Promise((resolve) => {
      if (!this.client.user.bot) {
        this.client.rest.methods.logout().then(resolve);
      } else {
        this.client.ws.destroy();
        resolve();
      }
    });
  }
}

module.exports = ClientManager;
