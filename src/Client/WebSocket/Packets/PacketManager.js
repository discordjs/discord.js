const ReadyHandler = require("./Handlers/Ready");
const TAG = "websocket";

class PacketManager{
	constructor(clientWS){
		this.clientWS = clientWS;
		this.handlers = {
			"READY" : new ReadyHandler(this)
		};
	}

	get client() {
		return this.clientWS.client;
	}

	log(message) {
		this.client.logger.log(TAG, message);
	}

	handle(packet){
		if(this.handlers[packet.t]){
			return this.handlers[packet.t].handle(packet);
		}
		return false;
	}
}

module.exports = PacketManager;