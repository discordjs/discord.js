'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);
const Constants = require('../../../../util/Constants');
const CloneObject = require('../../../../util/CloneObject');

const Role = Structure('User');

class TypingData {
	constructor(since, lastTimestamp, _timeout) {
		this.since = since;
		this.lastTimestamp = lastTimestamp;
		this._timeout = _timeout;
	}

	resetTimeout(_timeout) {
		clearTimeout(this._timeout);
		this._timeout = _timeout;
	}

	get elapsedTime() {
		return Date.now() - this.since;
	}
}

class TypingStartHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;
		let channel = client.store.get('channels', data.channel_id);
		let user = client.store.get('users', data.user_id);
		let timestamp = new Date(data.timestamp * 1000);

		if (channel && user) {
			if (channel.typingMap[user.id]) {
				// already typing, renew
				let mapping = channel.typingMap[user.id];
				mapping.lastTimestamp = timestamp;
				mapping.resetTimeout(tooLate());
			} else {
				channel.typingMap[user.id] = new TypingData(timestamp, timestamp, tooLate());
				client.emit(Constants.Events.TYPING_START, channel, user);
			}
		}

		function tooLate() {
			return setTimeout(() => {
				client.emit(Constants.Events.TYPING_STOP, channel, user, channel.typingMap[user.id]);
				delete channel.typingMap[user.id];
			}, 6000);
		}
	}

};

module.exports = TypingStartHandler;
