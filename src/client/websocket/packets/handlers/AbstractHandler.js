'use strict';

class AbstractHandler {

	constructor(packetManager) {
		this.packetManager = packetManager;
	}

	handle(packet) {

	}
}

module.exports = AbstractHandler;
