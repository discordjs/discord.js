const WebSocket = require('ws');
const Constants = require('../../util/Constants');
const EventEmitter = require('events').EventEmitter;

class VoiceConnectionWebSocket extends EventEmitter {
  constructor(voiceConnection, serverID, token, sessionID, endpoint) {
    super();
    this.voiceConnection = voiceConnection;
    this.token = token;
    this.sessionID = sessionID;
    this.serverID = serverID;
    this.heartbeat = null;
    this.opened = false;
    this.endpoint = endpoint;
    this.attempts = 6;
    this.setupWS();
  }

  setupWS() {
    this.attempts--;
    this.ws = new WebSocket(`wss://${this.endpoint}`, null, { rejectUnauthorized: false });
    this.ws.onopen = () => this._onOpen();
    this.ws.onmessage = e => this._onMessage(e);
    this.ws.onclose = e => this._onClose(e);
    this.ws.onerror = e => this._onError(e);
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(data));
  }

  _shutdown() {
    if (this.ws) this.ws.close();
    clearInterval(this.heartbeat);
  }

  _onOpen() {
    this.opened = true;
    this.send({
      op: Constants.OPCodes.DISPATCH,
      d: {
        server_id: this.serverID,
        user_id: this.voiceConnection.manager.client.user.id,
        session_id: this.sessionID,
        token: this.token,
      },
    });
  }

  _onClose(err) {
    if (!this.opened && this.attempts >= 0) {
      this.setupWS();
      return;
    }
    this.emit('close', err);
  }

  _onError(e) {
    if (!this.opened && this.attempts >= 0) {
      this.setupWS();
      return;
    }
    this.emit('error', e);
  }

  _setHeartbeat(interval) {
    this.heartbeat = this.voiceConnection.manager.client.setInterval(() => {
      this.send({
        op: Constants.VoiceOPCodes.HEARTBEAT,
        d: null,
      });
    }, interval);
    this.send({
      op: Constants.VoiceOPCodes.HEARTBEAT,
      d: null,
    });
  }

  _onMessage(event) {
    let packet;
    try {
      packet = JSON.parse(event.data);
    } catch (error) {
      this._onError(error);
      return;
    }

    switch (packet.op) {
      case Constants.VoiceOPCodes.READY:
        this._setHeartbeat(packet.d.heartbeat_interval);
        this.emit('ready-for-udp', packet.d);
        break;
      case Constants.VoiceOPCodes.SESSION_DESCRIPTION:
        this.encryptionMode = packet.d.mode;
        this.secretKey = new Uint8Array(new ArrayBuffer(packet.d.secret_key.length));
        for (const index in packet.d.secret_key) this.secretKey[index] = packet.d.secret_key[index];
        this.emit('ready', this.secretKey);
        break;
      case Constants.VoiceOPCodes.SPEAKING:
        /*
        { op: 5,
        d: { user_id: '123123', ssrc: 1, speaking: true } }
        */
        this.emit('speaking', packet.d);
        break;
      default:
        this.emit('unknown', packet);
        break;
    }
  }
}

module.exports = VoiceConnectionWebSocket;
