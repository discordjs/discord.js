const Constants = require('../util/Constants');

class ClientLogger {
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
	var now = new Date(),
	    h   = prettify(now.getHours()),
	    m   = prettify(now.getMinutes()),
	    s   = prettify(now.getSeconds());

	return `${h}:${m}:${s}`;
}

module.exports = ClientLogger;
