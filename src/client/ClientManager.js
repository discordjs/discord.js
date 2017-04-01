const Constants = require('../util/Constants');
const WebSocketConnection = require('./websocket/WebSocketConnection');

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
    this.client.rest.methods.getGateway(this.client.options.shardCount === 'auto').then(res => {
      const gateway = `${res.url}/?v=${Constants.PROTOCOL_VERSION}&encoding=${WebSocketConnection.ENCODING}`;
      this.client.emit(Constants.Events.DEBUG, `Using gateway ${gateway}`);
      if (res.shards) {
        this.client.options.shardCount = res.shards;
        this.client.emit(Constants.Events.DEBUG, `Using recommended shard count of ${res.shards}`);
      }
      const timeout = this.client.setTimeout(() => {
        reject(new Error(Constants.Errors.TOOK_TOO_LONG));
        this.client.ws.killAll();
      }, Math.max(this.client.options.shardCount, 1) * 60000);
      this.client.ws.connect(gateway, res.shards);
      this.client.ws.once('close', event => {
        if (!Object.keys(Constants.ClosableCodes).includes(event.code.toString())) return;
        this.client.ws.killAll();
        reject(Constants.ClosableCodes[event.code]);
      });
      this.client.once(Constants.Events.READY, () => {
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
      return this.client.rest.methods.logout().then(() => {
        this.client.token = null;
      });
    }
  }
}

module.exports = ClientManager;
