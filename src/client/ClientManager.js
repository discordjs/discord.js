'use strict';

const Constants = require('../util/Constants');

class ClientManager {

	constructor(client) {
		this.client = client;
		this.heartbeatInterval = null;
	}

	connectToWebSocket(token, resolve, reject) {
		this.client.store.token = token;
		this.client.rest.methods.GetGateway()
			.then(gateway => {
				this.client.ws.connect(gateway);
				this.client.once(Constants.Events.READY, () => resolve(token));
			})
			.catch(reject);

		setTimeout(() => reject(Constants.Errors.TOOK_TOO_LONG), 1000 * 15);
	}

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
