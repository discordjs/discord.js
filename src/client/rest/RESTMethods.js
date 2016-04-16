'use strict';

const Constants = require('../../util/Constants');

class RESTMethods{
	constructor(restManager) {
		this.rest = restManager;
	}

	LoginEmailPassword(email, password) {
		return new Promise((resolve, reject) => {

			this.rest.makeRequest('post', Constants.Endpoints.LOGIN, false, { email, password })
				.then(data => {
					this.rest.client.manager.connectToWebSocket(data.token, resolve, reject);
				})
				.catch(reject);

		});
	}

	LoginToken(token) {
		return new Promise((resolve, reject) => {
			this.rest.client.manager.connectToWebSocket(token, resolve, reject);
		});
	}

	GetGateway() {
		return new Promise((resolve, reject) => {
			this.rest.makeRequest('get', Constants.Endpoints.GATEWAY, true)
				.then(res => resolve(res.url))
				.catch(reject);
		});
	}
}

module.exports = RESTMethods;
