const VoiceConnectionWebSocket = require('./VoiceConnectionWebSocket');
const VoiceConnectionUDPClient = require('./VoiceConnectionUDPClient');
const EventEmitter = require('events').EventEmitter;

class VoiceConnection extends EventEmitter {
  constructor(manager, serverID, token, sessionID, endpoint) {
    super();
    this.manager = manager;
    this.endpoint = endpoint;
    this.websocket = new VoiceConnectionWebSocket(this, serverID, token, sessionID, endpoint);
    this.ready = false;
    this.bindListeners();
  }

  bindListeners() {
    this.websocket.on('ready-for-udp', data => {
      this.udp = new VoiceConnectionUDPClient(this, data);
    });
    this.websocket.on('ready', () => {
      this.ready = true;
    });
  }
}

module.exports = VoiceConnection;
