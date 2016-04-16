'use strict';

const request = require('superagent');
const Constants = require('../../util/Constants');
const UserAgentManager = require('./UserAgentManager');
const RESTMethods = require('./RESTMethods');

class RESTManager{

	constructor(client) {
		this.client = client;
		this.queue = [];
		this.userAgentManager = new UserAgentManager(this);
		this.methods = new RESTMethods(this);
	}

	makeRequest(method, url, auth, data, file) {
		/*
			file is {file, name}
		 */
		let apiRequest = request[method](url);

		if (auth) {
			if (this.client.store.token) {
				apiRequest.set('authorization', this.client.store.token);
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

		apiRequest.set('User-Agent', this.userAgentManager.userAgent);

		return new Promise((resolve, reject) => {
			apiRequest.end((err, res) => {
				if (err) {
					reject(err);
				} else {
					resolve(res ? res.body || {} : {});
				}
			});
		});
	}
};

module.exports = RESTManager;
