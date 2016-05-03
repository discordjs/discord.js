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
			this.rest.client.store.email = email;
			this.rest.client.store.password = password;
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

	DeleteChannel(channel) {
		return new Promise((resolve, reject) => {
			this.rest.makeRequest('del', Constants.Endpoints.CHANNEL(channel.id), true)
			.then(data => {
				data.id = channel.id;
				resolve(this.rest.client.actions.ChannelDelete.handle(data).channel);
			})
			.catch(reject);
		});
	}

	UpdateChannel(channel, data) {
		return new Promise((resolve, reject) => {
			data.name = (data.name || channel.name).trim();
			data.topic = data.topic || channel.topic;
			data.position = data.position || channel.position;
			data.bitrate = data.bitrate || channel.bitrate;

			this.rest.makeRequest('patch', Constants.Endpoints.CHANNEL(channel.id), true, data)
			.then(data => {
				resolve(this.rest.client.actions.ChannelUpdate.handle(data).updated);
			})
			.catch(reject);
		});
	}

	LeaveGuild(guild) {
		return new Promise((resolve, reject) => {
			this.rest.makeRequest('del', Constants.Endpoints.ME_GUILD(guild.id), true)
				.then(() => {
					resolve(this.rest.client.actions.GuildDelete.handle({ id:guild.id }).guild);
				})
				.catch(reject);
		});
	}

	// untested but probably will work
	DeleteGuild(guild) {
		return new Promise((resolve, reject) => {
			this.rest.makeRequest('del', Constants.Endpoints.GUILD(guild.id), true)
				.then(() => {
					resolve(this.rest.client.actions.GuildDelete.handle({ id:guild.id }).guild);
				})
				.catch(reject);
		});
	}

	UpdateCurrentUser(_data) {
		return new Promise((resolve, reject) => {
			let user = this.rest.client.store.user;
			let data = {};

			data.username = _data.username || user.username;
			data.avatar = this.rest.client.resolver.ResolveBase64(_data.avatar) || user.avatar;
			if (!user.bot) {
				data.password = this.rest.client.store.password;
				data.email = _data.email || this.rest.client.store.email;
				data.new_password = _data.newPassword;
			}

			this.rest.makeRequest('patch', Constants.Endpoints.ME, true, data)
				.then(data => resolve(this.rest.client.actions.UserUpdate.handle(data).updated))
				.catch(reject);
		});
	}

	UpdateGuild(guild, _data) {
		return new Promise((resolve, reject) => {
			/*
				can contain:
				name, region, verificationLevel, afkChannel, afkTimeout, icon, owner, splash
			 */

			let data = {};

			if (_data.name) {
				data.name = _data.name;
			}

			if (_data.region) {
				data.region = _data.region;
			}

			if (_data.verificationLevel) {
				data.verification_level = Number(_data.verificationLevel);
			}

			if (_data.afkChannel) {
				data.afk_channel_id = this.rest.client.resolver.ResolveChannel(_data.afkChannel).id;
			}

			if (_data.afkTimeout) {
				data.afk_timeout = Number(_data.afkTimeout);
			}

			if (_data.icon) {
				data.icon = this.rest.client.resolver.ResolveBase64(_data.icon);
			}

			if (_data.owner) {
				data.owner_id = this.rest.client.resolver.ResolveUser(_data.owner).id;
			}

			if (_data.splash) {
				data.splash = this.rest.client.resolver.ResolveBase64(_data.splash);
			}

			this.rest.makeRequest('patch', Constants.Endpoints.GUILD(guild.id), true, data)
				.then(data => resolve(this.rest.client.actions.GuildUpdate.handle(data).updated))
				.catch(reject);
		});
	}
}

module.exports = RESTMethods;
