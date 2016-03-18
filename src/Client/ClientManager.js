/**
 * This class is used to manage the state
 * of the client and manage the setup and
 * shutdown of it
 */

const Constants       = require('../util/Constants'),
      ClientWebSocket = require('./WebSocket/ClientWebSocket'),
      TAG             = 'manager';

class ClientManager {
	constructor(client) {
		this.client    = client;
		this.state     = Constants.ConnectionState.NOT_STARTED;
		this.gateway   = null;
		this.intervals = {
			keepAlive: null,
			other:     [],
		};
	}

	registerTokenAndConnect(token) {
		return new Promise((resolve, reject) => {
			this.client.api.token = token;

			this.connectToWebSocket().then(resolve).catch(reject);
		});
	}

	disconnectedFromWebSocket() {
		this.state = Constants.ConnectionState.DISCONNECTED;
		this.client.emit(Constants.Events.DISCONNECTED);
		this.client.logger.log(TAG, 'state now disconnected');
	}

	setStateConnected() {
		this.state = Constants.ConnectionState.CONNECTED;
		this.client.websocket._resolve(this.client.token);
		this.client.emit(Constants.Events.CONNECTED);
		this.client.logger.log(TAG, 'state now connected');
	}

	setupKeepAlive(interval) {
		this.intervals.keepAlive = setInterval(() => {
			this.client.logger.log(TAG, 'sent keep alive packet');
			if (this.client.websocket) {
				this.client.websocket.send({
					op: 1,
					d:  Date.now(),
				});
			} else {
				clearInterval(this.intervals.keepAlive);
			}
		}, interval);
	}

	connectToWebSocket() {
		return new Promise((resolve, reject) => {
			// if there is no token, fail
			if (!this.client.api.token) {
				throw Constants.Errors.NO_TOKEN;
			}

			// if already connected, fail
			if (this.state === Constants.ConnectionState.CONNECTED) {
				throw Constants.Errors.ALREADY_CONNECTED;
			}

			// if already connecting, fail
			if (this.state === Constants.ConnectionState.CONNECTING) {
				throw Constants.Errors.ALREADY_CONNECTING;
			}

			this.state = Constants.ConnectionState.CONNECTING;

			try {
				this.client.logger.log(TAG, 'finding gateway');

				this.client.api.getGateway()
					.then(url => {
						this.gateway = url;
						this.client.logger.log(TAG, 'connecting to gateway ' + this.gateway);
						this.client.websocket = new ClientWebSocket(this.client, this.gateway, resolve, reject);
					});
			} catch (e) {
				return reject(e);
			}
		});
	}
}

module.exports = ClientManager;
