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
    this.ws = new WebSocket(`wss://${endpoint}`, null, { rejectUnauthorized: false });
    this.ws.onopen = () => this._onOpen();
    this.ws.onmessage = e => this._onMessage(e);
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  _onOpen() {
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

  _onError(e) {
    throw e;
  }

  _onMessage(event) {
    let packet;
    try {
      packet = JSON.parse(event.data);
    } catch (error) {
      return this._onError(error);
    }

    switch (packet.op) {
      case 2:
        this.emit('ready-for-udp', packet.d);
        break;
      default:
        break;
    }
  }
}

module.exports = VoiceConnectionWebSocket;
