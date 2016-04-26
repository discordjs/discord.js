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
				resolve(this.rest.client.actions.MessageCreate.handle(data).m);
			})
			.catch(reject);
		});
	}

	DeleteMessage(message) {
		return new Promise((resolve, reject) => {
			this.rest.makeRequest('del', Constants.Endpoints.CHANNEL_MESSAGE(message.channel.id, message.id), true)
				.then(data => {
					resolve(this.rest.client.actions.MessageDelete.handle({
						id: message.id,
						channel_id: message.channel.id,
					}).m);
				})
				.catch(reject);
		});
	}

	UpdateMessage(message, content) {
		return new Promise((resolve, reject) => {
			this.rest.makeRequest('patch', Constants.Endpoints.CHANNEL_MESSAGE(message.channel.id, message.id), true, {
				content,
			})
			.then(data => {
				resolve(this.rest.client.actions.MessageUpdate.handle(data).updated);
			})
			.catch(reject);
		});
	}

	CreateChannel(guild, channelName, channelType) {
		return new Promise((resolve, reject) => {
			this.rest.makeRequest('post', Constants.Endpoints.GUILD_CHANNELS(guild.id), true, {
				name: channelName,
				type: channelType,
			})
			.then(data => {
				resolve(this.rest.client.actions.ChannelCreate.handle(data).channel);
			})
			.catch(reject);
		});
	}
}

module.exports = RESTMethods;
