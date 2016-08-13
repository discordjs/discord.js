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
    this.store = new WebSocketManagerDataStore();
    this.status = Constants.Status.IDLE;
  }

  connect(gateway) {
    this.status = Constants.Status.CONNECTING;
    this.ws = new WebSocket(gateway);
    this.ws.onopen = () => this.eventOpen();
    this.ws.onclose = () => this.eventClose();
    this.ws.onmessage = (e) => this.eventMessage(e);
    this.ws.onerror = (e) => this.eventError(e);
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  eventOpen() {
    if (this.reconnecting) {
      this._sendResume();
    } else {
      this._sendNewIdentify();
    }
  }

  _sendResume() {
    const payload = {
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
    const payload = this.client.options.ws;
    payload.token = this.client.store.token;

    this.send({
      op: Constants.OPCodes.IDENTIFY,
      d: payload,
    });
  }

  eventClose() {
    if (!this.reconnecting) {
      this.tryReconnect();
    }
  }

  eventMessage($event) {
    let packet;
    const event = $event;
    try {
      if (event.binary) {
        event.data = zlib.inflateSync(event.data).toString();
      }

      packet = JSON.parse(event.data);
    } catch (e) {
      return this.eventError(Constants.Errors.BAD_WS_MESSAGE);
    }

    if (packet.op === 10) {
      this.client.manager.setupKeepAlive(packet.d.heartbeat_interval);
    }

    return this.packetManager.handle(packet);
  }

  eventError() {
    this.tryReconnect();
  }

  checkIfReady() {
    if (this.status !== Constants.Status.READY) {
      let unavailableCount = 0;
      for (const guildID in this.client.store.data.guilds) {
        unavailableCount += this.client.store.data.guilds[guildID].available ? 0 : 1;
      }

      if (unavailableCount === 0) {
        this.status = Constants.Status.READY;
        this.client.emit(Constants.Events.READY);
        this.packetManager.handleQueue();
      }
    }
  }

  tryReconnect() {
    this.status = Constants.Status.RECONNECTING;
    this.ws.close();
    this.packetManager.handleQueue();
    this.client.emit(Constants.Events.RECONNECTING);
    this.connect(this.client.store.gateway);
  }
}

module.exports = WebSocketManager;
