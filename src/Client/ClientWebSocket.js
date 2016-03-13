const WebSocket = require("ws");
const Constants = require("../util/Constants");

class ClientWebSocket extends EventEmitter{
	constructor(client, gateway, resolve, reject) {
		this.client = client;
		this.ws = new WebSocket(gateway);

		this._resolve = resolve;
		this._reject = reject;

		// arrow functions to keep scope
		this.ws.onerror = err => this.eventError(err);
		this.ws.onopen = () => this.eventOpen();
		this.ws.onclose = () => this.eventClose();
		this.ws.onmessage = e => this.eventMessage(e);
	}

	eventOpen() {
		this._reject();
		this.client.manager.disconnectedFromWebSocket();
	}

	eventClose() {
		this._reject(Constants.Errors.WEBSOCKET_CLOSED_BEFORE_READY);
	}

	eventError(err) {
		this._reject(err);
		this.client.emit("error", err);
		this.client.manager.disconnectedFromWebSocket();
	}
}

module.exports = ClientWebSocket;