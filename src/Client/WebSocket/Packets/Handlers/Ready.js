const Generic = require("./Generic");

module.exports = class ReadyHandler extends Generic{
	constructor(manager){
		super(manager);
	}

	handle(packet) {
		let data = packet.d;
		this.manager.log("received READY packet");
		this.manager.client.manager.setupKeepAlive(data.heartbeat_interval);



		this.manager.client.manager.setStateConnected();
	}
};