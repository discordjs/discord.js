const request          = require('superagent'),
      Constants        = require('../../util/Constants'),
      UserAgentManager = require('./UserAgentManager');

class ClientAPI {
	constructor(client) {
		this.client           = client;
		this.userAgentManager = new UserAgentManager(this);

		this.token = null;
	}

	get userAgent() {
		return this.userAgentManager.full;
	}

	set userAgent(info) {
		this.userAgentManager.set(info);
	}

	makeRequest(method, url, auth, data, file) {
		let apiRequest = request[method](url);

		if (auth) {
			if (this.token) {
				apiRequest.set('authorization', this.token);
			} else {
				throw Constants.Errors.NO_TOKEN;
			}
		}

		if (data) {
			apiRequest.send(data);
		}

		if (file) {
			apiRequest.attach('file', file.file, file.name);
		}

		apiRequest.set('User-Agent', this.userAgent);

		return new Promise((resolve, reject) => {
			apiRequest.end((err, res) => {
				if (err) {
					reject(err);
				} else {
					resolve(res.body);
				}
			});
		});
	}

	getGateway() {
		return new Promise((resolve, reject) => {
			this.makeRequest('get', Constants.Endpoints.GATEWAY, true)
				.then(res => resolve(res.url))
				.catch(reject);
		});
	}

	login(login, password) {
		return new Promise((resolve, reject) => {
			if (!password) {
				return this.makeRequest('post', Constants.Endpoints.LOGIN, false, { token: login })
					.then(data => {
						this.token = data.token;

						resolve(this.token);
					})
					.catch(reject);
			}

			this.makeRequest('post', Constants.Endpoints.LOGIN, false, { email: login, password })
				.then(data => {
					this.token = data.token;

					resolve(this.token);
				})
				.catch(reject);
		});
	}
}

module.exports = ClientAPI;
