'use strict';

const Constants = require('../../util/Constants');
const Structure = name => require('../../structures/' + name);

const Message = Structure('Message');

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

	SendMessage(channel, content, tts, nonce) {
		return new Promise((resolve, reject) => {
			this.rest.makeRequest('post', Constants.Endpoints.CHANNEL_MESSAGES(channel.id), true, {
				content, tts, nonce,
			})
			.then(data => {
				let message = new Message(channel, data, this.rest.client);
				channel._cacheMessage(message);
				resolve(message);
				this.rest.client.emit(Constants.Events.MESSAGE_CREATE, message);
			})
			.catch(reject);
		});
	}
}

module.exports = RESTMethods;
