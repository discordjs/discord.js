'use strict';

const WebSocket = require('ws');
const Constants = require('../../util/Constants');
const zlib = require('zlib');
const PacketManager = require('./packets/WebSocketPacketManager');

class WebSocketManager {

	constructor(client) {
		this.client = client;
		this.ws = null;
		this.packetManager = new PacketManager(this);
		this.emittedReady = false;
	}

	connect(gateway) {
		gateway += `/?v=${this.client.options.protocol_version}`;
		this.ws = new WebSocket(gateway);
		this.ws.onopen = () => this.EventOpen();
		this.ws.onclose = () => this.EventClose();
		this.ws.onmessage = (e) => this.EventMessage(e);
		this.ws.onerror = (e) => this.EventError(e);
	}

	send(data) {
		this.ws.send(JSON.stringify(data));
	}

	EventOpen() {
		let payload = this.client.options.ws;
		payload.token = this.client.store.token;

		this.send({
			op: Constants.OPCodes.IDENTIFY,
			d: payload,
		});
	}

	EventClose() {

	}

	EventMessage(event) {
		let packet;
		try {
			if (event.binary) {
				event.data = zlib.inflateSync(event.data).toString();
			}

			packet = JSON.parse(event.data);
		} catch (e) {
			return this.EventError(Constants.Errors.BAD_WS_MESSAGE);
		}

		this.packetManager.handle(packet);
	}

	EventError(e) {

	}

	checkIfReady() {
		if (!this.emittedReady) {
			let unavailableCount = 0;

			for (let guildID in this.client.store.data.guilds) {
				unavailableCount += this.client.store.data.guilds[guildID].available ? 0 : 1;
			}

			if (unavailableCount === 0) {
				this.client.emit(Constants.Events.READY);
				this.emittedReady = true;
			}
		}
	}
}

module.exports = WebSocketManager;
