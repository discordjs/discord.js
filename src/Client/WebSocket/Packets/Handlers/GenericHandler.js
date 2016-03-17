class GenericHandler{
	constructor(packetManager) {
		this.manager = packetManager;
		this.client  = this.manager.client;
	}

	handle(packet) {
		return false;
	}
}

module.exports = GenericHandler;
