'use strict';

const WebSocket = require('ws');
const Constants = require('../../util/Constants');
const zlib = require('zlib');
const PacketManager = require('./packets/WebSocketPacketManager');
const WebSocketManagerDataStore = require('../../structures/datastore/WebSocketManagerDataStore');

class WebSocketManager {

	constructor(client) {
		this.client = client;
		this.ws = null;
		this.packetManager = new PacketManager(this);
		this.emittedReady = false;
		this.store = new WebSocketManagerDataStore();
		this.reconnecting = false;
	}

	connect(gateway) {
		this.store.gateway = gateway;
		gateway += `/?v=${this.client.options.protocol_version}`;
		this.ws = new WebSocket(gateway);
		this.ws.onopen = () => this.EventOpen();
		this.ws.onclose = () => this.EventClose();
		this.ws.onmessage = (e) => this.EventMessage(e);
		this.ws.onerror = (e) => this.EventError(e);
	}

	send(data) {
		if (this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(data));
		}
	}

	EventOpen() {
		if (this.reconnecting) {
			this._sendResume();
		} else {
			this._sendNewIdentify();
		}
	}

	_sendResume() {
		let payload = {
			token: this.client.store.token,
			session_id: this.store.sessionID,
			seq: this.store.sequence,
		};

		this.send({
			op: Constants.OPCodes.RESUME,
			d: payload,
		});
	}

	_sendNewIdentify() {
		this.reconnecting = false;
		let payload = this.client.options.ws;
		payload.token = this.client.store.token;

		this.send({
			op: Constants.OPCodes.IDENTIFY,
			d: payload,
		});
	}

	EventClose() {
		if (!this.reconnecting) {
			this.tryReconnect();
		}
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
		this.tryReconnect();
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
				this.packetManager.handleQueue();
			}
		}
	}

	tryReconnect() {
		this.reconnecting = true;
		this.ws.close();
		this.packetManager.handleQueue();
		this.client.emit(Constants.Events.RECONNECTING);
		this.emittedReady = false;
		this.connect(this.store.gateway);
	}
}

module.exports = WebSocketManager;
