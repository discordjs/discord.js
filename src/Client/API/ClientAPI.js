const request = require('superagent');
const Constants = require('../../util/Constants');
const UserAgentManager = require('./UserAgentManager');

class ClientAPI {

	constructor(client) {
		this.client = client;
		this.userAgentManager = new UserAgentManager(this);

		this.token = null;
	}

	get userAgent() {
		return this.userAgentManager.full;
	}

	set userAgent(info) {
		this.userAgentManager.set(info);
	}

	async makeRequest(method, url, auth, data, file) {
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
				}else {
					resolve(res.body);
				}
			});
		});
	}

	async getGateway() {
		return this
			.makeRequest('get', Constants.Endpoints.GATEWAY, true)
			.then(res => res.url);
	}

	async login(email, password) {
		return this
			.makeRequest('post', Constants.Endpoints.LOGIN, false, { email, password })
			.then(data => this.token = data.token);
	}
}

module.exports = ClientAPI;
