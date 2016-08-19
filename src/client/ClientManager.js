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
     * @type {?Number}
     */
    this.heartbeatInterval = null;
  }

  /**
   * Connects the Client to the WebSocket
   * @param {String} token the authorization token
   * @param {Function} resolve function to run when connection is successful
   * @param {Function} reject function to run when connection fails
   * @returns {null}
   */
  connectToWebSocket(token, resolve, reject) {
    this.client.token = token;
    this.client.rest.methods.getGateway()
      .then(gateway => {
        this.client.ws.connect(gateway);
        this.client.once(Constants.Events.READY, () => resolve(token));
      })
      .catch(reject);

    setTimeout(() => reject(Constants.Errors.TOOK_TOO_LONG), 1000 * 15);
  }

  /**
   * Sets up a keep-alive interval to keep the Client's connection valid
   * @param {Number} time the interval in milliseconds at which heartbeat packets should be sent
   * @returns {null}
   */
  setupKeepAlive(time) {
    this.heartbeatInterval = setInterval(() => {
      this.client.ws.send({
        op: Constants.OPCodes.HEARTBEAT,
        d: Date.now(),
      });
    }, time);
  }
}

module.exports = ClientManager;
