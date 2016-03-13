/**
 * This class is used to manage the state
 * of the client and manage the setup and
 * shutdown of it
 */

const Constants = require("../util/Constants");
const ClientWebSocket = require("./ClientWebSocket");

class ClientManager {
	constructor(client) {
		this.client = client;
		this.state = Constants.ConnectionState.NOT_STARTED;
		this.gateway = null;
	}

	async registerTokenAndConnect(token) {
		return this.connectToWebSocket(this.client.api.token = token);
	}

	async disconnectedFromWebSocket() {
		this.state = Constants.ConnectionState.DISCONNECTED;
	}

	async connectToWebSocket(token) {
		return new Promise(async (resolve, reject) => {
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
				this.gateway = await this.client.api.getGateway();
				this.client.websocket = new ClientWebSocket(this.client, this.gateway, resolve, reject);
			} catch (e) {
				return reject(e);
			}

		});
	}
}

module.exports = ClientManager;