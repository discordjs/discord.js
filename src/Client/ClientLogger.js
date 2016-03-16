const Constants = require('../util/Constants');

class ClientLogger{
	constructor(client) {
		this.client = client;
	}

	log(tag, message) {
		if (this.client.options.logging.enabled) {
			console.log(`[LOG ${time()}] ${tag} >> ${message}`);
		}

		if (this.client.options.logging.as_event) {
			this.client.emit(Constants.Events.LOG, tag, message);
		}
	}
}

function prettify(n) {
	return n < 10 ? '0' + n : n;
}

function time() {
	let now = new Date();
	let h = prettify(now.getHours());
	let m = prettify(now.getMinutes());
	let s = prettify(now.getSeconds());
	return `${h}:${m}:${s}`;
}

module.exports = ClientLogger;
