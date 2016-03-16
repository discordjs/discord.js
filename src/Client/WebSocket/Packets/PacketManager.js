const ReadyHandler = require('./Handlers/ReadyHandler');
const ServerCreateHandler = require('./Handlers/ServerCreateHandler');
const ServerDeleteHandler = require('./Handlers/ServerDeleteHandler');
const ServerUpdateHandler = require('./Handlers/ServerUpdateHandler');
const TAG = 'websocket';

class PacketManager{
	constructor(clientWS) {
		this.clientWS = clientWS;
		this.handlers = {
			READY: new ReadyHandler(this),
			GUILD_CREATE: new ServerCreateHandler(this),
			GUILD_DELETE: new ServerDeleteHandler(this),
			GUILD_UPDATE: new ServerUpdateHandler(this),
		};
	}

	get client() {
		return this.clientWS.client;
	}

	log(message) {
		this.client.logger.log(TAG, message);
	}

	handle(packet) {
		if (this.handlers[packet.t]) {
			return this.handlers[packet.t].handle(packet);
		}

		return false;
	}
}

module.exports = PacketManager;
