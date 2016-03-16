module.exports = class GenericHandler{
	constructor(packetManager) {
		this.manager = packetManager;
	}

	handle(packet) {
		return false;
	}
};
