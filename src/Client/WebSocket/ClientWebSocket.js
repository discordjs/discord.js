const WebSocket     = require('ws'),
      Constants     = require('../../util/Constants'),
      zlib          = require('zlib'),
      PacketManager = require('./Packets/PacketManager');

class ClientWebSocket {
	constructor(client, gateway, resolve, reject) {
		this.client = client;
		this.ws     = new WebSocket(gateway);

		this._resolve = resolve;
		this._reject  = reject;

		// arrow functions to keep scope
		this.ws.onerror   = err => this.eventError(err);
		this.ws.onopen    = () => this.eventOpen();
		this.ws.onclose   = () => this.eventClose();
		this.ws.onmessage = e => this.eventMessage(e);

		this.packetManager = new PacketManager(this);
	}

	eventOpen() {
		let data   = this.client.options.ws;
		data.token = this.client.token;

		this.send({
			op: 2,
			d:  data,
		});
	}

	eventClose() {
		this._reject(Constants.Errors.WEBSOCKET_CLOSED_BEFORE_READY);
		this.client.manager.disconnectedFromWebSocket();
	}

	eventError(err) {
		this._reject(err);
		this.client.emit(Constants.Events.ERROR, err);
		this.client.manager.disconnectedFromWebSocket();
	}

	eventMessage(event) {
		let packet;
		try {
			if (event.binary) {
				event.data = zlib.inflateSync(event.data).toString();
			}

			packet = JSON.parse(event.data);
		} catch (e) {
			this.eventError(e);
			return;
		}

		this.packetManager.handle(packet);
	}

	send(object) {
		if (this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(object));
			return true;
		} else {
			return false;
		}
	}
}

module.exports = ClientWebSocket;
